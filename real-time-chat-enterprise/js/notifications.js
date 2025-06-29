// Notification System for better UX

class NotificationSystem {
    constructor() {
      this.container = this.createContainer();
    }
  
    createContainer() {
      const container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'fixed top-4 right-4 z-50 space-y-2';
      document.body.appendChild(container);
      return container;
    }
  
    show(type, message, duration = 5000) {
      const notification = document.createElement('div');
      notification.className = `p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
      
      const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-black',
        info: 'bg-blue-500 text-white'
      };
      
      notification.className += ` ${colors[type] || colors.info}`;
      notification.textContent = message;
      
      this.container.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      // Auto remove
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, duration);
    }
  
    // Static method for quick notifications
    static show(type, message, duration = 5000) {
      if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
      }
      window.notificationSystem.show(type, message, duration);
    }
  }
  
  // Export for use in other modules
  window.NotificationSystem = NotificationSystem; 