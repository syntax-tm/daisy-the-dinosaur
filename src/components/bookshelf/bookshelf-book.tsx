import { IBook } from "@/types";
import { Route } from "next";
import Image from "next/image";

export interface BookshelfBookProps {
  image: string,
  alt?: string,
  isReleased: boolean,
  url: Route,
  book?: IBook,
}

export function BookshelfBook(props: BookshelfBookProps) {
  return (
    <div className="book relative">
      <div className="book-inside"></div>
      <Image className="book-cover" src={props.image} alt={props.alt ?? ''} fill style={{ aspectRatio: '2/3', objectFit: 'contain', borderRadius: '3px 0.5px 0.5px 3px' }} />
    </div>
  )
}

export { BookshelfBook as default };
