import { AUTH, LOGOUT } from "../constants/actionTypes";

const reducer = (state = { authData: null }, action) => {
  switch(action.type) {
    case AUTH:
      localStorage.setItem('profile', action?.payload);
      return { ...state, authData: action?.payload };
    case LOGOUT:
      localStorage.removeItem('profile');
      return { ...state, authData: null };
    default:
      return state;
  }
};

export default reducer;
