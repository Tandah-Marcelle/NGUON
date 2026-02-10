import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import ParticleBackground from "./ParticleBackground";
import MagneticButton from "./MagneticButton";
import LottieAnimation from "./LottieAnimation";
import fireworksAnimation from "@/assets/fireworks.json";
import { ChevronDown } from "lucide-react";

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
      </motion.div>

      {/* Particle Background */}
      <ParticleBackground />

      {/* Fireworks Lottie Animation - Celebration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute inset-0 z-[2] pointer-events-none"
      >
        <LottieAnimation
          animationData={fireworksAnimation}
          loop={true}
          style={{ width: "100%", height: "100%", opacity: 0.4 }}
        />
      </motion.div>

      {/* Animated overlay pattern */}
      <div className="absolute inset-0 z-[1] opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, hsl(46 92% 55% / 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(217 71% 28% / 0.3) 0%, transparent 50%)"
      }} />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full border-2 border-secondary/20"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-16 h-16 rounded-full border-2 border-gold/20"
        animate={{
          y: [0, 40, 0],
          rotate: [360, 180, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

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
              initial={{ opacity: 0, y: 30, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="block"
              style={{ transformStyle: "preserve-3d" }}
            >
              Le
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="block text-gold-gradient relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              NGUON
              <motion.span
                className="absolute inset-0 text-gold-gradient blur-xl opacity-50"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                NGUON
              </motion.span>
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

          <motion.div
            className="gold-line mb-10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
          />

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

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="mt-12"
          >
            <MagneticButton
              className="px-8 py-4 bg-secondary text-primary font-body font-semibold rounded-full text-lg shadow-lg hover:shadow-2xl transition-all duration-300"
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            >
              Découvrir le Nguon
            </MagneticButton>
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
              className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2 cursor-pointer"
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            >
              <motion.div className="w-1.5 h-1.5 bg-secondary rounded-full" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
              className="mt-2 flex justify-center"
            >
              <ChevronDown className="text-primary-foreground/50" size={20} />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
