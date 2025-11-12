import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Volume2, Key, Clock, Mic } from 'lucide-react';
import { ttsService } from '../services/ttsService';

const SettingsModal = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [apiKey, setApiKey] = useState(currentSettings.apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [autoChatDelay, setAutoChatDelay] = useState(currentSettings.autoChatDelay || 2000);
  const [selectedVoice, setSelectedVoice] = useState(currentSettings.selectedVoice || '');
  const [voices, setVoices] = useState([]);
  const [testText] = useState('Hello! This is a test of the text-to-speech system.');

  useEffect(() => {
    if (isOpen) {
      // Load available voices
      const availableVoices = ttsService.getAvailableVoices();
      setVoices(availableVoices);
      
      // Set default voice if none selected
      if (!selectedVoice && availableVoices.length > 0) {
        const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
        setSelectedVoice(defaultVoice.name);
      }
    }
  }, [isOpen, selectedVoice]);

  const handleSave = () => {
    onSave({
      apiKey: apiKey.trim(),
      autoChatDelay,
      selectedVoice
    });
    onClose();
  };

  const handleTestVoice = () => {
    if (selectedVoice) {
      ttsService.setVoice(selectedVoice);
      ttsService.speak(testText);
    }
  };

  const validateApiKey = (key) => {
    // Basic validation for OpenRouter API key format
    return key.length > 0 && (key.startsWith('sk-or-') || key.includes('openrouter'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-morphism max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* API Configuration */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-medium text-white">API Configuration</h3>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                OpenRouter API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {apiKey && (
                <div className="flex items-center space-x-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${
                    validateApiKey(apiKey) ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <span className={validateApiKey(apiKey) ? 'text-green-400' : 'text-red-400'}>
                    {validateApiKey(apiKey) ? 'Valid format' : 'Invalid format'}
                  </span>
                </div>
              )}

              <p className="text-xs text-gray-400">
                Get your API key from{' '}
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  OpenRouter Dashboard
                </a>
              </p>
            </div>
          </div>

          {/* Auto-Chat Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-medium text-white">Auto-Chat Settings</h3>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Delay between model responses (milliseconds)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={autoChatDelay}
                  onChange={(e) => setAutoChatDelay(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm text-gray-300min-w-[80px]">
                  {autoChatDelay}ms
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Controls how long to wait before sending a response to the next model in auto-chat mode.
              </p>
            </div>
          </div>

          {/* TTS Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-medium text-white">Text-to-Speech</h3>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Voice Selection
              </label>
              <div className="flex space-x-2">
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                >
                  <option value="" disabled className="bg-gray-800">
                    Select a voice...
                  </option>
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name} className="bg-gray-800">
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleTestVoice}
                  disabled={!selectedVoice}
                  className="px-4 py-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  title="Test Voice"
                >
                  <Mic className="w-4 h-4" />
                  <span className="hidden sm:inline">Test</span>
                </button>
              </div>
              
              {voices.length === 0 && (
                <p className="text-xs text-red-400">
                  No voices available. Text-to-speech may not be supported in your browser.
                </p>
              )}
              
              <p className="text-xs text-gray-400">
                Select a voice for text-to-speech playback. Not all browsers support all voices.
              </p>
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Speech Synthesis:</span>
                  <span className={`${
                    'speechSynthesis' in window ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {'speechSynthesis' in window ? 'Supported' : 'Not Supported'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Available Voices:</span>
                  <span className="text-white">{voices.length}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Local Storage:</span>
                  <span className={`${
                    'localStorage' in window ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {'localStorage' in window ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fetch API:</span>
                  <span className={`${
                    'fetch' in window ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {'fetch' in window ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;