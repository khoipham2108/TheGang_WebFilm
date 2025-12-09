// src/services/chatApi.tsx
import BackendApi from './BackendApi'

export interface MovieInfo {
  title: string;
  tmdb_id: number;
  year?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  overview?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  type?: 'greeting' | 'llm_response' | 'error';
  foundMovies?: MovieInfo[];
  moviesCount?: number;
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  found_movies?: MovieInfo[];
}

export interface ChatResponse {
  success: boolean;
  response: string;
  chat_history: ChatHistoryItem[];
  found_movies?: MovieInfo[];
  context_used?: boolean;
  type?: string;
  error?: string;
}

export interface ChatRequest {
  message: string;
  chat_history: ChatHistoryItem[];
  session_id?: string;
  user_id?: number;
}

class ChatApiService {
  private chatHistory: ChatHistoryItem[] = [];
  private sessionId?: string;
  private isInitialized = false;

  // Get current user ID from localStorage via BackendApi
  private getUserId(): number {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData).id : 1; // Default to 1 if no user data
  }

  // Initialize chat with greeting
  async initializeChat(): Promise<ChatResponse> {
    try {
      if (this.isInitialized && this.chatHistory.length > 0) {
        return {
          success: true,
          response: this.chatHistory[0]?.content || "Hello! I'm your movie assistant.",
          chat_history: this.chatHistory,
          found_movies: []
        };
      }

      // Initialize with a greeting message locally
      const fallbackGreeting = "Hello! I'm your movie and entertainment assistant. I can help with movie recommendations, actor information, and entertainment questions!";

      this.chatHistory = [{
        role: 'assistant',
        content: fallbackGreeting,
        timestamp: new Date().toISOString(),
        found_movies: []
      }];

      this.isInitialized = true;

      return {
        success: true,
        response: fallbackGreeting,
        chat_history: this.chatHistory,
        found_movies: []
      };

    } catch (error: any) {
      console.error('Chat initialization error:', error);

      // Fallback initialization
      const fallbackGreeting = "Hello! I'm your movie assistant. I can help with recommendations, movie information, and entertainment questions!";
      this.chatHistory = [{
        role: 'assistant',
        content: fallbackGreeting,
        timestamp: new Date().toISOString()
      }];

      this.isInitialized = true;

      return {
        success: true,
        response: fallbackGreeting,
        chat_history: this.chatHistory,
        found_movies: []
      };
    }
  }

  async askQuestion(question: string, userId?: number): Promise<ChatResponse> {
    try {
      // Ensure chat is initialized
      if (!this.isInitialized) {
        await this.initializeChat();
      }

      // Use provided userId or get from localStorage, fallback to 1
      const currentUserId = userId !== undefined ? userId : this.getUserId();

      const requestData: ChatRequest = {
        message: question.trim(),
        chat_history: this.chatHistory,
        session_id: this.sessionId,
        user_id: currentUserId
      };

      console.log('Sending chat request:', {
        message: requestData.message,
        historyLength: requestData.chat_history.length,
        userId: requestData.user_id
      });

      // Use BackendApi to make the request
      const response = await BackendApi.chatWithLLM(requestData);

      // Extract data from axios response
      const data = response.data;

      // Update chat history with the latest from the response
      if (data.chat_history) {
        this.chatHistory = data.chat_history;
      }

      // Update sessionId if returned
      if (data.session_id) {
        this.sessionId = data.session_id;
      }

      return data;
    } catch (error: any) {
      console.error('Error asking question:', error);

      // Add error message to local chat history
      const errorMessage: ChatHistoryItem = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        found_movies: []
      };

      const userMessage: ChatHistoryItem = {
        role: 'user',
        content: question.trim(),
        timestamp: new Date().toISOString()
      };

      this.chatHistory.push(userMessage, errorMessage);

      return {
        success: false,
        response: errorMessage.content,
        chat_history: this.chatHistory,
        found_movies: [],
        error: error.message || 'Unknown error'
      };
    }
  }

  // Reset chat with user context
  async resetChat(userId?: number): Promise<ChatResponse> {
    // Use provided userId or get from localStorage
    const currentUserId = userId !== undefined ? userId : this.getUserId();
    
    await this.clearHistory();
    return {
      success: true,
      response: this.chatHistory[0]?.content || "Chat reset successfully!",
      chat_history: this.chatHistory,
      found_movies: []
    };
  }

  // Convert chat history to UI messages format
  convertToUIMessages(chatHistory: ChatHistoryItem[]): ChatMessage[] {
    return chatHistory.map((item, index) => this.convertToUIFormat(item, index));
  }

  // Check if chat has context (more than just greeting)
  hasContext(): boolean {
    return this.chatHistory.length > 1;
  }

  // Get chat length
  getChatLength(): number {
    return this.chatHistory.length;
  }

  // Get current chat history
  getChatHistory(): ChatHistoryItem[] {
    return [...this.chatHistory];
  }

  // Clear chat history and reinitialize
  async clearHistory(): Promise<void> {
    this.chatHistory = [];
    this.sessionId = undefined;
    this.isInitialized = false;
    await this.initializeChat();
  }

  // Convert ChatHistoryItem to ChatMessage format for UI compatibility
  convertToUIFormat(historyItem: ChatHistoryItem, index: number): ChatMessage {
    return {
      id: `${historyItem.role}-${index}-${Date.now()}`,
      text: historyItem.content,
      isUser: historyItem.role === 'user',
      timestamp: new Date(historyItem.timestamp),
      status: 'sent',
      type: historyItem.role === 'assistant' ? 'llm_response' : undefined,
      foundMovies: historyItem.found_movies || [],
      moviesCount: historyItem.found_movies?.length || 0
    };
  }

  // Get chat history in UI format
  getChatHistoryForUI(): ChatMessage[] {
    return this.chatHistory.map((item, index) => this.convertToUIFormat(item, index));
  }

  // Get all movies found in the conversation
  getAllFoundMovies(): MovieInfo[] {
    const allMovies: MovieInfo[] = [];
    const seenTmdbIds = new Set<number>();

    this.chatHistory.forEach(message => {
      if (message.role === 'assistant' && message.found_movies) {
        message.found_movies.forEach(movie => {
          if (!seenTmdbIds.has(movie.tmdb_id)) {
            allMovies.push(movie);
            seenTmdbIds.add(movie.tmdb_id);
          }
        });
      }
    });

    return allMovies;
  }

  // Get movies from the last response
  getLastFoundMovies(): MovieInfo[] {
    for (let i = this.chatHistory.length - 1; i >= 0; i--) {
      const message = this.chatHistory[i];
      if (message.role === 'assistant' && message.found_movies && message.found_movies.length > 0) {
        return message.found_movies;
      }
    }
    return [];
  }

  // Get conversation summary with user context
  getSummary(): {
    messageCount: number;
    movieCount: number;
    lastActivity: string | null;
    userId: number;
  } {
    const messageCount = this.chatHistory.length;
    const movieCount = this.getAllFoundMovies().length;
    const lastActivity = this.chatHistory.length > 0 
      ? this.chatHistory[this.chatHistory.length - 1].timestamp 
      : null;

    return {
      messageCount,
      movieCount,
      lastActivity,
      userId: this.getUserId()
    };
  }

  // Export chat history for backup
  exportChatHistory(): string {
    return JSON.stringify({
      chatHistory: this.chatHistory,
      sessionId: this.sessionId,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  // Import chat history from backup
  importChatHistory(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.chatHistory && Array.isArray(data.chatHistory)) {
        this.chatHistory = data.chatHistory;
        this.sessionId = data.sessionId;
        this.isInitialized = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing chat history:', error);
      return false;
    }
  }
}

export default new ChatApiService();