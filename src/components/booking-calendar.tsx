import React from "react";
import { Calendar, Card, CardBody, Chip, Divider } from "@heroui/react";
import { today } from "@internationalized/date";
import { Icon } from "@iconify/react";
import { BookingTimeSlots } from "./booking-time-slots";
import { useBookingStore } from "../hooks/use-booking-store"; // For bookings, userBookings
import { useSharedBooking } from "../context/BookingContext"; // For shared date/time

export const BookingCalendar: React.FC = () => {
  const { selectedDate, setSelectedDate } = useSharedBooking();
  const { bookings, userBookings } = useBookingStore(); // Still use this for booking data management
  const calendarRootRef = React.useRef<HTMLDivElement | null>(null);

  const w = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
  const isHeader = (el: Element | null) => {
    if (!el) return false;
    const role = (el as HTMLElement).getAttribute?.("role");
    if (role !== "columnheader") return false;
    let p = el.parentElement, d = 0, ok = false;
    while (p && d < 6) {
      const r = (p as HTMLElement).getAttribute?.("role");
      if (r === "grid" || r === "table") { ok = true; break; }
      p = p.parentElement; d++;
    }
    return ok;
  };
  const patch = (root?: Element | Document) => {
    const scope = root ?? document;
    const all = Array.from(scope.querySelectorAll('[role="columnheader"]')).filter(isHeader);
    if (!all.length) return;
    let group: Element[] | null = null;
    for (let i = 0; i + 6 < all.length; i++) {
      const slice = all.slice(i, i + 7);
      const parent = slice[0].parentElement;
      if (slice.every(h => h.parentElement === parent)) { group = slice; break; }
    }
    if (!group) return;
    group.forEach((el, idx) => { (el as HTMLElement).textContent = w[idx]; });
  };
  React.useEffect(() => {
    const root = calendarRootRef.current ?? undefined;
    patch(root ?? document);
    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === 'childList') {
          m.addedNodes.forEach(n => {
            if ((n as Element)?.querySelector?.('[role="columnheader"]')) patch(n as Element);
          });
        } else if (m.type === 'characterData') {
          const el = (m.target as CharacterData)?.parentElement as Element | null;
          if (isHeader(el)) patch(root ?? document);
        }
      }
    });
    const target = root ?? document.body;
    mo.observe(target, { childList: true, subtree: true, characterData: true });
    return () => mo.disconnect();
  }, [selectedDate]);

  // Function to check if a date has bookings
  const isDateBooked = (date: any) => {
    const dateStr = date.toString();
    console.log('Checking bookings for date:', dateStr);
    console.log('Bookings:', bookings);
    return bookings.some(booking => booking.date === dateStr);
  };

  // Function to check if a date has user's own bookings
  const isDateOwnBooking = (date: any) => {
    const dateStr = date.toString();
    console.log('Checking user bookings for date:', dateStr);
    console.log('User Bookings:', userBookings);
    return userBookings.some(booking => booking.date === dateStr);
  };

  // Custom renderer for calendar cells
  const renderCalendarCell = (date: any) => {
    const hasBooking = isDateBooked(date);
    const hasOwnBooking = isDateOwnBooking(date);
    
    if (hasOwnBooking) {
      return <div className="calendar-day-own-booking"></div>;
    } else if (hasBooking) {
      return <div className="calendar-day-booked"></div>;
    }
    
    return null;
  };

  // Format date for display
  const formatDate = (date: any) => {
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const d = new Date(date.toString());
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
  };

  // Initial value for selectedDate is now set in BookingContext
  return (
    <div className="space-y-6" ref={calendarRootRef}>
      <Card className="soft-card border border-default-200">
        <CardBody className="p-4">
          <Calendar
            aria-label="Календарь бронирования"
            value={selectedDate}
            onChange={setSelectedDate as any}
            minValue={today("UTC")}
            weekdayStyle="short"
            classNames={{
              base: 'w-full max-w-full',
              content: 'w-full',
              gridWrapper: 'w-full',
              grid: 'w-full',
              gridHeader: 'bg-default-100 rounded-lg',
              gridHeaderCell: 'text-foreground-600 font-medium',
              cellButton: 'data-[selected=true]:bg-primary-500 data-[selected=true]:text-white hover:bg-primary-100',
            }}
            // @ts-ignore
            renderCellContent={renderCalendarCell}
          />
        </CardBody>
      </Card>

      <div className="flex justify-center py-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-secondary-500"></span>
          <span className="text-sm text-foreground-400">Ваше бронирование</span>
        </div>
      </div>

      <Divider className="opacity-30" />

      {selectedDate && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 p-2 rounded-lg">
                <Icon icon="lucide:calendar" className="text-primary-600" width={20} height={20} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {formatDate(selectedDate)}
              </h3>
            </div>
            <Chip 
              size="md" 
              variant="flat" 
              color={isDateOwnBooking(selectedDate) ? "primary" : isDateBooked(selectedDate) ? "warning" : "success"}
              className="font-medium"
            >
              {isDateOwnBooking(selectedDate) ? "Ваше бронирование" : 
               isDateBooked(selectedDate) ? "Частично занято" : "Доступно"}
            </Chip>
          </div>
          <BookingTimeSlots date={selectedDate.toString()} />
        </div>
      )}
    </div>
  );
};