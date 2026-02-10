import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

const TextReveal = ({ children, className = "", delay = 0 }: TextRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const words = children.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.05,
              ease: [0.33, 1, 0.68, 1],
            }}
          >
            {word}
            {index < words.length - 1 && "\u00A0"}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

export default TextReveal;
