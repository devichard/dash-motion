"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
import { type ComponentPropsWithoutRef, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  variant?: "default" | "currency" | "percent";
  showSign?: boolean;
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  variant = "default",
  showSign = false,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : startValue);
  const springValue = useSpring(motionValue, {
    damping: 40,
    stiffness: 40,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [motionValue, isInView, delay, value, direction, startValue]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          const numberValue = Number(latest.toFixed(decimalPlaces));

          let formattedValue: string;

          switch (variant) {
            case "currency":
              formattedValue = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
              }).format(numberValue);
              break;

            case "percent":
              formattedValue = new Intl.NumberFormat("pt-BR", {
                style: "percent",
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
              }).format(numberValue / 100);
              break;

            default:
              formattedValue = String(Math.floor(numberValue));
          }

          // Add sign prefix if requested or auto-detect
          if (showSign && numberValue > 0) {
            formattedValue = `+${formattedValue}`;
          }
          // Negative values already have the minus sign from Intl.NumberFormat

          ref.current.textContent = formattedValue;
        }
      }),
    [springValue, decimalPlaces, variant, showSign],
  );

  return (
    <span ref={ref} className={cn("inline-block tracking-wider tabular-nums", className)} {...props}>
      {startValue}
    </span>
  );
}
