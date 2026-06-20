import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export const RulesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/">
          <Button variant="light" startContent={<Icon icon="lucide:arrow-left" />} className="mb-6">
            Вернуться на главную
          </Button>
        </Link>

        <div className="soft-card p-8 rounded-2xl">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Правила аренды танцевального зала
          </h1>

          <div className="space-y-6 text-foreground-600">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Общие положения</h2>
              <p>
                Настоящие Правила определяют порядок и условия аренды танцевального зала 
                «ЗАЛ» (далее — «Зал»). Бронируя Зал, Арендатор подтверждает своё согласие 
                с настоящими Правилами и обязуется их соблюдать.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Порядок бронирования</h2>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Бронирование осуществляется через сайт с онлайн-оплатой.</li>
                <li>Бронирование считается подтверждённым после получения оплаты.</li>
                <li>Минимальное время аренды — 1 час.</li>
                <li>Время аренды включает время на подготовку и уборку.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Отмена и перенос бронирования</h2>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Отмена бронирования возможна не позднее чем за 24 часа до начала аренды с полным возвратом средств.</li>
                <li>При отмене менее чем за 24 часа возврат средств не производится.</li>
                <li>Перенос бронирования возможен не позднее чем за 12 часов до начала аренды (при наличии свободного времени).</li>
                <li>Для отмены или переноса свяжитесь с нами по телефону: +7 995 983 16 58</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Правила посещения</h2>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Сменная обувь обязательна.</strong> Посещение зала и раздевалок возможно только в сменной обуви. Уличную обувь необходимо оставлять при входе.</li>
                <li>Запрещено находиться в зале в состоянии алкогольного или наркотического опьянения.</li>
                <li>Запрещено курение на территории зала и в здании.</li>
                <li>Запрещено приносить и употреблять алкогольные напитки.</li>
              </ul>
            </section>

            <section className="bg-warning-50 border border-warning-300 rounded-xl p-4">
              <h2 className="text-xl font-semibold text-warning-800 mb-3 flex items-center gap-2">
                <Icon icon="lucide:alert-triangle" className="text-warning-600" />
                5. Зеркала — особое внимание!
              </h2>
              <p className="text-warning-700">
                <strong>Пожалуйста, не касайтесь зеркал и не опирайтесь на них!</strong>
              </p>
              <p className="mt-2 text-warning-700">
                Зеркальные стены являются важной частью оборудования зала. 
                Будьте аккуратны рядом с ними, не ставьте предметы вплотную к зеркалам, 
                не позволяйте детям играть около них. Это помогает сохранить их внешний вид 
                и избежать повреждений.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Использование инвентаря</h2>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Весь инвентарь зала (коврики, блоки, реквизит) предоставляется бесплатно.</li>
                <li>После использования инвентарь должен быть аккуратно возвращён на своё место.</li>
                <li>При обнаружении повреждений инвентаря до начала аренды — сообщите администрации.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Время занятия</h2>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Арендатор обязуется прибыть к началу забронированного времени.</li>
                <li>Опоздание не является основанием для продления времени аренды.</li>
                <li><strong>Просим завершать занятие за 5 минут до окончания времени аренды.</strong> Это время необходимо для подготовки пространства к следующему бронированию.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. После занятия</h2>
              <p>После завершения занятия Арендатор обязан:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Убрать следы от каблуков на полу (при их наличии)</li>
                <li>Протереть пол от волос (швабра находится в зале)</li>
                <li>Закрыть окна</li>
                <li>Выключить кондиционер/обогреватель</li>
                <li>Выбросить весь мусор (бутылки, стаканы, упаковки)</li>
                <li>Вернуть инвентарь на место</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Санузел</h2>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Просим не выбрасывать в туалет бумажные полотенца, средства личной гигиены и другие посторонние предметы.</li>
                <li>Рядом с унитазом находится мусорное ведро — используйте его.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Материальная ответственность</h2>
              <p>
                Арендатор несёт полную материальную ответственность за сохранность имущества Зала 
                в период аренды, включая:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Зеркала и зеркальные стены</li>
                <li>Звуковое и световое оборудование</li>
                <li>Мебель и инвентарь</li>
                <li>Напольное покрытие</li>
                <li>Стены и двери</li>
              </ul>
              <p className="mt-3">
                <strong>В случае повреждения имущества</strong> стоимость ремонта или замены 
                оплачивается Арендатором в полном объёме.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. Групповые занятия</h2>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Групповым считается занятие от 3 человек.</li>
                <li>Организатор группового занятия несёт ответственность за соблюдение правил всеми участниками группы.</li>
                <li>Максимальное количество участников — согласовывается с администрацией.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">12. Фото и видеосъёмка</h2>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Фото и видеосъёмка для личного использования разрешена.</li>
                <li>Коммерческая съёмка согласовывается отдельно с администрацией.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">13. Форс-мажорные обстоятельства</h2>
              <p>
                Администрация не несёт ответственности за невозможность предоставления услуг 
                в случае форс-мажорных обстоятельств (аварии, отключение электричества и т.д.). 
                В таких случаях производится полный возврат средств или перенос бронирования.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">14. Контактная информация</h2>
              <p>
                <strong>Танцевальное пространство «ЗАЛ»</strong><br />
                Адрес: г. Ярославль, ТЦ Бутусовский, ул. Победы 38/27<br />
                Email: Zaldancespace@gmail.com<br />
                Телефон: +7 995 983 16 58
              </p>
            </section>

            <section className="bg-primary-50 border border-primary-200 rounded-xl p-4">
              <p className="text-primary-700 text-center">
                <strong>Бронируя зал, вы подтверждаете, что ознакомились с данными правилами 
                и обязуетесь их соблюдать.</strong>
              </p>
            </section>

            <p className="text-sm text-foreground-400 text-center mt-4">
              Дата публикации: 17.06.2025<br />
              Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
