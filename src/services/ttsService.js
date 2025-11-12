class TtsService {
  constructor() {
    this.synthesis = null;
    this.voices = [];
    this.currentVoice = null;
    this.speaking = false;
    this.queue = [];
    this.settings = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0
    };
  }

  initialize() {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      
      // Load voices when they become available
      this.loadVoices();
      
      // Some browsers load voices asynchronously
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }

  loadVoices() {
    if (!this.synthesis) return;

    this.voices = this.synthesis.getVoices();
    
    // Set default voice if none selected
    if (!this.currentVoice && this.voices.length > 0) {
      // Prefer English voices
      const englishVoice = this.voices.find(voice => 
        voice.lang.startsWith('en') && voice.default
      ) || this.voices.find(voice => 
        voice.lang.startsWith('en')
      ) || this.voices[0];
      
      this.currentVoice = englishVoice;
    }
  }

  getAvailableVoices() {
    return this.voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default,
      localService: voice.localService
    }));
  }

  setVoice(voiceName) {
    if (!voiceName) return;
    
    const voice = this.voices.find(v => v.name === voiceName);
    if (voice) {
      this.currentVoice = voice;
}
  }

  getCurrentVoice() {
    return this.currentVoice ? this.currentVoice.name : null;
  }

  setSettings(settings) {
    this.settings = { ...this.settings, ...settings };
  }

  async speak(text) {
    if (!this.synthesis || !text) return;
    
    // Cancel any currently speaking utterance
    this.stop();
    
    return new Promise((resolve, reject) => {
      // Truncate very long text to prevent TTS issues
      const maxLength = 500;
      const truncatedText = text.length > maxLength 
        ? text.substring(0, maxLength) + '...' 
        : text;
      
      const utterance = new SpeechSynthesisUtterance(truncatedText);
      
      // Set voice and settings
      if (this.currentVoice) {
        utterance.voice = this.currentVoice;
      }
      
      utterance.rate = this.settings.rate;
      utterance.pitch = this.settings.pitch;
      utterance.volume = this.settings.volume;
      
      // Event handlers
      utterance.onstart = () => {
        this.speaking = true;
      };
      
      utterance.onend = () => {
        this.speaking = false;
        resolve();
      };
      
      utterance.onerror = (event) => {
        this.speaking = false;
        console.warn('Speech synthesis error:', event.error);
        reject(new Error(`Speech synthesis failed: ${event.error}`));
      };
      
      // Start speaking
      try {
        this.synthesis.speak(utterance);
      } catch (error) {
        this.speaking = false;
        reject(error);
      }
    });
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.speaking = false;
    }
  }

  pause() {
    if (this.synthesis && this.speaking) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis && this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  isSpeaking() {
    return this.speaking;
  }

  isPaused() {
    return this.synthesis ? this.synthesis.paused : false;
  }

  // Queue management for multiple messages
  async speakQueue(texts) {
    this.queue = [...texts];
    
    while (this.queue.length > 0) {
      const text = this.queue.shift();
      try {
        await this.speak(text);
      } catch (error) {
        console.warn('Failed to speak queued text:', error);
      }
    }
  }

  clearQueue() {
    this.queue = [];
    this.stop();
  }

  // Test speech with sample text
  async testSpeech(text = 'Hello! This is a test of the text-to-speech system.') {
    try {
      await this.speak(text);
      return true;
    } catch (error) {
      console.error('TTS test failed:', error);
      return false;
    }
  }
}

export const ttsService = new TtsService();