import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App';
import reducers from './reducers';

import './index.css';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

ReactDOM.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH2_CLIENT_ID}>
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>,
  document.getElementById('root')
);
