import React, { useState } from 'react';
import { Send, Mic, Sparkles, MapPin, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'agent';
  content: string;
  structured?: {
    recommendation?: string;
    confidence?: number;
    location?: string;
    conditions?: { label: string; value: string }[];
  };
}

export default function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      content: 'I am the NeerMitra Copilot. How can I assist you with marine operations today?',
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    const query = input;
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      
      const data = await res.json();
      
      const agentResponse: Message = {
        role: 'agent',
        content: data.text || 'Error processing response.',
        structured: {
          recommendation: data.text,
          confidence: data.confidence,
          location: data.location,
          conditions: data.conditions?.map((c: string) => ({ label: 'Context', value: c })) || []
        }
      };
      
      setMessages([...newMessages, agentResponse]);
    } catch (err) {
      setMessages([...newMessages, { role: 'agent', content: 'Failed to connect to AI Core.' }]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-surface-elevated border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center space-x-3 bg-surface">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">NeerMitra Copilot</h2>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Marine Intelligence Assistant</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex flex-col max-w-[90%]", msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
            <div className={cn(
              "px-4 py-3 rounded-2xl shadow-sm text-sm",
              msg.role === 'user' 
                ? "bg-primary text-primary-foreground rounded-br-none" 
                : "bg-surface border border-border text-foreground rounded-bl-none"
            )}>
              {msg.content}
            </div>
            
            {/* Structured Data rendering for Agent */}
            {msg.structured && (
              <div className="mt-2 w-full bg-surface border border-border rounded-xl p-3 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Recommendation</span>
                    <p className="text-sm text-foreground font-medium mt-1">{msg.structured.recommendation}</p>
                  </div>
                  {msg.structured.confidence && (
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confidence</span>
                      <span className="text-lg font-bold text-green-500">{msg.structured.confidence}%</span>
                    </div>
                  )}
                </div>
                
                {msg.structured.location && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{msg.structured.location}</span>
                  </div>
                )}
                
                {msg.structured.conditions && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    {msg.structured.conditions.map(c => (
                      <div key={c.label}>
                        <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">{c.label}</span>
                        <span className="text-sm font-medium">{c.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="pt-2 flex gap-2">
                  <button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold py-1.5 rounded transition-colors">Show on Map</button>
                  <button className="flex-1 bg-surface-elevated hover:bg-muted text-foreground border border-border text-xs font-semibold py-1.5 rounded transition-colors">Why?</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-surface">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about PFZ, risks, optimization..."
            className="w-full bg-background border border-border rounded-full pl-4 pr-24 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
          />
          <div className="absolute right-2 flex items-center space-x-1">
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full">
              <Mic className="w-4 h-4" />
            </button>
            <button 
              onClick={handleSend}
              className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-full"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
