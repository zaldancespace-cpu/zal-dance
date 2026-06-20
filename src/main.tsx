import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider, ToastProvider } from "@heroui/react"
import { I18nProvider } from '@react-aria/i18n'
import App from './App.tsx'
import './index.css'
import { BookingProvider } from './context/BookingContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <I18nProvider locale="ru-RU">
        <BookingProvider>
          <ToastProvider />
          <App />
        </BookingProvider>
      </I18nProvider>
    </HeroUIProvider>
  </React.StrictMode>,
)
