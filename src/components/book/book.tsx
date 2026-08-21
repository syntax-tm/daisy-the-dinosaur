'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Pagination, Card, CardHeader, Avatar, Paper } from '@mui/material';
import { useWindowSize } from '@uidotdev/usehooks';
import { KeyPressAction, useKeyboard } from '@hooks/useKeyboard';
import { ReactFlipBook } from '@vuvandinh203/react-flipbook';
import Image from 'next/image';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';
import './pdf-viewer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// const options = {
//   cMapUrl: '/cmaps/',
//   standardFontDataUrl: '/standard_fonts/',
//   wasmUrl: '/wasm/',
//   enableHwa: true,
// };

const maxWidth = 1000;
const pageCount = 22;
const pageWidth = 600;
const pageHeight = 900;
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
  const flipbookRef = useRef<ReactFlipBookRef | null>(null);
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

  const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }: PDFDocumentProxy): void => {
    setNumPages(nextNumPages);
  }, []);

  const avatar = useMemo(() => {
    return <Avatar src="images/daisy.png" />;
  }, []);

  const onChangeOrientation = (orientation: string) => {

  };

  return (
    <div className="grid w-full h-full fixed left-0 top-0">

      <div className="align-middle self-center justify-self-center items-center content-center">
        <ReactFlipBook width={pageWidth}
          height={pageHeight}
          showNavigationButtons={false}
          showPageNumbers={false}
          ref={flipbookRef}
          onPageChange={(page) => { setPageNumber(page); }}>
          {
            pages && pages.map(p => {

              return (
                <div key={p.index} className={`page page${p.pageNum}`}>
                  <Image src={p.url} width={pageWidth} height={pageHeight} alt=''  />
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
      <Card className="fixed top-10 right-10 text-right text-white z-100">
        <CardHeader title={bookTitle} subheader={'by Trey Morris'} avatar={avatar} />
      </Card>
      <div className="left-0 w-full flex justify-center fixed bottom-2 md:bottom-5 lg:bottom-10">
        <div className="z-100 w-[90%] ">
          <Card className="p-4" sx={{ display: 'inline-flex', alignContent: 'center', justifyContent: 'center', placeContent: 'center', placeSelf: 'center', alignSelf: 'center', justifySelf: 'center' }}>
            <Pagination count={numPages} page={pageNumber} onChange={(event: React.ChangeEvent<unknown>, page: number) => {
              setPageNumber(page);

            }} siblingCount={0} color="standard" showFirstButton={false} showLastButton={false} size='medium' />
          </Card>
        </div>
      </div>
    </div>
  )

};

export { PdfViewer as default };
