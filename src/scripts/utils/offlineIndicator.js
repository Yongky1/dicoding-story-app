class OfflineIndicator {
  constructor() {
    this.indicator = null;
    this.init();
  }

  init() {
    // Create indicator element
    this.indicator = document.createElement('div');
    this.indicator.className = 'offline-indicator hidden';
    this.indicator.innerHTML = `
      <div class="offline-message">
        <i class="fas fa-wifi-slash"></i>
        <span>You are offline</span>
      </div>
    `;
    document.body.appendChild(this.indicator);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .offline-indicator {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #f44336;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 1000;
        transition: transform 0.3s ease-in-out;
      }
      .offline-indicator.hidden {
        transform: translate(-50%, 100px);
      }
      .offline-message {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `;
    document.head.appendChild(style);

    // Add event listeners
    window.addEventListener('online', () => this.updateStatus());
    window.addEventListener('offline', () => this.updateStatus());
  }

  updateStatus() {
    if (!navigator.onLine) {
      this.indicator.classList.remove('hidden');
    } else {
      this.indicator.classList.add('hidden');
    }
  }
}

export default new OfflineIndicator(); 