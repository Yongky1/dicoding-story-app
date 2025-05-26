class NotificationManager {
  constructor() {
    this.notifications = [];
    this.unreadCount = 0;
  }

  init() {
    // Create notification dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'notification-dropdown';
    dropdown.id = 'notificationDropdown';
    document.querySelector('.app-bar__navigation').appendChild(dropdown);

    // Add click event to notification button
    const button = document.getElementById('notificationButton');
    if (!button) return; // Jangan error jika button tidak ada
    button.addEventListener('click', () => this.toggleDropdown());

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!button.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  }

  toggleDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
      this.renderNotifications();
    }
  }

  addNotification(notification) {
    this.notifications.unshift(notification);
    this.unreadCount++;
    this.updateBadge();
    this.renderNotifications();
  }

  markAsRead(index) {
    if (this.notifications[index] && !this.notifications[index].read) {
      this.notifications[index].read = true;
      this.unreadCount--;
      this.updateBadge();
      this.renderNotifications();
    }
  }

  updateBadge() {
    const badge = document.getElementById('notificationBadge');
    if (this.unreadCount > 0) {
      badge.textContent = this.unreadCount;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }

  renderNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (this.notifications.length === 0) {
      dropdown.innerHTML = `
        <div class="notification-empty">
          <i class="fas fa-bell-slash"></i>
          <p>No notifications yet</p>
        </div>
      `;
      return;
    }

    dropdown.innerHTML = this.notifications.map((notification, index) => `
      <div class="notification-item ${notification.read ? '' : 'unread'}" 
           onclick="window.notificationManager.markAsRead(${index})">
        <div class="notification-title">${notification.title}</div>
        <div class="notification-body">${notification.options.body}</div>
        <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
      </div>
    `).join('');
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) { // less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 86400000) { // less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

export default NotificationManager; 