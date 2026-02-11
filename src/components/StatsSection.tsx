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
    <span ref={ref} className="font-display text-4xl md:text-5xl font-bold text-primary">
      {count}{suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-primary/10 via-primary/5 to-background overflow-hidden">
      {/* Soft decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Chiffres Clés
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground font-body text-lg"
          >
            L'impact du Nguon en quelques chiffres
          </motion.p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.08}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border border-border/50 text-center transition-all hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="text-muted-foreground text-sm mt-3 font-body">{stat.label}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
