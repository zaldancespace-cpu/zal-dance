import type { BookingType } from "./booking-types";

export const createHourlySlots = (startHour = 8, endHour = 22) =>
  Array.from({ length: endHour - startHour }, (_, index) => {
    const hour = startHour + index;

    return {
      id: `${hour}:00`,
      time: `${hour}:00`,
      hour,
    };
  });

export const isWeekendDate = (date: string) => {
  const value = new Date(`${date}T00:00:00`);
  const day = value.getDay();

  return day === 0 || day === 6;
};

export const getSlotPrice = (date: string, hour: number, bookingType: BookingType) => {
  if (isWeekendDate(date)) {
    return 1000;
  }

  if (bookingType === "individual") {
    return hour < 17 ? 600 : 800;
  }

  return hour < 17 ? 1000 : 1200;
};

export const getTotalPrice = (date: string, slots: string[], bookingType: BookingType) =>
  slots.reduce((sum, slot) => sum + getSlotPrice(date, Number.parseInt(slot, 10), bookingType), 0);
