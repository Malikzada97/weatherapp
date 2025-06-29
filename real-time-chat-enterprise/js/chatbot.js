// Chatbot Logic Module — Enterprise AI-Ready

class ChatBot {
    constructor() {
      this.responses = [
        "Hello! How can I help you today? 😊",
        "That's interesting. Can you tell me more? 🤔",
        "I see. Please continue. 🧠",
        "Thanks for sharing that! 👍",
        "Let me think... 🤖"
      ];
      
      this.conversationContext = {
        lastTopic: null,
        messageCount: 0,
        userMood: 'neutral'
      };
    }
  
    // Generate chatbot response
    generateResponse(userMessage) {
      this.conversationContext.messageCount++;
      const lowerText = userMessage.toLowerCase();
  
      // Greeting patterns
      if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
        this.conversationContext.userMood = 'positive';
        return this.getGreetingResponse();
      } 
      
      // Gratitude patterns
      if (lowerText.includes("thank") || lowerText.includes("thanks")) {
        this.conversationContext.userMood = 'positive';
        return "You're very welcome! 😊 Is there anything else I can help you with?";
      }
      
      // Help patterns
      if (lowerText.includes("help") || lowerText.includes("support")) {
        return "I'm here to help! You can:\n• Send text messages\n• Share images\n• Use voice input\n• Export chat history\n• Switch themes\nWhat would you like to know more about?";
      }
      
      // Feature questions
      if (lowerText.includes("feature") || lowerText.includes("what can you do")) {
        return "I'm a feature-rich chat assistant! Here's what I can do:\n• 💬 Text conversations\n• 🎙️ Voice input\n• 📷 Image sharing\n• 🌙 Theme switching\n• 📤 Export chats\n• 📱 Works offline\n• 🔄 Syncs when online";
      }
      
      // Technical questions
      if (lowerText.includes("how") && (lowerText.includes("work") || lowerText.includes("function"))) {
        return "I work using modern web technologies:\n• JavaScript for logic\n• IndexedDB for storage\n• Service Workers for offline support\n• Web Speech API for voice\n• PWA features for mobile experience";
      }
      
      // Goodbye patterns
      if (lowerText.includes("bye") || lowerText.includes("goodbye") || lowerText.includes("see you")) {
        this.conversationContext.userMood = 'neutral';
        return "Goodbye! 👋 It was great chatting with you. Come back anytime!";
      }
      
      // Weather (mock response)
      if (lowerText.includes("weather")) {
        return "I'd love to help with weather info! 🌤️ However, I'm currently a demo chatbot. In a real app, I'd connect to a weather API to give you accurate forecasts.";
      }
      
      // Time
      if (lowerText.includes("time") || lowerText.includes("what time")) {
        const now = new Date();
        return `The current time is ${now.toLocaleTimeString()} ⏰`;
      }
      
      // Date
      if (lowerText.includes("date") || lowerText.includes("what day")) {
        const now = new Date();
        return `Today is ${now.toLocaleDateString()} 📅`;
      }
      
      // Question patterns
      if (lowerText.includes("?")) {
        this.conversationContext.lastTopic = 'question';
        return "That's a great question! 🤔 While I'm a demo chatbot, I can help you explore the app's features. What would you like to know about?";
      }
      
      // Long messages
      if (userMessage.length > 100) {
        return "Wow, that's quite detailed! 📝 I appreciate you sharing that with me. I'm processing your message and would love to continue our conversation. What's on your mind?";
      }
      
      // Default contextual response
      return this.getContextualResponse();
    }
  
    getGreetingResponse() {
      const greetings = [
        "Hi there! 👋 How can I assist you today?",
        "Hello! 😊 Welcome to our chat app. What can I help you with?",
        "Hey! 👋 Great to see you. How's your day going?",
        "Hi! 🌟 I'm here to help. What would you like to chat about?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
  
    getContextualResponse() {
      const responses = [
        "That's interesting! Tell me more about that. 🤔",
        "I see what you mean. Please continue! 👂",
        "Thanks for sharing! I'm listening. 📝",
        "That's a good point. What else is on your mind? 💭",
        "I understand. How can I help you further? 🤝",
        "Interesting perspective! Would you like to explore this topic more? 🔍"
      ];
      
      // Add some variety based on conversation context
      if (this.conversationContext.messageCount > 5) {
        responses.push("We've been chatting for a while! I'm enjoying our conversation. 😊");
      }
      
      if (this.conversationContext.userMood === 'positive') {
        responses.push("I'm glad you're in a good mood! 😄 What else would you like to discuss?");
      }
      
      return responses[Math.floor(Math.random() * responses.length)];
    }
  
    // Pick random response (fallback)
    getRandomResponse() {
      const index = Math.floor(Math.random() * this.responses.length);
      return this.responses[index];
    }
  }
  