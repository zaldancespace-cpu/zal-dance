import React from "react";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { BookingSection } from "../components/booking-section";
import { HallFeatures } from "../components/hall-features";
import { PricingSection } from "../components/pricing-section";
import { RulesSection } from "../components/rules-section";
import { ContactsSection } from "../components/contacts-section";
import { Footer } from "../components/footer";
import { GallerySection } from "../components/gallery-section";

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <GallerySection />
        <HallFeatures />
        <PricingSection />
        <RulesSection />
        <BookingSection />
        <ContactsSection />
      </main>
      <Footer />
    </div>
  );
};
