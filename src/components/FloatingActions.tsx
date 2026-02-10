import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
      {/* Chat/Contact Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-full bg-secondary text-primary shadow-lg hover:shadow-2xl flex items-center justify-center group relative overflow-hidden"
        onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
      >
        <motion.div
          className="absolute inset-0 bg-gold"
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        <MessageCircle className="relative z-10" size={24} />
        
        {/* Pulse effect */}
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-secondary"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.button>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="w-14 h-14 rounded-full bg-primary text-secondary shadow-lg hover:shadow-2xl flex items-center justify-center relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-royal-blue-light"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <ArrowUp size={24} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActions;
