import React from "react";
import { Button, Card } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const Hero: React.FC = () => {
  return (
    <section id="about" className="motion-grid-bg relative py-20 md:py-32 px-4 overflow-hidden">
      {/* Subtle background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-primary-200/30 blur-3xl"></div>
        <div className="absolute top-[40%] right-[10%] w-72 h-72 rounded-full bg-secondary-200/20 blur-3xl"></div>
        <div className="absolute bottom-[15%] left-[20%] w-80 h-80 rounded-full bg-primary-100/30 blur-3xl"></div>
        <svg
          className="absolute inset-x-0 top-10 h-80 w-full opacity-70"
          viewBox="0 0 1200 360"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M-80 260C112 94 238 344 420 178C575 36 712 54 872 178C996 274 1114 250 1280 108"
            stroke="rgba(93, 107, 78, 0.18)"
            strokeWidth="3"
          />
          <path
            d="M-120 156C76 16 266 236 456 108C640 -16 796 110 954 214C1082 298 1180 208 1320 84"
            stroke="rgba(185, 155, 125, 0.18)"
            strokeWidth="2"
          />
        </svg>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Танцевальное<br />пространство —
              </h1>
              <img src="/logo.png" alt="ЗАЛ" className="h-16 md:h-20 lg:h-24 mt-3" />
            </div>
            <p className="text-lg text-foreground-400 mb-8 max-w-lg">
              Просторный зал 100 м² для танцев, репетиций и тренировок. 
              Центр города, ТЦ Бутусовский. Профессиональный звук, зеркала, удобная раздевалка. От 600₽ в час.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                color="primary" 
                size="lg"
                className="accent-border"
                href="#booking"
                as="a"
                startContent={<Icon icon="lucide:calendar" />}
              >
                Забронировать зал
              </Button>
              <Button 
                variant="bordered" 
                size="lg"
                className="soft-button"
                href="#features"
                as="a"
                startContent={<Icon icon="lucide:info" />}
              >
                Подробнее
              </Button>
            </div>
            
            {/* Quick info badges */}
            <div className="flex flex-wrap gap-3 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-default-100 rounded-full">
                <Icon icon="lucide:maximize" className="text-primary-500" width={18} />
                <span className="text-sm font-medium">100 м²</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-default-100 rounded-full">
                <Icon icon="lucide:volume-2" className="text-primary-500" width={18} />
                <span className="text-sm font-medium">Профессиональный звук</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-default-100 rounded-full">
                <Icon icon="lucide:snowflake" className="text-primary-500" width={18} />
                <span className="text-sm font-medium">Кондиционер</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <Card className="soft-card overflow-hidden w-full aspect-[4/3]">
              <img 
                src="/img/gallery/1.jpg" 
                alt="Танцевальный зал ЗАЛ" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                  <span className="text-xs text-foreground-500">Доступно для бронирования</span>
                </div>
                <h3 className="text-xl font-medium text-foreground">Танцевальный ЗАЛ</h3>
              </div>
            </Card>
            
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-primary-200/40 blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-secondary-200/30 blur-3xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
