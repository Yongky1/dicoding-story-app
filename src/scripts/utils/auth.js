import { unsubscribePushNotification } from './pushNotification';

const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

// updateNavigation sudah tidak diperlukan karena navbar dihandle oleh NavigationView
const updateNavigation = () => {
  // Kosong, tidak melakukan apa-apa
};

const logout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await unsubscribePushNotification(token);
      } catch (error) {
        console.error('Failed to unsubscribe push notification:', error);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    window.location.hash = '/';
};

export { checkAuth, updateNavigation, logout };