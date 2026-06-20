import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Card, CardBody, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import emailjs from '@emailjs/browser';

export const BookingSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading");
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    const sendConfirmationEmails = async (booking: any) => {
      const EMAILJS_SERVICE = 'service_gdjkyol';
      const EMAILJS_TEMPLATE_ADMIN = 'template_8kyk0ka';
      const EMAILJS_TEMPLATE_CLIENT = 'template_tnjioth';
      const EMAILJS_PUBLIC_KEY = '0sBsMM6CMV7uwo6GM';

      const [day, month, year] = booking.bookingDate ? booking.bookingDate.split('-').reverse() : ['', '', ''];
      const formattedDate = `${year}-${month}-${day}`.split('-').reverse().join('.');
      
      const templateParams = {
        to_email: booking.userEmail,
        user_name: booking.userName,
        user_email: booking.userEmail,
        user_phone: booking.userPhone,
        booking_date: formattedDate || booking.bookingDate,
        booking_time: booking.timeSlot,
        booking_type: booking.bookingType === 'individual' ? 'Индивидуальное' : 'Групповое',
        booking_hours: booking.totalSlots,
        booking_total: booking.totalPrice,
        user_notes: booking.userNotes || 'Нет заметок'
      };

      try {
        // Send to admin
        await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE_ADMIN, templateParams, EMAILJS_PUBLIC_KEY);
        console.log('Admin email sent');
        
        // Send to client
        await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE_CLIENT, templateParams, EMAILJS_PUBLIC_KEY);
        console.log('Client email sent');
      } catch (error) {
        console.error('Email sending failed:', error);
      }
    };

    const checkPaymentAndConfirm = async () => {
      if (!bookingId || !db) {
        setStatus("error");
        return;
      }

      try {
        // Get booking from Firebase
        const bookingRef = doc(db, "bookings", bookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (!bookingSnap.exists()) {
          setStatus("error");
          return;
        }

        const booking = bookingSnap.data();
        
        // If already confirmed, show success (don't send emails again)
        if (booking.status === "confirmed") {
          setBookingDetails(booking);
          setStatus("success");
          return;
        }

        // Check payment status via API (MUST have paymentId)
        if (!booking.paymentId) {
          console.error("No paymentId found");
          setStatus("error");
          return;
        }

        const apiUrl = import.meta.env.VITE_API_BASE_URL || "";
        const response = await fetch(`${apiUrl}/api/payment-status?paymentId=${booking.paymentId}`);
        
        if (!response.ok) {
          console.error("Failed to check payment status");
          setStatus("error");
          return;
        }

        const paymentData = await response.json();
        console.log("Payment status:", paymentData);

        // ONLY confirm if payment is actually paid
        if (paymentData.paid === true && paymentData.status === "succeeded") {
          // Update booking status to confirmed
          await updateDoc(bookingRef, { status: "confirmed" });
          
          // Send confirmation emails
          await sendConfirmationEmails(booking);
          
          setBookingDetails({ ...booking, status: "confirmed" });
          setStatus("success");
        } else {
          // Check if 15 minutes have passed
          const PAYMENT_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
          const createdAt = booking.createdAt?.toDate?.() || new Date(booking.createdAt);
          const ageMs = Date.now() - createdAt.getTime();
          
          if (ageMs > PAYMENT_TIMEOUT_MS) {
            // Time expired - mark as expired
            await updateDoc(bookingRef, { status: "expired" });
            console.log("Booking expired - time limit exceeded");
            setStatus("expired");
          } else {
            console.log("Payment not completed:", paymentData.status);
            setStatus("error");
          }
        }

      } catch (error) {
        console.error("Error confirming booking:", error);
        setStatus("error");
      }
    };

    checkPaymentAndConfirm();
  }, [bookingId]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-foreground-400">Проверяем оплату...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="soft-card max-w-md w-full">
          <CardBody className="text-center py-12">
            <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon icon="lucide:credit-card" className="text-warning-600" width={32} />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Оплата не завершена</h1>
            <p className="text-foreground-400 mb-6">
              Оплата была отменена или не прошла. Бронирование не подтверждено.<br />
              Вы можете попробовать снова или связаться с нами.
            </p>
            <div className="space-y-3">
              <Link to="/#booking">
                <Button color="primary" className="w-full">
                  <Icon icon="lucide:refresh-cw" className="mr-2" />
                  Попробовать снова
                </Button>
              </Link>
              <Button as="a" href="tel:+79959831658" variant="bordered" className="w-full">
                Позвонить: +7 995 983 16 58
              </Button>
              <Link to="/">
                <Button variant="light" className="w-full">На главную</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="soft-card max-w-md w-full">
          <CardBody className="text-center py-12">
            <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon icon="lucide:clock" className="text-danger-600" width={32} />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Время на оплату истекло</h1>
            <p className="text-foreground-400 mb-6">
              К сожалению, время на оплату (15 минут) истекло.<br />
              Выбранное время освобождено для других пользователей.<br />
              Пожалуйста, забронируйте снова.
            </p>
            <div className="space-y-3">
              <Link to="/#booking">
                <Button color="primary" className="w-full">
                  <Icon icon="lucide:refresh-cw" className="mr-2" />
                  Забронировать снова
                </Button>
              </Link>
              <Link to="/">
                <Button variant="light" className="w-full">На главную</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="soft-card max-w-md w-full">
        <CardBody className="text-center py-12">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon icon="lucide:check" className="text-success" width={40} />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Бронирование подтверждено!
          </h1>
          <p className="text-foreground-400 mb-6">
            Мы отправили подтверждение на вашу почту
          </p>

          {bookingDetails && (
            <div className="bg-content2 rounded-xl p-4 mb-6 text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground-400">Дата:</span>
                  <span className="font-medium">{formatDate(bookingDetails.bookingDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-400">Время:</span>
                  <span className="font-medium">{bookingDetails.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-400">Тип:</span>
                  <span className="font-medium">
                    {bookingDetails.bookingType === "individual" ? "Индивидуальное" : "Групповое"}
                  </span>
                </div>
                <div className="flex justify-between border-t border-divider pt-2 mt-2">
                  <span className="text-foreground-400">Оплачено:</span>
                  <span className="font-bold text-primary-500">{bookingDetails.totalPrice}₽</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="bg-primary-50 rounded-lg p-4">
              <p className="text-sm text-foreground-600">
                <Icon icon="lucide:map-pin" className="inline mr-1" />
                ТЦ Бутусовский, ул. Победы 38/27
              </p>
            </div>
            
            <Link to="/">
              <Button color="primary" className="w-full" size="lg">
                Вернуться на сайт
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
