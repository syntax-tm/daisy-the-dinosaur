'use client';

import { Book, IBook } from "types";
import dedication from "@docs/daisy_the_dinosaurs_day_away/dedication.txt";

export const daisysDayAway: Book = new Book();

const bookProps: IBook = {
    author: "Trey Morris",
    title: "Daisy the Dino's Day Away",
    pages: [
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-01.png",
            isCover: true,
        },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\copyright-page.png",
        },
        // dedication page
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\dedication.png",
        },
        // {
        //   children: (
        //     <div className="m-4 text-lg">
        //       {dedication}
        //     </div>
        //   )
        // },
        {
            src: "docs\\daisy_the_dinosaurs_day_away\\page-03.png",
        },
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
            isBackCover: true,
        },
    ],
};

daisysDayAway.load(bookProps);
