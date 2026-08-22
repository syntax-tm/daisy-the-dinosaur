// import { CSSProperties, ReactElement, ReactNode } from "react";

// export interface ReactFlipBookProps {
//   // Required
//   width: number;
//   height: number;
//   children: ReactNode;
  
//   // PageFlip Core
//   size?: 'fixed' | 'stretch';
//   minWidth?: number;
//   maxWidth?: number;
//   minHeight?: number;
//   maxHeight?: number;
//   startPage?: number;
//   flippingTime?: number;
//   usePortrait?: boolean;
//   startZIndex?: number;
//   autoSize?: boolean;
//   showCover?: boolean;
//   drawShadow?: boolean;
//   maxShadowOpacity?: number;
//   mobileScrollSupport?: boolean;
//   clickEventForward?: boolean;
//   useMouseEvents?: boolean;
//   swipeDistance?: number;
//   showPageCorners?: boolean;
//   disableFlipByClick?: boolean;
  
//   // React Extensions
//   className?: string;
//   style?: CSSProperties;
//   currentPage?: number;
//   showNavigationButtons?: boolean;
//   showPageNumbers?: boolean;
//   enableKeyboardNav?: boolean;
//   autoFlipDelay?: number;
//   autoFlipDirection?: 'next' | 'prev';
//   renderOnlyPageLengthChange?: boolean;
  
//   // Custom Renderers
//   renderPage?: (page: ReactElement, index: number) => ReactElement;
//   renderNavigationButton?: (type: 'prev' | 'next', onClick: () => void) => ReactNode;
//   renderPageNumber?: (current: number, total: number) => ReactNode;
  
//   // Events
//   onPageChange?: (page: number) => void;
//   onFlip?: (e: FlipEvent) => void;
//   onChangeOrientation?: (e: OrientationEvent) => void;
//   onChangeState?: (e: StateEvent) => void;
//   onInit?: (e: InitEvent) => void;
//   onUpdate?: (e: UpdateEvent) => void;
// }

// export interface ReactFlipBookRef {
//   pageFlip: () => PageFlip | undefined;
//   flipNext: () => void;
//   flipPrev: () => void;
//   flip: (page: number) => void;
//   getCurrentPageIndex: () => number | undefined;
//   getPageCount: () => number | undefined;
//   destroy: () => void;
//   startAutoFlip: (delay: number, direction: 'next' | 'prev') => void;
//   stopAutoFlip: () => void;
// }