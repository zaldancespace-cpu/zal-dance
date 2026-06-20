import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const galleryImages = [
  { id: 1, src: "/img/gallery/1.jpg", alt: "Танцевальный зал - вид 1" },
  { id: 2, src: "/img/gallery/2.jpg", alt: "Танцевальный зал - вид 2" },
  { id: 3, src: "/img/gallery/3.jpg", alt: "Танцевальный зал - вид 3" },
  { id: 4, src: "/img/gallery/4.jpg", alt: "Танцевальный зал - вид 4" },
  { id: 5, src: "/img/gallery/5.jpg", alt: "Танцевальный зал - вид 5" },
  { id: 6, src: "/img/gallery/6.jpg", alt: "Танцевальный зал - вид 6" },
];

export const GallerySection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (isPaused || lightboxOpen) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isPaused, lightboxOpen]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const nextLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
  }, []);

  const prevLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextLightbox, prevLightbox]);

  return (
    <section id="gallery" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            Наш <img src="/logo.png" alt="ЗАЛ" className="h-10 md:h-12" />
          </h2>
          <p className="text-foreground-400 max-w-2xl mx-auto">
            Посмотрите пространство зала, детали интерьера и атмосферу для репетиций, занятий и тренировок.
          </p>
        </motion.div>

        {/* Main Slider */}
        <div 
          className="relative overflow-hidden rounded-2xl bg-content2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slider Container */}
          <div className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={galleryImages[currentIndex].src}
                alt={galleryImages[currentIndex].alt}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                onClick={() => openLightbox(currentIndex)}
              />
            </AnimatePresence>

            {/* Click to enlarge hint */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 pointer-events-none">
              <Icon icon="lucide:maximize-2" width={16} />
              <span className="hidden sm:inline">Нажмите для увеличения</span>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
            >
              <Icon icon="lucide:chevron-left" width={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
            >
              <Icon icon="lucide:chevron-right" width={24} />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 py-4 bg-content1/50">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-primary-500 w-6' 
                    : 'bg-foreground-300 hover:bg-foreground-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="mt-4 grid grid-cols-6 gap-2">
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToSlide(index)}
              className={`aspect-square rounded-lg overflow-hidden transition-all ${
                index === currentIndex 
                  ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-background' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button
            as="a"
            href="#booking"
            color="primary"
            variant="bordered"
            startContent={<Icon icon="lucide:calendar" />}
          >
            Забронировать зал
          </Button>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-10"
            >
              <Icon icon="lucide:x" width={28} />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 text-white/80 text-lg font-medium">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navigation Arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
            >
              <Icon icon="lucide:chevron-left" width={32} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
            >
              <Icon icon="lucide:chevron-right" width={32} />
            </button>

            {/* Thumbnail strip at bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-xl">
              {galleryImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(index); }}
                  className={`w-16 h-12 rounded-lg overflow-hidden transition-all ${
                    index === lightboxIndex 
                      ? 'ring-2 ring-white' 
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
