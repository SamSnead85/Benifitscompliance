'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Send,
    Sparkles,
    Brain,
    Loader2,
    Copy,
    Check,
    User,
    ChevronDown,
    FileText,
    BarChart3,
    Users
} from 'lucide-react';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    suggestions?: string[];
}

interface AIAssistantChatProps {
    className?: string;
}

const quickActions = [
    { icon: FileText, label: 'Generate compliance report', prompt: 'Generate a compliance summary report for Q4 2025' },
    { icon: BarChart3, label: 'Analyze FTE trends', prompt: 'Show me FTE trends over the past 12 months' },
    { icon: Users, label: 'Find coverage gaps', prompt: 'Identify employees with coverage gaps' },
];

const initialMessages: ChatMessage[] = [
    {
        id: 'init-1',
        role: 'assistant',
        content: "Hello! I'm your AI compliance assistant. I can help you with ACA compliance questions, generate reports, analyze employee data, and provide insights. How can I help you today?",
        timestamp: new Date(),
        suggestions: [
            'What is my current compliance score?',
            'Show employees at risk of penalty',
            'Explain the 4980H safe harbor rules'
        ]
    }
];

export function AIAssistantChat({ className = '' }: AIAssistantChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text?: string) => {
        const messageText = text || input;
        if (!messageText.trim()) return;

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: messageText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));

        const responses: Record<string, { content: string; suggestions?: string[] }> = {
            'compliance score': {
                content: "Your current overall compliance score is **96.8%**, up 1.2% from last month. Here's the breakdown:\n\n• Coverage Offers: 98.2%\n• Affordability: 94.5%\n• Waiting Period: 99.1%\n• Reporting: 95.8%\n\nThe affordability component has the most room for improvement. Would you like me to identify which employees are affecting this score?",
                suggestions: ['Show affordability issues', 'Compare to industry benchmark']
            },
            'penalty': {
                content: "Based on current data, I've identified **23 employees** at potential risk of triggering 4980H penalties:\n\n**4980H(a) - Coverage Offer Risk:** 8 employees\nThese employees were not offered minimum essential coverage.\n\n**4980H(b) - Affordability Risk:** 15 employees\nPremium contributions exceed 9.12% of household income.\n\nEstimated potential penalty: **$68,400**\n\nWould you like to review these employees or apply bulk corrections?",
                suggestions: ['Review affected employees', 'Apply safe harbor fix']
            },
            'safe harbor': {
                content: "The ACA provides three safe harbor methods for determining affordability:\n\n**1. W-2 Safe Harbor**\nCompare employee's COPE (cost of lowest-tier coverage) to their W-2 Box 1 wages multiplied by 9.12%.\n\n**2. Rate of Pay Safe Harbor**\nCalculate 130 × hourly rate × 9.12% for hourly employees.\n\n**3. Federal Poverty Level (FPL) Safe Harbor**\nContribution must not exceed 9.12% of the FPL for a single individual ($14,580 in 2025).\n\n**My Recommendation:** Based on your workforce composition, using Rate of Pay safe harbor for hourly workers and FPL for salary workers offers the best protection.",
                suggestions: ['Which safe harbor am I using?', 'Optimize safe harbor']
            },
            default: {
                content: "I understand you're asking about ACA compliance. Let me analyze your request and provide relevant insights.\n\nBased on your current data:\n• Total employees tracked: 4,521\n• Full-time equivalents: 4,298\n• Compliance score: 96.8%\n\nCould you provide more details about what specific aspect you'd like me to analyze?",
                suggestions: ['Run compliance audit', 'Generate report', 'Show recent alerts']
            }
        };

        let response = responses.default;
        const lowerText = messageText.toLowerCase();
        if (lowerText.includes('score')) response = responses['compliance score'];
        else if (lowerText.includes('penalty') || lowerText.includes('risk')) response = responses['penalty'];
        else if (lowerText.includes('safe harbor') || lowerText.includes('affordability')) response = responses['safe harbor'];

        const assistantMessage: ChatMessage = {
            id: `asst-${Date.now()}`,
            role: 'assistant',
            content: response.content,
            timestamp: new Date(),
            suggestions: response.suggestions
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSuggestionClick = (suggestion: string) => {
        handleSend(suggestion);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card flex flex-col h-[600px] ${className}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                        <Brain className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            AI Assistant
                            <Sparkles className="w-4 h-4 text-[var(--color-synapse-gold)]" />
                        </h3>
                        <p className="text-xs text-[var(--color-synapse-teal)]">Online • Ready to help</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 border-b border-[var(--glass-border)]">
                <div className="flex gap-2 overflow-x-auto">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={action.label}
                                onClick={() => handleSend(action.prompt)}
                                className="px-3 py-1.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs text-[var(--color-steel)] hover:text-white hover:border-[var(--color-synapse-teal)] flex items-center gap-2 whitespace-nowrap transition-colors"
                            >
                                <Icon className="w-3 h-3" />
                                {action.label}
                            </button>
                        );
                    })}
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
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${message.role === 'assistant'
                                ? 'bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)]'
                                : 'bg-[var(--glass-bg-light)]'
                            }`}>
                            {message.role === 'assistant' ? (
                                <Brain className="w-4 h-4 text-black" />
                            ) : (
                                <User className="w-4 h-4 text-[var(--color-silver)]" />
                            )}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                            <div className={`inline-block rounded-xl p-4 ${message.role === 'assistant'
                                    ? 'bg-[var(--glass-bg-light)] text-left'
                                    : 'bg-[var(--color-synapse-teal)] text-black'
                                }`}>
                                <p className={`text-sm whitespace-pre-wrap ${message.role === 'assistant' ? 'text-[var(--color-silver)]' : ''
                                    }`}>
                                    {message.content.split('**').map((part, i) =>
                                        i % 2 === 0 ? part : <strong key={i} className="text-white">{part}</strong>
                                    )}
                                </p>

                                {message.role === 'assistant' && (
                                    <button
                                        onClick={() => handleCopy(message.content, message.id)}
                                        className="mt-2 text-xs text-[var(--color-steel)] hover:text-white flex items-center gap-1"
                                    >
                                        {copiedId === message.id ? (
                                            <><Check className="w-3 h-3" /> Copied</>
                                        ) : (
                                            <><Copy className="w-3 h-3" /> Copy</>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Suggestions */}
                            {message.suggestions && message.role === 'assistant' && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {message.suggestions.map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="px-3 py-1 rounded-lg text-xs text-[var(--color-synapse-teal)] border border-[var(--color-synapse-teal)] hover:bg-[var(--color-synapse-teal)] hover:text-black transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}
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
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <Brain className="w-4 h-4 text-black" />
                        </div>
                        <div className="bg-[var(--glass-bg-light)] rounded-xl p-4">
                            <div className="flex gap-1">
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 rounded-full bg-[var(--color-synapse-teal)]" />
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full bg-[var(--color-synapse-teal)]" />
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full bg-[var(--color-synapse-teal)]" />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[var(--glass-border)]">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-3"
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about compliance, reports, or employee data..."
                        className="flex-1 px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white placeholder:text-[var(--color-steel)] focus:border-[var(--color-synapse-teal)] focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="px-4 py-3 rounded-xl bg-[var(--color-synapse-teal)] text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-synapse-cyan)] transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </motion.div>
    );
}

export default AIAssistantChat;
