# Zlatko - Multi-Model Chatbot Application

A sophisticated React-based chatbot application that enables conversations with multiple AI models simultaneously through the OpenRouter API. Features include animated avatars, text-to-speech, split-screen conversations, and model-to-model auto-chat functionality.

## ✨ Features

### 🤖 Multi-Model Support
- Auto-fetch free models from OpenRouter API
- Model capability indicators (💬 Chat, 🧠 Smart, ⚡ Fast,📚 Long Context,💻 Code,👁️ Vision,🆓 Free, 🔓 Open Source)
- Real-time model switching per chat instance
- Support for major providers: OpenAI, Anthropic, Google, Meta, Mistral, and more

### 💬 Advanced Chat Interface
- Multiple chat instances with split-screen support (up to 4 instances)
- Independent conversation history per instance
- Real-time typing indicators and thinking states
- Message formatting with basic markdown support
- Auto-scrolling message history

### 🎭Animated Avatars
- Dynamic avatar states: idle, listening, thinking, speaking
- Visual feedback during API calls and TTS playback
- Smooth state transitions and animations
- Color-coded status indicators

### 🔊 Text-to-Speech Integration
- System voice selection and management
- Auto-playback of AI responses
- Voice testing and preview functionality
- Configurable speech settings (rate, pitch, volume)
- Smart text truncation for optimal TTS performance

### 🤝 Model-to-Model Conversations
- Auto-chat toggle for conversations between different models
- Configurable delay between model exchanges
- Round-robin and random routing logic
- Manual conversation control and stopping

### ⚙️ Comprehensive Settings
- Secure API key management with validation
- Persistent settings storage (localStorage)
- Auto-chat delay configuration
- Voice selection and TTS settings
- System capability detection

### 🎨 Modern UI/UX
- Dark theme with gradient backgrounds
- Glass morphism design effects
- Responsive layout (mobile-friendly)
- Smooth animations and transitions
- Accessibility features (ARIA labels, keyboard navigation)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))
- Modern web browser with Speech Synthesis support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/erector666/zlatko.git
   cd zlatko
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

5. **Configure your API key**
   - Click the Settings button in the top right
   - Enter your OpenRouter API key
   - Save settings and refresh models

## 🔧 Configuration

### API Key Setup
1. Visit [OpenRouter Dashboard](https://openrouter.ai/keys)
2. Create a new API key
3. Copy the key (format: `sk-or-v1-...`)
4. Enter it in the Zlatko settings panel

### Voice Configuration
- Access Settings > Text-to-Speech
- Select from available system voices
- Test voices before applying
- Settings are automatically saved

### Auto-Chat Settings
- Configure delay between model responses (500ms - 10s)
- Enable/disable auto-chat mode
- Works automatically when multiple instances are active

## 📱 Usage

### Basic Chat
1. Select a model from the dropdown
2. Type your message in the input field
3. Press Enter or click Send
4. Watch the avatar animate during response generation
5. Listen to the TTS playback of the response

### Multi-Instance Chat
1. Click "Add Chat" to create additional instances
2. Select different models for each instance
3. Chat independently in each instance
4. Enable auto-chat for model-to-model conversations

### Model-to-Model Conversations
1. Create2+ chat instances
2. Select different models for each
3. Toggle "Auto-chat between models"
4. Send a message to any instance
5. Watch models automatically respond to each other

## 🛠️ Technical Stack

- **Frontend**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **API**: OpenRouter REST API
- **Storage**: localStorage for persistence, sessionStorage for chat history
- **TTS**: Web Speech API (Speech Synthesis)
- **Build Tool**: Create React App

## 📁 Project Structure

```
src/
├── components/
│   ├── Avatar.js# Animated avatar component
│   ├── ChatInstance.js        # Individual chat interface
│   ├── MessageBubble.js       # Message display component
│   ├── ModelSelector.js       # Model selection dropdown
│   └── SettingsModal.js       # Settings configuration panel
├── services/
│   ├── openRouterApi.js       # OpenRouter API integration
│   ├── storageService.js      # Local storage management
│   └── ttsService.js          # Text-to-speech functionality
├── App.js                     # Main application component
├── index.js                   # React entry point
└── index.css                  # Global styles and Tailwind imports
```

## 🎯 Model Capabilities

The application automatically detects and displays model capabilities:

- **💬 Chat**: Basic conversation capability (all models)
- **🧠 Smart**: Advanced reasoning (GPT-4, Claude, Gemini Pro)
- **⚡ Fast**: Quick response times (Turbo models, GPT-3.5)
- **📚 Long Context**: Extended context window (>8K tokens)
- **💻 Code**: Code-specialized models (Codex, Code Llama)
- **👁️ Vision**: Multimodal/image understanding (GPT-4V, Claude 3)
- **🆓 Free**: Explicitly free models (filtered from API)
- **🔓 Open Source**: Open-source models (Llama, Mistral, etc.)

## 🔒 Privacy & Security

- **API Key Security**: Keys stored locally in browser storage
- **No Server Storage**: All data remains on your device
- **Session Management**: Chat history cleared on browser close
- **HTTPS Required**: Secure connections for API calls

## 🌐 Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (some voice limitations)
- **Mobile**: Responsive design, limited TTS support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing access to multiple AI models
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icon library
- [React](https://reactjs.org/) for the component-based architecture

## 📞 Support

If you encounter any issues or have questions:

1. Check the browser console for error messages
2. Verify your API key is valid and has credits
3. Ensure your browser supports Speech Synthesis
4. Try refreshing the models list
5. Clear browser storage and reconfigure

For technical issues, please open an issue on GitHub with:
- Browser and version
- Error messages from console
- Steps to reproduce the problem

---

**Built with ❤️ for the AI community**