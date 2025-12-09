import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import chatApiService, { ChatMessage, ChatResponse } from '../services/chatApi';
import { useNavigate } from 'react-router-dom';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Initialize chat when component mounts
  useEffect(() => {
    if (!isInitialized) {
      initializeChat();
    }
  }, [isInitialized]);

  const initializeChat = async () => {
    try {
      const response = await chatApiService.initializeChat();
      const uiMessages = chatApiService.convertToUIMessages(response.chat_history);
      setMessages(uiMessages);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      
      // Fallback initialization
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: "Hello! I'm your movie assistant. Ask me anything about movies, TV shows, actors, or entertainment!",
        isUser: false,
        timestamp: new Date(),
        status: 'sent',
        type: 'greeting'
      };
      setMessages([welcomeMessage]);
      setIsInitialized(true);
    }
  };

  const handleMovieClick = (movie: any) => {
    navigate(`/movie/${movie.tmdb_id}`);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageText = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message to UI immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);

    // Add bot typing indicator
    const botTypingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: '',
      isUser: false,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, botTypingMessage]);

    try {
      // Send message with chat history
      const response: ChatResponse = await chatApiService.askQuestion(messageText);
      
      if (response.success) {
        // Convert the updated chat history to UI messages
        const updatedUIMessages = chatApiService.convertToUIMessages(response.chat_history);
        setMessages(updatedUIMessages);
        
        console.log('Found movies:', response.found_movies?.length || 0);
        console.log('Chat history length:', response.chat_history.length);
      } else {
        // Handle error but still update with returned history
        const updatedUIMessages = chatApiService.convertToUIMessages(response.chat_history);
        setMessages(updatedUIMessages);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update typing message with error
      setMessages(prev => prev.map(msg => 
        msg.id === botTypingMessage.id 
          ? {
              ...msg,
              text: 'Sorry, I encountered an error. Please try again.',
              status: 'error' as const
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleResetChat = async () => {
    setIsLoading(true);
    try {
      const response = await chatApiService.resetChat();
      const uiMessages = chatApiService.convertToUIMessages(response.chat_history);
      setMessages(uiMessages);
    } catch (error) {
      console.error('Error resetting chat:', error);
      
      // Fallback reset
      const welcomeMessage: ChatMessage = {
        id: 'reset-welcome',
        text: "Hello! I'm your movie assistant. Ask me anything about movies, TV shows, actors, or entertainment!",
        isUser: false,
        timestamp: new Date(),
        status: 'sent',
        type: 'greeting'
      };
      setMessages([welcomeMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Custom markdown components for styling
  const markdownComponents = {
    a: ({ href, children, ...props }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="movie-link"
        {...props}
      >
        {children}
      </a>
    ),
    p: ({ children }: any) => <p className="message-paragraph">{children}</p>,
  };

  return (
    <>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <span>🎬</span>
              </div>
              <div>
                <h4>Movie Assistant</h4>
                <span className="chat-status">
                  Online • {chatApiService.hasContext() ? 'Context Available' : 'New Chat'}
                </span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button
                onClick={handleResetChat}
                className="chat-reset-btn"
                title="Reset Chat"
                disabled={isLoading}
              >
                🔄
              </button>
              <button
                className="chat-close-btn"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.isUser ? 'user' : 'bot'} ${message.status}`}
              >
                {!message.isUser && (
                  <div className="message-avatar">
                    <span>🎬</span>
                  </div>
                )}
                <div className="message-content">
                  <div className="message-bubble">
                    {message.status === 'sending' ? (
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      <>
                        {message.isUser ? (
                          <p>{message.text}</p>
                        ) : (
                          <ReactMarkdown 
                            components={{
                              strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        )}
                        
                        {message.foundMovies && message.foundMovies.length > 0 && (
                          <div className="found-movies-list mt-3">
                            <div className="text-xs text-gray-400 mb-2">
                              Found {message.foundMovies.length} movie{message.foundMovies.length > 1 ? 's' : ''}:
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              {message.foundMovies.map((movie, index) => (
                                <div 
                                  key={index} 
                                  onClick={() => handleMovieClick(movie)}
                                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/30 border border-gray-700/50 cursor-pointer hover:bg-gray-700/40 hover:border-gray-600/60 transition-all duration-200 group"
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      handleMovieClick(movie);
                                    }
                                  }}
                                  title={`Click to view details for ${movie.title}`}
                                >
                                  {movie.poster_path && (
                                    <img 
                                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                      alt={movie.title}
                                      className="w-8 h-12 object-cover rounded group-hover:scale-105 transition-transform duration-200"
                                    />
                                  )}
                                  <div className="flex-1 text-xs">
                                    <div className="font-medium text-white group-hover:text-blue-300 transition-colors duration-200">
                                      {movie.title}
                                    </div>
                                    {movie.year && (
                                      <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                                        ({movie.year})
                                      </div>
                                    )}
                                    {movie.vote_average > 0 && (
                                      <div className="text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200">
                                        ★ {movie.vote_average.toFixed(1)}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-gray-500 group-hover:text-gray-300 transition-colors duration-200">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
                                    </svg>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                    {message.isUser && message.status === 'error' && (
                      <span className="error-icon" title="Failed to send">⚠️</span>
                    )}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <div className="chat-input-container">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about movies, actors, genres..."
                className="chat-input"
                disabled={isLoading}
                maxLength={500}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="chat-send-btn"
                aria-label="Send message"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 12L22 2L13 22L11 13L2 12Z" />
                </svg>
              </button>
            </div>
            <div className="chat-input-footer">
              <span className="input-hint">
                Press Enter to send • {inputValue.length}/500 • History: {chatApiService.getChatLength()} messages
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        className={`chat-float-btn ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label="Open movie assistant chat"
      >
        {isOpen ? (
          <span className="chat-close-icon">✕</span>
        ) : (
          <span className="chat-icon">💬</span>
        )}
        {!isOpen && messages.length > 1 && (
          <div className="chat-notification">
            <span>{messages.length - 1}</span>
          </div>
        )}
      </button>
    </>
  );
}