// Service Worker Registration & Sync Helper

class ServiceWorkerHelper {
    static async registerServiceWorker() {
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.register('/service-worker.js');
          console.log("✅ Service Worker registered:", reg);
        } catch (err) {
          console.error("❌ Service Worker registration failed:", err);
        }
      } else {
        console.warn("Service Worker not supported in this browser.");
      }
    }
  
    static async syncOfflineQueue() {
      if (!navigator.onLine) {
        console.log("Offline — deferring queue sync.");
        return;
      }
      try {
        await appState.loadQueue();
        while (appState.state.queue.length > 0) {
          const message = appState.state.queue[0];
          console.log("Syncing queued message:", message);
          try {
            await appState.addMessage(message);
            await appState.removeFromQueue();
          } catch (err) {
            console.error("Failed to sync message from queue:", err);
            // Optionally break or continue; here we continue to try next message
            await appState.removeFromQueue();
          }
        }
        console.log("✅ Offline queue fully synced.");
        if (window.NotificationSystem) {
          NotificationSystem.show('success', 'Offline messages synced successfully!');
        }
      } catch (err) {
        console.error('Failed to sync offline queue:', err);
        if (window.NotificationSystem) {
          NotificationSystem.show('error', 'Failed to sync offline messages');
        }
      }
    }
  }
  
  // Automatically register service worker at startup
  window.addEventListener('load', () => {
    ServiceWorkerHelper.registerServiceWorker();
  });
  