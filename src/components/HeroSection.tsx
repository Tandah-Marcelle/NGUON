import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import cultureCeremony from "@/assets/culture-ceremony.jpg";
import roiImage from "@/assets/roi_ok.png";
import boxImage from "@/assets/box.png";
import fireworks2 from "@/assets/fireworks2.json";
import ParticleBackground from "./ParticleBackground";
import MagneticButton from "./MagneticButton";
import LottieAnimation from "./LottieAnimation";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-1.5 md:p-1.5 lg:p-2.5 min-w-[50px] xs:min-w-[58px] md:min-w-[55px] lg:min-w-[70px] text-center border border-white/20">
      <motion.span
        key={value}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="font-display text-3xl xs:text-4xl md:text-3xl lg:text-5xl font-black text-white block"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
    </div>
    <span className="text-white text-[8px] md:text-[8px] lg:text-[10px] uppercase tracking-[0.15em] mt-1 font-body font-bold text-shadow-sm">
      {label}
    </span>
  </div>
);

const HeroSection = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowFireworks(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const targetDate = new Date('2026-12-04T00:00:00');
      const diff = Math.max(0, targetDate.getTime() - now.getTime());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showFireworks && (
          <div className="fixed inset-0 z-[9999] pointer-events-none overflow-visible">
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 w-[400px] h-[400px] md:w-[700px] md:h-[700px] overflow-visible"
            >
              <LottieAnimation animationData={fireworks2} loop={true} renderer="svg" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[700px] md:h-[700px] overflow-visible"
            >
              <LottieAnimation animationData={fireworks2} loop={true} renderer="svg" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[700px] md:h-[700px] overflow-visible"
            >
              <LottieAnimation animationData={fireworks2} loop={true} renderer="svg" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[700px] md:h-[700px] overflow-visible"
            >
              <LottieAnimation animationData={fireworks2} loop={true} renderer="svg" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section
        ref={ref}
        id="home"
        className="relative min-h-screen lg:min-h-[700px] lg:max-h-fit flex flex-col bg-[#0047AB] overflow-hidden pt-16"
      >
        {/* Roi Image */}
        <motion.div
          style={{ y: bgY }}
          className="absolute top-16 bottom-0 right-0 left-0 pointer-events-none hidden lg:block"
        >
          <motion.img
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={roiImage}
            alt=""
            className="absolute bottom-0 right-0 w-[45%] xl:w-[50%] h-[75%] xl:h-[95%] object-cover object-bottom select-none"
          />
        </motion.div>

        <div className="relative z-20 flex-grow flex flex-col pt-12 md:pt-16">
          {/* Countdown Timer - Top & Centered */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center mb-3 md:mb-6"
          >
            <div className="flex items-center gap-1.5 xs:gap-2 md:gap-2 lg:gap-4">
              <CountdownUnit value={timeLeft.days} label={t('hero.days')} />
              <span className="text-white text-lg xs:text-xl md:text-xl lg:text-3xl font-black mb-4 md:mb-6">:</span>
              <CountdownUnit value={timeLeft.hours} label={t('hero.hours')} />
              <span className="text-white text-lg xs:text-xl md:text-xl lg:text-3xl font-black mb-4 md:mb-6">:</span>
              <CountdownUnit value={timeLeft.minutes} label={t('hero.minutes')} />
              <span className="text-white text-lg xs:text-xl md:text-xl lg:text-3xl font-black mb-4 md:mb-6">:</span>
              <CountdownUnit value={timeLeft.seconds} label={t('hero.seconds')} />
            </div>
          </motion.div>

          {/* Main Content Container - Text on Left */}
          <div className="w-full flex-grow flex items-center justify-center pb-0 lg:pb-14 px-4">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-2 lg:gap-12 w-full items-center justify-items-center">
              {/* Left Column Container */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex flex-col justify-center items-center w-full"
              >
                {/* Internally Centered Text Block - Sits on the left half of the screen */}
                <div className="flex flex-col items-center text-center w-full max-w-4xl">
                  {/* Title Section */}
                  <div className="mb-3 w-full flex flex-col items-center">
                    <motion.h1
                      className="font-display text-2xl xs:text-3xl md:text-4xl lg:text-5xl xl:text-8xl font-black text-white leading-[0.9] flex flex-col items-center"
                    >
                      <div className="flex flex-wrap items-center justify-center gap-x-3 overflow-visible">
                        <span className="tracking-tighter">{t('hero.title_highlight')}</span>
                        <span className="text-secondary tracking-tighter">{t('hero.year')}</span>
                      </div>
                    </motion.h1>
                    <div className="mt-2 flex flex-col items-center space-y-1">
                      <div className="flex flex-col xs:flex-row items-center gap-1 xs:gap-2">
                        <div className="bg-white text-[#0047AB] px-2 py-0.5 font-black text-sm xs:text-base md:text-lg lg:text-xl xl:text-2xl rounded-sm">
                          {t('hero.edition')}
                        </div>
                        <div className="text-white font-black text-xs xs:text-sm md:text-base lg:text-lg xl:text-xl tracking-wide max-w-xs leading-tight text-center">
                          {t('hero.special')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description Text */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white font-medium text-[8px] md:text-sm tracking-wide leading-relaxed mb-3 w-full py-1 text-center capitalize whitespace-normal"
                  >
                    {t('hero.description')}
                  </motion.p>

                  {/* Theme Section */}
                  <div className="mb-4 w-full flex flex-col items-center">
                    <div className="bg-secondary text-white px-3 py-1.5 md:px-4 md:py-1.5 lg:px-5 lg:py-2 font-black text-sm md:text-base lg:text-lg xl:text-xl rounded-md mb-2 shadow-lg">
                      {t('hero.theme_label')}
                    </div>
                    <div className="text-white font-black text-xs md:text-xs lg:text-sm xl:text-base tracking-wider text-center leading-tight uppercase max-w-[280px] md:max-w-xs lg:max-w-md border-l-4 border-secondary pl-3">
                      {t('hero.theme_message')}
                    </div>
                  </div>

                  {/* Date and Location Box */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 xs:gap-4 mb-4">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 xs:p-4 rounded-xl flex flex-col items-center min-w-[140px] xs:min-w-[160px]">
                      <div className="flex items-baseline gap-1">
                        <span className="text-white text-xs xs:text-sm md:text-base tracking-widest uppercase font-bold">DU</span>
                        <span className="text-white text-3xl xs:text-4xl font-black">04</span>
                        <span className="text-white text-xs xs:text-sm md:text-base tracking-widest uppercase font-bold">AU</span>
                        <span className="text-white text-3xl xs:text-4xl font-black">13</span>
                      </div>
                      <div className="text-secondary font-bold tracking-[0.15em] xs:tracking-[0.2em] text-xs xs:text-sm md:text-base uppercase mt-1">DÉCEMBRE</div>
                    </div>

                    <div className="text-white space-y-0.5 xs:space-y-1 text-center">
                      <div className="text-xs xs:text-sm md:text-base font-black tracking-widest uppercase">FOUMBAN</div>
                      <div className="text-secondary/80 text-xs xs:text-sm md:text-base font-bold tracking-[0.15em] uppercase">
                        ET SES LOCALITÉS ENVIRONNANTES
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <MagneticButton
                      className="w-fit px-7 py-3 bg-white text-[#0047AB] font-black rounded-lg text-sm shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-[#0047AB] transition-all duration-300 uppercase tracking-widest"
                      onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      {t('hero.cta')}
                    </MagneticButton>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Side - Empty space for background Roi image on desktop */}
              <div className="hidden lg:block h-full min-h-[400px]" />

              {/* Mobile Image - Shows below text on mobile */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="lg:hidden w-full max-w-[300px] sm:max-w-md"
              >
                <img
                  src={roiImage}
                  alt=""
                  className="w-full h-auto object-contain"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="hidden lg:block absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2 cursor-pointer"
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          >
            <motion.div className="w-1.5 h-1.5 bg-secondary rounded-full" />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default HeroSection;
