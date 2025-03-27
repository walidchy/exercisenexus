
import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedLayoutProps {
  className?: string;
  children: React.ReactNode;
  animationType?: "fade" | "slide" | "scale" | "none";
  duration?: number;
  delay?: number;
}

const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
};

export function AnimatedLayout({
  className,
  children,
  animationType = "fade",
  duration = 0.3,
  delay = 0,
}: AnimatedLayoutProps) {
  const firstRender = useRef(true);
  
  useEffect(() => {
    firstRender.current = false;
  }, []);
  
  const animation = animations[animationType];
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${animationType}-layout`}
        initial={firstRender.current ? {} : animation.initial}
        animate={animation.animate}
        exit={animation.exit}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for natural motion
        }}
        className={cn("w-full h-full", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default AnimatedLayout;
