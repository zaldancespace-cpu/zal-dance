import React, { createContext, useState, useContext, ReactNode } from 'react';
import { today, CalendarDate } from '@internationalized/date';
import type { BookingType } from '../lib/booking-types';

export type { BookingType };

interface BookingContextType {
  selectedDate: CalendarDate;
  setSelectedDate: (date: CalendarDate) => void;
  selectedTimeSlots: string[];
  setSelectedTimeSlots: React.Dispatch<React.SetStateAction<string[]>>;
  toggleTimeSlot: (timeSlot: string) => void;
  clearTimeSlots: () => void;
  bookingType: BookingType;
  setBookingType: (type: BookingType) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState<CalendarDate>(today("UTC"));
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [bookingType, setBookingType] = useState<BookingType>('individual');

  const toggleTimeSlot = (timeSlot: string) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(timeSlot)) {
        return prev.filter(t => t !== timeSlot);
      } else {
        return [...prev, timeSlot].sort((a, b) => {
          const hourA = parseInt(a.split(':')[0]);
          const hourB = parseInt(b.split(':')[0]);
          return hourA - hourB;
        });
      }
    });
  };

  const clearTimeSlots = () => setSelectedTimeSlots([]);

  return (
    <BookingContext.Provider value={{ 
      selectedDate, 
      setSelectedDate, 
      selectedTimeSlots, 
      setSelectedTimeSlots,
      toggleTimeSlot,
      clearTimeSlots,
      bookingType,
      setBookingType
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useSharedBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useSharedBooking must be used within a BookingProvider');
  }
  return context;
};
