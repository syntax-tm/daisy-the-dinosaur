import { ReactNode } from "react";
import type { Route } from 'next';

export interface IBookPage {
  src?: string;
  index?: number;
  isCover?: boolean;
  isBackCover?: boolean;
  isHidden?: boolean;
  children?: ReactNode;
  isLeft?: boolean;
  isRight?: boolean;
}

export interface IBook {
  title?: string;
  author?: string;
  pages: IBookPage[];
  pageCount?: number;
  url?: Route;
  summary?: React.ReactNode;
}

export class Book implements IBook {

  private _pages: IBookPage[];
  title?: string;
  author?: string;
  url?: Route;
  summary?: React.ReactNode;

  constructor (title?: string, author?: string, pages?: IBookPage[], url?: Route, summary?: React.ReactNode) {
    this.title = title;
    this.author = author;
    this._pages = pages ?? [];
    this.url = url;
    this.summary = summary;
  }

  static Create(props: IBook) {
    const book = new Book();
    book.load(props);
    return book;
  }

  get pageCount() {
    return this._pages.length;
  }

  get pages() {
    return this._pages;
  }

  set pages(value: IBookPage[]) {
    this._pages = value;

    this.refresh();
  }

  refresh() {
    this.pages.forEach((p, index) => {
      p.index = index;
    });
  }

  load(book: IBook) {
    this.title = book.title;
    this.author = book.author;
    this.pages = book.pages;
  }
}
