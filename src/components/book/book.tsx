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
  [index: number]: IBookPage | null;
}

export interface SplitPageViewProps extends PageViewBase<SplitBookPage> {
  index: number;
  pageNumber: number;
  page: SplitBookPage;
  [index: number]: SplitBookPage;
}

export function buildBook(pages: IBookPage[], pagesPerView: number = 2) {
  // re-index the pages
  pages.forEach((p, i) => {
    pages[i] = { ...p, index: i };
  });

  // if we are displaying one page per view, then just return the re-indexed pages
  if (pagesPerView === 1) {
    return pages;
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
    }
    return pageProps;
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
    setPageNumber(pageNumber - 1);
  };

  const moveNext = () => {
    if (!allowNext) return;
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

  const page = currentPage as IBookPage;
  const splitPage = currentPage as SplitPageViewProps;

  let innerView = null;

  if (Array.isArray(splitPage.page)) {

    const leftPage = splitPage.page[0];
    const rightPage = splitPage.page[1];

    innerView = (
      <div className="fixed left-0 top-0 w-screen h-screen">
        <div className="flex flex-col items-center w-full h-screen">
          <div className="grid border-r relative h-screen place-items-end">
          {
            leftPage?.src && (
              // <PageView src={leftPage.src} index={leftPage.index} children={leftPage.children} isLeft={true} />
              <BookImage src={leftPage.src} alt='' />
            )
          }
          {/* {
            !leftPage && (
              <div className="justify-items-center place-items-center place-content-center">
                <Card className="text-white place-self-center self-center p-2 text-2xl" elevation={4}>
                  <CardHeader title={bookTitle} subheader={'by Trey Morris'} avatar={avatar} />
                </Card>
              </div>
            )
          } */}
          </div>
          <div className="grid border-l relative h-screen">
          {
            rightPage?.src && (
              // <PageView src={rightPage.src} index={rightPage.index} children={rightPage.children} isRight={true} />
              <BookImage src={rightPage.src} alt='' />
            )
          }
          </div>
        </div>
      </div>
    );
  }
  else if (!Array.isArray(page)) {
    innerView = page && (
      <div className="fixed left-0 top-0 w-screen h-screen">
        <Paper elevation={1} className="page-container h-screen w-screen">
          <PageView src={page.src} index={pageNumber} children={page.children} />
        </Paper>
      </div>
    );
  }

  return (
    <div>
      {innerView}
      <div className="fixed w-screen h-screen left-0 top-0 z-0 place-content-between justify-items-center flex flex-row pointer-events-none" hidden>
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
