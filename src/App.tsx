import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { RulesPage } from "./pages/RulesPage";
import { AdminPage } from "./pages/AdminPage";
import { BookingSuccessPage } from "./pages/BookingSuccessPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/booking-success" element={<BookingSuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;