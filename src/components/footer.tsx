import React from "react";
import { Link, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 mt-16 border-t border-default-200 bg-default-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-foreground-500">Танцевальное пространство</span>
              <span className="text-foreground-300">—</span>
              <img src="/logo.png" alt="ЗАЛ" className="h-6" />
            </div>
            <p className="text-foreground-400 mb-4 max-w-md">
              Просторный танцевальный зал для репетиций, занятий и тренировок. 
              100 м², профессиональный звук, зеркала, кондиционер.
            </p>
            <div className="flex gap-4">
              <span className="text-foreground-400">
                <Icon icon="lucide:instagram" width={20} height={20} />
              </span>
              <span className="text-foreground-400">
                <Icon icon="mdi:vk" width={20} height={20} />
              </span>
              <span className="text-foreground-400">
                <Icon icon="mdi:telegram" width={20} height={20} />
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-foreground-400 hover:text-primary-500 transition-colors">
                  О зале
                </a>
              </li>
              <li>
                <a href="#features" className="text-foreground-400 hover:text-primary-500 transition-colors">
                  Удобства
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-foreground-400 hover:text-primary-500 transition-colors">
                  Цены
                </a>
              </li>
              <li>
                <a href="#rules" className="text-foreground-400 hover:text-primary-500 transition-colors">
                  Правила
                </a>
              </li>
              <li>
                <a href="#booking" className="text-foreground-400 hover:text-primary-500 transition-colors">
                  Бронирование
                </a>
              </li>
              <li>
                <a href="#contacts" className="text-foreground-400 hover:text-primary-500 transition-colors">
                  Контакты
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-foreground-400">
                <Icon icon="lucide:map-pin" className="text-primary-500" width={16} height={16} />
                <span>ТЦ Бутусовский, ул. Победы 38/27</span>
              </li>
              <li className="flex items-center gap-2 text-foreground-400">
                <Icon icon="lucide:phone" className="text-primary-500" width={16} height={16} />
                <a href="tel:+79959831658" className="hover:text-primary-500 transition-colors">
                  +7 995 983 16 58
                </a>
              </li>
              <li className="flex items-center gap-2 text-foreground-400">
                <Icon icon="lucide:clock" className="text-primary-500" width={16} height={16} />
                <span>8:00 - 22:00</span>
              </li>
            </ul>
          </div>
        </div>
        
        <Divider className="my-8 opacity-30" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground-400">
            © {new Date().getFullYear()} Танцевальное пространство ЗАЛ. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};