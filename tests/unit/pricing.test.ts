import { describe, expect, it } from "vitest";
import { createHourlySlots, getSlotPrice, getTotalPrice, isWeekendDate } from "../../src/lib/pricing";

describe("booking pricing", () => {
  it("creates hourly slots from 10:00 to 19:00 by default", () => {
    expect(createHourlySlots()).toEqual([
      { id: "10:00", time: "10:00", hour: 10 },
      { id: "11:00", time: "11:00", hour: 11 },
      { id: "12:00", time: "12:00", hour: 12 },
      { id: "13:00", time: "13:00", hour: 13 },
      { id: "14:00", time: "14:00", hour: 14 },
      { id: "15:00", time: "15:00", hour: 15 },
      { id: "16:00", time: "16:00", hour: 16 },
      { id: "17:00", time: "17:00", hour: 17 },
      { id: "18:00", time: "18:00", hour: 18 },
      { id: "19:00", time: "19:00", hour: 19 },
    ]);
  });

  it("detects weekend dates using local calendar date strings", () => {
    expect(isWeekendDate("2026-06-13")).toBe(true);
    expect(isWeekendDate("2026-06-15")).toBe(false);
  });

  it("prices weekday individual and group slots by time of day", () => {
    expect(getSlotPrice("2026-06-15", 10, "individual")).toBe(600);
    expect(getSlotPrice("2026-06-15", 17, "individual")).toBe(800);
    expect(getSlotPrice("2026-06-15", 10, "group")).toBe(1000);
    expect(getSlotPrice("2026-06-15", 17, "group")).toBe(1400);
  });

  it("uses a fixed weekend price for all booking types", () => {
    expect(getSlotPrice("2026-06-13", 10, "individual")).toBe(1000);
    expect(getSlotPrice("2026-06-13", 18, "group")).toBe(1000);
  });

  it("calculates total price across selected slots", () => {
    expect(getTotalPrice("2026-06-15", ["16:00", "17:00", "18:00"], "individual")).toBe(2200);
  });
});
