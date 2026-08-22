import { Box, Card, Container, Icon } from "@mui/material";
import Image from "next/image";
import { useRef, useState } from "react";
import "./book-image.css";
import { delay } from "@/types";

export interface BookImageProps {
  image: string;
  width: number;
  height: number;
  alt?: string;
}

export function BookImage( { image, width, height, alt }: BookImageProps ) {
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement | null>(null);

  return (
    <div className="flex place-content-center justify-items-center place-items-center relative h-full w-full">
      {/* Custom Skeleton UI */}
      {isLoading && (
        <div className="place-items-center place-content-center place-self-center h-full">
          <span className="loader place-self-center justify-self-center"></span>
        </div>
      )}
      {
        <Image
          ref={imageRef}
          src={image} fill alt={alt ?? ''}
          className={`aspect-2/3 object-scale-down duration-300 ease-in-out ${
            isLoading ? 'scale-95 blur-sm opacity-0' : 'scale-100 blur-0 opacity-100'
          }`}
          onLoad={async () => setIsLoading(false)} // removes the skeleton when downloaded
        />
      }
    </div>
  )
}

export { BookImage as default };
