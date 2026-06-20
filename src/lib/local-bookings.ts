const STORAGE_KEY = "zal_booking_ids";

export const getLocalBookingIds = (): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
};

export const rememberLocalBookingId = (bookingId: string) => {
  const ids = new Set(getLocalBookingIds());
  ids.add(bookingId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
};

export const isLocalBooking = (bookingId: string) => getLocalBookingIds().includes(bookingId);
