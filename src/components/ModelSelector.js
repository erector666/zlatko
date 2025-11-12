import React from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';

const ModelSelector = ({ models, selectedModel, onModelSelect, loading }) => {
  const getModelCapabilities = (model) => {
    const capabilities = [];
    
    // Free model indicator
    if (model.pricing?.prompt === 0 || model.pricing?.prompt === '0') {
      capabilities.push('🆓');
    }
    
    // Chat capability (all models have this)
    capabilities.push('💬');
    
    // Advanced reasoning (GPT-4, Claude, etc.)
    if (model.name.toLowerCase().includes('gpt-4') || 
        model.name.toLowerCase().includes('claude') ||
        model.name.toLowerCase().includes('gemini-pro')) {
      capabilities.push('🧠');
    }
    
    // Fast models (smaller models)
    if (model.name.toLowerCase().includes('turbo') ||
        model.name.toLowerCase().includes('fast') ||
        model.name.toLowerCase().includes('3.5')) {
      capabilities.push('⚡');
    }
    
    // Long context (>8K tokens)
    if (model.context_length && model.context_length > 8000) {
      capabilities.push('📚');
    }
    
    // Code specialized
    if (model.name.toLowerCase().includes('code') ||
        model.name.toLowerCase().includes('codex') ||
        model.name.toLowerCase().includes('coder')) {
      capabilities.push('💻');
    }
    
    // Vision/Multimodal
    if (model.name.toLowerCase().includes('vision') ||
        model.name.toLowerCase().includes('gpt-4o') ||
        model.name.toLowerCase().includes('claude-3')) {
      capabilities.push('👁️');
    }
    
    // Open source
    if (model.name.toLowerCase().includes('llama') ||
        model.name.toLowerCase().includes('mistral') ||
        model.name.toLowerCase().includes('mixtral') ||
        model.name.toLowerCase().includes('phi') ||
        model.name.toLowerCase().includes('qwen')) {
      capabilities.push('🔓');
    }
    
    return capabilities.join(' ');
  };

  const formatModelName = (name) => {
    // Truncate long model names
    if (name.length > 40) {
      return name.substring(0, 37) + '...';
    }
    return name;
  };

  const getModelProvider = (id) => {
    if (id.includes('openai')) return 'OpenAI';
    if (id.includes('anthropic')) return 'Anthropic';
    if (id.includes('google')) return 'Google';
    if (id.includes('meta')) return 'Meta';
    if (id.includes('mistral')) return 'Mistral';
    if (id.includes('microsoft')) return 'Microsoft';
    return 'Other';
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading models...</span>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="text-gray-400 text-sm">
        No free models available. Please check your API key and try refreshing.
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={selectedModel?.id || ''}
        onChange={(e) => {
          const model = models.find(m => m.id === e.target.value);
          onModelSelect(model);
        }}
        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white appearance-none cursor-pointer"
      >
        <option value="" disabled className="bg-gray-800">
          Select a model...
        </option>
        {models.map((model) => (
          <option key={model.id} value={model.id} className="bg-gray-800">
            {formatModelName(model.name)} {getModelCapabilities(model)}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      
      {/* Selected model info */}
      {selectedModel && (
        <div className="mt-2 text-xs text-gray-400 space-y-1">
          <div className="flex justify-between items-center">
            <span>Provider: {getModelProvider(selectedModel.id)}</span>
            <span>Context: {selectedModel.context_length?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Capabilities: {getModelCapabilities(selectedModel)}</span>
            <span className="text-green-400">Free</span>
          </div>
        </div>
      )}
      
      {/* Capability legend */}
      <div className="mt-3 text-xs text-gray-500">
        <div className="grid grid-cols-2 gap-1">
          <div>💬 Chat •🧠 Smart •⚡ Fast •📚 Long Context</div>
          <div>💻 Code • 👁️ Vision • 🆓 Free • 🔓 Open Source</div>
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;