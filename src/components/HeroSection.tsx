import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
const cultureCeremony = "/img/culture-ceremony.jpg";
import majesty from "@/assets/majesty.jpg";
import ParticleBackground from "./ParticleBackground";
import MagneticButton from "./MagneticButton";
import LottieAnimation from "./LottieAnimation";

import fireworksAnimation from "@/assets/fireworks.json";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-display text-3xl md:text-5xl font-bold text-secondary"
    >
      {String(value).padStart(2, "0")}
    </motion.span>
    <span className="text-white/70 text-xs md:text-sm uppercase tracking-widest mt-1 font-body">
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

  // Countdown to next Saturday at 2pm
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      // Get current time in Cameroon (UTC+1)
      const now = new Date();
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const cameroonTime = new Date(utcTime + (3600000)); // UTC+1
      
      // Find next Saturday at 2pm Cameroon time
      let targetDate = new Date(cameroonTime);
      const currentDay = targetDate.getDay();
      const currentHour = targetDate.getHours();
      
      // If today is Saturday (6) and before 2pm, target is today at 2pm
      if (currentDay === 6 && currentHour < 14) {
        targetDate.setHours(14, 0, 0, 0);
      } else {
        // Otherwise find next Saturday
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
    <section
      ref={ref}
      id="accueil"
      className="relative min-h-screen flex items-center justify-center overflow-hidden dark"
    >
      {/* Primary Background Image with Parallax & Ken Burns effect */}
      <motion.div
        style={{ y: bgY, scale, willChange: "transform" }}
        className="absolute inset-0 z-0"
      >
        <img
          src={cultureCeremony}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Sophisticated overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-primary/90" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
      </motion.div>

      {/* Particle Background */}
      <ParticleBackground />

      {/* Animated overlay pattern */}
      <div className="absolute inset-0 z-[1] opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, hsl(48 100% 50% / 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(201 100% 45% / 0.2) 0%, transparent 50%)"
      }} />

      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-20">

          {/* Left Side - Image with Lottie */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex items-center justify-center order-2 lg:order-1"
          >
            {/* Circular Image Container */}
            <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
              {/* Background Image in Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute inset-0 rounded-full overflow-hidden border-4 border-secondary/30 shadow-2xl"
              >
                <img
                  src={majesty}
                  alt="Sultan Bamoun"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              </motion.div>

              {/* Decorative Ring */}
              <motion.div
                className="absolute -inset-4 rounded-full border-2 border-secondary/20"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          </motion.div>

          {/* Right Side - Text and Countdown */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center lg:text-left relative order-1 lg:order-2"
          >
            {/* Floating Text Container */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-secondary text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-body font-semibold"
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight group cursor-default"
              >
                {t('hero.title_prefix')} <span className="text-primary group-hover:text-secondary transition-colors duration-500">{t('hero.title_highlight')}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed px-4 lg:px-0"
              >
                {t('hero.description')}
              </motion.p>

              {/* Countdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="mb-8 sm:mb-10"
              >
                <p className="text-white/70 text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 font-body">
                  {t('hero.next_edition')}
                </p>
                <div className="flex justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4 lg:gap-6 flex-wrap">
                  <CountdownUnit value={timeLeft.days} label={t('hero.days')} />
                  <span className="text-secondary text-2xl sm:text-3xl md:text-5xl font-display self-start mt-0">:</span>
                  <CountdownUnit value={timeLeft.hours} label={t('hero.hours')} />
                  <span className="text-secondary text-2xl sm:text-3xl md:text-5xl font-display self-start mt-0">:</span>
                  <CountdownUnit value={timeLeft.minutes} label={t('hero.minutes')} />
                  <span className="text-secondary text-2xl sm:text-3xl md:text-5xl font-display self-start mt-0">:</span>
                  <CountdownUnit value={timeLeft.seconds} label={t('hero.seconds')} />
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
              >
                <MagneticButton
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-body font-semibold rounded-full text-base sm:text-lg shadow-lg hover:shadow-2xl hover:bg-secondary hover:text-primary transition-all duration-300"
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {t('hero.cta')}
                </MagneticButton>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2 cursor-pointer"
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        >
          <motion.div className="w-1.5 h-1.5 bg-secondary rounded-full" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
          className="mt-2 flex justify-center"
        >
          <ChevronDown className="text-white/50" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
