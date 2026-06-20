import React from "react";
import { Card, CardBody, CardHeader, Divider, Button } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const ContactsSection: React.FC = () => {
  return (
    <section id="contacts" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Наши <span className="text-primary-500">контакты</span>
          </h2>
          <p className="text-foreground-400 max-w-2xl mx-auto">
            Свяжитесь с нами для бронирования или получения дополнительной информации
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="soft-card h-full">
              <CardHeader>
                <h3 className="text-xl font-semibold text-foreground">Информация для связи</h3>
              </CardHeader>
              <Divider className="opacity-30" />
              <CardBody className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <Icon icon="lucide:map-pin" className="text-primary-500" width={24} height={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Адрес</h4>
                    <p className="text-foreground-400">ТЦ Бутусовский, ул. Победы 38/27</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <Icon icon="lucide:phone" className="text-primary-500" width={24} height={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Телефон</h4>
                    <a href="tel:+79959831658" className="text-foreground-400 hover:text-primary-500 transition-colors">
                      +7 995 983 16 58
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <Icon icon="lucide:mail" className="text-primary-500" width={24} height={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Email</h4>
                    <a href="mailto:Zaldancespace@gmail.com" className="text-foreground-400 hover:text-primary-500 transition-colors">
                      Zaldancespace@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <Icon icon="lucide:clock" className="text-primary-500" width={24} height={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Часы работы</h4>
                    <p className="text-foreground-400">Ежедневно: 8:00 - 22:00</p>
                  </div>
                </div>
                
                {/* Social links placeholder */}
                <div className="pt-4">
                  <p className="text-sm text-foreground-400 mb-3">Мы в соцсетях</p>
                  <div className="flex items-center gap-3">
                    <div className="bg-default-100 p-3 rounded-full">
                      <Icon icon="lucide:instagram" className="text-foreground-400" width={20} height={20} />
                    </div>
                    <div className="bg-default-100 p-3 rounded-full">
                      <Icon icon="mdi:vk" className="text-foreground-400" width={20} height={20} />
                    </div>
                    <div className="bg-default-100 p-3 rounded-full">
                      <Icon icon="mdi:telegram" className="text-foreground-400" width={20} height={20} />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="soft-card h-full">
              <CardHeader>
                <h3 className="text-xl font-semibold text-foreground">Быстрая связь</h3>
              </CardHeader>
              <Divider className="opacity-30" />
              <CardBody className="flex flex-col items-center justify-center p-8 space-y-6">
                <p className="text-foreground-400 text-center">
                  Позвоните нам для быстрого бронирования или уточнения деталей
                </p>
                <Button
                  as="a"
                  href="tel:+79959831658"
                  color="primary"
                  size="lg"
                  className="accent-border"
                  startContent={<Icon icon="lucide:phone" />}
                >
                  +7 995 983 16 58
                </Button>
                <Button
                  as="a"
                  href="#booking"
                  variant="bordered"
                  size="lg"
                  className="soft-button"
                  startContent={<Icon icon="lucide:calendar" />}
                >
                  Онлайн бронирование
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="soft-card overflow-hidden">
            <CardBody className="p-0">
              <div className="aspect-[16/9] w-full">
                <iframe
                  src="https://yandex.ru/map-widget/v1/?text=%D0%AF%D1%80%D0%BE%D1%81%D0%BB%D0%B0%D0%B2%D0%BB%D1%8C%2C%20%D1%83%D0%BB.%20%D0%9F%D0%BE%D0%B1%D0%B5%D0%B4%D1%8B%2038%2F27&z=17&l=map"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen={true}
                  loading="lazy"
                  title="Карта танцевального зала ЗАЛ - Ярославль, ТЦ Бутусовский"
                ></iframe>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};