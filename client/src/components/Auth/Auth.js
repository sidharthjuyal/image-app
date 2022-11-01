import React, { useState, useMemo, useEffect } from 'react';
import { Avatar, Button, Container, Grid, Paper, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import useStyles from './styles';
import Input from './Input';
import { AUTH } from '../../constants/actionTypes';
import { signIn, signUp } from '../../actions/auth';
import { isPasswordMatch, isValidEmail, isValidPassword, isValidTextValue } from '../../utilities';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Auth = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    document.title = 'Memories - Authentication';
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSignup) {
      dispatch(signUp(formData, history));
    }
    else {
      dispatch(signIn(formData, history));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(current => ({
      ...current,
      [name]: value,
    }));
  };

  const handleShowPassword = () => {
    setShowPassword(current => !current);
  };

  const switchMode = () => {
    setIsSignup(current => !current);
    setShowPassword(false);
  };
  
  const googleLoginSuccess = async ({ credential }) => {
    try {
      dispatch({ type: AUTH, payload: credential });
      history.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  const googleLoginError = (error) => {
    console.error("Google Sign In was not successful. Try again later. Details: ", error);
  };

  const isSubmitButtonEnabled = useMemo(() => {
    if (isSignup) {
      return isValidTextValue(formData.firstName) && isValidTextValue(formData.lastName) && isValidEmail(formData.email) && isValidPassword(formData.password) && isPasswordMatch(formData.password, formData.confirmPassword);
    }
    else {
      return isValidEmail(formData.email) && isValidPassword(formData.password);
    }
  }, [formData.confirmPassword, formData.email, formData.firstName, formData.lastName, formData.password, isSignup]);

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">
          { isSignup ? 'Sign Up' : 'Sign In' }
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {
              isSignup && (<>
                  <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                  <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                </>)
            }
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={ showPassword ? "text" : "password" } handleShowPassword={handleShowPassword} helperText={'At least 8 characters'} />
            { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" helperText={'Should match password'} /> }
          </Grid>
          <Button type="submit" fullWidth variant='contained' color="primary" className={classes.submit} disabled={!isSubmitButtonEnabled}>
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
          {!isSignup && <Grid container justifyContent='center' alignItems='center' style={{ marginBottom: '0.5rem' }}>
            <GoogleLogin
              onSuccess={googleLoginSuccess}
              onError={googleLoginError}
              useOneTap
            />
          </Grid>}
          <Grid container justifyContent='center'>
            <Grid item>
              <Button onClick={switchMode}>
                { isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up" }
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
