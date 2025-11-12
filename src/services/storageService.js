class StorageService {
  constructor() {
    this.isAvailable = this.checkStorageAvailability();
  }

  checkStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      console.warn('localStorage not available:', error);
      return false;
    }
  }

  // API Key management
  setApiKey(apiKey) {
    if (!this.isAvailable) return;
    
    try {
      if (apiKey) {
        localStorage.setItem('zlatko_api_key', apiKey);
      } else {
        localStorage.removeItem('zlatko_api_key');
      }
    } catch (error) {
      console.warn('Failed to save API key:', error);
    }
  }

  getApiKey() {
    if (!this.isAvailable) return null;
    
    try {
      return localStorage.getItem('zlatko_api_key');
    } catch (error) {
      console.warn('Failed to load API key:', error);
      return null;
    }
  }

  clearApiKey() {
    this.setApiKey(null);
  }

  // Settings management
  setSettings(settings) {
    if (!this.isAvailable) return;
    
    try {
      localStorage.setItem('zlatko_settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }

  getSettings() {
    if (!this.isAvailable) return null;
    
    try {
      const settings = localStorage.getItem('zlatko_settings');
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.warn('Failed to load settings:', error);
      return null;
    }
  }

  // Chat history management (session-based)
  setChatHistory(instanceId, messages) {
    if (!this.isAvailable) return;
    
    try {
      const key = `zlatko_chat_${instanceId}`;
      sessionStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.warn('Failed to save chat history:', error);
    }
  }

  getChatHistory(instanceId) {
    if (!this.isAvailable) return [];
    
    try {
      const key = `zlatko_chat_${instanceId}`;
      const history = sessionStorage.getItem(key);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.warn('Failed to load chat history:', error);
      return [];
    }
  }

  clearChatHistory(instanceId) {
    if (!this.isAvailable) return;
    
    try {
      const key = `zlatko_chat_${instanceId}`;
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to clear chat history:', error);
    }
  }

  clearAllChatHistory() {
    if (!this.isAvailable) return;
    
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('zlatko_chat_')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear all chat history:', error);
    }
  }

  // Recent models management
  setRecentModels(models) {
    if (!this.isAvailable) return;
    
    try {
      const recentModels = models.slice(0, 10); // Keep only last 10
      localStorage.setItem('zlatko_recent_models', JSON.stringify(recentModels));
    } catch (error) {
      console.warn('Failed to save recent models:', error);
    }
  }

  getRecentModels() {
    if (!this.isAvailable) return [];
    
    try {
      const models = localStorage.getItem('zlatko_recent_models');
      return models ? JSON.parse(models) : [];
    } catch (error) {
      console.warn('Failed to load recent models:', error);
      return [];
    }
  }

  addRecentModel(model) {
    const recentModels = this.getRecentModels();
    
    // Remove if already exists
    const filtered = recentModels.filter(m => m.id !== model.id);
    
    // Add to beginning
    filtered.unshift(model);
    
    // Save updated list
    this.setRecentModels(filtered);
  }

  // Instance state management
  setInstanceState(instances) {
    if (!this.isAvailable) return;
    
    try {
      // Only save essential instance data (not messages)
      const instanceData = instances.map(instance => ({
        id: instance.id,
        selectedModel: instance.selectedModel
      }));
      
      sessionStorage.setItem('zlatko_instances', JSON.stringify(instanceData));
    } catch (error) {
      console.warn('Failed to save instance state:', error);
    }
  }

  getInstanceState() {
    if (!this.isAvailable) return null;
    
    try {
      const state = sessionStorage.getItem('zlatko_instances');
      return state ? JSON.parse(state) : null;
    } catch (error) {
      console.warn('Failed to load instance state:', error);
      return null;
    }
  }

  // Utility methods
  getStorageUsage() {
    if (!this.isAvailable) return { used: 0, available: 0 };
    
    try {
      let used = 0;
      
      // Calculate localStorage usage
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }
      
      // Calculate sessionStorage usage
      for (let key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key)) {
          used += sessionStorage[key].length + key.length;
        }
      }
      
      // Rough estimate of available storage (5MB typical limit)
      const available = 5 * 1024 * 1024; // 5MB in bytes
      
      return {
        used: used,
        available: available,
        percentage: Math.round((used / available) * 100)
      };
    } catch (error) {
      console.warn('Failed to calculate storage usage:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  clearAllData() {
    if (!this.isAvailable) return;
    
    try {
      // Clear all zlatko-related data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('zlatko_')) {
          localStorage.removeItem(key);
        }
      });
      
      this.clearAllChatHistory();
      sessionStorage.removeItem('zlatko_instances');
    } catch (error) {
      console.warn('Failed to clear all data:', error);
    }
  }
}

export const storageService = new StorageService();