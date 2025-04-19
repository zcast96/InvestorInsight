import { useEffect, useState } from 'react';

/**
 * A hook that smoothly animates between value changes
 * @param targetValue - The current target value
 * @param duration - Animation duration in ms
 * @returns The animated value
 */
export function useAnimatedValue(targetValue: number, duration = 1000) {
  const [animatedValue, setAnimatedValue] = useState(targetValue);
  const [previousValue, setPreviousValue] = useState(targetValue);

  useEffect(() => {
    // If the target value has changed
    if (targetValue !== previousValue) {
      setPreviousValue(targetValue);
      
      // Start animation
      let startTime: number | null = null;
      const startValue = animatedValue;
      
      const animateFrame = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Ease out cubic formula
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (targetValue - startValue) * easedProgress;
        
        setAnimatedValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animateFrame);
        }
      };
      
      requestAnimationFrame(animateFrame);
    }
  }, [targetValue, duration, previousValue, animatedValue]);

  return animatedValue;
}