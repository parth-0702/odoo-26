import { useState, useEffect } from "react";

export function useCountUp(endValue: number, duration: number = 800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      // Ease out cubic
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      
      const percentage = Math.min(progress / duration, 1);
      const currentVal = Math.floor(easeOut(percentage) * endValue);
      
      setValue(currentVal);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setValue(endValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [endValue, duration]);

  return value;
}
