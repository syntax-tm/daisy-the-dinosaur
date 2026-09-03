'use client';

//import PdfViewer from "@/components/pdf-viewer/pdf-viewer";
import Image from "next/image";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useRouter } from "next/navigation";
import React, { useEffect, ReactNode } from "react";
import { AppBar, BottomNavigation, BottomNavigationAction, Card, CardContent, CardHeader, CardMedia, Container, Grid, IconButton, List, ListItem, Paper, Stack, Toolbar, Typography, Icon, Box, Button } from "@mui/material";
import { Restore, Favorite as FavoriteIcon, LocationOn, HomeFilled as HomeFilledIcon, Home as HomeIcon, Menu as MenuIcon  } from '@mui/icons-material';
import * as icons from '@mui/icons-material';
import { BookshelfBookProps } from "@/components/bookshelf/bookshelf-book";
import Bookshelf, { BookshelfProps } from "@/components/bookshelf/bookshelf";
import { chunkArray } from "@/types";
import Link from "next/link";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export interface MenuItem {
  title: string,
  link: string,
  isEnabled: boolean,
  icon?: ReactNode,
}

export default function HomePage() {

  const router = useRouter();
  const [value, setValue] = React.useState(0);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const menuItems: MenuItem[] = [
    {
      title: "Daisy the Dino's Day Away",
      link: '/book',
      isEnabled: true,
      icon: <Icon component={icons.Book} />,
    }
  ]

  const books: BookshelfBookProps[] = [
    {
      image: 'docs/daisy_the_dinosaurs_day_away/page-01.png',
      alt: "Daisy the Dino's Day Away",
      isReleased: true,
    },
    {
      image: 'docs/daisy_the_dinosaurs_first_day/cover.png',
      alt: "Daisy the Dino's First Day",
      isReleased: false,
    },
    {
      image: 'docs/daisy_the_dino_big_splash/cover.png',
      alt: "Daisy the Dino's Big Splash",
      isReleased: false,
    },
    {
      image: 'docs/daisy_the_dinosaur_finds_her_balance/cover.png',
      alt: "Daisy the Dino Finds Her Balance",
      isReleased: false,
    },
  ];

  const releasedBooks = books.filter(b => b.isReleased);
  const unreleasedBooks = books.filter(b => !b.isReleased);

  //const bookshelves: BookshelfBookProps[][] = chunkArray(books, 2);

  useEffect(() => {
    //router.replace('/book');
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
    </ThemeProvider>
  );
}
