import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { NdopTexture, WovenBand, GOLD } from "./Motif";

type Props = {
  image: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  to: string;
  cta: string;
  /** Which side the text sits on; the photo shows through on the other. */
  side?: "left" | "right";
};

export default function HeritageBanner({ image, icon: Icon, title, desc, to, cta, side = "left" }: Props) {
  const right = side === "right";
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <WovenBand color={GOLD} opacity={0.85} />
      <div className="relative">
        <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className={`absolute inset-0 ${
            right
              ? "bg-navy/70 md:bg-transparent md:bg-gradient-to-l md:from-navy md:via-navy/80 md:to-navy/20"
              : "bg-navy/70 md:bg-transparent md:bg-gradient-to-r md:from-navy md:via-navy/80 md:to-navy/20"
          }`}
        />
        <NdopTexture opacity={0.07} fade={right ? "right" : "left"} />

        <div className="container relative mx-auto px-4 md:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`max-w-xl ${right ? "md:ml-auto md:text-right" : ""}`}
          >
            <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-secondary/40 bg-navy/60 backdrop-blur-sm ${right ? "md:ml-auto" : ""}`}>
              <Icon className="h-6 w-6 text-secondary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black leading-[1.08] tracking-tight text-balance">{title}</h2>
            <p className="mt-4 font-body text-base md:text-lg leading-relaxed text-white/80">{desc}</p>
            <Link
              to={to}
              className="mt-8 inline-flex items-center gap-2.5 rounded-2xl bg-secondary px-7 py-4 font-display text-sm font-black text-navy shadow-[0_14px_30px_-12px_rgba(255,204,0,0.55)] transition hover:bg-secondary/90 active:scale-[0.98] group"
            >
              {cta}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
      <WovenBand color={GOLD} opacity={0.85} className="rotate-180" />
    </section>
  );
}
