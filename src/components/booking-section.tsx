import React from "react";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { BookingCalendar } from "./booking-calendar";
import { BookingForm } from "./booking-form";
import { today } from "@internationalized/date";

export const BookingSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState(today("UTC"));

  return (
    <section id="booking" className="py-16 px-4 bg-default-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            <span className="text-primary-500">Бронирование</span> зала
          </h2>
          <p className="text-foreground-400 max-w-2xl mx-auto">
            Выберите удобную дату и время для бронирования зала. Вы увидите доступные слоты и сможете сразу забронировать.
          </p>
        </div>
        
        <Card className="soft-card">
          <CardHeader className="flex flex-col gap-2 text-center">
            <h3 className="text-2xl font-bold text-foreground">Календарь бронирования</h3>
            <p className="text-base text-foreground-500">
              Выберите дату и время для аренды зала
            </p>
          </CardHeader>
          <Divider className="opacity-30" />
          <CardBody className="p-6 lg:p-8">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              <div className="xl:col-span-3">
                <BookingCalendar />
              </div>
              <div className="xl:col-span-2">
                <BookingForm />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
};