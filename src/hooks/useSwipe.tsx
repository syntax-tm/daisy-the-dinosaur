"use client";

import { useCallback, useEffect, useRef } from "react";

const MIN_SWIPE_DISTANCE = 50;

export interface SwipeInput {
  onSwipedUp?: () => void;
  onSwipedDown?: () => void;
  onSwipedLeft?: () => void;
  onSwipedRight?: () => void;
}

interface SwipeOutput {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
}

const useSwipe = (input: SwipeInput): SwipeOutput => {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX; // otherwise the swipe is fired even with usual touch events
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndY.current = e.targetTouches[0].clientY; // otherwise the swipe is fired even with usual touch events
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(() => {

    if (!touchStartX || !touchEndX) return;
    if (!touchStartY || !touchEndY) return;

    const distanceX = touchStartX.current - touchEndX.current;
    let isLeftSwipe = distanceX > MIN_SWIPE_DISTANCE;
    let isRightSwipe = distanceX < -MIN_SWIPE_DISTANCE;

    const distanceY = touchStartY.current - touchEndY.current;
    let isUpSwipe = distanceY > MIN_SWIPE_DISTANCE;
    let isDownSwipe = distanceY < -MIN_SWIPE_DISTANCE;

    const isLR = isLeftSwipe || isRightSwipe;
    const isUD = isUpSwipe || isDownSwipe;

    // if this is both left/right and top/bottom, use the one
    // with the greater distance
    if (isLR && isUD) {
      const isDistanceXLarger = distanceX > distanceY;
      if (isDistanceXLarger) {
        isUpSwipe = isDownSwipe = false;
      }
      else {
        isLeftSwipe = isRightSwipe = false;
      }
    }

    if (isUpSwipe && input.onSwipedUp) {
      input.onSwipedUp();
    }
    if (isDownSwipe && input.onSwipedDown) {
      input.onSwipedDown();
    }
    if (isLeftSwipe && input.onSwipedLeft) {
      input.onSwipedLeft();
    }
    if (isRightSwipe && input.onSwipedRight) {
      input.onSwipedRight();
    }
  }, [input]);

  useEffect(() => {
    document.body.addEventListener('touchstart', onTouchStart);
    document.body.addEventListener('touchend', onTouchEnd);
    document.body.addEventListener('touchmove', onTouchMove);
    return () => {
      document.body.removeEventListener('touchstart', onTouchStart);
      document.body.removeEventListener('touchend', onTouchEnd);
      document.body.removeEventListener('touchmove', onTouchMove);
    };
  }, [input, onTouchStart, onTouchEnd, onTouchMove]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

export { useSwipe as default };
