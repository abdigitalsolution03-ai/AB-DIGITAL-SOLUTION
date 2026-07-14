import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface TextAnimationProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  delay?: number;
  once?: boolean;
}

export default function TextAnimation({
  text,
  className = "",
  as: Tag = "h2",
  delay = 0,
  once = true}: TextAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const letters = text.split("");

  return (
    <motion.div
      ref={ref}
      className={`inline-flex flex-wrap ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="relative inline-block"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                delay: delay + index * 0.03,
                ease: [0.25, 0.46, 0.45, 0.94]}}}}
        >
          <Tag className="inline">
            <motion.span
              className="inline-block"
              animate={
                isHovered
                  ? {
                      color: "#FFD400",
                      y: -8,
                      textShadow: "0 0 20px rgba(255, 212, 0, 0.3)"}
                  : {
                      color: "#111111",
                      y: 0,
                      textShadow: "0 0 0px rgba(255, 212, 0, 0)"}
              }
              transition={{
                duration: 0.5,
                delay: index * 0.02,
                ease: [0.25, 0.46, 0.45, 0.94]}}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          </Tag>
        </motion.span>
      ))}
      {isHovered && (
        <motion.span
          className="absolute bottom-0 left-0 h-[3px] bg-[#FFD400]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
}
