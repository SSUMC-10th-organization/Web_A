export const authStorage = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  
  setIsLoggedIn: (status: boolean) => localStorage.setItem('isLoggedIn', String(status)),
  getIsLoggedIn: () => localStorage.getItem('isLoggedIn') === 'true',
  
  setUserInfo: (userInfo: any) => localStorage.setItem('user_info', JSON.stringify(userInfo)),
  getUserInfo: () => {
    try {
      return JSON.parse(localStorage.getItem('user_info') || '{}');
    } catch {
      return {};
    }
  },
  
  clearAll: () => {
    localStorage.clear();
  },
  
  removeRedirect: () => localStorage.removeItem('redirectAfterLogin'),
};