"use client"

import React from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useUser } from "@/store";
import { auth } from "@/firebase";
import Link from 'next/link'
import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import FlatwareTwoToneIcon from '@mui/icons-material/FlatwareTwoTone';
import MenuIcon from '@mui/icons-material/Menu';

const pages = [
  {
    label: 'Перші Страви',
    link: '/category/pershi-stravy'
  },
  {
    label: 'Другі Страви',
    link: '/category/drugi-stravy'
  },
  {
    label: 'Салати та закуски',
    link: '/category/salaty-ta-zakusky'
  },
  {
    label: 'Випічка',
    link: '/category/vipechka'
  },
  {
    label: 'Торти',
    link: '/category/torty'
  },
  {
    label: 'Напої',
    link: '/category/napoi'
  }
];

const provider = new GoogleAuthProvider();

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{mb: 5}}>
      <Container
        maxWidth="xl"
      >
        <Toolbar disableGutters>
          <MobileLinkMenu/>
          <FlatwareTwoToneIcon
            fontSize="large"
            sx={{ color: "yellow", mr: 1 }}
          />
          <Typography
            variant="h6"
            // noWrap
            sx={{
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: {xs: 1, md: 0}
            }}
          >
            <Link href="/">NEXT-RECIPES</Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, my: 2 }}>
            {pages.map((page) => (
              <Link href={`${page.link}`} key={page.link}>
              <Button
                key={page.link}
                sx={{color: 'white', display: 'block', fontSize: 12 }}                
              >
                {page.label}
              </Button>
              </Link>
            ))}
          </Box>
          <LoginButton/>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const LoginButton: React.FC = () => {
  const [loginMenu, setLoginMenu] = React.useState<null | HTMLElement>(null);  
  const user = useUser(state => state.loggedUser);
  const login = useUser(state => state.login);
  const logout = useUser(state => state.logout);

  const onLogin = async() => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user.photoURL);
        login({id: user.uid, email: user.email, name: user.displayName, photoURL: user.photoURL})
    })  
  }
  const handleUserIconClick = (event: React.MouseEvent<HTMLElement>) => {
    if(user) {
      setLoginMenu(event.currentTarget);
    }
    else {
      onLogin();
    }
  }
  const handleCloseUserMenu = () => {
    setLoginMenu(null);
  };
  const handleLogout = () => {
    setLoginMenu(null);
    signOut(auth);
    logout();
  };
  return (
    <Box sx={{ flexGrow: 0 }}>
    <Tooltip title={user ? null : "Увійти"}>
      <IconButton onClick={handleUserIconClick} sx={{ p: 0 }}>
        <Avatar src={user?.photoURL ? user.photoURL : "#"}/>
      </IconButton>
    </Tooltip>
    <Menu
      sx={{ mt: '45px' }}
      id="menu-appbar"
      anchorEl={loginMenu}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(loginMenu)}
      onClose={handleCloseUserMenu}
    >
      <MenuItem onClick={handleLogout}>
        <Typography textAlign="center">Вийти</Typography>
      </MenuItem>
    </Menu>
  </Box>
  )
}

const MobileLinkMenu: React.FC = () => {
  const [linkMenu, setLinkMenu] = React.useState<null | HTMLElement>(null);  

  const handleUserIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setLinkMenu(event.currentTarget); 
  }
  const handleCloseUserMenu = () => {
    setLinkMenu(null);
  };

  return (
    <Box sx={{ flexGrow: 1, display: {xs: "flex", md: "none"} }}>
    <Tooltip title="Навігація">
      <IconButton
        onClick={handleUserIconClick}
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
      >
      <MenuIcon />
      </IconButton>
    </Tooltip>
    <Menu
      sx={{ mt: '45px' }}
      id="menu-appbar"
      anchorEl={linkMenu}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(linkMenu)}
      onClose={handleCloseUserMenu}
    >
      {pages.map((page) => (
        <Link href={page.link} key={page.link}>
        <MenuItem onClick={handleCloseUserMenu}>
            <Typography textAlign="center">{page.label}</Typography>
        </MenuItem>
        </Link>
      ))}
    </Menu>
  </Box>
  )
}

export default Header;