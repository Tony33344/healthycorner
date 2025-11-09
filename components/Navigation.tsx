"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/#home", label: "Home", labelSl: "Domov" },
  { href: "/#about", label: "About", labelSl: "O nas" },
  { href: "/#services", label: "Services", labelSl: "Storitve" },
  { href: "/#menu", label: "Menu", labelSl: "Meni" },
  { href: "/#schedule", label: "Schedule", labelSl: "Urnik" },
  { href: "/#gallery", label: "Gallery", labelSl: "Galerija" },
  { href: "/#contact", label: "Contact", labelSl: "Kontakt" },
];

export function Navigation() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState<"en" | "sl">("en");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-black/20 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/#home" className="flex items-center">
            {scrolled ? (
              // When scrolled - show icon + text
              <div className="flex items-center space-x-3">
                <div className="relative w-14 h-14">
                  <Image
                    src="/images/logo.png"
                    alt="Healthy Corner Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold lowercase text-neutral-900">
                    healthy corner
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                    ALPSKI ZDRAVILIŠKI KAMP
                  </span>
                </div>
              </div>
            ) : (
              // When transparent - show full logo image
              <div className="relative w-64 h-16">
                <Image
                  src="/images/logo.png"
                  alt="Healthy Corner Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium hover:text-primary transition-colors ${
                  scrolled ? "text-neutral-700" : "text-white"
                }`}
              >
                {language === "en" ? item.label : item.labelSl}
              </a>
            ))}
            <button
              onClick={() => setLanguage(language === "en" ? "sl" : "en")}
              aria-label={`Switch to ${language === "en" ? "Slovenian" : "English"}`}
              className={`px-4 py-2 text-sm font-medium border rounded-full hover:border-primary hover:text-primary transition-colors ${
                scrolled 
                  ? "border-neutral-300 text-neutral-700" 
                  : "border-white/30 text-white"
              }`}
            >
              {language === "en" ? "SL" : "EN"}
            </button>
            <Link
              href="/#booking"
              className="px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg"
            >
              {language === "en" ? "Book Now" : "Rezerviraj"}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className={`lg:hidden p-2 transition-colors ${
              scrolled ? "text-neutral-700" : "text-white"
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-neutral-200"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-neutral-700 hover:text-primary transition-colors"
                >
                  {language === "en" ? item.label : item.labelSl}
                </a>
              ))}
              <div className="flex items-center space-x-4 pt-4">
                <button
                  onClick={() => setLanguage(language === "en" ? "sl" : "en")}
                  aria-label={`Switch to ${language === "en" ? "Slovenian" : "English"}`}
                  className="px-4 py-2 text-sm font-medium border border-neutral-300 rounded-full"
                >
                  {language === "en" ? "SL" : "EN"}
                </button>
                <Link
                  href="/#booking"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center px-6 py-2.5 bg-primary text-white rounded-full font-medium"
                >
                  {language === "en" ? "Book Now" : "Rezerviraj"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
