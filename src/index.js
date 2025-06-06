import './styles/main.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: './images/marker-icon.png',
  iconRetinaUrl: './images/marker-icon-2x.png',
  shadowUrl: './images/marker-shadow.png',
});

import App from './scripts/app';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();

  // Accessibility: Skip to content logic
  const mainContent = document.querySelector('#main-content');
  const skipLink = document.querySelector('.skip-link');
  if (mainContent && skipLink) {
    skipLink.addEventListener('click', function (event) {
      event.preventDefault();
      skipLink.blur();
      mainContent.setAttribute('tabindex', '-1'); // Ensure focusable
      mainContent.focus();
      mainContent.scrollIntoView();
      setTimeout(() => mainContent.removeAttribute('tabindex'), 1000); // Clean up
    });
  }

  // Unregister service worker otomatis di development
  if ('serviceWorker' in navigator) {
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
  }
});