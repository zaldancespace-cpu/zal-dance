import React from "react";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface Rule {
  title: string;
  content: string;
  icon: string;
  highlight?: boolean;
}

const hallRules: Rule[] = [
  {
    title: "Сменная обувь",
    content: "Посещение зала и раздевалок возможно только в сменной обуви. Уличную обувь необходимо оставлять при входе.",
    icon: "lucide:footprints"
  },
  {
    title: "Инвентарь",
    content: "После использования весь инвентарь должен быть аккуратно возвращён на своё место.",
    icon: "lucide:package"
  },
  {
    title: "⚠️ Зеркала — важно!",
    content: "Пожалуйста, не касайтесь зеркал и не опирайтесь на них. Это помогает сохранить их внешний вид и избежать повреждений. Будьте аккуратны рядом с зеркальными стенами!",
    icon: "lucide:alert-triangle",
    highlight: true
  },
  {
    title: "Время занятия",
    content: "Просим завершать занятие за 5 минут до окончания времени аренды. Это время необходимо для уборки и подготовки пространства к следующему бронированию.",
    icon: "lucide:clock"
  },
  {
    title: "После занятия",
    content: "После завершения занятия необходимо: убрать следы от каблуков при их наличии; протереть пол от волос (швабра находится в зале); закрыть окна; выбросить бутылки, стаканы, упаковки и другой мусор, оставленный в зале или раздевалке.",
    icon: "lucide:check-square"
  },
  {
    title: "Санузел",
    content: "Просим не выбрасывать в туалет бумажные полотенца, средства личной гигиены и другие посторонние предметы. Рядом находится мусорное ведро.",
    icon: "lucide:trash-2"
  },
  {
    title: "Материальная ответственность",
    content: "Арендатор несёт ответственность за сохранность имущества зала, включая зеркала, мебель, оборудование и инвентарь. В случае повреждения стоимость ремонта или замены оплачивается в полном объёме.",
    icon: "lucide:shield"
  }
];

export const RulesSection: React.FC = () => {
  return (
    <section id="rules" className="py-16 px-4 bg-default-50">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Правила <span className="text-primary-500">зала</span>
          </h2>
          <p className="text-foreground-400 max-w-2xl mx-auto">
            Спасибо, что выбираете наше пространство. Чтобы в зале всегда сохранялись комфорт, чистота и приятная атмосфера для всех гостей, просим соблюдать следующие правила.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="soft-card">
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
                <Icon icon="lucide:file-text" className="text-primary-500" />
                Правила и условия
              </h3>
            </CardHeader>
            <Divider className="opacity-30" />
            <CardBody className="space-y-4">
              {hallRules.map((rule, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl border ${
                    rule.highlight 
                      ? 'bg-warning-50 border-warning-300 ring-2 ring-warning-200' 
                      : 'bg-default-50 border-default-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      rule.highlight ? 'bg-warning-200' : 'bg-primary-100'
                    }`}>
                      <Icon 
                        icon={rule.icon} 
                        className={rule.highlight ? 'text-warning-700' : 'text-primary-500'} 
                        width={20} 
                        height={20} 
                      />
                    </div>
                    <div>
                      <h4 className={`font-semibold mb-1 ${
                        rule.highlight ? 'text-warning-800' : 'text-foreground'
                      }`}>
                        {rule.title}
                      </h4>
                      <p className={`text-sm ${
                        rule.highlight ? 'text-warning-700' : 'text-foreground-500'
                      }`}>
                        {rule.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </motion.div>
        
        <motion.div 
          className="mt-8 p-6 soft-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <Icon icon="lucide:heart" className="text-primary-500" width={24} height={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Благодарим за аккуратность</h3>
              <p className="text-foreground-400">
                Благодарим за аккуратность, уважение к пространству и соблюдение правил ✨
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};