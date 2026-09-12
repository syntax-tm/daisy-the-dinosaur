'use client';

import { Book, IBook } from "types";
import type { Route } from 'next';
import dedication from "@docs/daisy_the_dinosaurs_day_away/dedication.txt";
import summary from "@docs/daisy_the_dinosaurs_day_away/summary.txt";
import { Divider } from "@mui/material";
import Image from "next/image";

const text = {
  "page-01": [
    "Daisy the dino was bright, bold, and green,",
    "The happiest dino you've ever seen."
  ]
}

export const daisysDayAway: Book = new Book();

const bookProps: IBook = {
    author: "Trey Morris",
    title: "Daisy the Dino's Day Away",
    summary,
    about: (
      <div className="grid grid-cols-1 grid-flow-row text-left place-content-center place-items-center justify-center my-auto">
        <div className="border-b border-gray-500 w-full" />
        {/* <div className="h-auto place-content-start place-items-start grid">
          <Image src="images/banners/daisy_day_away_cover_photo.png" fill style={{ objectFit: 'contain' }} alt="" className="place-self-start align-top mb-auto" />
        </div> */}
        <p className="text-center text-lg m-5">
          <b>Daisy the Dino's Day Away</b> is a heartwarming children's book about family, friendship, and courage.
        </p>
        <div className="border-b border-gray-500 w-full" />
        <ul className="m-5 place-content-center list-disc self-center">
          <li className="my-4"><b>Leaving Home:</b> Daisy, a happy green dinosaur, learns that she will need to spend some time away from her home.</li>
          <li className="my-4"><b>New Friends:</b> Daisy has to temporarily stay with friendly dinosaurs who share their toys and snacks with her. Even though she has fun, she still misses her family.</li>
          <li className="my-4"><b>Returning Home:</b> Meanwhile, Daisy's family is hard at work doing everyhting they can to get Daisy back home.</li>
          <li className="my-4"><b>The Message:</b> The story concludes with the comforting lesson that even when you have to spend time away from home, you are never alone and are always loved.</li>
        </ul>
        <Divider />
      </div>
    ),
    url: '/day-away',
    pages: [
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-01.png",
            isCover: true,
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-02.png",
        },
        // dedication page
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-03.png",
        },
        // {
        //   children: (
        //     <div className="m-4 text-lg">
        //       {dedication}
        //     </div>
        //   )
        // },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-04.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-05.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-06.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-07.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-08.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-09.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-10.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-11.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-12.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-13.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-14.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-15.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-16.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-17.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-18.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-19.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-20.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-21.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-22.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-23.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-24.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-25.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-26.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-27.png",
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-28.png",
            isBackCover: true,
        },
    ],
};

daisysDayAway.load(bookProps);
