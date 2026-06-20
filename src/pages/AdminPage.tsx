import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Divider, Spinner, Chip, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, addToast, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, Timestamp, doc, updateDoc, deleteDoc, addDoc, where, getDocs } from "firebase/firestore";

interface Booking {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  bookingDate: string;
  timeSlot: string;
  bookingType: string;
  totalPrice: number;
  userNotes: string;
  createdAt: Timestamp;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

interface BlockedSlot {
  id: string;
  date: string;
  timeSlots: string[];
  reason: string;
  createdAt: Timestamp;
}

export const AdminPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  
  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  
  // Block slot form
  const [blockDate, setBlockDate] = useState("");
  const [blockTimeSlots, setBlockTimeSlots] = useState<string[]>([]);
  const [blockReason, setBlockReason] = useState("");
  
  // Tab state
  const [activeTab, setActiveTab] = useState("bookings");

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;

    setBookingsLoading(true);
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData: Booking[] = [];
      snapshot.forEach((doc) => {
        bookingsData.push({ id: doc.id, ...doc.data() } as Booking);
      });
      setBookings(bookingsData);
      setBookingsLoading(false);
    }, (error) => {
      console.error("Error fetching bookings:", error);
      setBookingsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Load blocked slots
  useEffect(() => {
    if (!user || !db) return;

    const q = query(collection(db, "blockedSlots"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const slotsData: BlockedSlot[] = [];
      snapshot.forEach((doc) => {
        slotsData.push({ id: doc.id, ...doc.data() } as BlockedSlot);
      });
      setBlockedSlots(slotsData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setLoginError("Firebase не настроен");
      return;
    }

    try {
      setLoginError("");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setLoginError("Неверный email или пароль");
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  // Booking management functions
  const openBookingDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status });
      addToast({
        title: status === 'confirmed' ? "Бронь подтверждена" : "Бронь отменена",
        color: status === 'confirmed' ? "success" : "warning"
      });
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error("Error updating booking:", error);
      addToast({ title: "Ошибка обновления", color: "danger" });
    }
  };

  const deleteBooking = async (bookingId: string) => {
    if (!db) return;
    if (!confirm("Удалить эту бронь? Это действие нельзя отменить.")) return;
    
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      addToast({ title: "Бронь удалена", color: "success" });
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error("Error deleting booking:", error);
      addToast({ title: "Ошибка удаления", color: "danger" });
    }
  };

  // Block slots functions
  const timeSlotOptions = Array.from({ length: 14 }, (_, i) => `${8 + i}:00`);

  const toggleBlockTimeSlot = (slot: string) => {
    setBlockTimeSlots(prev => 
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const createBlockedSlot = async () => {
    if (!db || !blockDate || blockTimeSlots.length === 0) {
      addToast({ title: "Заполните дату и выберите слоты", color: "warning" });
      return;
    }

    try {
      await addDoc(collection(db, "blockedSlots"), {
        date: blockDate,
        timeSlots: blockTimeSlots,
        reason: blockReason || "Не указана",
        createdAt: Timestamp.now()
      });
      addToast({ title: "Слоты заблокированы", color: "success" });
      setIsBlockModalOpen(false);
      setBlockDate("");
      setBlockTimeSlots([]);
      setBlockReason("");
    } catch (error) {
      console.error("Error blocking slots:", error);
      addToast({ title: "Ошибка блокировки", color: "danger" });
    }
  };

  const deleteBlockedSlot = async (slotId: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "blockedSlots", slotId));
      addToast({ title: "Блокировка снята", color: "success" });
    } catch (error) {
      console.error("Error deleting blocked slot:", error);
      addToast({ title: "Ошибка", color: "danger" });
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'warning';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'confirmed': return 'Подтверждено';
      case 'cancelled': return 'Отменено';
      default: return 'Ожидает';
    }
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
  };

  const formatCreatedAt = (timestamp: Timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleString("ru-RU");
  };

  const groupBookingsByDate = () => {
    const grouped: { [key: string]: Booking[] } = {};
    bookings.forEach((booking) => {
      if (!grouped[booking.bookingDate]) {
        grouped[booking.bookingDate] = [];
      }
      grouped[booking.bookingDate].push(booking);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md soft-card">
          <CardHeader className="flex flex-col items-center gap-2 pt-8">
            <div className="text-3xl font-bold text-primary-500">ЗАЛ</div>
            <h1 className="text-xl font-semibold text-foreground">Вход в админ-панель</h1>
          </CardHeader>
          <CardBody className="px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onValueChange={setEmail}
                variant="bordered"
                isRequired
              />
              <Input
                label="Пароль"
                type="password"
                value={password}
                onValueChange={setPassword}
                variant="bordered"
                isRequired
              />
              {loginError && (
                <p className="text-danger text-sm text-center">{loginError}</p>
              )}
              <Button type="submit" color="primary" className="w-full" size="lg">
                Войти
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    );
  }

  const groupedBookings = groupBookingsByDate();
  const sortedDates = Object.keys(groupedBookings).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-content1 border-b border-divider sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl font-bold text-primary-500">ЗАЛ</span>
            <span className="text-foreground-400 text-sm sm:text-base">Админ</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs sm:text-sm text-foreground-400 truncate max-w-[150px] sm:max-w-none">{user.email}</span>
            <Button variant="flat" color="danger" size="sm" onPress={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Tabs 
          selectedKey={activeTab} 
          onSelectionChange={(key) => setActiveTab(key as string)}
          className="mb-6"
        >
          <Tab key="bookings" title={
            <div className="flex items-center gap-1 sm:gap-2">
              <Icon icon="lucide:calendar" width={18} />
              <span className="text-sm sm:text-base">Брони</span>
              <Chip size="sm" variant="flat">{bookings.length}</Chip>
            </div>
          }>
            <div className="pt-4">
              {bookingsLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : bookings.length === 0 ? (
                <Card className="soft-card">
                  <CardBody className="py-12 text-center">
                    <Icon icon="lucide:calendar-x" className="mx-auto text-foreground-300 mb-4" width={48} />
                    <p className="text-foreground-400">Пока нет бронирований</p>
                  </CardBody>
                </Card>
              ) : (
                <div className="space-y-6">
                  {sortedDates.map((date) => (
                    <Card key={date} className="soft-card">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:calendar" className="text-primary-500" />
                          <span className="font-semibold text-lg">{formatDate(date)}</span>
                          <Chip size="sm" variant="flat">{groupedBookings[date].length} броней</Chip>
                        </div>
                      </CardHeader>
                      <Divider />
                      <CardBody className="space-y-4">
                        {groupedBookings[date].map((booking) => (
                          <div 
                            key={booking.id} 
                            className="bg-content2 rounded-lg p-4 cursor-pointer hover:bg-content3 transition-colors"
                            onClick={() => openBookingDetail(booking)}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div className="space-y-2 flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                  <Icon icon="lucide:clock" className="text-foreground-400 flex-shrink-0" width={14} />
                                  <span className="font-medium text-sm sm:text-base">{booking.timeSlot}</span>
                                  <Chip size="sm" color={booking.bookingType === 'individual' ? 'primary' : 'secondary'}>
                                    {booking.bookingType === 'individual' ? 'Инд.' : 'Гр.'}
                                  </Chip>
                                  <Chip size="sm" color={getStatusColor(booking.status)} variant="flat">
                                    {getStatusText(booking.status)}
                                  </Chip>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-sm">
                                  <Icon icon="lucide:user" className="text-foreground-400 flex-shrink-0" width={14} />
                                  <span className="truncate">{booking.userName}</span>
                                  <span className="text-foreground-400 hidden sm:inline">•</span>
                                  <span className="text-foreground-400 text-xs sm:text-sm">{booking.userPhone}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end gap-3 sm:text-right">
                                <div>
                                  <div className="text-base sm:text-lg font-bold text-primary-500">{booking.totalPrice}₽</div>
                                  <div className="text-xs text-foreground-400">{formatCreatedAt(booking.createdAt)}</div>
                                </div>
                                <Icon icon="lucide:chevron-right" className="text-foreground-400" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Tab>

          <Tab key="blocked" title={
            <div className="flex items-center gap-1 sm:gap-2">
              <Icon icon="lucide:lock" width={18} />
              <span className="text-sm sm:text-base">Блок</span>
              <Chip size="sm" variant="flat">{blockedSlots.length}</Chip>
            </div>
          }>
            <div className="pt-4">
              <div className="flex justify-end mb-4">
                <Button 
                  color="primary" 
                  startContent={<Icon icon="lucide:plus" />}
                  onPress={() => setIsBlockModalOpen(true)}
                >
                  Заблокировать слоты
                </Button>
              </div>

              {blockedSlots.length === 0 ? (
                <Card className="soft-card">
                  <CardBody className="py-12 text-center">
                    <Icon icon="lucide:unlock" className="mx-auto text-foreground-300 mb-4" width={48} />
                    <p className="text-foreground-400">Нет заблокированных слотов</p>
                  </CardBody>
                </Card>
              ) : (
                <div className="space-y-4">
                  {blockedSlots.map((slot) => (
                    <Card key={slot.id} className="soft-card">
                      <CardBody>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Icon icon="lucide:calendar" className="text-danger" width={18} />
                              <span className="font-semibold">{formatDate(slot.date)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {slot.timeSlots.map((t) => (
                                <Chip key={t} size="sm" color="danger" variant="flat">{t}</Chip>
                              ))}
                            </div>
                            <p className="text-xs sm:text-sm text-foreground-400">Причина: {slot.reason}</p>
                          </div>
                          <Button 
                            color="danger" 
                            variant="light" 
                            size="sm"
                            startContent={<Icon icon="lucide:trash-2" />}
                            onPress={() => deleteBlockedSlot(slot.id)}
                            className="w-full sm:w-auto"
                          >
                            Снять
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      </main>

      {/* Booking Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} size="lg" scrollBehavior="inside">
        <ModalContent>
          {selectedBooking && (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Icon icon="lucide:calendar-check" className="text-primary-500" />
                Бронирование на {formatDate(selectedBooking.bookingDate)}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Chip color={getStatusColor(selectedBooking.status)} size="lg">
                      {getStatusText(selectedBooking.status)}
                    </Chip>
                    <Chip color={selectedBooking.bookingType === 'individual' ? 'primary' : 'secondary'}>
                      {selectedBooking.bookingType === 'individual' ? 'Индивидуальное' : 'Групповое'}
                    </Chip>
                  </div>

                  <Divider />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-foreground-400">Время</p>
                      <p className="font-semibold text-base sm:text-lg">{selectedBooking.timeSlot}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-foreground-400">Сумма</p>
                      <p className="font-semibold text-base sm:text-lg text-primary-500">{selectedBooking.totalPrice}₽</p>
                    </div>
                  </div>

                  <Divider />

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Icon icon="lucide:user" className="text-foreground-400" />
                      <div>
                        <p className="text-sm text-foreground-400">Имя</p>
                        <p className="font-medium">{selectedBooking.userName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon icon="lucide:phone" className="text-foreground-400" />
                      <div>
                        <p className="text-sm text-foreground-400">Телефон</p>
                        <a href={`tel:${selectedBooking.userPhone}`} className="font-medium text-primary-500">
                          {selectedBooking.userPhone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon icon="lucide:mail" className="text-foreground-400" />
                      <div>
                        <p className="text-sm text-foreground-400">Email</p>
                        <a href={`mailto:${selectedBooking.userEmail}`} className="font-medium text-primary-500">
                          {selectedBooking.userEmail}
                        </a>
                      </div>
                    </div>
                    {selectedBooking.userNotes && selectedBooking.userNotes !== 'Нет заметок' && (
                      <div className="flex items-start gap-3">
                        <Icon icon="lucide:message-square" className="text-foreground-400 mt-1" />
                        <div>
                          <p className="text-sm text-foreground-400">Комментарий</p>
                          <p>{selectedBooking.userNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Divider />

                  <p className="text-xs text-foreground-400">
                    Создано: {formatCreatedAt(selectedBooking.createdAt)}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button 
                    color="danger" 
                    variant="light"
                    size="sm"
                    startContent={<Icon icon="lucide:trash-2" width={16} />}
                    onPress={() => deleteBooking(selectedBooking.id)}
                    className="w-full sm:w-auto"
                  >
                    Удалить
                  </Button>
                  <div className="flex-1 hidden sm:block" />
                  <div className="flex gap-2 w-full sm:w-auto">
                    {selectedBooking.status !== 'cancelled' && (
                      <Button 
                        color="warning"
                        variant="flat"
                        size="sm"
                        startContent={<Icon icon="lucide:x" width={16} />}
                        onPress={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                        className="flex-1 sm:flex-none"
                      >
                        Отменить
                      </Button>
                    )}
                    {selectedBooking.status !== 'confirmed' && (
                      <Button 
                        color="success"
                        size="sm"
                        startContent={<Icon icon="lucide:check" width={16} />}
                        onPress={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                        className="flex-1 sm:flex-none"
                      >
                        Подтвердить
                      </Button>
                    )}
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Block Slots Modal */}
      <Modal isOpen={isBlockModalOpen} onClose={() => setIsBlockModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Заблокировать слоты</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                type="date"
                label="Дата"
                value={blockDate}
                onChange={(e) => setBlockDate(e.target.value)}
                variant="bordered"
              />
              
              <div>
                <p className="text-sm text-foreground-400 mb-2">Выберите слоты</p>
                <div className="flex flex-wrap gap-2">
                  {timeSlotOptions.map((slot) => (
                    <Chip
                      key={slot}
                      color={blockTimeSlots.includes(slot) ? 'danger' : 'default'}
                      variant={blockTimeSlots.includes(slot) ? 'solid' : 'bordered'}
                      className="cursor-pointer"
                      onClick={() => toggleBlockTimeSlot(slot)}
                    >
                      {slot}
                    </Chip>
                  ))}
                </div>
              </div>

              <Textarea
                label="Причина блокировки"
                placeholder="Например: Техническое обслуживание"
                value={blockReason}
                onValueChange={setBlockReason}
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsBlockModalOpen(false)}>
              Отмена
            </Button>
            <Button color="danger" onPress={createBlockedSlot}>
              Заблокировать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
