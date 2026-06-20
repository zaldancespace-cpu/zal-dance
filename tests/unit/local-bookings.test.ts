import { beforeEach, describe, expect, it } from "vitest";
import { getLocalBookingIds, isLocalBooking, rememberLocalBookingId } from "../../src/lib/local-bookings";

describe("local booking ownership", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with no remembered booking ids", () => {
    expect(getLocalBookingIds()).toEqual([]);
  });

  it("remembers unique booking ids in local storage", () => {
    rememberLocalBookingId("booking-1");
    rememberLocalBookingId("booking-1");
    rememberLocalBookingId("booking-2");

    expect(getLocalBookingIds()).toEqual(["booking-1", "booking-2"]);
    expect(isLocalBooking("booking-1")).toBe(true);
    expect(isLocalBooking("missing")).toBe(false);
  });

  it("recovers from invalid local storage data", () => {
    localStorage.setItem("zal_booking_ids", "not-json");

    expect(getLocalBookingIds()).toEqual([]);
  });
});
