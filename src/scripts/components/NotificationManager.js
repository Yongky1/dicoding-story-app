class NotificationManager {
  constructor() {
    this.notifications = [];
    this.unreadCount = 0;
    this.init();
  }

  init() {
    // Create notification button and dropdown if they don't exist
    if (!document.getElementById('notificationButton')) {
      const nav = document.querySelector('.app-bar__navigation ul');
      if (nav) {
        const notificationContainer = document.createElement('li');
        notificationContainer.innerHTML = `
          <button id="notificationButton" class="notification-button">
            <i class="fas fa-bell"></i>
            <span id="notificationBadge" class="notification-badge" style="display: none">0</span>
          </button>
          <div id="notificationDropdown" class="notification-dropdown"></div>
        `;
        nav.appendChild(notificationContainer);

        // Add click event for notification button
        const button = document.getElementById('notificationButton');
        const dropdown = document.getElementById('notificationDropdown');
        
        button.addEventListener('click', () => {
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
          if (!button.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
          }
        });
      }
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
    if (badge) {
      if (this.unreadCount > 0) {
        badge.textContent = this.unreadCount;
        badge.style.display = 'block';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Less than 1 minute
    if (diff < 60000) {
      return 'Just now';
    }
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    // Otherwise show date
    return date.toLocaleDateString();
  }

  renderNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;

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
}

export default NotificationManager; 