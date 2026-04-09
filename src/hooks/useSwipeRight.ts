import { useRef } from "react";

type UseSwipeRightOptions = {
  onSwipeRight: () => void;
  minDistance?: number;
  maxTime?: number;
  maxVerticalDistance?: number; // absolute vertical tolerance
  minHorizontalRatio?: number; // how much more horizontal than vertical
  enabled?: boolean;
};

export const useSwipeRight = ({
  onSwipeRight,
  minDistance = 80,
  maxTime = 500,
  maxVerticalDistance = 40,
  minHorizontalRatio = 1.5,
  enabled = true,
}: UseSwipeRightOptions) => {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (!enabled) return;

    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    startTime.current = Date.now();
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (
      !enabled ||
      startX.current === null ||
      startY.current === null ||
      startTime.current === null
    )
      return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;
    const deltaTime = Date.now() - startTime.current;

    // reset early
    startX.current = null;
    startY.current = null;
    startTime.current = null;

    // ignore taps
    if (deltaTime < 50) return;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    const isHorizontalEnough =
      absY <= maxVerticalDistance && absX / (absY || 1) >= minHorizontalRatio;

    const isSwipeRight =
      deltaX > minDistance && deltaTime < maxTime && isHorizontalEnough;

    if (isSwipeRight) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchEnd,
  };
};
