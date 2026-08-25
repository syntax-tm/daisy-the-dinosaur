export interface BookPage {
  src: string;
  index?: number;
  isCover?: boolean;
  isBackCover?: boolean;
  isHidden?: boolean;
}

export interface Book {
  title?: string;
  author?: string;
  pages: BookPage[];
  pageCount?: number;
}
