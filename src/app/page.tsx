'use client';

//import PdfViewer from "@/components/pdf-viewer/pdf-viewer";
import Image from "next/image";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('@/components/book/book'), {
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
          <PdfViewer file="https://raw.githubusercontent.com/syntax-tm/daisy-the-dinosaur/3182c0723dc1f54ef7c7468d8d3eb4a6263dfde9/public/docs/Daisy%20the%20Dino's%20Day%20Away%20v1.0-a.pdf" />
        </div>
      </div>
    </ThemeProvider>
  );
}
