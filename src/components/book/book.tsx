'use client';

import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Pagination, Card, CardHeader, Avatar, Paper, Container, IconButton } from '@mui/material';
import { useOrientation, useWindowSize } from '@uidotdev/usehooks';
import { chunkArray } from '@/types/array';
import { Page } from '../page/page';
import { ArrowLeft, ArrowRight, QuestionAnswerSharp } from '@mui/icons-material';
import { formatString } from '@/types';
import BookImage from '../book-image/book-image';
import { Book, BookPage } from '@/types/book';
import { daisysDayAway } from '@/config/daisys-day-away';
import useSwipe from '@/hooks/useSwipe';
import useKeyboard, { KeyPressAction } from '@/hooks/useKeyboard';
import './book.css';

const bookTitle = "Daisy the Dino's Day Away";

export const PageView = (page: BookPage) => {
  return page.src && page.src !== '' && (
    <div key={page.src} className={`page h-full w-full aspect-2/3 object-cover place-content-center place-items-center`}>
      <BookImage src={page.src} alt='' />
    </div>
  )
}

export type SplitBookPage = [left: BookPage | null, right: BookPage | null];

export interface PageViewBase<T> {
  index: number;
  pageNumber: number;
  [index: number]: T;
}

export interface SinglePageViewProps extends PageViewBase<BookPage | null> {
  index: number;
  pageNumber: number;
  page: BookPage | null;
  [index: number]: BookPage | null;
}

export interface SplitPageViewProps extends PageViewBase<SplitBookPage> {
  index: number;
  pageNumber: number;
  page: SplitBookPage;
  [index: number]: SplitBookPage;
}

export function buildBook(pages: BookPage[], pagesPerView: number = 2) {
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

const BookView = ({ pages = daisysDayAway.pages }: { pages: BookPage[] }) => {

  const orientation = useOrientation();

  const [allowPrev, setAllowPrev] = useState(false);
  const [allowNext, setAllowNext] = useState(false);
  const [pagesPerView, setPagesPerView] = useState(1);
  const [currentItem, setCurrentItem] = useState<SplitPageViewProps | BookPage | null>(null);
  // const [options, setOptions] = useState<BookViewState>(defaultState);
  // const [currentPage, setCurrentPage] = useState<BookPageProps | null>(null);
  const [content, setContent] = useState<BookPage[] | SplitPageViewProps[] | null>(() => {
    const ppv = orientation.type.startsWith('landscape')
      ? 2
      : 1;
    return buildBook(pages, ppv);
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(content?.length ?? 0);

  const currentPage = content?.[pageNumber - 1];

  const avatar = useMemo(() => {
    return <Avatar src="images/daisy.png" />;
  }, []);

  useEffect(() => {

    if (pageNumber < 1) {
      setPageNumber(1);
    }
    else if (content && pageNumber > content.length) {
      setPageNumber(content.length);
    }

    setTotalPages(content?.length ?? -1);
  }, [pageNumber, content]);

  useEffect(() => {

    setAllowPrev(pageNumber > 1);
    setAllowNext(pageNumber < totalPages);

  }, [pageNumber, totalPages]);

  useEffect(() => {
    const nextPpv = orientation.type.startsWith('landscape')
      ? 2
      : 1;

    const c = buildBook(pages, nextPpv);

    setContent(c);
    setPagesPerView(nextPpv);
    setTotalPages(c.length);

    const prevItem = content?.[pageNumber - 1];
    const prevItemIndex = prevItem?.index;

    if (prevItemIndex) {
      const newPageNumber = c.findIndex((p: BookPage | SplitPageViewProps) => {
        if ('page' in p) {
          return p.page[0]?.index === prevItemIndex
            || p.page[1]?.index === prevItemIndex;
        }
        return p.index === prevItemIndex;
      });

      setPageNumber(newPageNumber + 1);
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
      ['escape', { repeat: false, onKeyPress: moveFirst }],
    ]);
  }, [movePrev, moveNext]);

  useKeyboard(keyboardActions);

  if (!currentPage) return null;

  const page = currentPage as BookPage;
  const splitPage = currentPage as SplitPageViewProps;

  let innerView = null;

  if (Array.isArray(splitPage.page)) {

    const leftPage = splitPage.page[0];
    const rightPage = splitPage.page[1];

    innerView = (
      <div className="fixed left-0 top-0 w-screen h-screen">
        <Container fixed className="page-container p-0 m-0 flex">
          <div className="w-1/2 h-screen place-content-center">
          {
            leftPage && (
              <PageView src={leftPage.src} index={leftPage.index} />
            )
          }
          {
            !leftPage && (
              <div className="flex justify-items-center place-items-center place-content-center">
                <Card className="text-white place-self-center self-center p-2 text-2xl" elevation={4}>
                  <CardHeader title={bookTitle} subheader={'by Trey Morris'} avatar={avatar} />
                </Card>
              </div>
            )
          }
          </div>
          <div className="w-1/2 border-l h-screen place-content-center border-gray-400/50">
          {
            rightPage && (
              <PageView src={rightPage.src} index={rightPage.index} />
            )
          }
          </div>
        </Container>
      </div>
    );
  }
  else if (!Array.isArray(page)) {
    innerView = page && (
      <div className="fixed left-0 top-0 w-screen h-screen">
        <PageView src={page.src} index={pageNumber} />
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
