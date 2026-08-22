'use client';

import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Pagination, Card, CardHeader, Avatar, Paper, Container, IconButton } from '@mui/material';
import { useWindowSize } from '@uidotdev/usehooks';
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
    <div key={index} className={`page relative`}>
      <Image src={image} width={pageWidth} height={pageHeight} alt=''
        className="aspect-2/3 w-screen h-screen object-scale-down" />
    </div>
  )
}


export const bookPages = Array.from({ length: pageCount }, (_, index): PageProps => {
  const pageNum = index + 1;
  const id = pageNum.toString().padStart(2, '0');
  return {
    index,
    image: `docs/daisy_the_dinosaurs_day_away/page-${id}.png`,
  }
});

export type BookPage = [left: PageProps | null, right: PageProps | null];
export interface BookPageProps {
  pageNumber: number;
  page: BookPage;
}

export function buildBook(pages: PageProps[]) {
  const coverPage = pages[0];
  const backPage = pages.slice(-1)[0];
  const inside = pages.slice(1, -1);
  const insidePages: BookPage[] = chunkArray(inside, 2).map(p => {
    return [p.at(0) ?? null, p.at(1) ?? null]
  });

  const book: BookPage[] = [
    [null, coverPage],
    ...insidePages,
    [backPage, null],
  ];

  return book.map((p, i) => {
    const pageProps: BookPageProps = {
      page: p,
      pageNumber: i,
    }
    return pageProps;
  });
}

const BookView = ({ pages = bookPages }: { pages: PageProps[] }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(pages.length / 2);
  //const [currentPage, setCurrentPage] = useState<BookPageProps | null>(null);
  const [content, setContent] = useState<BookPageProps[] | null>(() => {
    const c = buildBook(pages);
    console.log(JSON.stringify(c, null, 2));
    return c;
  });
  const [allowPrev, setAllowPrev] = useState(false);
  const [allowNext, setAllowNext] = useState(false);

  useEffect(() => {

    setAllowPrev(pageNumber > 1);
    setAllowNext(pageNumber <= totalPages);

    console.log(`totalPages: ${totalPages}`)

  }, [pageNumber, totalPages]);

  const currentPage = content?.[pageNumber - 1];
  const leftPage = currentPage?.page[0] ?? null;
  const rightPage = currentPage?.page[1] ?? null;

  const avatar = useMemo(() => {
    return <Avatar src="images/daisy.png" />;
  }, []);

  return (
    <div className="fixed left-0 top-0 w-screen h-screen">
      <Container fixed className="page-container p-0 m-0 flex">
        <div className="w-1/2 h-screen place-content-center">
        {
          leftPage && (
            <PageView image={leftPage.image} index={pageNumber} />
          )
        }
        {
          !leftPage && (
            <Card className="text-white z-100 place-self-centen w-full">
              <CardHeader title={bookTitle} subheader={'by Trey Morris'} avatar={avatar} />
            </Card>
          )
        }
        </div>
        <div className="w-1/2 border-l border-gray-400/50">
        {
          rightPage && (
            <PageView image={rightPage.image} index={pageNumber} />
          )
        }
        {
          !rightPage && (
            // <div className="w-full h-full relative">
            //   <Image src='images/cat_sleeping.png' width={200} height={200} alt="" />
            // </div>
            <div></div>
          )
        }
        </div>
      </Container>
      {/* <Card className="fixed top-10 right-10 text-right text-white z-100 not-xl:opacity-0 not-xl:hidden">
        <CardHeader title={bookTitle} subheader={'by Trey Morris'} avatar={avatar} />
      </Card> */}
      <div className="fixed w-screen h-screen left-0 top-0 place-content-between justify-items-center flex flex-row">
        <IconButton disabled={!allowPrev}
          className={`text-white hover:text-blue-400 active:text-gray-600 ${allowPrev ? '' : 'opacity-0'}`}
          onClick={() => { setPageNumber(pageNumber - 1) }}>
          <ArrowLeft className="object-fill aspect-square scale-200 m-2" />
        </IconButton>
        <IconButton disabled={!allowNext}
          className={`text-white hover:text-blue-400 active:text-gray-600 ${allowNext ? '' : 'opacity-0'}`}
          onClick={() => { setPageNumber(pageNumber + 1) }}>
          <ArrowRight className="object-fill aspect-square scale-200 m-2" />
        </IconButton>
      </div>
      <div className="left-0 w-full grid justify-center fixed bottom-2 md:bottom-5 lg:bottom-10">
        <div className="z-100 items-center justify-center place-content-center">
          <Card className="p-4" sx={{ display: 'inline-flex', alignContent: 'center', justifyContent: 'center', placeContent: 'center', placeSelf: 'center', alignSelf: 'center', justifySelf: 'center' }}>
            <Pagination count={content?.length ?? 0} page={pageNumber} onChange={(event: React.ChangeEvent<unknown>, page: number) => { setPageNumber(page) }}
              siblingCount={0} color="standard" showFirstButton={false} showLastButton={false} size='medium' />
          </Card>
        </div>
      </div>
    </div>
  )
}

