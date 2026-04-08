import { useRef } from "react";

type UseSwipeRightOptions = {
  onSwipeRight: () => void;
  minDistance?: number;
  maxTime?: number;
  enabled?: boolean;
};

export const useSwipeRight = ({
  onSwipeRight,
  minDistance = 80,
  maxTime = 500,
  enabled = true,
}: UseSwipeRightOptions) => {
  const startX = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (!enabled) return;

    startX.current = e.touches[0].clientX;
    startTime.current = Date.now();
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!enabled || startX.current === null || startTime.current === null)
      return;

    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX.current;
    const deltaTime = Date.now() - startTime.current;

    // ignore taps
    if (deltaTime < 50) return;

    // reset
    startX.current = null;
    startTime.current = null;

    const isSwipeRight = deltaX > minDistance && deltaTime < maxTime;

    if (isSwipeRight) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchEnd,
  };
};
