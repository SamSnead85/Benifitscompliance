'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Bot,
    MessageSquare,
    Send,
    X,
    Loader2,
    FileText,
    Users,
    BarChart3,
    AlertTriangle,
    CheckCircle2,
    Zap,
    HelpCircle,
    Lightbulb
} from 'lucide-react';

interface AIAssistantPanelProps {
    className?: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    suggestions?: string[];
}

interface QuickAction {
    id: string;
    label: string;
    icon: typeof FileText;
    prompt: string;
}

const quickActions: QuickAction[] = [
    { id: 'qa1', label: 'Check Compliance Status', icon: CheckCircle2, prompt: 'What is our current ACA compliance status?' },
    { id: 'qa2', label: 'Identify At-Risk Employees', icon: AlertTriangle, prompt: 'Which employees are at risk of losing FT status?' },
    { id: 'qa3', label: 'Prepare Filing Summary', icon: FileText, prompt: 'Generate a summary for our 1095-C filings' },
    { id: 'qa4', label: 'Analyze Coverage Gaps', icon: Users, prompt: 'Analyze coverage gaps for FT eligible employees' },
];

const mockMessages: Message[] = [
    { id: 'm1', role: 'assistant', content: 'Hello! I\'m your AI Compliance Assistant. I can help you navigate ACA regulations, analyze employee data, and ensure your organization stays compliant. How can I assist you today?', timestamp: '2:30 PM', suggestions: ['Check compliance status', 'Review pending forms', 'Analyze eligibility'] },
];

export function AIAssistantPanel({ className = '' }: AIAssistantPanelProps) {
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: `m${messages.length + 1}`,
            role: 'user',
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const assistantMessage: Message = {
                id: `m${messages.length + 2}`,
                role: 'assistant',
                content: getAIResponse(input),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                suggestions: ['Tell me more', 'Show data', 'Export report'],
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);
        }, 1500);
    };

    const getAIResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('compliance') || lowerQuery.includes('status')) {
            return 'Your organization is currently at **98.5% compliance**. Here\'s a quick breakdown:\n\n• **3,891** full-time eligible employees have been offered coverage\n• **0** penalty exposure for the current tax year\n• **3** pending employee reviews require attention\n\nWould you like me to generate a detailed compliance report?';
        }
        if (lowerQuery.includes('risk') || lowerQuery.includes('at-risk')) {
            return 'I\'ve identified **12 employees** currently at risk of losing FT status:\n\n• 8 employees averaged below 130 hours in the last 2 months\n• 4 employees are approaching the end of their measurement period\n\nRecommendation: Review these employees\' schedules and consider proactive coverage offers.';
        }
        if (lowerQuery.includes('filing') || lowerQuery.includes('1095')) {
            return 'Your 1095-C filing summary for TY 2025:\n\n• **4,256** total forms generated\n• **0** forms with errors\n• **100%** ready for distribution\n• Distribution deadline: February 28, 2026\n\nFiling deadline is March 31, 2026. Want me to prepare the electronic filing package?';
        }
        return 'I understand you\'re asking about your benefits compliance. Based on my analysis of your data, everything appears to be in order. Is there a specific aspect you\'d like me to examine more closely?';
    };

    const handleQuickAction = (action: QuickAction) => {
        setInput(action.prompt);
    };

    const handleSuggestion = (suggestion: string) => {
        setInput(suggestion);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card flex flex-col h-[600px] ${className}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center relative">
                        <Sparkles className="w-5 h-5 text-black" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--color-success)] border-2 border-[var(--color-obsidian)]" />
                    </div>
                    <div>
                        <h3 className="font-medium text-white">AI Compliance Assistant</h3>
                        <p className="text-xs text-[var(--color-success)]">Online • Ready to help</p>
                    </div>
                </div>
                <button className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]">
                    <HelpCircle className="w-5 h-5" />
                </button>
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={action.id}
                                onClick={() => handleQuickAction(action)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] hover:border-[var(--color-synapse-teal)] transition-colors whitespace-nowrap"
                            >
                                <Icon className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                <span className="text-xs text-[var(--color-silver)]">{action.label}</span>
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
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] ${message.role === 'user' ? 'order-1' : ''}`}>
                            {message.role === 'assistant' && (
                                <div className="flex items-center gap-2 mb-1">
                                    <Bot className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                    <span className="text-xs text-[var(--color-steel)]">AI Assistant • {message.timestamp}</span>
                                </div>
                            )}
                            <div className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-[var(--color-synapse-teal)] text-black' : 'bg-[rgba(255,255,255,0.05)] text-white'}`}>
                                <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} />
                            </div>
                            {message.suggestions && message.role === 'assistant' && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {message.suggestions.map((suggestion, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSuggestion(suggestion)}
                                            className="px-2 py-1 text-xs rounded-full border border-[var(--glass-border)] text-[var(--color-steel)] hover:border-[var(--color-synapse-teal)] hover:text-[var(--color-synapse-teal)] transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {message.role === 'user' && (
                                <div className="text-right text-xs text-[var(--color-steel)] mt-1">{message.timestamp}</div>
                            )}
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[var(--color-steel)]">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                    </motion.div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[var(--glass-border)]">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about compliance, forms, or employees..."
                            className="w-full px-4 py-3 pr-12 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[var(--color-synapse-teal)] text-black disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default AIAssistantPanel;
