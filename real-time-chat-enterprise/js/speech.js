// Speech-to-Text Module using Web Speech API

class SpeechRecognitionAPI {
    constructor(onResult) {
      this.onResult = onResult;
      this.recognition = null;
      this.isListening = false;
    }
  
    init() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error("Speech Recognition not supported in this browser");
        if (window.NotificationSystem) {
          NotificationSystem.show('error', 'Speech recognition not supported in your browser');
        }
        return;
      }
  
      this.recognition = new SpeechRecognition();
      this.recognition.lang = "en-US";
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
  
      this.recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        this.onResult(transcript);
      };
  
      this.recognition.onerror = (e) => {
        console.error("Speech recognition error:", e);
        if (window.NotificationSystem) {
          NotificationSystem.show('error', 'Speech recognition failed. Please try again.');
        }
      };
  
      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  
    start() {
      if (!this.recognition) {
        this.init();
      }
      if (!this.isListening && this.recognition) {
        this.recognition.start();
        this.isListening = true;
        if (window.NotificationSystem) {
          NotificationSystem.show('info', 'Listening... Speak now', 2000);
        }
      }
    }
  }
  