'use client';

//import PdfViewer from "@/components/pdf-viewer/pdf-viewer";
import Image from "next/image";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { daisysDayAway } from "@/config/daisys-day-away";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const BookView = dynamic(() => import('@/components/book/book'), {
  ssr: false,
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    router.replace('/book');
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="home absolute left-0 top-0 h-full w-full">
        
      </div>
    </ThemeProvider>
  );
}
