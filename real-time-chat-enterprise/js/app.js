// Main App Controller — Fully Enterprise Level

class ChatApp {
    constructor() {
      this.chatContainer = document.getElementById("chatContainer");
      this.chatForm = document.getElementById("chatForm");
      this.messageInput = document.getElementById("messageInput");
      this.fileInput = document.getElementById("fileInput");
      this.fileBtn = document.getElementById("fileBtn");
      this.voiceBtn = document.getElementById("voiceBtn");
      this.themeToggle = document.getElementById("themeToggle");
      this.exportBtn = document.getElementById("exportChat");
      this.typingIndicator = document.getElementById("typingIndicator");
      this.welcomeMessage = document.getElementById("welcomeMessage");
      
      // New UI components
      this.settingsBtn = document.getElementById("settingsBtn");
      this.settingsModal = document.getElementById("settingsModal");
      this.closeSettings = document.getElementById("closeSettings");
      this.themeSelect = document.getElementById("themeSelect");
      this.soundToggle = document.getElementById("soundToggle");
      this.autoScrollToggle = document.getElementById("autoScrollToggle");
      this.emojiBtn = document.getElementById("emojiBtn");
      this.emojiPicker = document.getElementById("emojiPicker");
  
      this.chatbot = new ChatBot();
      this.speechAPI = new SpeechRecognitionAPI(this.handleSpeechResult.bind(this));
      this.notificationSystem = new NotificationSystem();
  
      appState.subscribe(this.render.bind(this));
      this.speechAPI.init();
      
      // Settings
      this.settings = {
        soundEnabled: true,
        autoScroll: true
      };
    }
  
    async init() {
      try {
        await appState.initialize();
        await ServiceWorkerHelper.syncOfflineQueue();
        this.attachListeners();
        
        // Apply theme after initialization
        const currentTheme = appState.state.theme || 'light';
        console.log('Initializing with theme:', currentTheme);
        this.applyTheme(currentTheme);
        
        this.loadSettings();
        this.hideWelcomeMessage();
      } catch (err) {
        console.error('Failed to initialize app:', err);
      }
    }
  
