"use client";

import { useEffect, useEffectEvent, useRef } from "react";

export interface WheelInput {
  onWheelUp?: () => void;
  onWheelDown?: () => void;
  onWheelLeft?: () => void;
  onWheelRight?: () => void;
}

export const useWheel = ({ onWheelUp, onWheelDown, onWheelLeft, onWheelRight }: WheelInput) => {

  const shift = useRef(false);

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key !== 'Shift') return;
    e.preventDefault();
    shift.current = true;
  });

  const onKeyUp = useEffectEvent((e: KeyboardEvent) => {
    if (e.key !== 'Shift') return;
    e.preventDefault();
    shift.current = false;
  });

  const handleWheelAction = useEffectEvent((deltaY: number) => {
    const down = deltaY > 0;
    if (down) {
      if (shift.current) {
        console.log(`wheelright: ${onWheelLeft?.name}()`);
        onWheelRight?.();
        return;
      }
      console.log(`wheeldown: ${onWheelLeft?.name}()`);
      onWheelDown?.();
      return;
    }
    if (shift.current) {
      console.log(`wheelleft: ${onWheelLeft?.name}()`);
      onWheelLeft?.();
      return;
    }
    console.log(`wheelup: ${onWheelLeft?.name}()`);
    onWheelUp?.();
  });

  useEffect(() => {

    const onWheel = (e: WheelEvent) => {
      // call the stable event abstraction
      handleWheelAction(e.deltaY);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);
};

export { useWheel as default };
