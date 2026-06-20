import React from "react";
import { today } from "@internationalized/date"; // today is needed for mock data

// Define booking types
interface Booking {
  id: string;
  date: string;
  timeSlot: string;
  name: string;
  email: string;
  phone: string;
  // purpose: string; // Removed purpose
  notes?: string;
}

// Add photo gallery interface
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

// Mock data for existing bookings
const mockBookings: Booking[] = [
  {
    id: "1",
    date: today("UTC").toString(),
    timeSlot: "10:00",
    name: "Иван Петров",
    email: "ivan@example.ru",
    phone: "7-999-123-4567"
  },
  {
    id: "2",
    date: today("UTC").toString(),
    timeSlot: "14:00",
    name: "Елена Смирнова",
    email: "elena@example.ru",
    phone: "7-999-765-4321"
  },
  {
    id: "3",
    date: today("UTC").add({ days: 1 }).toString(),
    timeSlot: "11:00",
    name: "Михаил Иванов",
    email: "mikhail@example.ru",
    phone: "7-999-555-1234"
  },
  {
    id: "4",
    date: today("UTC").add({ days: 2 }).toString(),
    timeSlot: "15:00",
    name: "Анна Козлова",
    email: "anna@example.ru",
    phone: "7-999-333-7890"
  }
];

// Mock data for user's own bookings
const mockUserBookings: Booking[] = [
  {
    id: "5",
    date: today("UTC").add({ days: 3 }).toString(),
    timeSlot: "16:00",
    name: "Ваше Имя",
    email: "you@example.ru",
    phone: "7-999-888-7777",
    notes: "Принесу свой реквизит"
  }
];

// Create a custom hook for booking state management
export const useBookingStore = () => {
  // State for selected date and time slot are now managed by BookingContext
  
  // State for bookings
  const [bookings, setBookings] = React.useState<Booking[]>(() => {
    const savedBookings = localStorage.getItem('bookings');
    // Dates in localStorage are already strings "YYYY-MM-DD"
    // Keep them as strings to match the Booking interface and comparison logic
    return savedBookings ? JSON.parse(savedBookings) : mockBookings;
  });
  const [userBookings, setUserBookings] = React.useState<Booking[]>(() => {
    const savedUserBookings = localStorage.getItem('userBookings');
    // Dates in localStorage are already strings "YYYY-MM-DD"
    // Keep them as strings to match the Booking interface and comparison logic
    return savedUserBookings ? JSON.parse(savedUserBookings) : mockUserBookings;
  });
  
  // Save bookings to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings, (key, value) => {
      if (key === 'date') {
        return value.toString();
      }
      return value;
    }));
  }, [bookings]);
  
  React.useEffect(() => {
    localStorage.setItem('userBookings', JSON.stringify(userBookings, (key, value) => {
      if (key === 'date') {
        return value.toString();
      }
      return value;
    }));
  }, [userBookings]);
  
  // Add gallery image slots for hall photos.
  const [galleryImages] = React.useState<GalleryImage[]>([
    { id: "1", src: "/img/1.jpg", alt: "Фото танцевального зала 1", category: "hall" },
    { id: "2", src: "/img/2.jpg", alt: "Фото танцевального зала 2", category: "hall" },
    { id: "3", src: "/img/3.jpg", alt: "Фото танцевального зала 3", category: "hall" },
    { id: "4", src: "/img/4.jpg", alt: "Фото танцевального зала 4", category: "hall" },
    { id: "5", src: "/img/5.jpg", alt: "Фото танцевального зала 5", category: "hall" },
    { id: "6", src: "/img/6.jpg", alt: "Фото танцевального зала 6", category: "hall" },
    { id: "7", src: "/img/7.jpg", alt: "Фото танцевального зала 7", category: "hall" },
    { id: "8", src: "/img/8.jpg", alt: "Фото танцевального зала 8", category: "hall" },
    { id: "9", src: "/img/9.jpg", alt: "Фото танцевального зала 9", category: "hall" },
    { id: "10", src: "/img/10.jpg", alt: "Фото танцевального зала 10", category: "hall" }
  ]);
  
  // Add a new booking
  // Add a new booking
  const addBooking = (newBooking: Booking) => {
    // Ensure the date is a string in "YYYY-MM-DD" format
    const bookingToAdd = {
      ...newBooking,
      date: typeof newBooking.date === 'string' ? newBooking.date : (newBooking.date as any).toString(),
    };
    setBookings(prevBookings => [...prevBookings, bookingToAdd]);
  };

  // Add a new user booking
  const addUserBooking = (newUserBooking: Booking) => {
    // Ensure the date is a string in "YYYY-MM-DD" format
    const userBookingToAdd = {
      ...newUserBooking,
      date: typeof newUserBooking.date === 'string' ? newUserBooking.date : (newUserBooking.date as any).toString(),
    };
    setUserBookings(prevUserBookings => [...prevUserBookings, userBookingToAdd]);
  };
  
  // Remove a booking
  const removeBooking = (id: string) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
  };
  
  // Remove a user booking
  const removeUserBooking = (id: string) => {
    setUserBookings(prev => prev.filter(booking => booking.id !== id));
  };
  
  return {
    // selectedDate, // Managed by BookingContext
    // setSelectedDate, // Managed by BookingContext
    // selectedTimeSlot, // Managed by BookingContext
    // setSelectedTimeSlot, // Managed by BookingContext
    bookings,
    userBookings,
    galleryImages,
    addBooking,
    addUserBooking,
    removeBooking,
    removeUserBooking
  };
};
