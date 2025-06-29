// Performance Optimization Module

class PerformanceOptimizer {
    constructor(container, itemHeight = 80) {
      this.container = container;
      this.itemHeight = itemHeight;
      this.visibleItems = Math.ceil(container.clientHeight / itemHeight) + 2;
      this.scrollTop = 0;
      this.items = [];
      this.virtualItems = [];
    }
  
    // Virtual scrolling for large message lists
    setupVirtualScrolling(messages) {
      this.items = messages;
      this.container.addEventListener('scroll', this.handleScroll.bind(this));
      this.renderVisibleItems();
    }
  
    handleScroll() {
      this.scrollTop = this.container.scrollTop;
      this.renderVisibleItems();
    }
  
    renderVisibleItems() {
      const startIndex = Math.floor(this.scrollTop / this.itemHeight);
      const endIndex = Math.min(startIndex + this.visibleItems, this.items.length);
      
      // Clear container
      this.container.innerHTML = '';
      
      // Add spacer for items above
      if (startIndex > 0) {
        const spacer = document.createElement('div');
        spacer.style.height = `${startIndex * this.itemHeight}px`;
        this.container.appendChild(spacer);
      }
      
      // Render visible items
      for (let i = startIndex; i < endIndex; i++) {
        if (this.items[i]) {
          this.renderItem(this.items[i]);
        }
      }
      
      // Add spacer for items below
      const remainingItems = this.items.length - endIndex;
      if (remainingItems > 0) {
        const spacer = document.createElement('div');
        spacer.style.height = `${remainingItems * this.itemHeight}px`;
        this.container.appendChild(spacer);
      }
    }
  
    renderItem(item) {
      // This will be overridden by the main app
      const wrapper = document.createElement("div");
      wrapper.style.height = `${this.itemHeight}px`;
      wrapper.textContent = `Item ${item.id}`;
      this.container.appendChild(wrapper);
    }
  
    // Debounce function for performance
    static debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  
    // Throttle function for scroll events
    static throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
  }
  
  // Export for use in other modules
  window.PerformanceOptimizer = PerformanceOptimizer; 