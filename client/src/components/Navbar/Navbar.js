import React, { useState, useEffect } from 'react';
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { googleLogout } from '@react-oauth/google';

import memoriesLogo from '../../images/memoriesLogo.png';
import memoriesText from '../../images/memoriesText.png';
import useStyles from './styles';
import { LOGOUT } from '../../constants/actionTypes';
import { getUserDataFromToken } from '../../utilities';

const Navbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserDataFromToken());
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      const userData = getUserDataFromToken();
      if ((userData?.exp * 1000) < (new Date().getTime())) {
        logout();
      }
    }, 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    googleLogout();
    setUser(null);
    dispatch({ type: LOGOUT });
    history.push('/');
  };

  return (
    <AppBar className={classes.appBar} position='static' color='inherit'>
      <Link to='/' className={classes.brandContainer}>
        <img src={memoriesText} alt='icon' height='45px' />
        <img className={classes.image} src={memoriesLogo} alt="memories_logo" height='40px' />
      </Link>
      <Toolbar className={classes.toolbar}>
        { user ? (
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt={user.name} src={user.imageUrl}>
              {user.name.charAt(0)}
            </Avatar>
            <Typography className={classes.userName} variant="h6">
              { user.name }
            </Typography>
            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : ((location.pathname === '/auth') ? null : (<Button component={Link} to="/auth" variant="contained" color="primary">
            Sign In
          </Button>)) }
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
