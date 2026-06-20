import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Divider, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Стоимость <span className="text-primary-500">аренды</span>
          </h2>
          <p className="text-foreground-400 max-w-2xl mx-auto">
            Почасовая аренда зала. Минимальное время бронирования — 1 час. Можно бронировать несколько часов подряд.
          </p>
        </motion.div>
        
        {/* Two columns: Individual and Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Individual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="soft-card h-full">
              <CardHeader className="flex flex-col items-center pb-0">
                <div className="bg-primary-100 p-3 rounded-full mb-3">
                  <Icon icon="lucide:user" className="text-primary-600" width={28} height={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground">Индивидуально</h3>
                <p className="text-sm text-foreground-400">Занятия для 1-2 человек</p>
              </CardHeader>
              <Divider className="opacity-30 my-4" />
              <CardBody className="pt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-default-50 rounded-lg">
                    <span className="text-foreground-600">8:00 — 17:00</span>
                    <span className="text-2xl font-bold text-primary-600">600₽<span className="text-sm font-normal text-foreground-400">/час</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-default-50 rounded-lg">
                    <span className="text-foreground-600">17:00 — 22:00</span>
                    <span className="text-2xl font-bold text-primary-600">800₽<span className="text-sm font-normal text-foreground-400">/час</span></span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Group */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="soft-card h-full border-2 border-secondary-300">
              <CardHeader className="flex flex-col items-center pb-0">
                <div className="bg-secondary-100 p-3 rounded-full mb-3">
                  <Icon icon="lucide:users" className="text-secondary-600" width={28} height={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground">Группа</h3>
                <p className="text-sm text-foreground-400">Занятия от 3 человек</p>
              </CardHeader>
              <Divider className="opacity-30 my-4" />
              <CardBody className="pt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-default-50 rounded-lg">
                    <span className="text-foreground-600">8:00 — 17:00</span>
                    <span className="text-2xl font-bold text-secondary-600">1000₽<span className="text-sm font-normal text-foreground-400">/час</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-default-50 rounded-lg">
                    <span className="text-foreground-600">17:00 — 22:00</span>
                    <span className="text-2xl font-bold text-secondary-600">1200₽<span className="text-sm font-normal text-foreground-400">/час</span></span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Weekend pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Card className="soft-card bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200">
            <CardBody className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <Icon icon="lucide:calendar" className="text-primary-600" width={24} height={24} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">Выходные дни</h4>
                  <p className="text-sm text-foreground-500">Суббота и воскресенье, любое время</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <span className="text-3xl font-bold text-primary-600">1000₽</span>
                <span className="text-foreground-400">/час</span>
                <Chip color="primary" variant="flat" size="sm" className="ml-2">Фиксированная цена</Chip>
              </div>
            </CardBody>
          </Card>
        </motion.div>
        
        <div className="text-center mt-10">
          <Button
            as="a"
            href="#booking"
            color="primary"
            size="lg"
            className="accent-border pulse-animation"
            startContent={<Icon icon="lucide:calendar" />}
          >
            Забронировать зал
          </Button>
        </div>
      </div>
    </section>
  );
};