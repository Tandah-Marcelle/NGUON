import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  title: ReactNode;
  lead?: ReactNode;
  /** split: title left, lead right on desktop. left/center: stacked. */
  align?: "split" | "left" | "center";
  tone?: "dark" | "light";
  action?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function SectionHeading({ title, lead, align = "split", tone = "dark", action, className, as = "h2" }: Props) {
  const H = as === "h1" ? motion.h1 : motion.h2;
  const light = tone === "light";
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-10 md:mb-14",
        align === "split" && "md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end md:gap-12",
        centered && "text-center",
        className,
      )}
    >
      <div>
        <H
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease }}
          className={cn(
            "font-display text-3xl md:text-4xl lg:text-5xl font-black leading-[1.08] tracking-tight text-balance",
            light ? "text-white" : "text-foreground",
          )}
        >
          {title}
        </H>
        <div className={cn("mt-5 h-1 w-14 rounded-full bg-secondary", centered && "mx-auto")} />
      </div>
      {(lead || action) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.08, ease }}
          className={cn("mt-5 md:mt-0", align !== "split" && "md:mt-5", centered && "mx-auto max-w-2xl")}
        >
          {lead && (
            <p className={cn("font-body text-base md:text-lg leading-relaxed max-w-[60ch]", light ? "text-white/75" : "text-muted-foreground", centered && "mx-auto")}>
              {lead}
            </p>
          )}
          {action && <div className={cn("mt-5", centered && "flex justify-center")}>{action}</div>}
        </motion.div>
      )}
    </div>
  );
}
