
import React from 'react';
import './Header.scss';
import { alpha, Avatar, InputBase, ListItemIcon, Menu, MenuItem, styled, Typography } from '@mui/material';
import { Language as LanguageIcon, NotificationsNone, HelpOutline } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Search as SearchIcon, AccountBox as AccountBoxIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { loginOut } from '@/store/user/userSlice';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


export default function Header(props: {
  hasNotice?: boolean;
}) {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

  const user = useAppSelector(state => state.user)

  const handleLogout = () => {
    dispatch(loginOut())
    navigate('/signin')
  }

  return (
    <>
      <div className="header">
        <div className="header-logo">
          <img width={40} src={process.env.PUBLIC_URL + '/img/logo.png'} />
          Gradual Community
        </div>
        <div className="header-actions">

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          <LanguageIcon />
          <span>
            UTC-
            {
              `${new Date().getHours()}:${new Date().getMinutes()}`
            }
          </span>
          <span>
            {
              Intl.DateTimeFormat().resolvedOptions().timeZone
            }
          </span>
          <NotificationsNone />
          <HelpOutline />
          <Avatar onClick={handleOpenUserMenu} variant={'circular'} src={user.avatar} />
        </div>
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
          <MenuItem>
            <ListItemIcon>
              <AccountBoxIcon fontSize="small" />
            </ListItemIcon>
            <Typography textAlign="center">{user.username}</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <Typography textAlign="center">Login Out</Typography>
          </MenuItem>
        </Menu>
      </div>
    </>
  )
}