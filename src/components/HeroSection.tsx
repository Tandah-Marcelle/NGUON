import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import cultureCeremony from "@/assets/culture-ceremony.jpg";
import majesty from "@/assets/majesty.jpg";
import ParticleBackground from "./ParticleBackground";
import MagneticButton from "./MagneticButton";
import LottieAnimation from "./LottieAnimation";
import aiFlowAnimation from "@/assets/ai animation Flow 1.json";
import fireworksAnimation from "@/assets/fireworks.json";
import { ChevronDown } from "lucide-react";

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
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Countdown to next Saturday at 2pm
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const getNextSaturday2pm = () => {
      const now = new Date();
      const nextSat = new Date(now);
      const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
      nextSat.setDate(now.getDate() + daysUntilSaturday);
      nextSat.setHours(14, 0, 0, 0);
      if (nextSat <= now) {
        nextSat.setDate(nextSat.getDate() + 7);
      }
      return nextSat.getTime();
    };

    const tick = () => {
      const diff = Math.max(0, getNextSaturday2pm() - Date.now());
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
        style={{ y: bgY, scale }}
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
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">

          {/* Left Side - Image with Lottie */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex items-center justify-center"
          >
            {/* Circular Image Container */}
            <div className="relative w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
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

              {/* Lottie Animation Overlay */}
              <motion.div
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="absolute inset-0 pointer-events-none"
              >
                <LottieAnimation
                  animationData={aiFlowAnimation}
                  loop={true}
                  style={{ width: "100%", height: "100%" }}
                />
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
            className="text-center lg:text-left relative"
          >
            {/* Fireworks Lottie Animation Behind Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ duration: 1.5, delay: 1 }}
              className="absolute inset-0 -inset-x-20 pointer-events-none z-0"
            >
              <LottieAnimation
                animationData={fireworksAnimation}
                loop={true}
                style={{ width: "100%", height: "100%" }}
              />
            </motion.div>

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
                Royaume Bamoun • Depuis 1394
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
              >
                Le <span className="text-secondary">NGUON</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="text-lg md:text-xl text-white/90 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
              >
                Rituels de gouvernance et expressions culturelles associés du Royaume Bamoun
              </motion.p>

              {/* Countdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="mb-10"
              >
                <p className="text-white/70 text-sm uppercase tracking-widest mb-4 font-body">
                  Prochaine édition
                </p>
                <div className="flex justify-center lg:justify-start gap-4 md:gap-6">
                  <CountdownUnit value={timeLeft.days} label="Jours" />
                  <span className="text-secondary text-3xl md:text-5xl font-display self-start mt-0">:</span>
                  <CountdownUnit value={timeLeft.hours} label="Heures" />
                  <span className="text-secondary text-3xl md:text-5xl font-display self-start mt-0">:</span>
                  <CountdownUnit value={timeLeft.minutes} label="Min" />
                  <span className="text-secondary text-3xl md:text-5xl font-display self-start mt-0">:</span>
                  <CountdownUnit value={timeLeft.seconds} label="Sec" />
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
              >
                <MagneticButton
                  className="px-8 py-4 bg-secondary text-primary font-body font-semibold rounded-full text-lg shadow-lg hover:shadow-2xl hover:bg-blue-600 hover:text-white transition-all duration-300"
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Découvrir le Nguon
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
