import React from 'react';
import { User, Bot, AlertCircle } from 'lucide-react';

const MessageBubble = ({ message, isUser }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-600' 
            : message.isError 
              ? 'bg-red-600'
              : 'bg-purple-600'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : message.isError ? (
            <AlertCircle className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        
        {/* Message content */}
        <div className={`flex flex-col ${
          isUser ? 'items-end' : 'items-start'
        }`}>
          <div className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-sm'
              : message.isError
                ? 'bg-red-600/20 border border-red-500/30 text-red-300rounded-bl-sm'
                : 'bg-white/10 border border-white/20 text-white rounded-bl-sm'
          } shadow-lg backdrop-blur-sm`}>
            <div 
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
            />
          </div>
          
          {/* Timestamp */}
          <div className={`mt-1 text-xs text-gray-400 ${
            isUser ? 'mr-2' : 'ml-2'
          }`}>
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;