'use client';

import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Pagination, Card, CardHeader, Avatar, Paper } from '@mui/material';
import { useWindowSize } from '@uidotdev/usehooks';
import { KeyPressAction, useKeyboard } from '@hooks/useKeyboard';
import { ReactFlipBook } from '@vuvandinh203/react-flipbook';
import type { ReactFlipBookRef } from '@/types/lib';
import { useMediaQuery } from "@uidotdev/usehooks";
import Image from 'next/image';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';
import './book.css';

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

const pages = Array.from({ length: pageCount }, (_, index) => {
  const pageNum = index + 1;
  const id = pageNum.toString().padStart(2, '0');
  return {
    index,
    pageNum,
    url: `docs/daisy_the_dinosaurs_day_away/page-${id}.png`,
  }
});

console.log(JSON.stringify(pages, null, 2));


export const PdfViewer = () => {
  const [numPages, setNumPages] = useState<number>(pageCount);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const flipbookRef = useRef<ReactNode | null>(null);
  const size = useWindowSize();

  const movePrev = useCallback(() => {
    if (pageNumber <= 1) return;
    setPageNumber(pageNumber - 1);
  }, [pageNumber]);

  const moveNext = useCallback(() => {
    if (!numPages) return;
    if (pageNumber >= numPages) return;
    setPageNumber(pageNumber + 1);
  }, [pageNumber, numPages]);

  const moveFirst = useCallback(() => {
    setPageNumber(1);
  }, []);

  const moveLast = useCallback(() => {
    if (!numPages) return;
    setPageNumber(numPages);
  }, [numPages]);

  const mappedKeys = useMemo(() => {
    return new Map<string, KeyPressAction>([
    ['arrowleft', { repeat: false, onKeyPress: movePrev }],
    ['arrowright', { repeat: false, onKeyPress: moveNext }],
    ['arrowup', { repeat: false, onKeyPress: moveLast }],
    ['arrowdown', { repeat: false, onKeyPress: moveFirst }],
    ['w', { repeat: false, onKeyPress: moveLast }],
    ['a', { repeat: false, onKeyPress: movePrev }],
    ['s', { repeat: false, onKeyPress: moveFirst }],
    ['d', { repeat: false, onKeyPress: moveNext }],
    [' ', { repeat: false, onKeyPress: moveNext }],
    ['enter', { repeat: false, onKeyPress: moveNext }],
    ['escape', { repeat: false, onKeyPress: moveFirst }],
  ])
  }, [movePrev, moveNext, moveFirst, moveLast]);

  useKeyboard(mappedKeys);

  const avatar = useMemo(() => {
    return <Avatar src="images/daisy.png" />;
  }, []);

  return (
    <div className="grid w-full h-full fixed left-0 top-0">

      <div className="align-middle self-center justify-self-center items-center content-center">
        <ReactFlipBook width={pageWidth}
          height={pageHeight}
          mobileScrollSupport={true}
          showNavigationButtons={true}
          showPageNumbers={true}
          currentPage={pageNumber}
          showPageCorners={true}
          pageShadow={true}
          enableTouchSwipe={true}
          enableKeyboardNav={true}
          showCover={false}
          pageMargin={2}
          useMouseEvents={true}
          drawShadow={true}
          style={{  }}
          maxWidth={500}
          swipeDistance={20}
          className=""
          onPageChange={(page) => { setPageNumber(page); }}>
          {
            pages && pages.map(p => {

              const w = Math.max(size?.width ?? 0, 600);

              return (
                <div key={p.index} className={`page page${p.pageNum} relative w-full`}>
                  <div className="grid grid-flow-col justify-center w-screen h-screen">
                    <Image src={p.url} width={pageWidth} height={pageHeight} alt=''
                      className="self-center object-center place-self-center justify-center center justify-self-center aspect-2/3 portrait:max-w-dvw not-portrait:max-h-dvh object-contain" />
                  </div>
                </div>
              )
            })
          }
        </ReactFlipBook>
      </div>

{/* 
      <Paper className="w-full fixed left-0 top-0 h-full" elevation={3} square>
        <Image src={currentImage ?? ''} alt='' />
      </Paper> */}
      {/* <Card className="fixed top-10 right-10 text-right text-white z-100 not-xl:opacity-0 not-xl:hidden">
        <CardHeader title={bookTitle} subheader={'by Trey Morris'} avatar={avatar} />
      </Card>
      <div className="left-0 w-full grid justify-center fixed bottom-2 md:bottom-5 lg:bottom-10">
        <div className="z-100 items-center justify-center place-content-center">
          <Card className="p-4" sx={{ display: 'inline-flex', alignContent: 'center', justifyContent: 'center', placeContent: 'center', placeSelf: 'center', alignSelf: 'center', justifySelf: 'center' }}>
            <Pagination count={numPages} page={pageNumber} onChange={(event: React.ChangeEvent<unknown>, page: number) => {
              setPageNumber(page);

            }} siblingCount={0} color="standard" showFirstButton={false} showLastButton={false} size='medium' />
          </Card>
        </div>
      </div> */}
    </div>
  )

};

export { PdfViewer as default };
