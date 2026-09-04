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
      link: '/day-away',
      isEnabled: true,
      icon: <Icon component={icons.Book} />,
    },
    {
      title: "Daisy the Dino's First Day",
      link: '/first-day',
      isEnabled: false,
      icon: <Icon component={icons.Book} />,
    }
  ]

  const books: BookshelfBookProps[] = [
    {
      image: 'docs/daisy_the_dinosaurs_day_away/cover.png',
      alt: "Daisy the Dino's Day Away",
      isReleased: true,
      url: '/day-away',
    },
    {
      image: 'docs/daisy_the_dinosaurs_first_day/cover.png',
      alt: "Daisy the Dino's First Day",
      isReleased: false,
      url: '/first-day',
    },
    {
      image: 'docs/daisy_the_dino_big_splash/cover.png',
      alt: "Daisy the Dino's Big Splash",
      isReleased: false,
      url: '/big-splash',
    },
    {
      image: 'docs/daisy_the_dinosaur_finds_her_balance/cover.png',
      alt: "Daisy the Dino Finds Her Balance",
      isReleased: false,
      url: '/finds-her-balance',
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
      <div className="home absolute left-0 top-0 h-full w-full">
        <div className="flex flex-col">
          <AppBar position="static">
            <Toolbar disableGutters>
              <IconButton>
                <MenuIcon />
              </IconButton>
              <Typography variant="h5" align="center" noWrap component="a" href="#app-bar-menu" className="">
                Home
              </Typography>
            </Toolbar>
          </AppBar>
          <div className="section mx-5 p-2 overflow-y-auto">
            <div className="m-2">
              <h2 className="text-5xl relative flex flex-row text-green-400 cursor-default select-none">
                <img src={'images/daisy.png'} alt="" className="mr-4" style={{ height: '1em', width: '1em', scale: 1.2, objectFit: 'contain', aspectRatio: '1/1' }} />
                <span>Daisy the Dinosaur</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-content-between justify-items-center-safe gap-4 py-4 my-4">
              {
                books && books.map((b, index) => {
                  return (
                    <Link key={index} className="grow relative border-gray-300 aspect-2/3 min-w-auto w-3xl max-w-[90%] grid" href={b.url}>
                      <Image src={b.image} alt={b.alt ?? ''} fill style={{ objectFit: 'contain' }} className={`${b.isReleased ? '' : 'coming-soon'} border border-gray-300`} />
                    </Link>
                  )})
              }
            </div>
          </div>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            sx={{ position: 'fixed', bottom: 0, left: 0, width: '100vw', bgcolor: '#1d1d1d' }}
          >
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction label="Book" icon={<icons.Book />} />
            <BottomNavigationAction label="About" icon={<icons.Info />} />
            <BottomNavigationAction label="Nearby" icon={<icons.Help />} />
          </BottomNavigation>
        </div>
      </div>
    </ThemeProvider>
  );
}
