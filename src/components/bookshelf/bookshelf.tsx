import Image from 'next/image';
import { BookshelfBook, BookshelfBookProps } from './bookshelf-book';
import './bookshelf.scss';
import { ImageList, Stack, Divider, Card, Button, Paper, List } from '@mui/material';

export interface BookshelfProps {
  books: BookshelfBookProps[]
}

export function Bookshelf(props: BookshelfProps) {
  return (
    <div className="shelf flex flex-col p-4">
      <Stack useFlexGap className="overflow-y-scroll p-2">
        <List>
          {
            props.books && props.books.map((book, index) => {
              return (
                <div key={index} className="grid aspect-2/3 m-2">
                  <Image className="book-cover" src={book.image} alt={book.alt ?? ''} fill style={{ aspectRatio: '2/3', objectFit: 'contain' }} />
                </div>
              )
            })
          }
        </List>
      </Stack>
    </div>
  )
}

export { Bookshelf as default };
