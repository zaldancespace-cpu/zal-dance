import React, { useEffect, useState } from "react";
import { db } from "../firebase"; 
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Button, Tooltip, Chip, RadioGroup, Radio } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useBookingStore } from "../hooks/use-booking-store";
import { useSharedBooking } from "../context/BookingContext";
import type { BookingType } from "../lib/booking-types";
import { createHourlySlots, getSlotPrice, getTotalPrice, isWeekendDate } from "../lib/pricing";

interface BookingTimeSlotsProps {
  date: string;
}

export const BookingTimeSlots: React.FC<BookingTimeSlotsProps> = ({ date }) => {
  const [firestoreBookedSlots, setFirestoreBookedSlots] = useState<string[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  const { selectedTimeSlots, toggleTimeSlot, clearTimeSlots, bookingType, setBookingType } = useSharedBooking();
  const { userBookings } = useBookingStore();

  const timeSlots = createHourlySlots();

  // Load confirmed bookings
  useEffect(() => {
    if (!date || !db) {
      setFirestoreBookedSlots([]);
      return;
    }
    
    const bookingsCol = collection(db, "bookings");
    // Block slots for both confirmed AND pending_payment (to prevent double booking)
    const q = query(
      bookingsCol, 
      where("bookingDate", "==", date),
      where("status", "in", ["confirmed", "pending_payment"])
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const slots: string[] = [];
      const now = Date.now();
      const PAYMENT_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // For pending_payment, check if it's older than 15 minutes
        if (data.status === 'pending_payment' && data.createdAt) {
          const createdAt = data.createdAt.toDate?.() || new Date(data.createdAt);
          const ageMs = now - createdAt.getTime();
          if (ageMs > PAYMENT_TIMEOUT_MS) {
            // Skip expired pending bookings
            return;
          }
        }

        if (data.timeSlot) {
          const timeSlots = data.timeSlot.split(', ');
          timeSlots.forEach((slot: string) => slots.push(slot.trim()));
        }
      });
      setFirestoreBookedSlots(slots);
    }, (error) => {
      console.error("Error fetching booked slots: ", error);
      setFirestoreBookedSlots([]);
    });

    return () => unsubscribe();
  }, [date]);

  // Load blocked slots from admin
  useEffect(() => {
    if (!date || !db) {
      setBlockedSlots([]);
      return;
    }
    
    const blockedCol = collection(db, "blockedSlots");
    const q = query(blockedCol, where("date", "==", date));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const slots: string[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // timeSlots is an array of blocked time slots
        if (data.timeSlots && Array.isArray(data.timeSlots)) {
          data.timeSlots.forEach((slot: string) => slots.push(slot));
        }
      });
      setBlockedSlots(slots);
    }, (error) => {
      console.error("Error fetching blocked slots: ", error);
      setBlockedSlots([]);
    });

    return () => unsubscribe();
  }, [date]);

  // Check if a time slot is booked or blocked
  const isTimeSlotBooked = (time: string) => {
    return firestoreBookedSlots.includes(time) || blockedSlots.includes(time);
  };
  
  // Check if slot is blocked by admin
  const isSlotBlocked = (time: string) => {
    return blockedSlots.includes(time);
  };

  // Check if a time slot is booked by the current user (from local store)
  const isUserBooking = (time: string) => {
    return userBookings.some(booking => 
      booking.date === date && booking.timeSlot === time
    );
  };

  const totalPrice = getTotalPrice(date, selectedTimeSlots, bookingType);
  const isWeekend = () => isWeekendDate(date);

  // Get booking details for a specific time slot
  const getBookingDetails = (time: string, hour: number) => {
    const userBooking = userBookings.find(
      booking => booking.date === date && booking.timeSlot === time
    );
    
    if (userBooking) {
      return `Ваше бронирование: ${userBooking.name}`;
    }
    if (blockedSlots.includes(time)) {
      return `Недоступно`;
    }
    if (firestoreBookedSlots.includes(time)) {
      return `Забронировано`;
    }
    
    return `Доступно — ${getSlotPrice(date, hour, bookingType)}₽`;
  };

  return (
    <div className="space-y-5">
      {/* Booking type selector */}
      <div className="bg-default-100 rounded-xl p-4">
        <p className="text-sm font-semibold text-foreground mb-3">Тип занятия:</p>
        <RadioGroup 
          orientation="horizontal" 
          value={bookingType}
          onValueChange={(val) => setBookingType(val as BookingType)}
          classNames={{
            wrapper: "gap-4"
          }}
        >
          <Radio 
            value="individual"
            classNames={{
              wrapper: "border-2 border-default-300 group-data-[selected=true]:border-primary",
              control: "bg-primary"
            }}
          >
            Индивидуально
          </Radio>
          <Radio 
            value="group"
            classNames={{
              wrapper: "border-2 border-default-300 group-data-[selected=true]:border-primary",
              control: "bg-primary"
            }}
          >
            Группа (от 3 человек)
          </Radio>
        </RadioGroup>
      </div>

      {/* Price info */}
      <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-foreground mb-2">
          {isWeekend() ? '📅 Выходной день' : '📅 Будний день'}
        </p>
        {isWeekend() ? (
          <p className="text-sm text-foreground-600">
            Фиксированная цена: <span className="font-bold text-secondary-700">1000₽/час</span>
          </p>
        ) : (
          <div className="text-sm text-foreground-600 space-y-1">
            {bookingType === 'individual' ? (
              <>
                <p>8:00 — 17:00: <span className="font-bold text-secondary-700">600₽/час</span></p>
                <p>17:00 — 22:00: <span className="font-bold text-secondary-700">800₽/час</span></p>
              </>
            ) : (
              <>
                <p>8:00 — 17:00: <span className="font-bold text-secondary-700">1000₽/час</span></p>
                <p>17:00 — 22:00: <span className="font-bold text-secondary-700">1200₽/час</span></p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Selected slots summary */}
      {selectedTimeSlots.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:clock" className="text-primary-600" width={20} />
              <span className="font-semibold text-foreground">
                Выбрано: {selectedTimeSlots.length} {selectedTimeSlots.length === 1 ? 'час' : selectedTimeSlots.length < 5 ? 'часа' : 'часов'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-primary-600">{totalPrice}₽</span>
              <Button 
                size="sm" 
                variant="light" 
                color="danger"
                onPress={clearTimeSlots}
                startContent={<Icon icon="lucide:x" width={16} />}
              >
                Сбросить
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedTimeSlots.map(slot => (
              <Chip 
                key={slot} 
                color="primary" 
                variant="flat"
                onClose={() => toggleTimeSlot(slot)}
                className="font-medium"
              >
                {slot}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Time slots grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
        {timeSlots.map((slot) => {
          const isBooked = isTimeSlotBooked(slot.id);
          const isUserSlot = isUserBooking(slot.id);
          const isSelected = selectedTimeSlots.includes(slot.id);
          const bookingDetails = getBookingDetails(slot.id, slot.hour);
          const price = getSlotPrice(date, slot.hour, bookingType);
          
          return (
            <Tooltip 
              key={slot.id} 
              content={bookingDetails}
              placement="top"
            >
              <Button
                size="md"
                color={isUserSlot ? "secondary" : isBooked ? "default" : isSelected ? "primary" : "default"}
                variant={isSelected ? "solid" : isUserSlot ? "flat" : "bordered"}
                className={`
                  w-full h-auto py-3 flex flex-col gap-0.5
                  ${!isBooked && !isUserSlot && !isSelected ? "border-default-300 hover:border-primary-400 hover:bg-primary-50" : ""}
                  ${isBooked && !isUserSlot ? "opacity-50 cursor-not-allowed" : ""}
                `}
                isDisabled={isBooked && !isUserSlot}
                onPress={() => {
                  if (!isBooked) {
                    toggleTimeSlot(slot.id);
                  }
                }}
              >
                <span className="text-base font-semibold">{slot.time}</span>
                {!isBooked && !isUserSlot && (
                  <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-foreground-400'}`}>
                    {price}₽
                  </span>
                )}
              </Button>
            </Tooltip>
          );
        })}
      </div>

      {/* Hint */}
      <p className="text-sm text-foreground-400 text-center">
        <Icon icon="lucide:info" className="inline mr-1" width={14} />
        Выберите один или несколько часов для бронирования
      </p>
    </div>
  );
};
