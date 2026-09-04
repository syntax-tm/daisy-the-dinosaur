'use client';

import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import BookImage from "../book-image/book-image";
import { IBookPage } from '@/types';

export interface PageFlipProps {
  currentPage: IBookPage;
  adjacentPage?: IBookPage;
  direction: number;
  className?: string;
  showUnderlay?: boolean;
  onFlipComplete?: () => void;
}

export function PageFlip({
  currentPage,
  adjacentPage,
  direction,
  className = "",
  showUnderlay = true,
  onFlipComplete,
}: PageFlipProps) {
  const forward = direction > 0;

  return (
    <div
      className={className || "relative w-full aspect-2/3 max-w-md"}
      style={{
        perspective: "3000px",
      }}
    >
      {/* Page underneath */}
      {showUnderlay && (
        <div
          className="absolute inset-0 overflow-hidden shadow-2xl"
          style={{
            zIndex: 1,
            background: "white",
          }}
        >
          {(forward ? adjacentPage : currentPage)?.src && (
            <BookImage
              src={(forward ? adjacentPage : currentPage)!.src!}
              alt=""
            />
          )}
        </div>
      )}

      {/* Physical page */}
      <motion.div
        key={`${currentPage.index}-${direction}`}
        initial={{
          rotateY: 0,
        }}
        animate={{
          rotateY: forward ? -180 : 180,
        }}
        transition={{
          duration: 1.5,
          ease: [0.22, 0.61, 0.36, 1],
        }}
        onAnimationComplete={onFlipComplete}
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",

          /*
           * Forward:
           *   page hinges on LEFT side
           *
           * Backward:
           *   page hinges on RIGHT side
           */
          transformOrigin: forward
            ? "left center"
            : "right center",

          zIndex: 2,
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 overflow-hidden shadow-2xl"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: "white",
          }}
        >
          {currentPage.src && (
            <BookImage
              src={currentPage.src}
              alt=""
            />
          )}
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 overflow-hidden shadow-2xl"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: "white",
          }}
        >
          {adjacentPage?.src && (
            <BookImage
              src={adjacentPage.src}
              alt=""
            />
          )}
        </div>

        {/* Spine shadow */}
        <motion.div
          className="absolute top-0 bottom-0 w-8 pointer-events-none"
          animate={{
            opacity: [0.15, 0.45, 0.15],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
          style={{
            [forward ? "left" : "right"]: 0,

            background: forward
              ? "linear-gradient(to right, rgba(0,0,0,0.35), transparent)"
              : "linear-gradient(to left, rgba(0,0,0,0.35), transparent)",
            zIndex: 5,
          }}
        />
      </motion.div>
    </div>
  );
}

export { PageFlip as default };
