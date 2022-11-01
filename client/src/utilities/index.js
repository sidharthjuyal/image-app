import jwt_decode from 'jwt-decode';

export const isValidTextValue = (text) => {
  return text.trim().length > 0;
};

export const isValidEmail = (email) => {
  return isValidTextValue(email) && (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email));
};

export const isValidPassword = (password) => {
  return password.trim().length > 7;
};

export const isPasswordMatch = (password, confirmPassword) => {
  return password.trim() === confirmPassword.trim();
};

export const getUserDataFromToken = () => {
  const jwtToken = localStorage.getItem('profile');
  if (jwtToken) {
    const tokenData = jwt_decode(jwtToken);
    return {
      name: tokenData?.name,
      imageUrl: tokenData?.picture,
      email: tokenData?.email,
      id: tokenData?.id ?? tokenData?.sub,
      exp: tokenData?.exp,
    };
  }
  return null;
};
