import { ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";

type Direction = "up" | "left" | "right" | "none";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

const variants = {
  hidden: (direction: Direction, distance: number) => ({
    opacity: 0,
    y: direction === "up" ? distance : direction === "none" ? 0 : 0,
    x: direction === "left" ? distance : direction === "right" ? -distance : 0}),
  visible: {
    opacity: 1,
    y: 0,
    x: 0}};

export default function AnimatedSection({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 60,
  once = true}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={direction}
      variants={{
        hidden: variants.hidden(direction, distance),
        visible: {
          ...variants.visible,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94]}}}}
      className={className}
    >
      {children}
    </motion.div>
  );
}
