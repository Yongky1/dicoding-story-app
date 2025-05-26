class NavigationView {
  constructor() {
    this.isLoggedIn = false;
  }

  setLoggedIn(status) {
    this.isLoggedIn = status;
  }

  render() {
    return `
      <nav class="navbar">
        <div class="navbar-menu">
          ${this.isLoggedIn ? `
            <button id="notificationButton" class="notification-button navbar-item" aria-label="Notifications">
              <i class="fas fa-bell"></i>
              <span class="notification-badge" id="notificationBadge" style="display: none;">0</span>
            </button>
            <a href="#/" class="navbar-item" id="home-button">
              <i class="fas fa-home"></i> Home
            </a>
            <a href="#/add-story" class="navbar-item">
              <i class="fas fa-plus"></i> Add Story
            </a>
            <button id="logout-button" class="navbar-item">
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          ` : `
            <a href="#/login" class="navbar-item">
              <i class="fas fa-sign-in-alt"></i> Login
            </a>
            <a href="#/register" class="navbar-item">
              <i class="fas fa-user-plus"></i> Register
            </a>
          `}
        </div>
      </nav>
    `;
  }

  bindLogout(handler) {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', handler);
    }
  }
}

export default NavigationView; 