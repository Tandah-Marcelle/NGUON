import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useTranslation } from "react-i18next";
import logo1 from "@/assets/logo1.png";

const navLinks = [
  { label: "nav.home", href: "#accueil" },
  { label: "nav.about", href: "#about" },
  { label: "nav.sites", href: "#sites" },
  { label: "nav.program", href: "#programme" },
  { label: "nav.participate", href: "#participer" },
  { label: "nav.media", href: "#media" },
  { label: "nav.visitors", href: "#visitors" },
  { label: "nav.contact", href: "#contact" },
];

const Navbar = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect active section
      const sections = navLinks.map(link => link.href.substring(1));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Backdrop blur effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-background/80 via-background/60 to-transparent backdrop-blur-xl z-40 dark:from-background/90 dark:via-background/70"
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`relative rounded-2xl transition-all duration-500 ${scrolled
              ? "bg-card/70 backdrop-blur-2xl shadow-lg border border-border/50"
              : "bg-card/10 backdrop-blur-sm border border-border/20"
              }`}
          >
            <div className="flex items-center justify-between px-6 py-2">
              {/* Logo */}
              <motion.a
                href="#accueil"
                className="relative group block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <img
                  src={logo1}
                  alt="Le Nguon Logo"
                  className={`h-16 w-auto transition-all duration-300 ${scrolled ? "brightness-100" : "brightness-0 invert dark:brightness-100 dark:invert-0"
                    }`}
                />
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-secondary"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>

              {/* Desktop nav */}
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-lg group ${activeSection === link.href.substring(1)
                      ? scrolled
                        ? "text-primary hover:text-secondary"
                        : "text-white hover:text-secondary dark:text-foreground dark:hover:text-secondary"
                      : scrolled
                        ? "text-foreground/70 hover:text-primary"
                        : "text-white/80 hover:text-white dark:text-foreground/70 dark:hover:text-primary"
                      }`}
                  >
                    {t(link.label)}

                    {/* Active indicator */}
                    {activeSection === link.href.substring(1) && (
                      <motion.span
                        layoutId="activeSection"
                        className="absolute inset-0 bg-secondary/10 rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Hover effect */}
                    <motion.span
                      className={`absolute bottom-1 left-4 right-4 h-0.5 ${activeSection === link.href.substring(1)
                        ? "bg-secondary"
                        : scrolled ? "bg-primary" : "bg-white dark:bg-primary"
                        }`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}

                {/* Theme Toggle */}
                <div className="ml-2 flex items-center gap-2">
                  <ThemeToggle />
                  <LanguageToggle scrolled={scrolled} />
                </div>
              </div>

              {/* Mobile toggle */}
              <motion.button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled
                  ? "text-primary hover:bg-primary/10"
                  : "text-white hover:bg-white/10 dark:text-foreground dark:hover:bg-primary/10"
                  }`}
                aria-label="Menu"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:hidden overflow-hidden border-t border-border/20"
                >
                  <div className="px-6 py-4 space-y-4">
                    {/* Mobile Toggles */}
                    <div className="flex items-center justify-between pb-4 border-b border-border/10">
                      <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <span className="text-sm font-medium text-foreground/70">Theme</span>
                      </div>
                      <LanguageToggle scrolled={scrolled} />
                    </div>

                    <div className="space-y-2">
                      {navLinks.map((link, i) => (
                        <motion.a
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: i * 0.05 }}
                          className={`block px-4 py-3 text-base font-medium rounded-lg transition-all ${activeSection === link.href.substring(1)
                            ? "bg-secondary/20 text-primary hover:text-secondary"
                            : scrolled
                              ? "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                              : "text-white/80 hover:bg-white/10 hover:text-white dark:text-foreground/70 dark:hover:bg-primary/5 dark:hover:text-primary"
                            }`}
                        >
                          {t(link.label)}
                          {activeSection === link.href.substring(1) && (
                            <motion.span
                              className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-secondary"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            />
                          )}
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
