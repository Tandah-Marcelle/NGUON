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
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-1.5 md:p-1.5 lg:p-2.5 min-w-[50px] xs:min-w-[58px] md:min-w-[55px] lg:min-w-[70px] xl:min-w-[55px] 2xl:min-w-[60px] text-center border border-white/20">
      <motion.span
        key={value}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="font-display text-3xl xs:text-4xl md:text-3xl lg:text-5xl xl:text-3xl 2xl:text-4xl font-black text-white block"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
    </div>
    <span className="text-white text-base md:text-lg lg:text-xl xl:text-lg 2xl:text-xl uppercase tracking-[0.15em] mt-1 font-body font-bold text-shadow-sm">
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
    const timer = setTimeout(() => setShowFireworks(false), 5000);
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
              <LottieAnimation animationData={fireworks2} loop={true} renderer="svg" duration={5000} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[700px] md:h-[700px] overflow-visible"
            >
              <LottieAnimation animationData={fireworks2} loop={true} renderer="svg" duration={5000} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[700px] md:h-[700px] overflow-visible"
            >
              <LottieAnimation animationData={fireworks2} loop={true} renderer="svg" duration={5000} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[700px] md:h-[700px] overflow-visible"
            >
              <LottieAnimation animationData={fireworks2} loop={true} renderer="svg" duration={5000} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section
        ref={ref}
        id="home"
        className="relative min-h-screen lg:min-h-[700px] xl:min-h-[900px] 2xl:min-h-screen lg:max-h-fit flex flex-col bg-[#0047AB] overflow-hidden pt-16"
      >
        {/* Roi Image */}
        <motion.div
          style={{ y: bgY }}
          className="absolute top-0 bottom-0 right-0 left-0 pointer-events-none hidden lg:block"
        >
          <motion.img
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={roiImage}
            alt=""
            className="absolute bottom-0 right-[-8%] lg:right-[-5%] xl:right-[-3%] 2xl:right-0 w-[75%] lg:w-[70%] xl:w-[65%] 2xl:w-[60%] h-auto max-h-[95%] object-contain object-bottom select-none"
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
            <div className="flex items-center gap-1 xs:gap-1.5 md:gap-2 lg:gap-4">
              <CountdownUnit value={timeLeft.days} label={t('hero.days')} />
              <span className="text-white text-sm xs:text-base md:text-lg lg:text-2xl font-black mb-3 md:mb-4">:</span>
              <CountdownUnit value={timeLeft.hours} label={t('hero.hours')} />
              <span className="text-white text-sm xs:text-base md:text-lg lg:text-2xl font-black mb-3 md:mb-4">:</span>
              <CountdownUnit value={timeLeft.minutes} label={t('hero.minutes')} />
              <span className="text-white text-sm xs:text-base md:text-lg lg:text-2xl font-black mb-3 md:mb-4">:</span>
              <CountdownUnit value={timeLeft.seconds} label={t('hero.seconds')} />
            </div>
          </motion.div>

          {/* Main Content Container - Text on Left */}
          <div className="w-full flex-grow flex items-center justify-center pb-0 lg:pb-14 px-4">
            <div className="flex flex-col lg:grid lg:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1fr_1fr] gap-4 lg:gap-6 xl:gap-12 w-full items-center justify-items-start lg:justify-items-center">
              {/* Left Column Container */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex flex-col justify-center items-center lg:items-start w-full lg:pr-4"
              >
                {/* Internally Centered Text Block - Sits on the left half of the screen */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-4xl">
                  {/* Title Section */}
                  <div className="mb-3 w-full flex flex-col items-center">
                    <motion.h1
                      className="font-display text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-white leading-tight flex flex-col items-center lg:items-start"
                    >
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 overflow-visible">
                        <span className="tracking-tighter">{t('hero.title_highlight')}</span>
                        <span className="text-secondary tracking-tighter">{t('hero.year')}</span>
                      </div>
                    </motion.h1>
                    <div className="mt-2 flex flex-col items-center lg:items-start space-y-1">
                      <div className="flex flex-col xs:flex-row items-center lg:items-start gap-1 xs:gap-2">
                        <div className="bg-white text-[#0047AB] px-2 py-1 font-black text-sm xs:text-base md:text-lg lg:text-xl rounded-sm">
                          {t('hero.edition')}
                        </div>
                        <div className="text-white font-black text-xs xs:text-sm md:text-base lg:text-lg tracking-wide max-w-sm leading-tight text-center lg:text-left">
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
                    className="text-white font-medium text-sm xs:text-base md:text-lg lg:text-xl tracking-wide leading-relaxed mb-3 w-full py-1 text-center lg:text-left capitalize whitespace-normal"
                  >
                    {t('hero.description')}
                  </motion.p>

                  {/* Theme Section */}
                  <div className="mb-4 w-full flex flex-col items-center lg:items-start">
                    <div className="bg-secondary text-white px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 font-black text-xs xs:text-sm md:text-base lg:text-lg rounded-md mb-2 shadow-lg">
                      {t('hero.theme_label')}
                    </div>
                    <div className="text-white font-black text-xs md:text-sm lg:text-base tracking-wider text-center lg:text-left leading-tight uppercase max-w-xs md:max-w-sm lg:max-w-md border-l-4 border-secondary pl-2">
                      {t('hero.theme_message')}
                    </div>
                  </div>

                  {/* Date and Location Box */}
                  <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 mb-4">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-2 sm:p-3 rounded-xl flex flex-col items-center min-w-[120px] sm:min-w-[140px]">
                      <div className="flex items-baseline gap-1">
                        <span className="text-white text-xs md:text-sm tracking-wide uppercase font-bold">{t('hero.date_from')}</span>
                        <span className="text-white text-lg xs:text-xl sm:text-2xl md:text-3xl font-black">04</span>
                        <span className="text-white text-xs md:text-sm tracking-wide uppercase font-bold">{t('hero.date_to')}</span>
                        <span className="text-white text-lg xs:text-xl sm:text-2xl md:text-3xl font-black">13</span>
                      </div>
                      <div className="text-secondary font-bold tracking-[0.1em] text-xs md:text-sm uppercase mt-0.5">{t('hero.date_month')}</div>
                    </div>

                    <div className="text-white space-y-0.5 text-center sm:mt-2">
                      <div className="text-xs md:text-sm font-black tracking-wide uppercase">FOUMBAN</div>
                      <div className="text-secondary/80 text-xs md:text-sm font-bold tracking-[0.1em] uppercase">
                        {t('hero.location_surroundings')}
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
                      className="w-fit px-4 py-2 xs:px-6 xs:py-3 md:px-8 md:py-4 bg-white text-[#0047AB] font-black rounded-lg text-sm xs:text-base md:text-lg shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-[#0047AB] transition-all duration-300 uppercase tracking-wide"
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
