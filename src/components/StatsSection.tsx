import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Calendar, Users, Palette, Handshake, MapPin } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const stats = [
  { icon: Calendar, value: 10, suffix: "", label: "Jours de célébrations", color: "text-secondary" },
  { icon: Users, value: 500, suffix: "K+", label: "Participants et visiteurs", color: "text-secondary" },
  { icon: Palette, value: 300, suffix: "+", label: "Acteurs culturels", color: "text-secondary" },
  { icon: Handshake, value: 60, suffix: "+", label: "Partenaires", color: "text-secondary" },
  { icon: MapPin, value: 4, suffix: "", label: "Sites officiels", color: "text-secondary" },
];

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(value / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-5xl md:text-6xl font-bold text-secondary">
      {count}{suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="relative py-20 hero-gradient overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 bg-gold/10 rounded-full blur-2xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4"
          >
            Chiffres Clés
          </motion.h2>
          <motion.div
            className="gold-line"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.1} direction="scale" className="text-center">
              <motion.div
                whileHover={{ scale: 1.1, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center relative group"
              >
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-secondary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1.5 }}
                />

                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10"
                >
                  <stat.icon className="w-8 h-8 text-secondary/70 mb-3 group-hover:text-secondary transition-colors duration-300" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative z-10"
                >
                  <Counter value={stat.value} suffix={stat.suffix} />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                  className="text-primary-foreground/70 text-sm mt-2 font-body group-hover:text-primary-foreground transition-colors duration-300"
                >
                  {stat.label}
                </motion.p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
