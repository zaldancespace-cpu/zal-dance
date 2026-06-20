import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const hallFeatures: Feature[] = [
  {
    icon: "lucide:maximize",
    title: "Просторный зал",
    description: "100 квадратных метров для комфортных занятий и репетиций"
  },
  {
    icon: "lucide:volume-2",
    title: "Профессиональный звук",
    description: "Качественная аудиосистема для танцев и тренировок"
  },
  {
    icon: "lucide:square",
    title: "Зеркала",
    description: "Зеркальные стены для контроля техники и движений"
  },
  {
    icon: "lucide:snowflake",
    title: "Кондиционер",
    description: "Комфортная температура в любое время года"
  },
  {
    icon: "lucide:shirt",
    title: "Раздевалка",
    description: "Удобная раздевалка для переодевания"
  },
  {
    icon: "lucide:bath",
    title: "Санузел",
    description: "Чистый и оборудованный санузел"
  },
  {
    icon: "lucide:lightbulb",
    title: "Световое оборудование",
    description: "Регулируемое освещение для разных типов занятий"
  },
  {
    icon: "lucide:map-pin",
    title: "Удобное расположение",
    description: "Легкая доступность и удобный вход"
  },
  {
    icon: "lucide:dumbbell",
    title: "Инвентарь для тренировок",
    description: "Оборудование для растяжки, пилатеса, йоги и функциональных тренировок"
  }
];

export const HallFeatures: React.FC = () => {
  return (
    <section id="features" className="py-16 px-4 bg-default-50">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Удобства <span className="text-primary-500">зала</span>
          </h2>
          <p className="text-foreground-400 max-w-2xl mx-auto">
            Всё необходимое для комфортных занятий танцами, репетиций и тренировок
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hallFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="soft-card h-full">
                <CardBody className="p-6 text-center">
                  <div className="bg-primary-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon icon={feature.icon} className="text-primary-500" width={28} height={28} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-foreground-400">{feature.description}</p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button
            as="a"
            href="#booking"
            color="primary"
            size="lg"
            className="accent-border"
            startContent={<Icon icon="lucide:calendar" />}
          >
            Забронировать зал
          </Button>
        </div>
      </div>
    </section>
  );
};
