'use client';

import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { Pagination, Card, CardHeader, Avatar, Paper, Container, IconButton } from '@mui/material';
import { useOrientation } from '@uidotdev/usehooks';
import { chunkArray } from '@/types/array';
import { Page } from '../page/page';
import { ArrowLeft, ArrowRight, QuestionAnswerSharp } from '@mui/icons-material';
import { formatString, Book, IBookPage } from 'types';
import BookImage from '../book-image/book-image';
import { daisysDayAway } from '@/config/daisys-day-away';
import { useSwipe, useKeyboard, useWheel, KeyPressAction } from '@hooks/index';
import './book.css';

const bookTitle = "Daisy the Dino's Day Away";

export const PageView = (page: IBookPage, position?: 'left' | 'right') => {
  return page.src && page.src !== '' && (
    <div key={page.index} className={`page h-full w-full aspect-2/3 object-cover`}>
      {page.src && <BookImage src={page.src} alt='' />}
    </div>
  )
}

const pageVariants = {
  enter: (direction: number) => ({
    rotateY: direction > 0 ? 0 : -180,
    // When moving backward, the entering page must immediately sit beneath the exiting page
    zIndex: direction > 0 ? 1 : 1,
  }),
  center: {
    rotateY: 0,
    zIndex: 2, // The active page rests safely on top
  },
  exit: (direction: number) => ({
    rotateY: direction > 0 ? -180 : 0,
    // The exiting element maintains top visual priority so it remains visible through the full 180° swing
    zIndex: direction > 0 ? 0 : 10,
  }),
};

const singlePageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "20%" : "-20%",  // Slides in from the direction you are travelling
    rotateY: direction > 0 ? 90 : -90,   // Angled slightly into the 3D space
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    rotateY: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-20%" : "20%",  // Slides out ahead of the navigation path
    rotateY: direction > 0 ? -90 : 90,   // Flips away into the distance
    opacity: 0,
    scale: 0.95,
  }),
};

export type SplitBookPage = [left: IBookPage | null, right: IBookPage | null];

export interface PageViewBase<T> {
  index: number;
  pageNumber: number;
  [index: number]: T;
}

export interface SinglePageViewProps extends PageViewBase<IBookPage | null> {
  index: number;
  pageNumber: number;
  page: IBookPage | null;
  prevPage: IBookPage | undefined;
  nextPage: IBookPage | undefined;
  [index: number]: IBookPage | null;
}

export interface SplitPageViewProps extends PageViewBase<SplitBookPage> {
  index: number;
  pageNumber: number;
  page: SplitBookPage;
  prevPage: SplitPageViewProps | undefined;
  nextPage: SplitPageViewProps | undefined;
  [index: number]: SplitBookPage;
}

export function buildBook(pages: IBookPage[], pagesPerView: number = 2) {
  // re-index the pages
  pages.forEach((p, i) => {
    pages[i] = { ...p, index: i };
  });

  if (pagesPerView === 1) {

    const singlePages: SinglePageViewProps[] = [];

    let prevPage;
    let nextPage;
    let page;

    for (let i = 0; i < pages.length - 1; i++) {
      prevPage = i - 1 >= 0 ? pages[i - 1] : undefined;
      nextPage = i + 1 <= pages.length - 1 ? pages[i + 1] : undefined;
      page = pages[i];

      singlePages.push({
        index: i,
        nextPage,
        prevPage,
        page,
        pageNumber: i + 1,
      })
    }

    return singlePages;
  }

  const coverPage = pages[0];
  const backPage = pages.slice(-1)[0];
  const inside = pages.slice(1, -1);

  const insidePages: SplitBookPage[] = chunkArray(inside, pagesPerView).map(p => {
    return [p.at(0) ?? null, p.at(1) ?? null]
  });

  const splitPages: SplitBookPage[] = [
    [null, coverPage],
    ...insidePages,
    [backPage, null],
  ];

  const splitPageProps = splitPages.map((p, i) => {
    const firstItem = p[0] ?? p[1];
    if (p[0]) {
      p[0].isLeft = true;
      p[0].isRight = false;
    }
    if (p[1]) {
      p[1].isLeft = false;
      p[1].isRight = true;
    }
    const lowestIndex = firstItem?.index ?? -1;
    const pageProps: SplitPageViewProps = {
      index: lowestIndex,
      page: p,
      pageNumber: i,
      prevPage: undefined,
      nextPage: undefined,
    }
    return pageProps;
  });

  // after we have the first pass, need to re-loop through and set the front and back pages
  splitPageProps.forEach((p, i) => {
    p.prevPage = i - 1 >= 0 ? splitPageProps[i - 1] : undefined;
    p.nextPage = i + 1 <= splitPageProps.length - 1 ? splitPageProps[i + 1] : undefined;
  });

  return splitPageProps;
}

export interface BookViewState {
  pagesPerView: number;
  totalPages: number;
  pageNumber: number;
  allowNext: boolean;
  allowPrev: boolean;
}

