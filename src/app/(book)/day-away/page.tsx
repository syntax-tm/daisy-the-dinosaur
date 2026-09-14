'use client';

import { daisysDayAway } from "@/config/daisys-day-away";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const BookView = dynamic(() => import('@/components/book/book-view'), {
  ssr: false,
});

export default function Page() {
  return (
    <Suspense>
      <BookView book={daisysDayAway} />
    </Suspense>
  );
}
