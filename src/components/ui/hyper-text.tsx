"use client";

import { AnimatePresence, type MotionProps, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type CharacterSet = string[] | readonly string[];

interface HyperTextProps extends MotionProps {
  /** The text content to be animated */
  children: string;
  /** Optional className for styling */
  className?: string;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Component to render as - defaults to div */
  as?: React.ElementType;
  /** Custom character set for scramble effect. Defaults to uppercase alphabet */
  characterSet?: CharacterSet;
}

const DEFAULT_CHARACTER_SET = Object.freeze("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")) as readonly string[];

const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

export function HyperText({
  children,
  className,
  delay = 0,
  as: Component = "div",
  characterSet = DEFAULT_CHARACTER_SET,
  ...props
}: HyperTextProps) {
  const MotionComponent = motion.create(Component, {
    forwardMotionProps: true,
  });

  const [displayText, setDisplayText] = useState<Array<{ char: string; id: string }>>(() =>
    children.split("").map((char, idx) => ({ char, id: `${idx}-${char}` })),
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const iterationCount = useRef(0);
  const elementRef = useRef<HTMLElement>(null);
  const isInView = useInView(elementRef, { once: true, margin: "0px" });

  // Handle animation start based on view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay]);

  // Handle scramble animation with spring-like timing (matching NumberTicker damping: 60, stiffness: 100)
  useEffect(() => {
    if (!isAnimating) return;

    const maxIterations = children.length;
    const startTime = performance.now();
    // Duration calculated to match spring physics (damping: 60, stiffness: 100)
    const duration = 1000;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      iterationCount.current = progress * maxIterations;

      setDisplayText((currentText) =>
        currentText.map((item, index) =>
          item.char === " "
            ? item
            : {
                ...item,
                char:
                  index <= iterationCount.current ? children[index] : characterSet[getRandomInt(characterSet.length)],
              },
        ),
      );

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [children, isAnimating, characterSet]);

  return (
    <MotionComponent ref={elementRef} className={cn("overflow-hidden py-2 text-3xl", className)} {...props}>
      <AnimatePresence mode="popLayout">
        {displayText.map((item) => (
          <motion.span key={item.id} className={cn("font-mono", item.char === " " ? "w-3" : "")}>
            {item.char.toUpperCase()}
          </motion.span>
        ))}
      </AnimatePresence>
    </MotionComponent>
  );
}
