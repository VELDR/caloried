import { jwtDecode } from 'jwt-decode';

export const isRoleMatch = (token, role) => {
  try {
    const decoded = jwtDecode(token);
    return decoded?.role === role;
  } catch (error) {
    return false;
  }
};
