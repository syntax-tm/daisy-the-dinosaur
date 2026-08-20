'use client';

//import PdfViewer from "@/components/pdf-viewer/pdf-viewer";
import Image from "next/image";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('@/components/pdf-viewer/pdf-viewer'), {
  ssr: false,
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="home absolute left-0 top-0 h-full w-full">
        <div className="">
          <PdfViewer file="docs/Daisy the Dino's Day Away v1.0-a.pdf" />
        </div>
      </div>
    </ThemeProvider>
  );
}
