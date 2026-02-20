import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import cultureCeremony from "@/assets/culture-ceremony.jpg";
import roiImage from "@/assets/Roi.png";
import fireworks2 from "@/assets/fireworks2.json";
import ParticleBackground from "./ParticleBackground";
import MagneticButton from "./MagneticButton";
import LottieAnimation from "./LottieAnimation";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-1.5 md:p-2.5 min-w-[50px] xs:min-w-[58px] md:min-w-[70px] text-center border border-white/20">
      <motion.span
        key={value}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="font-display text-3xl xs:text-4xl md:text-5xl font-black text-white block"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
    </div>
    <span className="text-white text-[8px] md:text-[10px] uppercase tracking-[0.15em] mt-1 font-body font-bold text-shadow-sm">
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
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const cameroonTime = new Date(utcTime + (3600000));

      let targetDate = new Date(cameroonTime);
      const currentDay = targetDate.getDay();
      const currentHour = targetDate.getHours();

      if (currentDay === 6 && currentHour < 14) {
        targetDate.setHours(14, 0, 0, 0);
      } else {
        const daysUntilSaturday = currentDay === 6 ? 7 : (6 - currentDay + 7) % 7;
        targetDate.setDate(targetDate.getDate() + daysUntilSaturday);
        targetDate.setHours(14, 0, 0, 0);
      }

      const diff = Math.max(0, targetDate.getTime() - cameroonTime.getTime());
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
        className="relative h-screen flex flex-col bg-white overflow-hidden pt-16"
      >
        {/* Parallax Background Container */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Layer 1: Blue to White gradient — sits under the image as a pure background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: 'linear-gradient(to right, #0047AB 0%, #0047AB 15%, #0047AB 20%, rgba(0, 71, 171, 0.99) 24%, rgba(0, 71, 171, 0.97) 28%, rgba(0, 71, 171, 0.93) 33%, rgba(0, 71, 171, 0.86) 38%, rgba(0, 71, 171, 0.75) 44%, rgba(0, 71, 171, 0.6) 52%, rgba(0, 71, 171, 0.4) 62%, rgba(0, 71, 171, 0.2) 75%, white 95%, white 100%)'
            }}
          />

          {/* Layer 2: Sultan Image — mask synchronized with gradient so image fades in exactly where gradient fades out */}
          <motion.img
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={roiImage}
            alt=""
            className="absolute top-0 right-0 w-full h-full object-contain object-right z-10"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, transparent 15%, rgba(0,0,0,0.01) 20%, rgba(0,0,0,0.07) 28%, rgba(0,0,0,0.2) 38%, rgba(0,0,0,0.45) 48%, rgba(0,0,0,0.75) 62%, rgba(0,0,0,0.95) 78%, black 95%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 15%, rgba(0,0,0,0.01) 20%, rgba(0,0,0,0.07) 28%, rgba(0,0,0,0.2) 38%, rgba(0,0,0,0.45) 48%, rgba(0,0,0,0.75) 62%, rgba(0,0,0,0.95) 78%, black 95%)'
            }}
          />
        </motion.div>

        <div className="relative z-20 flex-grow flex flex-col pt-4 md:pt-8">
          {/* Countdown Timer - Top & Centered */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center mb-3 md:mb-6"
          >
            <p className="text-white/80 text-[7px] xs:text-[9px] md:text-xs uppercase tracking-[0.3em] mb-2 font-body font-bold text-shadow">
              {t('hero.next_edition')}
            </p>
            <div className="flex items-center gap-1.5 xs:gap-2 md:gap-4">
              <CountdownUnit value={timeLeft.days} label={t('hero.days')} />
              <span className="text-white text-lg xs:text-xl md:text-3xl font-black mb-4 md:mb-6">:</span>
              <CountdownUnit value={timeLeft.hours} label={t('hero.hours')} />
              <span className="text-white text-lg xs:text-xl md:text-3xl font-black mb-4 md:mb-6">:</span>
              <CountdownUnit value={timeLeft.minutes} label={t('hero.minutes')} />
              <span className="text-white text-lg xs:text-xl md:text-3xl font-black mb-4 md:mb-6">:</span>
              <CountdownUnit value={timeLeft.seconds} label={t('hero.seconds')} />
            </div>
          </motion.div>

          {/* Main Content Container - Text on Left */}
          <div className="container mx-auto px-4 w-full flex-grow flex items-center pb-14">
            <div className="grid lg:grid-cols-2 gap-12 w-full items-center">
              {/* Left Column Container */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex flex-col justify-center items-center w-full"
              >
                {/* Internally Centered Text Block - Sits on the left half of the screen */}
                <div className="flex flex-col items-center text-center w-full max-w-2xl">
                  {/* Title Section */}
                  <div className="mb-4 w-full flex flex-col items-center">
                    <motion.h1
                      className="font-display text-3xl xs:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.9] flex flex-col items-center"
                    >
                      <div className="flex items-center justify-center gap-x-3 whitespace-nowrap overflow-visible">
                        <span className="tracking-tighter">{t('hero.title_highlight')}</span>
                        <span className="text-secondary tracking-tighter">{t('hero.year')}</span>
                      </div>
                    </motion.h1>
                    <div className="mt-3 flex flex-col items-center space-y-2">
                      <div className="flex flex-col xs:flex-row items-center gap-2 xs:gap-3">
                        <div className="bg-white text-[#0047AB] px-2.5 py-0.5 font-black text-base xs:text-lg md:text-2xl rounded-sm">
                          {t('hero.edition')}
                        </div>
                        <div className="text-white font-black text-sm xs:text-base md:text-xl tracking-wide max-w-sm leading-tight text-center">
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
                    className="text-white font-bold text-xs md:text-base tracking-wide leading-relaxed mb-4 max-w-2xl border-y-2 md:border-y-0 md:border-l-4 border-secondary py-2 md:py-0 md:pl-4 text-center"
                  >
                    {t('hero.description')}
                  </motion.p>

                  {/* Date and Location Box */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 xs:gap-6 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 xs:p-4 rounded-xl flex flex-col items-center min-w-[140px] xs:min-w-[160px]">
                      <span className="text-white text-[9px] xs:text-[10px] tracking-widest uppercase mb-0.5">DU</span>
                      <div className="text-white text-3xl xs:text-4xl font-black">04</div>
                      <div className="text-secondary font-bold tracking-[0.15em] xs:tracking-[0.2em] text-[9px] xs:text-xs uppercase">AU 13 DÉCEMBRE</div>
                    </div>

                    <div className="text-white space-y-0.5 xs:space-y-1 text-center">
                      <div className="text-2xl xs:text-3xl md:text-4xl font-black tracking-widest uppercase">FOUMBAN</div>
                      <div className="text-secondary/80 text-[9px] xs:text-xs md:text-sm font-bold tracking-[0.15em] uppercase">
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

              {/* Right Side - Empty space for background Roi image */}
              <div className="hidden lg:block h-full min-h-[400px]" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20"
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

        {/* Theme Bar - Attached at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-black py-2.5 md:py-4 overflow-hidden">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <div className="bg-[#0072CE] text-white px-3 py-1 md:px-5 md:py-1.5 font-black text-base md:text-xl rounded-sm whitespace-nowrap">
              {t('hero.theme_label')}
            </div>
            <div className="text-white font-bold text-[10px] xs:text-xs sm:text-sm md:text-base tracking-wide text-center md:text-left leading-tight uppercase max-w-md md:max-w-none">
              {t('hero.theme_message')}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