    attachListeners() {
      if (!this.chatForm) console.warn('chatForm not found in DOM');
      else this.chatForm.addEventListener("submit", e => {
        e.preventDefault();
        const text = this.messageInput.value.trim();
        if (text) {
          this.handleUserMessage({ type: 'text', content: text });
          this.messageInput.value = '';
        }
      });
  
      if (!this.fileBtn) console.warn('fileBtn not found in DOM');
      else this.fileBtn.addEventListener("click", () => this.fileInput.click());
  
      if (!this.fileInput) console.warn('fileInput not found in DOM');
      else this.fileInput.addEventListener("change", e => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            console.warn('File size too large. Please select a smaller image.');
            this.fileInput.value = '';
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            this.handleUserMessage({ type: 'image', content: reader.result });
            this.fileInput.value = '';
          };
          reader.onerror = () => {
            console.error('Failed to read file');
            this.fileInput.value = '';
          };
          reader.readAsDataURL(file);
        } else {
          console.warn('Please select a valid image file');
          this.fileInput.value = '';
        }
      });
  
      if (!this.voiceBtn) console.warn('voiceBtn not found in DOM');
      else this.voiceBtn.addEventListener("click", () => {
        this.speechAPI.start();
      });
  
      if (!this.themeToggle) console.warn('themeToggle not found in DOM');
      else this.themeToggle.addEventListener("click", () => {
        const currentTheme = appState.state.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        console.log('Theme toggle clicked:', { currentTheme, newTheme });
        appState.setTheme(newTheme);
        this.applyTheme(newTheme);
      });
  
      if (!this.exportBtn) console.warn('exportBtn not found in DOM');
      else this.exportBtn.addEventListener("click", () => this.exportChat());
      
      // Settings modal
      if (!this.settingsBtn) console.warn('settingsBtn not found in DOM');
      else this.settingsBtn.addEventListener("click", () => {
        console.log('Settings button clicked');
        this.showSettings();
      });
      if (!this.closeSettings) console.warn('closeSettings not found in DOM');
      else this.closeSettings.addEventListener("click", () => this.hideSettings());
      if (!this.settingsModal) console.warn('settingsModal not found in DOM');
      else this.settingsModal.addEventListener("click", (e) => {
        if (e.target === this.settingsModal) this.hideSettings();
      });
      
      // Settings controls
      if (!this.themeSelect) console.warn('themeSelect not found in DOM');
      else this.themeSelect.addEventListener("change", (e) => {
        appState.setTheme(e.target.value);
        this.applyTheme(e.target.value);
      });
      
      if (!this.soundToggle) console.warn('soundToggle not found in DOM');
      else this.soundToggle.addEventListener("change", (e) => {
        this.settings.soundEnabled = e.target.checked;
        this.saveSettings();
      });
      
      if (!this.autoScrollToggle) console.warn('autoScrollToggle not found in DOM');
      else this.autoScrollToggle.addEventListener("change", (e) => {
        this.settings.autoScroll = e.target.checked;
        this.saveSettings();
      });
      
      // Emoji picker
      if (!this.emojiBtn) console.warn('emojiBtn not found in DOM');
      else this.emojiBtn.addEventListener("click", () => this.toggleEmojiPicker());
      if (!this.emojiBtn || !this.emojiPicker) {
        if (!this.emojiBtn) console.warn('emojiBtn not found in DOM for document click');
        if (!this.emojiPicker) console.warn('emojiPicker not found in DOM for document click');
      } else {
        document.addEventListener("click", (e) => {
          if (!this.emojiBtn.contains(e.target) && !this.emojiPicker.contains(e.target)) {
            this.hideEmojiPicker();
          }
        });
      }
      if (!this.emojiPicker) console.warn('emojiPicker not found in DOM');
      else this.emojiPicker.addEventListener("click", (e) => {
        if (e.target.classList.contains('emoji-btn')) {
          this.messageInput.value += e.target.textContent;
          this.messageInput.focus();
          this.hideEmojiPicker();
        }
      });
      
      // Add keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
          this.chatForm.dispatchEvent(new Event('submit'));
        }
        if (e.key === 'Escape') {
          this.hideSettings();
          this.hideEmojiPicker();
        }
      });
    }
  
    applyTheme(theme) {
      console.log('Applying theme:', theme);
      
      // Remove any existing theme classes
      document.documentElement.classList.remove('dark', 'light');
      
      // Apply the new theme
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.add('light');
      }
      
      // Update the theme select if it exists
      if (this.themeSelect) {
        this.themeSelect.value = theme;
      }
      
      // Update the theme toggle icon
      this.updateThemeToggleIcon(theme);
      
      console.log('Theme applied. HTML classes:', document.documentElement.className);
    }
    
    updateThemeToggleIcon(theme) {
      const moonIcon = this.themeToggle.querySelector('.fa-moon');
      const sunIcon = this.themeToggle.querySelector('.fa-sun');
      
      if (theme === 'dark') {
        if (moonIcon) moonIcon.classList.add('hidden');
        if (sunIcon) sunIcon.classList.remove('hidden');
      } else {
        if (moonIcon) moonIcon.classList.remove('hidden');
        if (sunIcon) sunIcon.classList.add('hidden');
      }
    }
  
    async handleUserMessage(payload) {
      try {
        const message = this.createMessage('user', payload);
        if (navigator.onLine) {
          await appState.addMessage(message);
        } else {
          appState.addToQueue(message);
          console.log("Offline — queued message locally.");
        }
        this.showTyping();
        setTimeout(async () => {
          try {
            const botReply = this.createMessage('bot', { type: 'text', content: this.chatbot.generateResponse(payload.content) });
            await appState.addMessage(botReply);
            this.hideTyping();
            if (this.settings.soundEnabled) {
              this.playNotificationSound();
            }
          } catch (err) {
            console.error('Bot reply failed:', err);
            this.hideTyping();
          }
        }, 1500);
      } catch (err) {
        console.error('Failed to send message:', err);
        this.hideTyping();
      }
    }
  
    createMessage(sender, payload) {
      return {
        id: this.generateUUID(),
        sender,
        payload,
        timestamp: new Date().toLocaleString()
      };
    }
  
    handleSpeechResult(transcript) {
      this.handleUserMessage({ type: 'text', content: transcript });
    }
  
    render(state) {
      // Performance optimization: only update if messages changed
      if (this.lastMessageCount === state.messages.length) {
        return;
      }
      
      this.chatContainer.innerHTML = '';
      
      // Show welcome message if no messages
      if (state.messages.length === 0) {
        this.showWelcomeMessage();
      } else {
        this.hideWelcomeMessage();
        state.messages.forEach(msg => this.renderMessage(msg));
      }
      
      if (this.settings.autoScroll) {
        this.scrollToBottom();
      }
      
      // Update export button state
      if (this.exportBtn) {
        this.exportBtn.disabled = !state.messages || state.messages.length === 0;
      }
      
      this.lastMessageCount = state.messages.length;
    }
  
    renderMessage(msg) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("flex", msg.sender === "user" ? "justify-end" : "justify-start", "items-end", "fade-in", "mb-4");
  
      const avatar = document.createElement("img");
      avatar.src = msg.sender === "user" ? "assets/avatars/user.png" : "assets/avatars/bot.png";
      avatar.className = "avatar w-10 h-10 rounded-full mx-3";
      avatar.alt = `${msg.sender} avatar`;
  
      const bubble = document.createElement("div");
      bubble.className = `message-bubble ${msg.sender === 'user' ? 'user' : 'bot'} max-w-xs p-4 shadow-soft hover-lift`;
  
      if (msg.payload.type === 'text') {
        const textContent = document.createElement("p");
        textContent.className = "text-sm leading-relaxed";
        textContent.textContent = msg.payload.content;
        bubble.appendChild(textContent);
      } else if (msg.payload.type === 'image') {
        const img = document.createElement("img");
        img.src = msg.payload.content;
        img.className = "rounded-lg w-full max-w-xs shadow-soft";
        img.alt = "Shared image";
        bubble.appendChild(img);
      }
      
      const timestamp = document.createElement("div");
      timestamp.className = "text-xs opacity-70 mt-2";
      timestamp.textContent = msg.timestamp;
      bubble.appendChild(timestamp);
  
      if (msg.sender === 'bot') {
        wrapper.appendChild(avatar);
      }
      wrapper.appendChild(bubble);
      if (msg.sender === 'user') {
        wrapper.appendChild(avatar);
      }
  
      this.chatContainer.appendChild(wrapper);
    }
  
    scrollToBottom() {
      this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
  
    showTyping() { 
      this.typingIndicator.classList.remove("hidden"); 
    }
    
    hideTyping() { 
      this.typingIndicator.classList.add("hidden"); 
    }
    
    showWelcomeMessage() {
      if (this.welcomeMessage) {
        this.welcomeMessage.classList.remove("hidden");
      }
    }
    
    hideWelcomeMessage() {
      if (this.welcomeMessage) {
        this.welcomeMessage.classList.add("hidden");
      }
    }
    
    showSettings() {
      this.settingsModal.classList.remove("hidden");
      console.log('showSettings called, modal classList:', this.settingsModal.classList.value);
    }
    
    hideSettings() {
      this.settingsModal.classList.add("hidden");
    }
    
    toggleEmojiPicker() {
      this.emojiPicker.classList.toggle("hidden");
    }
    
    hideEmojiPicker() {
      this.emojiPicker.classList.add("hidden");
    }
    
    playNotificationSound() {
      // Create a simple notification sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
    
    loadSettings() {
      const saved = localStorage.getItem('chatSettings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
        this.soundToggle.checked = this.settings.soundEnabled;
        this.autoScrollToggle.checked = this.settings.autoScroll;
      }
    }
    
    saveSettings() {
      localStorage.setItem('chatSettings', JSON.stringify(this.settings));
    }
  
    exportChat() {
      if (!appState.state.messages || appState.state.messages.length === 0) {
        console.warn('No messages to export.');
        return;
      }
      
      try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState.state.messages, null, 2));
        const a = document.createElement("a");
        a.href = dataStr;
        a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        console.log('Chat history exported successfully!');
      } catch (err) {
        console.error('Failed to export chat history:', err);
      }
    }
  
    // UUID generator
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  
    // Test function to verify theme toggle
    testThemeToggle() {
      console.log('Testing theme toggle...');
      console.log('Current theme state:', appState.state.theme);
      console.log('Current HTML classes:', document.documentElement.className);
      console.log('Theme toggle button:', this.themeToggle);
      
      // Simulate a click
      this.themeToggle.click();
      
      setTimeout(() => {
        console.log('After toggle - theme state:', appState.state.theme);
        console.log('After toggle - HTML classes:', document.documentElement.className);
      }, 100);
    }
  }

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
  }
  
  // Startup
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      await Storage.init();
    } catch (err) {
      console.error('Storage initialization failed:', err);
      return;
    }
    const app = new ChatApp();
    app.init();
    
    // Expose app for testing (remove in production)
    window.chatApp = app;
    console.log('Chat app initialized. Test theme toggle with: window.chatApp.testThemeToggle()');
  });
  