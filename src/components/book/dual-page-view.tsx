'use client';

import { Avatar, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import BookImage from '../book-image/book-image';
import PageFlip from './page-flip';
import type { SplitPageViewProps } from './book-view';
import { IBook } from '@/types';
import Image from 'next/image';

const bookTitle = "Daisy the Dino's Day Away";

export interface DualPageViewProps {
  book: IBook;
  currentPage: SplitPageViewProps;
  direction: number;
  onFlipComplete: () => void;
}

export function DualPageView({ book, currentPage, direction, onFlipComplete }: DualPageViewProps) {
  const currentLeft = currentPage.page[0];
  const currentRight = currentPage.page[1];
  const previousLeft = currentPage.prevPage?.page[0] ?? null;
  const previousRight = currentPage.prevPage?.page[1] ?? null;
  const nextLeft = currentPage.nextPage?.page[0] ?? null;
  const nextRight = currentPage.nextPage?.page[1] ?? null;

  const turningForward = direction > 0;
  const isTurning = direction !== 0;
  const staticLeft = !isTurning ? currentLeft : turningForward ? previousLeft : currentLeft;
  const staticRight = !isTurning ? currentRight : turningForward ? currentRight : nextRight;
  const turningPage = turningForward ? previousRight : nextLeft;
  const pageBehind = turningForward ? currentLeft : currentRight;
  const avatar = <Avatar src="images/daisy.png" />;

  return (
    <div
      className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-neutral-900 select-none"
      style={{ perspective: '1500px' }}
    >
      <div
        className="relative flex h-[85vh] max-h-[85vh] w-auto max-w-full aspect-4/3"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative z-0 grid h-full w-1/2 items-end justify-end overflow-hidden border-r border-neutral-800 shadow-md">
          {staticLeft?.src ? (
            <BookImage src={staticLeft.src} alt="" alignment="left" />
          ) : (
            <div className="grid h-full w-full aspect-2/3 border-2 border-gray-600">
              <Card className="p-4" elevation={2}>
                <div className="h-full w-full max-h-15 relative">
                  <div className="h-full aspect-square grid absolute left-0 top-0">
                    <Image src="images/daisy.png" fill style={{ objectFit: 'contain' }} alt="" />
                  </div>
                  <div className="h-full grow grid z-1 absolute left-0 top-0 w-full">
                    <h4 className="place-self-start justify-self-center text-left align-middle text-3xl my-auto">
                      {book.title}
                    </h4>
                  </div>
                </div>
                <CardContent>
                  <div className="m-2">
                    {book.about}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="relative z-0 grid h-full w-1/2 items-start justify-start overflow-hidden border-l border-neutral-800 shadow-md">
          {staticRight?.src && (
            <BookImage src={staticRight.src} alt="" alignment="right" />
          )}
        </div>

        {isTurning && turningPage && (
          <PageFlip
            currentPage={turningPage}
            adjacentPage={pageBehind ?? undefined}
            direction={direction}
            showUnderlay={false}
            onFlipComplete={onFlipComplete}
            className={`absolute top-0 z-10 h-full w-1/2 max-w-none aspect-auto ${turningForward ? 'left-1/2' : 'left-0'}`}
          />
        )}
      </div>
    </div>
  );
}

export default DualPageView;
