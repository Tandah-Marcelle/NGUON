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
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[90px] text-center border border-white/20">
      <motion.span
        key={value}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="font-display text-4xl md:text-6xl font-black text-white block"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
    </div>
    <span className="text-white text-[10px] md:text-xs uppercase tracking-[0.2em] mt-2 font-body font-bold text-shadow-sm">
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
      {/* Fireworks in Corners - Moved slightly inward and ensured visibility to prevent clipping */}
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
        id="accueil"
        className="relative min-h-[110vh] flex flex-col justify-start items-center overflow-hidden dark pt-12 md:pt-20"
      >

        {/* Background - Simplified with ultra-smooth multi-stop gradient blend */}
        <motion.div
          style={{ y: bgY, willChange: "transform" }}
          className="absolute inset-0 z-0 bg-[#0047AB]"
        >
          <div className="absolute inset-0">
            <img
              src={roiImage}
              alt=""
              className="absolute top-0 right-0 w-full md:w-[80%] lg:w-[70%] h-full object-contain object-right opacity-80"
              style={{
                maskImage: 'linear-gradient(to right, transparent 10%, black 60%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 10%, black 60%)'
              }}
            />
            {/* Ultra-smooth overlay - Uses raw CSS for perfect color interpolation */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, #0047AB 0%, #0047AB 40%, rgba(0, 71, 171, 0) 90%)'
              }}
            />
          </div>

          {/* Subtle white-ish gradient at bottom to blend with next section */}
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </motion.div>

        {/* Countdown Timer - Top & Centered */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 flex flex-col items-center mb-8 md:mb-16"
        >
          <p className="text-white/80 text-[10px] md:text-sm uppercase tracking-[0.4em] mb-4 font-body font-bold text-shadow">
            {t('hero.next_edition')}
          </p>
          <div className="flex items-center gap-3 md:gap-6">
            <CountdownUnit value={timeLeft.days} label={t('hero.days')} />
            <span className="text-white text-2xl md:text-4xl font-black mb-6 md:mb-8">:</span>
            <CountdownUnit value={timeLeft.hours} label={t('hero.hours')} />
            <span className="text-white text-2xl md:text-4xl font-black mb-6 md:mb-8">:</span>
            <CountdownUnit value={timeLeft.minutes} label={t('hero.minutes')} />
            <span className="text-white text-2xl md:text-4xl font-black mb-6 md:mb-8">:</span>
            <CountdownUnit value={timeLeft.seconds} label={t('hero.seconds')} />
          </div>
        </motion.div>

        {/* Main Content Container - Text on Left */}
        <div className="container mx-auto px-4 relative z-10 w-full flex-grow flex items-center pb-20">
          <div className="grid lg:grid-cols-2 gap-12 w-full items-center">
            {/* Left Side: All Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex flex-col justify-center text-left"
            >
              {/* Title Section */}
              <div className="mb-8">
                <motion.h1
                  className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-[0.9] flex flex-col"
                >
                  <div className="flex items-center gap-4">
                    <span className="tracking-tighter">{t('hero.title_highlight')}</span>
                    <span className="text-secondary tracking-tighter">{t('hero.year')}</span>
                  </div>
                </motion.h1>
                <div className="mt-6 flex flex-col space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="bg-white text-[#0047AB] px-3 py-1 font-black text-xl md:text-3xl rounded-sm">
                      {t('hero.edition')}
                    </div>
                    <div className="text-white font-black text-lg md:text-2xl tracking-wide max-w-sm leading-tight">
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
                className="text-white font-bold text-sm md:text-xl tracking-wider leading-relaxed mb-10 max-w-2xl border-l-4 border-secondary pl-6"
              >
                {t('hero.description')}
              </motion.p>

              {/* Date and Location Right Box Detail */}
              <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl flex flex-col items-center min-w-[200px]">
                  <span className="text-white text-xs tracking-widest uppercase mb-1">DU</span>
                  <div className="text-white text-5xl font-black">04</div>
                  <div className="text-secondary font-bold tracking-[0.3em] text-sm uppercase">AU 13 DÉCEMBRE</div>
                </div>

                <div className="text-white space-y-2">
                  <div className="text-4xl md:text-5xl font-black tracking-widest uppercase">FOUMBAN</div>
                  <div className="text-secondary/80 text-sm md:text-base font-bold tracking-[0.2em] uppercase">
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
                  className="w-fit px-10 py-5 bg-white text-[#0047AB] font-black rounded-lg text-lg shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-[#0047AB] transition-all duration-300 uppercase tracking-widest"
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {t('hero.cta')}
                </MagneticButton>
              </motion.div>
            </motion.div>

            {/* Right Side - Empty space for background Roi image */}
            <div className="hidden lg:block h-full min-h-[400px]" />
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
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
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-black py-4 md:py-6 overflow-hidden">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="bg-[#0072CE] text-white px-6 py-2 font-black text-xl md:text-2xl rounded-sm whitespace-nowrap">
              {t('hero.theme_label')}
            </div>
            <div className="text-white font-bold text-base md:text-xl tracking-wide text-center md:text-left leading-tight uppercase">
              {t('hero.theme_message')}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
