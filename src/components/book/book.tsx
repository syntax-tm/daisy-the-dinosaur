'use client';

import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Pagination, Card, CardHeader, Avatar, Paper, Container, IconButton } from '@mui/material';
import { useOrientation, useWindowSize } from '@uidotdev/usehooks';
import { KeyPressAction, useKeyboard } from '@hooks/useKeyboard';
import { ReactFlipBook } from '@vuvandinh203/react-flipbook';
import { useMediaQuery } from "@uidotdev/usehooks";
import Image from 'next/image';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';
import './book.css';
import { chunkArray } from '@/types/array';
import { Page } from '../page/page';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { formatString } from '@/types';
import BookImage from '../book-image/book-image';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// const options = {
//   cMapUrl: '/cmaps/',
//   standardFontDataUrl: '/standard_fonts/',
//   wasmUrl: '/wasm/',
//   enableHwa: true,
// };

const maxWidth = 1000;
const pageCount = 22;
const pageWidth = 3200;
const pageHeight = 4800;
const bookTitle = "Daisy the Dino's Day Away";

export interface PageProps {
  image: string;
  index: number;
}

export const PageView = ({ image, index }: PageProps) => {

  return (
    <div key={index} className={`page h-full w-full aspect-2/3 object-cover place-content-center place-items-center`}>
      <BookImage image={image} width={pageWidth} height={pageHeight} alt='' />
    </div>
  )
}

//const imageUrl = 'https://github.com/syntax-tm/daisy-the-dinosaur/blob/main/public/docs/daisy_the_dinosaurs_day_away/page-{0}.png?raw=true';


const imageUrl = 'docs/daisy_the_dinosaurs_day_away/page-{0}.png';

export const bookPages = Array.from({ length: pageCount }, (_, index): PageProps => {
  const pageNum = index + 1;
  const id = pageNum.toString().padStart(2, '0');
  return {
    index,
    image: formatString(imageUrl, id),
  }
});

export type BookPage = PageProps | null;
export type SplitBookPage = [left: BookPage, right: BookPage];

export interface BookPageBase<T> {
  pageNumber: number;
  [index: number]: T;
}

export interface BookPageProps extends BookPageBase<BookPage> {
  pageNumber: number;
  page: BookPage;
  [index: number]: BookPage;
}

export interface SplitBookPageProps extends BookPageBase<SplitBookPage> {
  pageNumber: number;
  page: SplitBookPage;
  [index: number]: SplitBookPage;
}

export function buildBook(pages: PageProps[], pagesPerView: number = 2) {
  const coverPage = pages[0];
  const backPage = pages.slice(-1)[0];
  const inside = pages.slice(1, -1);

  if (pagesPerView !== 1) {
    const insidePages: SplitBookPage[] = chunkArray(inside, pagesPerView).map(p => {
      return [p.at(0) ?? null, p.at(1) ?? null]
    });

    const splitBookPages: SplitBookPage[] = [
      [null, coverPage],
      ...insidePages,
      [backPage, null],
    ];

    const splitBookPageProps = splitBookPages.map((p, i) => {
      const pageProps: SplitBookPageProps = {
        page: p,
        pageNumber: i,
      }
      return pageProps;
    });

    return splitBookPageProps;
  }

  return pages.map((p, i) => {
    const pageProps: BookPageProps = {
      page: p,
      pageNumber: i,
    }
    return pageProps;
  });
}

export interface BookViewState {
  pagesPerview: number;
  totalPages: number;
  pageNumber: number;
  allowNext: boolean;
  allowPrev: boolean;
}

const defaultState: BookViewState = {
  pageNumber: 1,
  pagesPerview: 1,
  totalPages: 0,
  allowNext: true,
  allowPrev: false,
};

