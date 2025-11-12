import React from 'react';

const Avatar = ({ state = 'idle' }) => {
  const getAvatarClass = () => {
    switch (state) {
      case 'thinking':
        return 'animate-pulse-slow';
      case 'speaking':
        return 'animate-bounce-slow';
      case 'listening':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  const getEyeState = () => {
    switch (state) {
      case 'thinking':
        return 'animate-ping';
      case 'speaking':
        return 'scale-110';
      case 'listening':
        return 'scale-105';
      default:
        return '';
    }
  };

  const getMouthState = () => {
    switch (state) {
      case 'speaking':
        return 'h-3 animate-pulse';
      case 'thinking':
        return 'h-1';
      default:
        return 'h-1';
    }
  };

  return (
    <div className={`relative w-20 h-20 ${getAvatarClass()}`}>
      {/* Face container */}
      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg border-2 border-purple-300/30 relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
        
        {/* Eyes */}
        <div className="absolute top-6 left-0 right-0 flex justify-center space-x-2">
          <div className={`w-2 h-2 bg-white rounded-full transform transition-transform duration-200 ${getEyeState()}`} />
          <div className={`w-2 h-2 bg-white rounded-full transform transition-transform duration-200 ${getEyeState()}`} />
        </div>
        
        {/* Mouth */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <div className={`w-4 bg-white rounded-full transition-all duration-200 ${getMouthState()}`} />
        </div>
        
        {/* Thinking indicator */}
        {state === 'thinking' && (
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-ping" />
            <div className="absolute top-0 w-4 h-4 bg-blue-500 rounded-full" />
          </div>
        )}
        
        {/* Speaking indicator */}
        {state === 'speaking' && (
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse" />
            <div className="absolute top-0 w-4 h-4 bg-green-500 rounded-full" />
          </div>
        )}
        
        {/* Listening indicator */}
        {state === 'listening' && (
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
            <div className="absolute top-0 w-4 h-4 bg-yellow-500 rounded-full" />
          </div>
        )}
      </div>

      {/* Status text */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400capitalize">
        {state}
      </div>
    </div>
  );
};

export default Avatar;