// export const PdfViewer = () => {
//   const [numPages, setNumPages] = useState<number>(pageCount);
//   const [pageNumber, setPageNumber] = useState<number>(1);
//   const [currentImage, setCurrentImage] = useState<string | null>(null);
//   const flipbookRef = useRef<ReactNode | null>(null);
//   const size = useWindowSize();

//   const movePrev = useCallback(() => {
//     if (pageNumber <= 1) return;
//     setPageNumber(pageNumber - 1);
//   }, [pageNumber]);

//   const moveNext = useCallback(() => {
//     if (!numPages) return;
//     if (pageNumber >= numPages) return;
//     setPageNumber(pageNumber + 1);
//   }, [pageNumber, numPages]);

//   const moveFirst = useCallback(() => {
//     setPageNumber(1);
//   }, []);

//   const moveLast = useCallback(() => {
//     if (!numPages) return;
//     setPageNumber(numPages);
//   }, [numPages]);

//   const mappedKeys = useMemo(() => {
//     return new Map<string, KeyPressAction>([
//     ['arrowleft', { repeat: false, onKeyPress: movePrev }],
//     ['arrowright', { repeat: false, onKeyPress: moveNext }],
//     ['arrowup', { repeat: false, onKeyPress: moveLast }],
//     ['arrowdown', { repeat: false, onKeyPress: moveFirst }],
//     ['w', { repeat: false, onKeyPress: moveLast }],
//     ['a', { repeat: false, onKeyPress: movePrev }],
//     ['s', { repeat: false, onKeyPress: moveFirst }],
//     ['d', { repeat: false, onKeyPress: moveNext }],
//     [' ', { repeat: false, onKeyPress: moveNext }],
//     ['enter', { repeat: false, onKeyPress: moveNext }],
//     ['escape', { repeat: false, onKeyPress: moveFirst }],
//   ])
//   }, [movePrev, moveNext, moveFirst, moveLast]);

//   useKeyboard(mappedKeys);

//   const avatar = useMemo(() => {
//     return <Avatar src="images/daisy.png" />;
//   }, []);

//   return (
//     <div className="grid w-full h-full fixed left-0 top-0">

//       <div className="align-middle self-center justify-self-center items-center content-center">
//         {/* <ReactFlipBook width={pageWidth / 2}
//           height={pageHeight}
//           mobileScrollSupport={true}
//           showNavigationButtons={true}
//           showPageNumbers={true}
//           currentPage={pageNumber}
//           showPageCorners={true}
//           pageShadow={true}
//           enableTouchSwipe={true}
//           enableKeyboardNav={true}
//           showCover={false}
//           pageMargin={2}
//           useMouseEvents={true}
//           drawShadow={true}
//           style={{  }}
//           maxWidth={500 / 2}
//           swipeDistance={20}
//           className=""
//           onPageChange={(page) => { setPageNumber(page); }}>
//           {
//             pages && pages.map(p => {

//               const w = Math.max(size?.width ?? 0, 600);

//               return (
//                 <div key={p.index} className={`page page${p.pageNum} relative w-screen flex`}>
//                   <Image src={p.url} width={pageWidth} height={pageHeight} alt=''
//                     className="aspect-2/3 w-screen h-screen object-scale-down" />
//                 </div>
//                 // <div key={p.index} className={`page page${p.pageNum} relative w-full`}>
//                 //   <div className="grid grid-flow-col justify-center w-screen h-screen">
//                 //     <Image src={p.url} width={pageWidth} height={pageHeight} alt=''
//                 //       className="self-center object-center place-self-center justify-center center justify-self-center aspect-2/3 portrait:max-w-dvw portrait:max- not-portrait:max-h-dvh not-portrait:max-w-[50dvh] object-contain" />
//                 //   </div>
//                 // </div>
//               )
//             })
//           }
//         </ReactFlipBook> */}
//       </div>

// {/* 
//       <Paper className="w-full fixed left-0 top-0 h-full" elevation={3} square>
//         <Image src={currentImage ?? ''} alt='' />
//       </Paper> */}
//       {/* <Card className="fixed top-10 right-10 text-right text-white z-100 not-xl:opacity-0 not-xl:hidden">
//         <CardHeader title={bookTitle} subheader={'by Trey Morris'} avatar={avatar} />
//       </Card>
//       <div className="left-0 w-full grid justify-center fixed bottom-2 md:bottom-5 lg:bottom-10">
//         <div className="z-100 items-center justify-center place-content-center">
//           <Card className="p-4" sx={{ display: 'inline-flex', alignContent: 'center', justifyContent: 'center', placeContent: 'center', placeSelf: 'center', alignSelf: 'center', justifySelf: 'center' }}>
//             <Pagination count={numPages} page={pageNumber} onChange={(event: React.ChangeEvent<unknown>, page: number) => {
//               setPageNumber(page);

//             }} siblingCount={0} color="standard" showFirstButton={false} showLastButton={false} size='medium' />
//           </Card>
//         </div>
//       </div> */}
//     </div>
//   )

// };

export { BookView as default };
