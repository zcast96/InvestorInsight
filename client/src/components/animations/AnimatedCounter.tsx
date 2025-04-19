import { animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export function AnimatedCounter({
  from,
  to,
  duration = 1,
  formatValue = (value) => value.toFixed(0),
  className = "",
}: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(from, to, {
      duration,
      onUpdate(value) {
        node.textContent = formatValue(value);
      },
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [from, to, duration, formatValue]);

  return <span ref={nodeRef} className={className}>{formatValue(from)}</span>;
}