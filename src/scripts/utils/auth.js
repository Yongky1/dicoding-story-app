import { unsubscribePushNotification } from './pushNotification';

const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };
  
  const updateNavigation = () => {
    const isLoggedIn = checkAuth();
    
    const loginMenu = document.getElementById('loginMenu');
    const registerMenu = document.getElementById('registerMenu');
    const logoutMenu = document.getElementById('logoutMenu');
    const addStoryLink = document.querySelector('a[href="#/add-story"]');
    
    if (isLoggedIn) {
      loginMenu.style.display = 'none';
      registerMenu.style.display = 'none';
      logoutMenu.style.display = 'block';
      if (addStoryLink) addStoryLink.style.display = 'block';
    } else {
      loginMenu.style.display = 'block';
      registerMenu.style.display = 'block';
      logoutMenu.style.display = 'none';
      if (addStoryLink) addStoryLink.style.display = 'none';
    }
  };
  
  const logout = async () => {
    try {
      await unsubscribePushNotification();
    } catch (error) {
      console.error('Failed to unsubscribe push notification:', error);
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    window.dispatchEvent(new Event('auth-change'));
    window.location.hash = '/';
  };
  
  export { checkAuth, updateNavigation, logout };