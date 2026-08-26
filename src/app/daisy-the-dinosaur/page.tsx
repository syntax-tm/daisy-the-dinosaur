'use client';

import { daisysDayAway } from "@/config/daisys-day-away";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import dynamic from "next/dynamic";

const BookView = dynamic(() => import('@/components/book/book'), {
  ssr: false,
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Page() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="home absolute left-0 top-0 h-full w-full">
        <div className="">
          <BookView pages={daisysDayAway.pages} />
        </div>
      </div>
    </ThemeProvider>
  );
}
