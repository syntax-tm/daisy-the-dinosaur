'use client';

import PageFlip from './page-flip';
import type { SinglePageViewProps } from './book-view';

export interface SinglePageViewComponentProps {
  currentPage: SinglePageViewProps;
  direction: number;
}

export function SinglePageView({ currentPage, direction }: SinglePageViewComponentProps) {
  const adjacentPage = direction > 0
    ? currentPage.nextPage
    : currentPage.prevPage;

  return (
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center overflow-hidden">
      <PageFlip
        currentPage={currentPage.page!}
        adjacentPage={adjacentPage}
        direction={direction}
      />
    </div>
  );
}

export default SinglePageView;
