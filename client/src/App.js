import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import PostDetails from './components/PostDetails/PostDetails';
import { getUserDataFromToken } from './utilities';

const App = () => {

  return (
    <BrowserRouter>
      <Container maxWidth='xl'>
        <Navbar />
        <Switch>
          <Route path='/' exact component={() => <Redirect to='/posts?page=1' />} />
          <Route path='/posts' exact component={Home} />
          <Route path='/posts/search' exact component={Home} />
          <Route path='/posts/:id' component={PostDetails} />
          <Route path='/auth' exact component={() => ((getUserDataFromToken()) ? <Redirect to='/posts?page=1' /> : <Auth /> )} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;
