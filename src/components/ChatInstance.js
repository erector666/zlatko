import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import Avatar from './Avatar';
import MessageBubble from './MessageBubble';

const ChatInstance = ({ instance, onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [instance.messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !instance.selectedModel || instance.isThinking) return;
    
    onSendMessage(inputMessage.trim());
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getAvatarState = () => {
    if (instance.isThinking) return 'thinking';
    if (instance.isSpeaking) return 'speaking';
    if (inputMessage.length > 0) return 'listening';
    return 'idle';
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Avatar Section */}
      <div className="p-4 border-b border-white/10 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <Avatar state={getAvatarState()} />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-300">
              {instance.selectedModel ? instance.selectedModel.name : 'No model selected'}
            </p>
            {instance.isThinking && (
              <p className="text-xs text-purple-400 animate-pulse">Thinking...</p>
            )}
            {instance.isSpeaking && (
              <p className="text-xs text-green-400 animate-pulse">Speaking...</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {instance.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="mb-2">No messages yet</p>
              <p className="text-sm">
                {instance.selectedModel 
                  ? 'Start a conversation!' 
                  : 'Please select a model to begin chatting'
                }
              </p>
            </div>
          </div>
        ) : (
          instance.messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isUser={message.role === 'user'}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                !instance.selectedModel 
                  ? 'Select a model first...'
                  : instance.isThinking 
                    ? 'Please wait...'
                    : 'Type your message...'
              }
              disabled={!instance.selectedModel || instance.isThinking}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
style={{
                minHeight: '48px',
                maxHeight: '120px',
                height: 'auto'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || !instance.selectedModel || instance.isThinking}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
            title="Send message"
          >
            {instance.isThinking ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        
        {/* Character count */}
        <div className="mt-2 text-xs text-gray-400 text-right">
          {inputMessage.length} characters
        </div>
      </div>
    </div>
  );
};

export default ChatInstance;