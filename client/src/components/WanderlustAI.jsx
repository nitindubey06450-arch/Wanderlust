import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/aiService';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Compass,
  Bot,
  User,
  Star,
  MapPin,
  BookmarkPlus,
  History,
  Trash2,
  ExternalLink,
  ChevronDown,
  Globe2,
  AlertCircle
} from 'lucide-react';

const QUICK_PROMPTS = [
  "Explore India 🇮🇳",
  "Plan a trip",
  "Best destinations",
  "Budget travel",
  "Weekend getaway",
  "International travel"
];

// Helper to format simple Markdown text (bold, headings, bullet lists, numbered lists)
const FormattedMarkdown = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  return (
    <div className="space-y-2 text-sm leading-relaxed font-sans">
      {lines.map((line, index) => {
        // Headings ###
        if (line.startsWith('### ')) {
          return (
            <h4 key={index} className="font-extrabold text-base text-slate-900 mt-3 mb-1">
              {line.replace('### ', '')}
            </h4>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h3 key={index} className="font-extrabold text-lg text-slate-900 mt-4 mb-1">
              {line.replace('## ', '')}
            </h3>
          );
        }

        // Bullet points - or *
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const rawText = line.trim().substring(2);
          return (
            <div key={index} className="flex items-start gap-2 pl-2 my-1">
              <span className="text-emerald-500 font-bold">•</span>
              <span>{renderFormattedText(rawText)}</span>
            </div>
          );
        }

        // Numbered list 1. 2.
        const numberedMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          return (
            <div key={index} className="flex items-start gap-2 pl-2 my-1">
              <span className="text-emerald-600 font-extrabold text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {numberedMatch[1]}
              </span>
              <span>{renderFormattedText(numberedMatch[2])}</span>
            </div>
          );
        }

        // Empty line
        if (!line.trim()) {
          return <div key={index} className="h-1" />;
        }

        // Regular paragraph
        return <p key={index}>{renderFormattedText(line)}</p>;
      })}
    </div>
  );
};

