'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Pagination, Card, CardHeader, Avatar } from '@mui/material';
import { useWindowSize } from '@uidotdev/usehooks';
import { KeyPressAction, useKeyboard } from '@hooks/useKeyboard';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './pdf-viewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
  wasmUrl: '/wasm/',
  enableHwa: true,
};

const maxWidth = 1000;

export const PdfViewer = ({ file }: { file: string }) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
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

  const source = useMemo(() => {
    return file;
  }, [file]);
  const fileName = useMemo(() => {
    return file.split('/').pop();
  }, [file]);

  const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }: PDFDocumentProxy): void => {
    setNumPages(nextNumPages);
  }, []);

  const avatar = useMemo(() => {
    return <Avatar src="images/daisy.png" />;
  }, []);

  return (
    <div className="Example__container__document">
      <Document file={source} options={options} onLoadSuccess={onDocumentLoadSuccess} className={'w-full fixed left-0 top-0 h-full'}>
        <Page
            // biome-ignore lint/suspicious/noArrayIndexKey: index is stable here
            pageNumber={pageNumber}
            key={`page-${pageNumber}`}
            width={size?.width ? Math.min(size.width, maxWidth) : maxWidth}
          />
      </Document>
      <Card className="fixed top-10 right-10 text-right text-white z-100">
        <CardHeader title={fileName} subheader={'by Trey Morris'} avatar={avatar} />
      </Card>
      <div className="z-100 flex bottom-10 left-0 fixed items-center w-full justify-center">
        <Card className="p-4" sx={{ display: 'inline-flex', alignContent: 'center', justifyContent: 'center', placeContent: 'center', placeSelf: 'center', alignSelf: 'center', justifySelf: 'center' }}>
          <Pagination count={numPages} page={pageNumber} onChange={(event: React.ChangeEvent<unknown>, page: number) => {
            setPageNumber(page);
          }} color="standard" showFirstButton showLastButton size='large' />
        </Card>
      </div>
    </div>
  )

};

export { PdfViewer as default };
