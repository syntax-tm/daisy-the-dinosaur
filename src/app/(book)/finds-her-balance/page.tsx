'use client';

import { daisysDayAway } from "@/config/daisys-day-away";
import dynamic from "next/dynamic";

const BookView = dynamic(() => import('@/components/book/book-view'), {
  ssr: false,
});

export default function Page() {
  return (
    <BookView pages={daisysDayAway.pages} />
  );
}
