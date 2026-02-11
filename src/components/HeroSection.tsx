import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-display text-4xl md:text-6xl font-bold text-secondary"
    >
      {String(value).padStart(2, "0")}
    </motion.span>
    <span className="text-primary-foreground/70 text-xs md:text-sm uppercase tracking-widest mt-1 font-body">
      {label}
    </span>
  </div>
);

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Countdown to Dec 2026
  const targetDate = new Date("2026-12-01T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, targetDate - Date.now());
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
  }, [targetDate]);

  return (
    <section ref={ref} id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY, scale }}>
        <img src={heroBg} alt="Le Nguon" className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-70" />
      </motion.div>

      {/* Animated overlay pattern */}
      <div className="absolute inset-0 z-[1] opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, hsl(46 92% 55% / 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(217 71% 28% / 0.3) 0%, transparent 50%)"
      }} />

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="text-secondary text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-body font-medium"
          >
            Royaume Bamoun • Depuis 1394
          </motion.p>

          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-primary-foreground mb-6 leading-none">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="block"
            >
              Le
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="block text-gold-gradient"
            >
              NGUON
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="font-elegant text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 italic"
          >
            Rituels de gouvernance et expressions culturelles associés du Royaume Bamoun
          </motion.p>

          <div className="gold-line mb-10" />

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <p className="text-primary-foreground/60 text-sm uppercase tracking-widest mb-4 font-body">
              Prochaine édition
            </p>
            <div className="flex justify-center gap-6 md:gap-10">
              <CountdownUnit value={timeLeft.days} label="Jours" />
              <span className="text-secondary text-4xl md:text-6xl font-display self-start mt-0">:</span>
              <CountdownUnit value={timeLeft.hours} label="Heures" />
              <span className="text-secondary text-4xl md:text-6xl font-display self-start mt-0">:</span>
              <CountdownUnit value={timeLeft.minutes} label="Min" />
              <span className="text-secondary text-4xl md:text-6xl font-display self-start mt-0">:</span>
              <CountdownUnit value={timeLeft.seconds} label="Sec" />
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-secondary rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
