import { combineReducers } from "redux";

import postsData from './posts';
import auth from './auth';

export default combineReducers({ postsData: postsData, auth: auth });
