class OpenRouterApi {
  constructor() {
    this.baseUrl = 'https://openrouter.ai/api/v1';
    this.apiKey = null;
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  async getModels() {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Zlatko Chatbot'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key');
        }
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }
  }

  async sendMessage(modelId, messages) {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    if (!modelId) {
      throw new Error('Model ID not specified');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Zlatko Chatbot'
        },
        body: JSON.stringify({
          model: modelId,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key');
        }
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Bad request: ${errorData.error?.message || 'Invalid request format'}`);
        }
        if (response.status === 402) {
          throw new Error('Insufficient credits. Please check your OpenRouter account.');
        }
        if (response.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        }
        
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response generated');
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }
  }

  // Utility method to validate API key format
  isValidApiKeyFormat(key) {
    return typeof key === 'string' && 
           key.length > 0 && 
           (key.startsWith('sk-or-') || key.includes('openrouter'));
  }

  // Method to test API key validity
  async testApiKey(key) {
    const originalKey = this.apiKey;
    this.setApiKey(key);
    
    try {
      await this.getModels();
return true;
    } catch (error) {
      return false;
    } finally {
      this.setApiKey(originalKey);
    }
  }
}

export const openRouterApi = new OpenRouterApi();