// Helper for bold formatting (**text**)
const renderFormattedText = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const WanderlustAI = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  
  // Saved conversations drawer
  const [showHistory, setShowHistory] = useState(false);
  const [savedConversations, setSavedConversations] = useState([]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  // Initial welcome message if conversation is empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `Hello! 👋 I'm **Wanderlust AI**, your personal AI travel companion.\n\nAsk me anything about traveling across India or worldwide — itinerary planning, best times to visit, budget estimates, or hidden gems!`,
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  // Fetch saved chat conversations for logged-in user
  const loadConversations = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await aiService.getConversations();
      if (res.success) {
        setSavedConversations(res.conversations || []);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadConversations();
    }
  }, [isOpen, isAuthenticated]);

  const handleSend = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    const userMsg = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Format history for context (exclude system messages & inline destination objects)
      const historyContext = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      const res = await aiService.chat(textToSend, historyContext, conversationId);

      if (res.success) {
        const aiMsg = {
          role: 'assistant',
          content: res.message,
          destinations: res.destinations || [],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
        if (res.conversationId) {
          setConversationId(res.conversationId);
        }
      }
    } catch (err) {
      console.error('AI Chat Error:', err);
      toast.error(err.message || 'Sorry, Wanderlust AI is temporarily unavailable.');
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, Wanderlust AI is temporarily unavailable. Please try again in a moment.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Chat cleared! How can I assist your travel plans today?`,
        timestamp: new Date()
      }
    ]);
    setConversationId(null);
    toast.success('Chat cleared');
  };

  const handleSelectSavedChat = async (id) => {
    try {
      const res = await aiService.getConversationById(id);
      if (res.success && res.conversation) {
        setMessages(res.conversation.messages || []);
        setConversationId(res.conversation._id);
        setShowHistory(false);
        toast.success(`Loaded conversation: ${res.conversation.title}`);
      }
    } catch (err) {
      toast.error('Failed to load conversation');
    }
  };

  const handleDeleteSavedChat = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await aiService.deleteConversation(id);
      if (res.success) {
        setSavedConversations(prev => prev.filter(c => c._id !== id));
        if (conversationId === id) {
          handleClearChat();
        }
        toast.success('Chat deleted');
      }
    } catch (err) {
      toast.error('Failed to delete chat');
    }
  };

  const handleSaveTrip = async (itineraryText) => {
    if (!isAuthenticated) {
      toast.error('Please log in to save this trip to your profile');
      return;
    }

    try {
      // Extract basic metadata or infer
      const firstLine = itineraryText.split('\n')[0].replace(/[#*]/g, '').trim();
      const title = firstLine.length > 5 ? firstLine.slice(0, 40) : 'Saved AI Itinerary';

      await aiService.saveTrip({
        title,
        destination: 'AI Curated Destination',
        startLocation: 'Flexible',
        duration: 'Multi-day',
        budget: 'Custom Estimate',
        travelStyle: 'AI Recommended',
        itinerary: itineraryText
      });

      toast.success('Trip itinerary saved to your profile!');
    } catch (err) {
      toast.error(err.message || 'Failed to save trip');
    }
  };

  return (
    <>
      {/* Floating Launcher Button at Bottom Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-2xl hover:shadow-emerald-600/40 transition-all transform hover:scale-105 active:scale-95 group border border-white/20"
        aria-label="Open Wanderlust AI Chatbot"
      >
        <div className="p-1 rounded-full bg-white/20">
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        </div>
        <span className="text-sm font-extrabold tracking-tight">Ask Wanderlust AI</span>
      </button>

      {/* Main Chatbot Modal Panel */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 w-full sm:w-[450px] md:w-[500px] h-full sm:h-[650px] sm:max-h-[85vh] bg-white/95 backdrop-blur-xl sm:rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Panel Header */}
          <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 text-white flex items-center justify-center shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Wanderlust AI Online"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base tracking-tight text-white">Wanderlust AI</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                    v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Your AI travel companion ✈️</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              {isAuthenticated && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`p-2 rounded-xl hover:bg-slate-800 transition-colors ${
                    showHistory ? 'text-emerald-400 bg-slate-800' : 'hover:text-white'
                  }`}
                  title="Saved Conversations"
                >
                  <History className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleClearChat}
                className="p-2 rounded-xl hover:bg-slate-800 hover:text-rose-400 transition-colors"
                title="Clear Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
                title="Close AI Panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversation History Drawer Overlay */}
          {showHistory && (
            <div className="bg-slate-800 text-white p-4 border-b border-slate-700 max-h-48 overflow-y-auto space-y-2 animate-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-400 mb-2">
                <span>Previous Conversations</span>
                <span className="text-emerald-400">{savedConversations.length} saved</span>
              </div>
              {savedConversations.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No saved conversations yet.</p>
              ) : (
                savedConversations.map(c => (
                  <div
                    key={c._id}
                    onClick={() => handleSelectSavedChat(c._id)}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 cursor-pointer text-xs transition-colors"
                  >
                    <span className="font-semibold truncate pr-2">{c.title}</span>
                    <button
                      onClick={(e) => handleDeleteSavedChat(e, c._id)}
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            
            {/* Quick Prompts Bar if chat is starting */}
            {messages.length <= 1 && (
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2 mb-4">
                <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">
                  Quick Prompts
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition-all shadow-xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message History */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-2xl shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none font-medium text-sm'
                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <FormattedMarkdown content={msg.content} />
                    )}
                  </div>

                  {/* Embedded Destination Cards in Chat */}
                  {msg.destinations && msg.destinations.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        Recommended Wanderlust Places:
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.destinations.map((dest) => (
                          <div
                            key={dest._id}
                            className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 hover:border-emerald-500 transition-all"
                          >
                            <img
                              src={dest.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80'}
                              alt={dest.name}
                              className="w-14 h-14 rounded-xl object-cover"
                            />
                            <div className="flex-grow min-w-0">
                              <h5 className="font-bold text-slate-900 text-xs truncate">{dest.name}</h5>
                              <p className="text-[11px] text-slate-500 truncate">{dest.country} • ${dest.estimatedBudget}</p>
                              <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span>{dest.rating}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setIsOpen(false);
                                navigate(`/destinations/${dest._id}`);
                              }}
                              className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors flex-shrink-0"
                            >
                              <span>View</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Save Trip Button for Assistant Itineraries */}
                  {msg.role === 'assistant' && msg.content.includes('Day 1') && (
                    <button
                      onClick={() => handleSaveTrip(msg.content)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Save Itinerary to Profile</span>
                    </button>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Thinking Indicator */}
            {loading && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4 animate-spin-slow" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none text-slate-500 text-xs font-semibold flex items-center gap-2 shadow-xs">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span>Wanderlust AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-center"
            >
              <textarea
                rows="1"
                placeholder="Ask Wanderlust AI... (e.g. Plan a 5 day trip to Goa)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-100 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-medium disabled:opacity-50 max-h-24"
              ></textarea>

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2.5 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1 font-medium">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Globe2 className="w-3 h-3" /> Live Travel Context
              </span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default WanderlustAI;
