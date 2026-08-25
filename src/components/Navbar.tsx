import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ShoppingCart } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo2 from "@/assets/logo2.png";
import { useCart } from "@/context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse, faCircleInfo, faScroll, faCalendarDays,
  faHandshake, faPhotoFilm, faPersonWalking, faEnvelope,
  faTrophy, faStore, faBullseye, faMapLocationDot, faChartLine,
  faBed,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const navLinks = [
  { label: "nav.home",        href: "#accueil",    icon: faHouse },
  {
    label: "nav.about",
    href: "#about",
    icon: faCircleInfo,
    dropdown: [
      { label: "nav.about_nguon",          href: "#about",       icon: faCircleInfo    },
      { label: "nav.objectives",           href: "#objectives",  icon: faBullseye      },
      { label: "nav.sites_manifestations", href: "#sites",       icon: faMapLocationDot },
      { label: "nav.impact",               href: "#impact",      icon: faChartLine     },
    ]
  },
  { label: "nav.actualites",  href: "#actualites", icon: faScroll },
  { label: "nav.program",     href: "#programme",  icon: faCalendarDays },
  { label: "nav.participate", href: "#participer", icon: faHandshake },
  { label: "nav.media",       href: "#media",      icon: faPhotoFilm },
  { label: "nav.visitors",    href: "#visiteurs",  icon: faPersonWalking },
  { label: "nav.contact",     href: "#contact",    icon: faEnvelope },
  { label: "nav.concours",    href: "/concours",   icon: faTrophy,  isPage: true },
  // Hidden from public nav while still testing online — routes stay reachable
  // directly by URL (/booking, /shop). Uncomment to relist them here.
  // { label: "nav.booking", href: "/booking", icon: faBed, isPage: true },
  // { label: "nav.shop",        href: "/shop",       icon: faStore,   isPage: true },
];

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);

  const isOnConcours = location.pathname === "/concours";
  const isOnBooking = location.pathname.startsWith("/booking");
  const isOnShop = location.pathname.startsWith("/shop");
  const isSubPage = location.pathname !== "/";
  const effectiveScrolled = scrolled || isSubPage;

  const { count: cartCount } = useCart();

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isPage?: boolean) => {
    e.preventDefault();
    setMobileOpen(false);

    if (isPage) {
      navigate(href);
      return;
    }

    // If we're not on home page, go home first then scroll
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);
        if (element) {
          const navbarHeight = 80;
          const elementTop = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementTop - navbarHeight, behavior: 'smooth' });
        }
      }, 300);
      return;
    }

    setTimeout(() => {
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        const navbarHeight = 80;
        const elementTop = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementTop - navbarHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <>
      {/* Backdrop blur effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: effectiveScrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-background/80 via-background/60 to-transparent backdrop-blur-xl z-40 dark:from-background/90 dark:via-background/70"
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-[1720px] mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`relative rounded-2xl transition-all duration-500 ${effectiveScrolled
              ? "bg-card/70 backdrop-blur-2xl shadow-lg border border-border/50"
              : "bg-card/10 backdrop-blur-sm border border-border/20"
              }`}
          >
            <div className="flex items-center justify-between px-4 lg:px-6 py-2">
              {/* Logo */}
              <motion.a
                href="#accueil"
                onClick={(e) => handleNavClick(e, "#accueil")}
                className="relative group block flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <img
                  src={logo2}
                  alt="Le Nguon Logo"
                  className="h-10 lg:h-11 xl:h-12 2xl:h-16 w-auto transition-all duration-300"
                />
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-secondary"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>

              {/* Desktop nav */}
              <div className="hidden lg:flex items-center gap-0 xl:gap-0.5 2xl:gap-1">
                {navLinks.map((link, index) => (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <motion.a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href, link.isPage)}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      title={t(link.label)}
                      className={`relative px-1.5 xl:px-2 2xl:px-3 py-1.5 font-medium tracking-wide transition-all duration-300 rounded-lg group flex items-center gap-1 ${
                        (link.isPage ? (link.href === "/concours" ? isOnConcours : link.href === "/booking" ? isOnBooking : link.href === "/shop" ? isOnShop : false) : (activeSection === link.href.substring(1) || (link.dropdown && link.dropdown.some(d => activeSection === d.href.substring(1)))))
                        ? effectiveScrolled
                          ? "text-primary hover:text-secondary"
                          : "text-white hover:text-secondary dark:text-foreground dark:hover:text-secondary"
                        : link.isPage
                          ? effectiveScrolled
                            ? "text-secondary font-bold hover:text-secondary/80 border border-secondary/30 rounded-lg bg-secondary/5"
                            : "text-secondary font-bold hover:text-secondary/80 border border-secondary/40 rounded-lg bg-secondary/10"
                          : effectiveScrolled
                            ? "text-foreground/70 hover:text-primary"
                            : "text-white/80 hover:text-white dark:text-foreground/70 dark:hover:text-primary"
                      }`}
                    >
                      {/* lg/xl: icon only. 2xl: icon + label */}
                      {'icon' in link && link.icon ? (
                        <>
                          <FontAwesomeIcon
                            icon={link.icon as IconDefinition}
                            className="w-3.5 h-3.5 flex-shrink-0"
                          />
                          {/* Label hidden below 2xl */}
                          <span className="hidden 2xl:inline text-xs">
                            {t(link.label)}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] xl:text-xs">{t(link.label)}</span>
                      )}
                      {link.dropdown && (
                        <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-300 flex-shrink-0 ${activeDropdown === link.label ? "rotate-180" : ""}`} />
                      )}

                      {/* Active indicator */}
                      {!link.isPage && (activeSection === link.href.substring(1) || (link.dropdown && link.dropdown.some(d => activeSection === d.href.substring(1)))) && (
                        <motion.span
                          layoutId="activeSection"
                          className="absolute inset-0 bg-secondary/10 rounded-lg -z-10"
                          initial={false}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}

                      {/* Hover effect */}
                      {!link.isPage && (
                        <motion.span
                          className={`absolute bottom-1 left-4 right-4 h-0.5 ${
                            activeSection === link.href.substring(1) || (link.dropdown && link.dropdown.some(d => activeSection === d.href.substring(1)))
                              ? "bg-secondary"
                              : effectiveScrolled ? "bg-primary" : "bg-white dark:bg-primary"
                          }`}
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.a>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {link.dropdown && activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
                          {link.dropdown.map((subItem) => (
                            <a
                              key={subItem.href}
                              href={subItem.href}
                              onClick={(e) => {
                                handleNavClick(e, subItem.href);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-200 relative group"
                            >
                              {'icon' in subItem && subItem.icon && (
                                <FontAwesomeIcon icon={subItem.icon as IconDefinition} className="w-3 h-3 text-primary/60 group-hover:text-primary flex-shrink-0" />
                              )}
                              <span className="relative z-10">{t(subItem.label)}</span>
                              <motion.span
                                className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                layoutId={`dropdown-indicator-${subItem.href}`}
                              />
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Theme Toggle + Cart */}
                <div className="ml-1 flex items-center gap-1 2xl:gap-2">
                  {/* Cart button — icon only at lg/xl, show label at 2xl */}
                  {isOnShop && (
                    <Link
                      to="/shop/cart"
                      className={`relative flex items-center gap-1.5 px-2 py-1.5 rounded-xl font-black text-[10px] 2xl:text-xs transition-all duration-300 ${
                        effectiveScrolled
                          ? "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                          : "bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm"
                      }`}
                    >
                      <ShoppingCart size={14} />
                      <span className="hidden 2xl:inline">Panier</span>
                      {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-secondary text-black text-[9px] font-black flex items-center justify-center shadow">
                          {cartCount > 9 ? "9+" : cartCount}
                        </span>
                      )}
                    </Link>
                  )}
                  <ThemeToggle />
                  <LanguageToggle scrolled={effectiveScrolled} />
                </div>
              </div>

              {/* Mobile toggle */}
              <motion.button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${effectiveScrolled
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
                  className="lg:hidden overflow-hidden border-t border-border/20 bg-card/95 backdrop-blur-xl"
                >
                  <div className="px-6 py-4 space-y-4">
                    {/* Mobile Toggles */}
                    <div className="flex items-center justify-between pb-4 border-b border-border/10">
                      <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <span className="text-sm font-medium text-foreground/70">Theme</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOnShop && (
                          <Link
                            to="/shop/cart"
                            onClick={() => setMobileOpen(false)}
                            className="relative flex items-center gap-1.5 bg-primary text-white font-black text-xs px-3 py-2 rounded-xl hover:bg-primary/90 transition-all"
                          >
                            <ShoppingCart size={14} />
                            Panier
                            {cartCount > 0 && (
                              <span className="ml-0.5 bg-secondary text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">
                                {cartCount > 9 ? "9+" : cartCount}
                              </span>
                            )}
                          </Link>
                        )}
                        <LanguageToggle scrolled={effectiveScrolled} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {navLinks.map((link, i) => (
                        <div key={link.href} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <motion.a
                              href={link.href}
                              onClick={(e) => handleNavClick(e, link.href, link.isPage)}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ delay: i * 0.05 }}
                              className={`flex-grow flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all ${
                                link.isPage
                                  ? (link.href === "/concours" ? isOnConcours : link.href === "/booking" ? isOnBooking : link.href === "/shop" ? isOnShop : false)
                                    ? "bg-secondary/20 text-secondary font-bold"
                                    : "text-secondary font-bold border border-secondary/30 bg-secondary/5"
                                  : (activeSection === link.href.substring(1) || (link.dropdown && link.dropdown.some(d => activeSection === d.href.substring(1))))
                                    ? "bg-secondary/20 text-primary hover:text-secondary"
                                    : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                              }`}
                            >
                              {'icon' in link && link.icon && (
                                <FontAwesomeIcon
                                  icon={link.icon as IconDefinition}
                                  className="w-4 h-4 flex-shrink-0 opacity-70"
                                />
                              )}
                              <span className="flex-1">{t(link.label)}</span>
                              {!link.isPage && (activeSection === link.href.substring(1) || (link.dropdown && link.dropdown.some(d => activeSection === d.href.substring(1)))) && (
                                <motion.span
                                  className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500 }}
                                />
                              )}
                            </motion.a>
                            {link.dropdown && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setMobileDropdownOpen(mobileDropdownOpen === link.label ? null : link.label);
                                }}
                                className="p-3 text-foreground/50 hover:text-primary transition-colors"
                              >
                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileDropdownOpen === link.label ? "rotate-180" : ""}`} />
                              </button>
                            )}
                          </div>

                          {/* Mobile Dropdown Items */}
                          <AnimatePresence>
                            {link.dropdown && mobileDropdownOpen === link.label && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="pl-6 space-y-1 overflow-hidden"
                              >
                                {link.dropdown.map((subItem) => (
                                  <a
                                    key={subItem.href}
                                    href={subItem.href}
                                    onClick={(e) => handleNavClick(e, subItem.href)}
                                    className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${activeSection === subItem.href.substring(1)
                                      ? "text-primary bg-primary/5"
                                      : "text-foreground/60 hover:text-primary hover:bg-primary/5"
                                      }`}
                                  >
                                    {'icon' in subItem && subItem.icon && (
                                      <FontAwesomeIcon
                                        icon={subItem.icon as IconDefinition}
                                        className="w-3.5 h-3.5 flex-shrink-0 opacity-60"
                                      />
                                    )}
                                    {t(subItem.label)}
                                  </a>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
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
