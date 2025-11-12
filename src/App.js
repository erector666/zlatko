import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Plus, X, RefreshCw } from 'lucide-react';
import ChatInstance from './components/ChatInstance';
import SettingsModal from './components/SettingsModal';
import ModelSelector from './components/ModelSelector';
import { openRouterApi } from './services/openRouterApi';
import { ttsService } from './services/ttsService';
import { storageService } from './services/storageService';

function App() {
  const [instances, setInstances] = useState([{ id: 1, selectedModel: null, messages: [] }]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [autoChat, setAutoChat] = useState(false);
  const [autoChatDelay, setAutoChatDelay] = useState(2000);
  const [maxInstances] = useState(4);
  const [apiKey, setApiKey] = useState('');

  // Load settings and API key on startup
  useEffect(() => {
    const savedApiKey = storageService.getApiKey();
    const savedSettings = storageService.getSettings();
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
      openRouterApi.setApiKey(savedApiKey);
    }
    
    if (savedSettings) {
      setAutoChatDelay(savedSettings.autoChatDelay || 2000);
      ttsService.setVoice(savedSettings.selectedVoice);
    }
    
    // Auto-fetch models if API key is available
    if (savedApiKey) {
      fetchModels();
    }
    
    // Initialize TTS service
    ttsService.initialize();
  }, []);

  const fetchModels = useCallback(async () => {
    if (!apiKey) {
      setError('API key required to fetch models');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const fetchedModels = await openRouterApi.getModels();
      const freeModels = fetchedModels.filter(model => 
        model.pricing?.prompt === 0 || model.pricing?.prompt === '0'
      );
      setModels(freeModels);
    } catch (err) {
      setError(`Failed to fetch models: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const addInstance = () => {
    if (instances.length < maxInstances) {
      const newInstance = {
        id: Date.now(),
        selectedModel: null,
        messages: []
      };
      setInstances(prev => [...prev, newInstance]);
    }
  };

  const removeInstance = (id) => {
    if (instances.length > 1) {
      setInstances(prev => prev.filter(instance => instance.id !== id));
    }
  };

  const updateInstance = (id, updates) => {
    setInstances(prev => prev.map(instance => 
      instance.id === id ? { ...instance, ...updates } : instance
    ));
  };

  const sendMessage = async (instanceId, message) => {
    const instance = instances.find(i => i.id === instanceId);
    if (!instance || !instance.selectedModel) return;

    const userMessage = { role: 'user', content: message, timestamp: Date.now() };
    updateInstance(instanceId, {
      messages: [...instance.messages, userMessage],
      isThinking: true
    });

    try {
      const response = await openRouterApi.sendMessage(
        instance.selectedModel.id,
        [...instance.messages, userMessage]
      );

      const assistantMessage = {
        role: 'assistant',
        content: response.choices[0].message.content,
        timestamp: Date.now()
      };

      updateInstance(instanceId, {
        messages: [...instance.messages, userMessage, assistantMessage],
        isThinking: false,
        isSpeaking: true
      });

      // TTS playback
      await ttsService.speak(assistantMessage.content);
      updateInstance(instanceId, { isSpeaking: false });

      // Auto-chat logic
      if (autoChat && instances.length > 1) {
        setTimeout(() => {
          relayToNextInstance(instanceId, assistantMessage.content);
        }, autoChatDelay);
      }
    } catch (err) {
      updateInstance(instanceId, {
        messages: [...instance.messages, userMessage,{
          role: 'assistant',
          content: `Error: ${err.message}`,
          timestamp: Date.now(),
          isError: true
        }],
        isThinking: false
      });
    }
  };

  const relayToNextInstance = (senderId, message) => {
    const otherInstances = instances.filter(i => i.id !== senderId && i.selectedModel);
    if (otherInstances.length === 0) return;

    const targetInstance = otherInstances[Math.floor(Math.random() * otherInstances.length)];
    sendMessage(targetInstance.id, message);
  };

  const saveSettings = (settings) => {
    if (settings.apiKey !== apiKey) {
      setApiKey(settings.apiKey);
      openRouterApi.setApiKey(settings.apiKey);
      storageService.setApiKey(settings.apiKey);
      
      // Fetch models with new API key
      if (settings.apiKey) {
        fetchModels();
      }
    }
    
    setAutoChatDelay(settings.autoChatDelay);
    ttsService.setVoice(settings.selectedVoice);
    
    storageService.setSettings({
      autoChatDelay: settings.autoChatDelay,
      selectedVoice: settings.selectedVoice
    });
  };

  const getGridClass = () => {
    switch (instances.length) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 lg:grid-cols-2';
      case 3: return 'grid-cols-1 lg:grid-cols-3';
      default: return 'grid-cols-1 lg:grid-cols-2xl:grid-cols-2';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="glass-morphism border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Zlatko
            </h1>
            <span className="text-sm text-gray-400">Multi-Model Chatbot</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchModels}
              disabled={loading || !apiKey}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh Models"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            
            <button
              onClick={addInstance}
              disabled={instances.length >= maxInstances}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add Chat Instance"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Chat</span>
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Auto-chat toggle */}
        {instances.length > 1 && (
          <div className="max-w-7xl mx-auto mt-4 flex items-center justify-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoChat}
                onChange={(e) => setAutoChat(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">
                Auto-chat between models (delay: {autoChatDelay}ms)
              </span>
            </label>
          </div>
        )}
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-600/20 border border-red-500/30 text-red-300 px-4 py-3 text-center">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4 inline" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {!apiKey ? (
          <div className="text-center py-20">
            <div className="glass-morphism p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4">Welcome to Zlatko</h2>
              <p className="text-gray-300 mb-6">
                To get started, please configure your OpenRouter API key in settings.
              </p>
              <button
                onClick={() => setShowSettings(true)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Open Settings
              </button>
            </div>
          </div>
        ) : (
          <div className={`grid ${getGridClass()} gap-6`}>
            {instances.map((instance) => (
              <div key={instance.id} className="relative">
                {instances.length > 1 && (
                  <button
                    onClick={() => removeInstance(instance.id)}
                    className="absolute top-2 right-2 z-10 p-1 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-full transition-colors"
                    title="Remove Chat Instance"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                
                <div className="glass-morphism h-[600px] flex flex-col">
                  <div className="p-4 border-b border-white/10">
                    <ModelSelector
                      models={models}
                      selectedModel={instance.selectedModel}
                      onModelSelect={(model) => updateInstance(instance.id, { selectedModel: model })}
                      loading={loading}
                    />
                  </div>
                  
                  <ChatInstance
                    instance={instance}
                    onSendMessage={(message) => sendMessage(instance.id, message)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={saveSettings}
          currentSettings={{
            apiKey,
            autoChatDelay,
            selectedVoice: ttsService.getCurrentVoice()
          }}
        />
      )}
    </div>
  );
}

export default App;