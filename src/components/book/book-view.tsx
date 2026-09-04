'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Pagination, Card, IconButton, Avatar } from '@mui/material';
import { useOrientation } from '@uidotdev/usehooks';
import { chunkArray } from '@/types/array';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { IBookPage } from 'types';
import { daisysDayAway } from '@/config/daisys-day-away';
import { useSwipe, useKeyboard, useWheel, KeyPressAction } from '@hooks/index';
import './book.css';
import DualPageView from './dual-page-view';
import SinglePageView from './single-page-view';

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

export type BookLayout = 'auto' | 'single' | 'dual';

export interface BookViewProps {
  pages?: IBookPage[];
  layout?: BookLayout;
}

function parseBookLayout(value: string | null): BookLayout | undefined {
  return value === 'single' || value === 'dual' || value === 'auto'
    ? value
    : undefined;
}

const BookView = ({ pages = daisysDayAway.pages, layout = 'auto' }: BookViewProps) => {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const orientation = useOrientation();
  const [direction, setDirection] = useState(0);
  const [navigationLocked, setNavigationLocked] = useState(false);
  const navigationLockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryLayout = parseBookLayout(searchParams.get('layout'));
  const activeLayout = queryLayout ?? layout;

  const getPpv = useCallback(() => {
    if (activeLayout === 'single') return 1;
    if (activeLayout === 'dual') return 2;

    const nextPpv = orientation.type.startsWith('landscape')
      ? 2
      : 1;
    return nextPpv;
  }, [activeLayout, orientation.type]);

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

  }, [getPpv, orientation.type, pages]);

  useEffect(() => {
    return () => {
      if (navigationLockTimer.current) {
        clearTimeout(navigationLockTimer.current);
      }
    };
  }, []);

  const lockNavigation = () => {
    setNavigationLocked(true);
    navigationLockTimer.current = setTimeout(() => {
      setNavigationLocked(false);
      navigationLockTimer.current = null;
    }, 2000);
  };

  const moveFirst = () => {
    if (navigationLocked) return;
    lockNavigation();
    setPageNumber(1);
  };

  const moveLast = () => {
    if (navigationLocked) return;
    lockNavigation();
    setPageNumber(content?.length ?? 1);
  };

  const movePrev = () => {
    if (!allowPrev || navigationLocked) return;
    lockNavigation();
    setDirection(-1); // Going backward
    setPageNumber(pageNumber - 1);
  };

  const moveNext = () => {
    if (!allowNext || navigationLocked) return;
    lockNavigation();
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

  let innerView;
  const singlePage = currentPage as SinglePageViewProps;

  if (pagesPerView === 2) {
    innerView = (
      <DualPageView
        currentPage={currentPage as SplitPageViewProps}
        direction={direction}
        onFlipComplete={() => setDirection(0)}
      />
    );
  }
  else {
    innerView = (
      <SinglePageView currentPage={singlePage} direction={direction} />
    );
  }

  return (
    <div>
      {innerView}
      <div className="fixed w-screen h-screen left-0 top-0 z-0 place-content-between justify-items-center flex flex-row pointer-events-none">
        <IconButton disabled={!allowPrev || navigationLocked}
          className={`text-white hover:text-blue-400 active:text-gray-600 z-100 align-middle object-scale-down pointer-events-auto aspect-square place-self-center max-h-20 my-auto ${allowPrev ? '' : 'opacity-0'}`}
          onClick={() => {
            movePrev();
          }}>
          <ArrowLeft className="object-fill aspect-square scale-300 m-2 drop-shadow-lg drop-shadow-neutral-950" />
        </IconButton>
        <IconButton disabled={!allowNext || navigationLocked}
          className={`text-white hover:text-blue-400 active:text-gray-600 z-100 align-middle object-scale-down pointer-events-auto aspect-square place-self-center max-h-20 my-auto ${allowNext ? '' : 'opacity-0'}`}
          onClick={() => {
            moveNext();
          }}>
          <ArrowRight className="object-fill aspect-square scale-300 m-2 drop-shadow-lg z-100 drop-shadow-neutral-950 " />
        </IconButton>
      </div>
      <div className="left-0 w-full grid justify-center fixed bottom-2 md:bottom-5 lg:bottom-10">
        <div className="z-200 items-center justify-center place-content-center">
          <Card className="p-2" sx={{ display: 'inline-flex', alignContent: 'center', justifyContent: 'center', placeContent: 'center', placeSelf: 'center', alignSelf: 'center', justifySelf: 'center' }}>
            <Pagination count={content?.length ?? 0} page={pageNumber} disabled={navigationLocked}
              onChange={(
                event: React.ChangeEvent<unknown>,
                page: number
              ) => {
                if (navigationLocked) return;
                lockNavigation();
                setDirection(page > pageNumber ? 1 : -1);
                setPageNumber(page);
              }}
              siblingCount={1} color="standard" showFirstButton={false} showLastButton={false} size='medium' />
          </Card>
        </div>
      </div>
    </div>
  )
}

export { BookView as default };
