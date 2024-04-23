"use client"

import React from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useUser } from "@/store";
import { auth } from "@/firebase";
import Link from 'next/link'
import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import FlatwareTwoToneIcon from '@mui/icons-material/FlatwareTwoTone';

const pages = [
  {
    label: 'Перші Страви',
    link: '/pershi-stravy'
  },
  {
    label: 'Другі Страви',
    link: '/drugi-stravy'
  },
  {
    label: 'Салати та закуски',
    link: '/salaty-ta-zakusky'
  },
  {
    label: 'Випічка',
    link: '/vipechka'
  },
  {
    label: 'Торти',
    link: '/torty'
  },
  {
    label: 'Напої',
    link: '/napoi'
  }
];

const provider = new GoogleAuthProvider();

const Header: React.FC = () => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);  
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
      setAnchorElUser(event.currentTarget);
    }
    else {
      onLogin();
    }
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = () => {
    setAnchorElUser(null);
    signOut(auth);
    logout();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <FlatwareTwoToneIcon fontSize="large" sx={{ color: "yellow", mr: 1 }}/>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link href="/">NEXT-RECIPES</Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.link}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <Link href={page.link}>{page.label}</Link>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={user ? null : "Увійти"}>
              <IconButton onClick={handleUserIconClick} sx={{ p: 0 }}>
                <Avatar src={user?.photoURL ? user.photoURL : "#"}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Вийти</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;