import { Box, Card, Container, Icon } from "@mui/material";
import Image from "next/image";
import { useRef, useState } from "react";
import { delay } from "types";
import "./book-image.css";

export interface BookImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export function BookImage( { src, alt, className }: BookImageProps ) {
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement | null>(null);

  return (
    <div className={`${className ? className : ''}`}>
      {/* Custom Skeleton UI */}
      {/* {isLoading && (
        <div className="place-items-center place-content-center place-self-center h-full">
          <span className="loader place-self-center justify-self-center"></span>
        </div>
      )} */}
      {
        <Image
          ref={imageRef}
          src={src} fill alt={alt ?? ''}
          loading='eager'
          className={`aspect-2/3 object-scale-down duration-300 ease-in-out z-10 ${
            isLoading ? 'scale-95 blur-sm opacity-0' : 'scale-100 blur-0 opacity-100'
          }`}
          onLoad={async () => setIsLoading(false)} // removes the skeleton when downloaded
        />
      }
    </div>
  )
}

export { BookImage as default };