const BookView = ({ pages = daisysDayAway.pages }: { pages: IBookPage[] }) => {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const orientation = useOrientation();
  const [direction, setDirection] = useState(0);

  const getPpv = useCallback(() => {
    const nextPpv = orientation.type.startsWith('landscape')
      ? 2
      : 1;
    return nextPpv;
  }, [orientation.type]);

  const [allowPrev, setAllowPrev] = useState(false);
  const [allowNext, setAllowNext] = useState(false);
  const [pagesPerView, setPagesPerView] = useState(() => {
    return getPpv();
  });
  const [content, setContent] = useState<IBookPage[] | SplitPageViewProps[] | null>(() => {
    return buildBook(pages, pagesPerView);
  });
  const [pageNumber, setPageNumber] = useState(() => {
    const pageParam = searchParams.get('page') ?? '1';
    return Number(pageParam);
  });
  const [totalPages, setTotalPages] = useState(content?.length ?? 0);

  const currentPage = content?.[pageNumber - 1];

  const avatar = useMemo(() => {
    return <Avatar src="images/daisy.png" />;
  }, []);

  // ensures the page number is valid between 1 and the total number of pages
  useEffect(() => {

    if (pageNumber < 1) {
      setPageNumber(1);
    }
    else if (pageNumber > totalPages) {
      setPageNumber(totalPages);
    }

  }, [pageNumber]);

  useEffect(() => {

    setAllowPrev(pageNumber > 1);
    setAllowNext(pageNumber < totalPages);

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());

    router.replace(`${pathname}?${params.toString()}`);

  }, [pageNumber, totalPages]);

  useEffect(() => {
    const nextPpv = getPpv();
    const c = buildBook(pages, nextPpv);

    setContent(c);
    setPagesPerView(nextPpv);
    setTotalPages(c.length);

    const prevItem = content?.[pageNumber - 1];
    const prevIndex = prevItem?.index;

    if (prevIndex) {
      const selectedPage = c.findIndex((p: IBookPage | SplitPageViewProps) => {
        return p.index === prevIndex;
      });

      setPageNumber(selectedPage + 1);
    }

  }, [orientation.type, pages]);

  const moveFirst = () => {
    setPageNumber(1);
  };

  const moveLast = () => {
    setPageNumber(content?.length ?? 1);
  };

  const movePrev = () => {
    if (!allowPrev) return;
    setDirection(-1); // Going backward
    setPageNumber(pageNumber - 1);
  };

  const moveNext = () => {
    if (!allowNext) return;
    setDirection(1); // Going forward
    setPageNumber(pageNumber + 1);
  };

  useSwipe({
    onSwipeLeft: moveNext,
    onSwipeRight: movePrev,
  });

  const keyboardActions = useMemo(() => {
    return new Map<string, KeyPressAction>([
      ['w', { repeat: false, onKeyPress: moveLast }],
      ['a', { repeat: false, onKeyPress: movePrev }],
      ['s', { repeat: false, onKeyPress: moveFirst }],
      ['d', { repeat: false, onKeyPress: moveNext }],
      ['arrowup', { repeat: false, onKeyPress: moveLast }],
      ['arrowdown', { repeat: false, onKeyPress: moveFirst }],
      ['arrowleft', { repeat: false, onKeyPress: movePrev }],
      ['arrowright', { repeat: false, onKeyPress: moveNext }],
      ['enter', { repeat: false, onKeyPress: moveNext }],
      [' ', { repeat: false, onKeyPress: moveNext }],
      ['backspace', { repeat: false, onKeyPress: movePrev }],
      ['escape', { repeat: false, onKeyPress: moveFirst }],
    ]);
  }, [movePrev, moveNext, moveFirst, moveLast]);

  useKeyboard(keyboardActions);

  useWheel({
    onWheelDown: movePrev,
    onWheelUp: moveNext,
    onWheelLeft: movePrev,
    onWheelRight: moveNext,
  });

  if (!currentPage) return null;

  let innerView = null;

  if (pagesPerView === 2) {
    const splitPage = currentPage as SplitPageViewProps;
    const currentLeft = splitPage.page?.[0] ?? null;
    const currentRight = splitPage.page?.[1] ?? null;

    const previousLeft = splitPage.prevPage?.page?.[0] ?? null;
    const previousRight = splitPage.prevPage?.page?.[1] ?? null;

    const nextLeft = splitPage.nextPage?.page?.[0] ?? null;
    const nextRight = splitPage.nextPage?.page?.[1] ?? null;

    const backgroundLeft = direction > 0 ? currentLeft : previousLeft;
    const backgroundRight = direction > 0 ? nextRight : currentRight;

    const leafFront = direction > 0 ? currentRight : previousRight;
    const leafBack = direction > 0 ? nextLeft : currentLeft;

    innerView = (
      <div className="fixed inset-0 w-screen h-screen bg-neutral-900 flex items-center select-none" style={{ perspective: "5000px" }}>
        <div className="relative w-full h-[85vh] flex " style={{ transformStyle: "preserve-3d" }}>

          {/* STATIC BACKGROUND CONTAINER (LEFT SIDE) */}
          <div className="w-1/2 h-full flex flex-row border-r border-neutral-800 relative place-items-end rounded-l-md shadow-md overflow-hidden z-0">
            {backgroundLeft?.src
            ? (
              <div className="flex flex-row place-items-end place-content-end items-end justify-end">
                <BookImage src={backgroundLeft.src} alt="" className="" />
              </div>
            ) : (
              <div className="p-6 flex flex-col justify-center items-center h-full text-black w-full text-center">
                <Card className="p-4" elevation={2}>
                  <CardHeader title={bookTitle} subheader="by Trey Morris" avatar={avatar} />
                </Card>
              </div>
            )}
          </div>

          {/* STATIC BACKGROUND CONTAINER (RIGHT SIDE) */}
          <div className="w-1/2 h-full grid border-l border-neutral-800 relative shadow-md overflow-hidden z-0">
            {backgroundRight?.src && <BookImage src={backgroundRight.src} alt="" />}
          </div>

          {/* INTERACTIVE ANIMATING LEAF LAYER */}
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={pageNumber}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-0 w-1/2 h-full"
              style={{
                // anchor the hinge point dynamically to the center book spine line
                left: direction > 0 ? "50%" : "0%",
                transformOrigin: direction > 0 ? "left center" : "right center",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Sheet Face: Front View */}
              <div
                className="absolute inset-0 border-neutral-200 overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  borderLeftWidth: direction > 0 ? "1px" : "0px",
                  borderRightWidth: direction > 0 ? "0px" : "1px"
                }}
              >
                {leafFront?.src && <BookImage src={leafFront.src} alt="" />}
              </div>

              {/* Sheet Face: Reverse View (Mirrored 180 degrees) */}
              <div
                className="absolute inset-0 border-neutral-200 overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  borderLeftWidth: direction > 0 ? "0px" : "1px",
                  borderRightWidth: direction > 0 ? "1px" : "0px"
                }}
              >
                {leafBack?.src && <BookImage src={leafBack.src} alt="" />}
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    );
  }
  else {
    const singlePage = currentPage as unknown as SinglePageViewProps;
    const activePage = singlePage.page;
    const bgPage = direction > 0 ? singlePage.nextPage : singlePage.prevPage;

    innerView = (
      <div className="fixed inset-0 w-screen h-screen flex items-center justify-center" style={{ perspective: "1200px" }}>
          <motion.div
            key={(bgPage?.index ?? 0) + 1}
            custom={direction}
            variants={{

            }}
            initial={{
              zIndex: -1,
              opacity: 0,
            }}
            animate={{
              zIndex: 1,
              opacity: 1,
            }}
            exit={{
              zIndex: -1,
              opacity: 0,
            }}
            className="w-full aspect-2/3 max-w-md shadow-2xl overflow-hidden absolute"
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: direction > 0 ? "left center" : "right center",
            }}
          >
            {activePage?.src && <BookImage src={activePage.src} alt="" />}
          </motion.div>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={pageNumber}
            custom={direction}
            variants={singlePageVariants} // Using the new center-axis flashcard animation
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 26 // Using a crisp spring curve instead of basic ease
            }}
            className="w-full aspect-2/3 max-w-md shadow-2xl overflow-hidden absolute"
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: direction > 0 ? "left center" : "right center",
            }}
          >
            {activePage?.src && <BookImage src={activePage.src} alt="" />}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div>
      {innerView}
      <div className="fixed w-screen h-screen left-0 top-0 z-0 place-content-between justify-items-center flex flex-row pointer-events-none">
        <IconButton disabled={!allowPrev}
          className={`text-white hover:text-blue-400 active:text-gray-600 z-100 align-middle object-scale-down pointer-events-auto aspect-square place-self-center max-h-20 my-auto ${allowPrev ? '' : 'opacity-0'}`}
          onClick={() => {
            movePrev();
          }}>
          <ArrowLeft className="object-fill aspect-square scale-300 m-2 drop-shadow-lg drop-shadow-neutral-950" />
        </IconButton>
        <IconButton disabled={!allowNext}
          className={`text-white hover:text-blue-400 active:text-gray-600 z-100 align-middle object-scale-down pointer-events-auto aspect-square place-self-center max-h-20 my-auto ${allowNext ? '' : 'opacity-0'}`}
          onClick={() => {
            moveNext();
          }}>
          <ArrowRight className="object-fill aspect-square scale-300 m-2 drop-shadow-lg z-100 drop-shadow-neutral-950 " />
        </IconButton>
      </div>
      <div className="left-0 w-full grid justify-center fixed bottom-2 md:bottom-5 lg:bottom-10">
        <div className="z-100 items-center justify-center place-content-center">
          <Card className="p-2" sx={{ display: 'inline-flex', alignContent: 'center', justifyContent: 'center', placeContent: 'center', placeSelf: 'center', alignSelf: 'center', justifySelf: 'center' }}>
            <Pagination count={content?.length ?? 0} page={pageNumber} onChange={(event: React.ChangeEvent<unknown>, page: number) => { setPageNumber(page) }}
              siblingCount={1} color="standard" showFirstButton={false} showLastButton={false} size='medium' />
          </Card>
        </div>
      </div>
    </div>
  )
}

export { BookView as default };
