import React from "react";
import { Button, Input, Textarea, Divider, Checkbox, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useBookingStore } from "../hooks/use-booking-store"; // For addBooking, addUserBooking
import { useSharedBooking } from "../context/BookingContext"; // For shared date/time
import emailjs from '@emailjs/browser';
import { db } from "../firebase";
import { collection, addDoc, Timestamp, getDocs, query, where } from "firebase/firestore";
import { getTotalPrice } from "../lib/pricing";

export const BookingForm: React.FC = () => {
  const { selectedDate, selectedTimeSlots, clearTimeSlots, bookingType } = useSharedBooking();
  const { addUserBooking } = useBookingStore();
  
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = React.useState(false);

  const bookingDate = selectedDate
    ? `${selectedDate.year}-${selectedDate.month.toString().padStart(2, '0')}-${selectedDate.day.toString().padStart(2, '0')}`
    : "";
  const totalPrice = selectedDate ? getTotalPrice(bookingDate, selectedTimeSlots, bookingType) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || selectedTimeSlots.length === 0) {
      addToast({
        title: "Ошибка бронирования",
        description: "Пожалуйста, выберите дату и хотя бы один временной слот",
        color: "danger"
      });
      return;
    }

    if (!name || !email || !phone) {
      addToast({
        title: "Ошибка бронирования",
        description: "Пожалуйста, заполните все обязательные поля",
        color: "danger"
      });
      return;
    }

    setIsSubmitting(true);

    const bookingDateForFirestore = bookingDate;
    const formattedDate = `${selectedDate.day.toString().padStart(2, '0')}.${selectedDate.month.toString().padStart(2, '0')}.${selectedDate.year}`;
    const slotsText = selectedTimeSlots.join(', ');

    // Email params
    const bookingTypeText = bookingType === 'individual' ? 'Индивидуальное' : 'Групповое';
    const templateParams = {
      to_email: email,
      user_name: name,
      user_email: email,
      user_phone: phone,
      booking_date: formattedDate,
      booking_time: slotsText,
      booking_type: bookingTypeText,
      booking_hours: selectedTimeSlots.length,
      booking_total: totalPrice,
      user_notes: notes || 'Нет заметок'
    };

    try {
      if (!db) {
        throw new Error("Firebase is not configured");
      }

      // 0. Check if slots are still available (prevent double booking)
      const existingBookings = await getDocs(query(
        collection(db, "bookings"),
        where("bookingDate", "==", bookingDateForFirestore),
        where("status", "in", ["confirmed", "pending_payment"])
      ));

      const now = Date.now();
      const PAYMENT_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

      const alreadyBookedSlots: string[] = [];
      existingBookings.forEach(doc => {
        const data = doc.data();
        
        // For pending_payment, check if it's older than 15 minutes (expired)
        if (data.status === 'pending_payment' && data.createdAt) {
          const createdAt = data.createdAt.toDate?.() || new Date(data.createdAt);
          const ageMs = now - createdAt.getTime();
          if (ageMs > PAYMENT_TIMEOUT_MS) {
            // Skip expired pending bookings
            return;
          }
        }

        const slots = data.timeSlot?.split(', ') || [];
        slots.forEach((s: string) => alreadyBookedSlots.push(s.trim()));
      });

      const conflictSlots = selectedTimeSlots.filter(slot => alreadyBookedSlots.includes(slot));
      if (conflictSlots.length > 0) {
        addToast({
          title: "Время уже занято",
          description: `Слоты ${conflictSlots.join(', ')} уже забронированы другим пользователем. Пожалуйста, выберите другое время.`,
          color: "danger"
        });
        setIsSubmitting(false);
        return;
      }

      // 1. Create booking in Firebase with pending_payment status
      const bookingRef = await addDoc(collection(db, "bookings"), {
        userName: name,
        userEmail: email,
        userPhone: phone,
        bookingDate: bookingDateForFirestore,
        timeSlot: slotsText,
        bookingType: bookingType,
        totalSlots: selectedTimeSlots.length,
        totalPrice: totalPrice,
        userNotes: notes || 'Нет заметок',
        status: 'pending_payment',
        createdAt: Timestamp.now()
      });

      const bookingId = bookingRef.id;
      console.log('Booking created with ID:', bookingId);

      // 2. Create payment via API with retry
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const paymentBody = JSON.stringify({
        bookingId: bookingId,
        amount: totalPrice,
        description: `Аренда зала ЗАЛ на ${formattedDate}, ${slotsText}`,
        customerEmail: email,
        metadata: {
          userName: name,
          userPhone: phone,
          bookingDate: bookingDateForFirestore,
          timeSlots: slotsText,
          bookingType: bookingType
        }
      });

      let paymentResponse;
      let paymentData;
      let lastError;

      // Retry up to 3 times
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`Payment attempt ${attempt}/3...`);
          paymentResponse = await fetch(`${apiUrl}/api/create-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: paymentBody,
          });

          paymentData = await paymentResponse.json();
          console.log('Payment response:', paymentResponse.status, paymentData);

          if (paymentResponse.ok) {
            console.log('Payment created successfully on attempt', attempt);
            break;
          } else {
            lastError = paymentData.error || 'Payment failed';
            console.warn(`Attempt ${attempt} failed:`, lastError);
          }
        } catch (fetchError) {
          lastError = fetchError;
          console.warn(`Attempt ${attempt} fetch error:`, fetchError);
        }

        // Wait before retry (1s, 2s)
        if (attempt < 3) {
          await new Promise(r => setTimeout(r, attempt * 1000));
        }
      }

      if (!paymentResponse?.ok || !paymentData?.paymentId) {
        console.error('All payment attempts failed:', lastError);
        throw new Error('Failed to create payment after 3 attempts');
      }

      console.log('Payment created:', paymentData);

      // 3. Save payment ID to booking
      const { updateDoc, doc } = await import('firebase/firestore');
      await updateDoc(doc(db, "bookings", bookingId), {
        paymentId: paymentData.paymentId
      });

      // 4. Redirect to YooKassa payment page
      if (paymentData.confirmationUrl) {
        window.location.href = paymentData.confirmationUrl;
      } else {
        throw new Error('No confirmation URL received');
      }

    } catch (error) {
      console.error('Booking error:', error);
      addToast({
        title: "Ошибка бронирования",
        description: "Не удалось создать платёж. Попробуйте снова.",
        color: "danger"
      });
      setIsSubmitting(false);
    }
  };
  
  // Confetti effect function
  const showConfetti = () => {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#5D6B4E', '#87976F', '#B99B7D', '#D5C3B1'];
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 5 + 5}px`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = '0';
      confetti.style.borderRadius = '50%';
      confetti.style.opacity = '0.8';
      confetti.style.transform = 'rotate(0deg)';
      confetti.style.transition = 'transform 1s linear';
      confettiContainer.appendChild(confetti);
      
      const animationDuration = Math.random() * 3 + 2;
      const horizontalMovement = (Math.random() - 0.5) * 20;
      
      confetti.animate([
        { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 0.8 },
        { transform: `translateY(100vh) translateX(${horizontalMovement}vw) rotate(720deg)`, opacity: 0 }
      ], {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });
    }
    
    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 5000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
        <Icon icon="lucide:clipboard" className="text-primary-500" />
        Детали бронирования
      </h3>

      {/* Summary of selected slots */}
      {selectedTimeSlots.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">
              {selectedTimeSlots.length} {selectedTimeSlots.length === 1 ? 'час' : selectedTimeSlots.length < 5 ? 'часа' : 'часов'}
            </span>
            <span className="text-lg font-bold text-primary-600">{totalPrice}₽</span>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Input
          label="Имя"
          placeholder="Введите ваше имя"
          value={name}
          onValueChange={setName}
          variant="bordered"
          isRequired
          classNames={{
            inputWrapper: "bg-default-100 border-default-300"
          }}
        />
      </div>
      
      <div className="space-y-2">
        <Input
          label="Email"
          placeholder="Введите ваш email"
          value={email}
          onValueChange={setEmail}
          type="email"
          variant="bordered"
          isRequired
          classNames={{
            inputWrapper: "bg-default-100 border-default-300"
          }}
        />
      </div>
      
      <div className="space-y-2">
        <Input
          label="Телефон"
          placeholder="Введите ваш номер телефона"
          value={phone}
          onValueChange={setPhone}
          variant="bordered"
          isRequired
          classNames={{
            inputWrapper: "bg-default-100 border-default-300"
          }}
        />
      </div>
      
      <div className="space-y-2">
        <Textarea
          label="Дополнительная информация"
          placeholder="Особые требования или пожелания"
          value={notes}
          onValueChange={setNotes}
          variant="bordered"
          classNames={{
            inputWrapper: "bg-default-100 border-default-300"
          }}
        />
      </div>
      
      <Divider className="opacity-30 my-4" />

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Checkbox
            isSelected={agreedToPolicy}
            onValueChange={setAgreedToPolicy}
            size="sm"
          />
          <span className="text-xs text-foreground-500 leading-relaxed">
            Я соглашаюсь с{" "}
            <a 
              href="/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-500 underline hover:text-primary-600 cursor-pointer"
            >
              политикой конфиденциальности
            </a>
            {" "}и даю согласие на обработку персональных данных
          </span>
        </div>
      </div>
      
      <Button
        type="submit"
        color="primary"
        size="lg"
        className="w-full font-semibold"
        startContent={<Icon icon="lucide:calendar-check" />}
        isLoading={isSubmitting}
        isDisabled={isSubmitting || selectedTimeSlots.length === 0 || !agreedToPolicy}
      >
        {selectedTimeSlots.length > 0 
          ? `Забронировать за ${totalPrice}₽` 
          : 'Выберите время'}
      </Button>
      
      <p className="text-xs text-center text-foreground-400 mt-4">
        Бронируя зал, вы соглашаетесь с{" "}
        <a 
          href="/rules" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 underline hover:text-primary-600"
        >
          правилами аренды
        </a>.
      </p>
    </form>
  );
};
