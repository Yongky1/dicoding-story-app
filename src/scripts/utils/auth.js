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
    console.log('[Logout] Token sebelum logout:', token);
    
    // Clear localStorage first
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('[Logout] Token dan user dihapus dari localStorage');

    if (token) {
        try {
            await unsubscribePushNotification(token);
            console.log('[Logout] Unsubscribe push notification sukses');
        } catch (error) {
            console.error('[Logout] Failed to unsubscribe push notification:', error);
        }
    }

    // Dispatch auth-change event
    window.dispatchEvent(new Event('auth-change'));
    console.log('[Logout] Event auth-change dipanggil');

    // Force navigation to login page
    window.location.replace('#/login');
    console.log('[Logout] Hash diubah ke /login');
};

export { checkAuth, updateNavigation, logout };