const BookView = ({ pages = bookPages }: { pages: PageProps[] }) => {

  const size = useWindowSize();
  const orientation = useOrientation();

  const bookContent = useMemo(() => {
    const ppv = orientation.type.startsWith('landscape')
      ? 2
      : 1;
    return buildBook(pages, ppv);
  }, []);
  const [options, setOptions] = useState<BookViewState>(defaultState);
  //const [currentPage, setCurrentPage] = useState<BookPageProps | null>(null);
  const [content, setContent] = useState<BookPageProps[] | SplitBookPageProps[] | null>(bookContent);

  //console.log(`pagesPerView: ${pagesPerView}`);
  //console.log(`pageNumber: ${pageNumber}`);
  //console.log(`content.length: ${content?.length}`);

  const currentPage = content?.[options.pageNumber - 1];

  const avatar = useMemo(() => {
    return <Avatar src="images/daisy.png" />;
  }, []);

  useEffect(() => {

    if (!options) return;
    const nextOptions = { ...options };
    if (nextOptions.pageNumber < 1) {
      nextOptions.pageNumber = 1;
    }
    else if (content && nextOptions.pageNumber > content.length) {
      nextOptions.pageNumber = content.length;
    }

    nextOptions.allowPrev = nextOptions.pageNumber > 1;
    nextOptions.allowNext = nextOptions.pageNumber < options.totalPages;

    console.log(`${options.pageNumber} / ${options.totalPages}`)

    setOptions(nextOptions);
  }, [options.pageNumber, content]);

  useEffect(() => {
    const prevOptions = options;
    const nextOptions: BookViewState = { ...options };

    const nextPpv = orientation.type.startsWith('landscape')
      ? 2
      : 1;

    const c = buildBook(pages, nextPpv);
    setContent(c);

    nextOptions.totalPages = c.length;
    if (prevOptions) {
      // account for the extra 2 pages inserted when in split view
      const prevContentLength = prevOptions.pagesPerview === 1
        ? prevOptions.totalPages
        : prevOptions.totalPages + 2;
      const curContentLength = nextOptions.totalPages === 1
        ? c.length
        : c.length + 2;

      const factor = prevContentLength / curContentLength;
      console.log(`  prev: ${prevContentLength}`);
      console.log(`length: ${curContentLength}`);
      console.log(`factor: ${factor}`);
      console.log();

      nextOptions.pageNumber = Math.round(factor * nextOptions.pageNumber);
    }

    setOptions(nextOptions);
  }, [orientation, pages]);

  if (!currentPage) return null;

  const page = currentPage as BookPageProps;
  const splitPage = currentPage as SplitBookPageProps;

  let innerView = null;

  if (!Array.isArray(page.page)) {
    innerView = page.page && (
      <div className="fixed left-0 top-0 w-screen h-screen">
        <PageView image={page.page.image} index={options.pageNumber} />
      </div>
    );
  }
  else if (Array.isArray(page.page)) {

    const leftPage = splitPage.page[0];
    const rightPage = splitPage.page[1];

    innerView = (
      <div className="fixed left-0 top-0 w-screen h-screen">
        <Container fixed className="page-container p-0 m-0 flex">
          <div className="w-1/2 h-screen place-content-center">
          {
            leftPage && (
              <PageView image={leftPage.image} index={options.pageNumber} />
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
              <PageView image={rightPage.image} index={options.pageNumber} />
            )
          }
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div>
      {innerView}
      <div className="fixed w-screen h-screen left-0 top-0 place-content-between justify-items-center flex flex-row">
        <IconButton disabled={!options.allowPrev}
          className={`text-white hover:text-blue-400 active:text-gray-600 align-middle object-scale-down aspect-square place-self-center max-h-20 my-auto ${options.allowPrev ? '' : 'opacity-0'}`}
          onClick={() => {
            if (!options.allowPrev) return;
            setOptions({ ...options, pageNumber: options.pageNumber - 1 });
          }}>
          <ArrowLeft className="object-fill aspect-square scale-300 m-2" />
        </IconButton>
        <IconButton disabled={!options.allowNext}
          className={`text-white hover:text-blue-400 active:text-gray-600 align-middle object-scale-down aspect-square place-self-center max-h-20 my-auto ${options.allowNext ? '' : 'opacity-0'}`}
          onClick={() => {
            if (!options.allowNext) return;
            setOptions({ ...options, pageNumber: options.pageNumber + 1 });
          }}>
          <ArrowRight className="object-fill aspect-square scale-300 m-2" />
        </IconButton>
      </div>
      <div className="left-0 w-full grid justify-center fixed bottom-2 md:bottom-5 lg:bottom-10">
        <div className="z-100 items-center justify-center place-content-center">
          <Card className="p-2" sx={{ display: 'inline-flex', alignContent: 'center', justifyContent: 'center', placeContent: 'center', placeSelf: 'center', alignSelf: 'center', justifySelf: 'center' }}>
            <Pagination count={content?.length ?? 0} page={options.pageNumber} onChange={(event: React.ChangeEvent<unknown>, page: number) => { setOptions({ ...options, pageNumber: page }) }}
              siblingCount={2} color="standard" showFirstButton={false} showLastButton={false} size='medium' />
          </Card>
        </div>
      </div>
    </div>
  )
}

export { BookView as default };
