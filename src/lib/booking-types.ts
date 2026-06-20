export type BookingType = "individual" | "group";

export type BookingStatus = "pending_payment" | "confirmed" | "cancelled" | "expired";

export interface PublicBooking {
  id: string;
  date: string;
  timeSlots: string[];
  bookingType: BookingType;
  status: BookingStatus;
  totalPrice: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerNotes?: string;
  paymentId?: string;
  createdAt?: unknown;
  confirmedAt?: unknown;
  cancelledAt?: unknown;
  cancelReason?: string;
  source?: "public" | "admin_manual";
}

export interface BlockedSlot {
  id: string;
  date: string;
  timeSlots: string[];
  reason: string;
  active: boolean;
  createdAt?: unknown;
  createdBy?: string;
}
