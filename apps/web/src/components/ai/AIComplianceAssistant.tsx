'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
    Sparkles,
    Send,
    MessageCircle,
    X,
    Maximize2,
    Minimize2,
    Copy,
    RefreshCw,
    Lightbulb,
    HelpCircle,
    FileText,
    Calculator,
    Users,
    Calendar,
    ChevronRight,
    Bot,
    User,
    CheckCircle2,
} from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    suggestions?: string[];
}

interface AIComplianceAssistantProps {
    isOpen?: boolean;
    onClose?: () => void;
    defaultExpanded?: boolean;
    className?: string;
}

/**
 * AI Compliance Assistant
 * Natural language queries for compliance intelligence
 */
export function AIComplianceAssistant({
    isOpen = true,
    onClose,
    defaultExpanded = false,
    className = '',
}: AIComplianceAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm your AI Compliance Assistant. I can help you with ACA eligibility calculations, penalty exposure analysis, safe harbor testing, and regulatory guidance. What would you like to know?",
            timestamp: 'Just now',
            suggestions: [
                'What is my current penalty exposure?',
                'Show employees at risk of FT status change',
                'Explain the look-back measurement method',
                'Calculate safe harbor for employee #12345',
            ],
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const quickActions = [
        { icon: <Calculator className="w-4 h-4" />, label: 'Safe Harbor Test', query: 'Run safe harbor affordability test' },
        { icon: <Users className="w-4 h-4" />, label: 'At-Risk Employees', query: 'Show employees at risk' },
        { icon: <FileText className="w-4 h-4" />, label: 'Regulatory Updates', query: 'Latest IRS guidance' },
        { icon: <Calendar className="w-4 h-4" />, label: 'Upcoming Deadlines', query: 'What are my upcoming deadlines?' },
    ];

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: 'Just now',
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response
        await new Promise(resolve => setTimeout(resolve, 1500));

        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: getAIResponse(inputValue),
            timestamp: 'Just now',
            suggestions: ['Tell me more', 'Show detailed breakdown', 'Export this data'],
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
    };

    const getAIResponse = (query: string): string => {
        // Simulated AI responses based on common queries
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('penalty') || lowerQuery.includes('exposure')) {
            return "Based on current data, your total 4980H penalty exposure is **$127,450**. This breaks down to:\n\n• **4980H(a)**: $45,000 (15 employees without MEC offer)\n• **4980H(b)**: $82,450 (23 employees with unaffordable coverage)\n\nI recommend prioritizing the 4980H(a) exposure first, as this represents the greater per-employee penalty. Would you like me to identify the specific employees affected?";
        }

        if (lowerQuery.includes('safe harbor')) {
            return "For safe harbor testing, I can run calculations using any of the three methods:\n\n1. **W-2 Safe Harbor** - Uses prior year Box 1 wages\n2. **Rate of Pay** - Uses hourly rate × 130 hours\n3. **Federal Poverty Line** - Uses mainland single FPL\n\nWhich method would you like me to use? You can also provide an employee ID for individual testing.";
        }

        if (lowerQuery.includes('at risk') || lowerQuery.includes('employees')) {
            return "I've identified **12 employees** currently at risk of FT status change based on hour trending:\n\n• **5 employees** approaching 130-hour threshold (currently 115-129 avg)\n• **4 employees** with variable hours requiring monitoring\n• **3 employees** in stability period ending next month\n\nWould you like a detailed list with recommended actions?";
        }

        if (lowerQuery.includes('deadline')) {
            return "Here are your upcoming compliance deadlines:\n\n📅 **March 31, 2026** - 1095-C distribution deadline\n📅 **March 31, 2026** - 1094-C/1095-C e-file deadline (250+ forms)\n📅 **April 30, 2026** - 1094-C/1095-C paper file deadline (<250 forms)\n\nYou have **62 days** until the first deadline. Would you like me to check your filing readiness?";
        }

        return "I understand you're asking about **" + query.slice(0, 50) + "**. Let me analyze your compliance data to provide relevant insights.\n\nBased on your current configuration, I can provide detailed analysis on eligibility status, measurement periods, safe harbor calculations, and penalty exposure. Which aspect would you like me to focus on?";
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
        flex flex-col
        ${isExpanded ? 'fixed inset-4 z-50' : 'glass-card'}
        bg-[#0A0A0F] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden
        ${isExpanded ? 'shadow-[0_20px_60px_rgba(0,0,0,0.6)]' : ''}
        ${className}
      `}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                            AI Compliance Assistant
                        </h2>
                        <p className="text-xs text-[#64748B]">Powered by Synapse Intelligence</p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white transition-colors"
                    >
                        {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-b border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)]">
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(action.query)}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#94A3B8] hover:text-white bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-lg whitespace-nowrap transition-all"
                        >
                            {action.icon}
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
              ${message.role === 'assistant'
                                ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20'
                                : 'bg-cyan-500/20'
                            }
            `}>
                            {message.role === 'assistant' ? (
                                <Bot className="w-4 h-4 text-violet-400" />
                            ) : (
                                <User className="w-4 h-4 text-cyan-400" />
                            )}
                        </div>

                        <div className={`
              max-w-[80%] rounded-xl p-3
              ${message.role === 'user'
                                ? 'bg-cyan-500/10 border border-cyan-500/20'
                                : 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]'
                            }
            `}>
                            <div
                                className="text-sm text-[#E2E8F0] whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{
                                    __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                                }}
                            />

                            {message.suggestions && (
                                <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)] space-y-1.5">
                                    {message.suggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="flex items-center gap-2 w-full text-left text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                                        >
                                            <ChevronRight className="w-3 h-3" />
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <p className="text-[10px] text-[#64748B] mt-2">{message.timestamp}</p>
                        </div>
                    </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-violet-400" />
                        </div>
                        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about compliance, eligibility, or penalties..."
                        className="flex-1 px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-cyan-500/50"
                    />
                    <motion.button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
              p-2.5 rounded-lg transition-all
              ${inputValue.trim()
                                ? 'bg-gradient-to-b from-cyan-500 to-teal-600 text-[#030712]'
                                : 'bg-[rgba(255,255,255,0.04)] text-[#64748B]'
                            }
            `}
                    >
                        <Send className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

export default AIComplianceAssistant;
