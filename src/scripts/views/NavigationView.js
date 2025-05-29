class NavigationView {
  constructor() {
    this.isLoggedIn = false;
    this.logoutHandler = null;
  }

  setLoggedIn(status) {
    this.isLoggedIn = status;
  }

  render() {
    return `
      <nav class="navbar">
        <div class="navbar-menu">
          ${this.isLoggedIn ? `
            <button id="subscribePushButton" class="notification-button navbar-item" aria-label="Subscribe Notifikasi">
              <i class="fas fa-bell"></i> Subscribe Notifikasi
            </button>
            <a href="#/" class="navbar-item" id="home-button">
              <i class="fas fa-home"></i> Home
            </a>
            <a href="#/add-story" class="navbar-item">
              <i class="fas fa-plus"></i> Add Story
            </a>
            <a href="#/saved-stories" class="navbar-item">
              <i class="fas fa-save"></i> Saved Stories
            </a>
            <button id="logout-button" class="navbar-item" type="button">
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
    // Remove existing event listener if any
    this.destroy();

    // Store the new handler
    this.logoutHandler = handler;

    // Add new event listener
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.logoutHandler(e);
      });
    } else {
      console.warn('Logout button not found!');
    }
  }

  destroy() {
    // Cleanup event listeners
    if (this.logoutHandler) {
      const logoutButton = document.getElementById('logout-button');
      if (logoutButton) {
        logoutButton.removeEventListener('click', this.logoutHandler);
      }
      this.logoutHandler = null;
    }
  }
}

export default NavigationView; 