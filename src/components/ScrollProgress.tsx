import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-gold to-secondary origin-left z-[100]"
        style={{ scaleX }}
      />
      <motion.div
        className="fixed top-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent origin-left z-[100] blur-sm"
        style={{ scaleX }}
      />
    </>
  );
};

export default ScrollProgress;
