"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, RefreshCw } from "lucide-react";
import { aiService, ChatMessage } from "@/lib/services/ai.service";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { cn } from "@/lib/utils";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "assistant",
    text: "Hello! I'm your ShopFlow AI Assistant. Ask me about products, stock availability, or price recommendations!",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const SUGGESTED_PROMPTS = [
  "Running shoes under $100",
  "Top apparel recommendations",
  "Latest electronics in stock",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage(query, messages);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "assistant",
          text: "Sorry, I had trouble processing your request. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant Chat"
        className={cn(
          "fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm text-white focus:outline-none focus:ring-4 focus:ring-emerald-600/30",
          isOpen
            ? "bg-slate-800 hover:bg-slate-900 rotate-90"
            : "bg-emerald-800 hover:bg-emerald-900 hover:scale-105 active:scale-95"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-emerald-300 animate-pulse" />
            <span className="hidden sm:inline font-semibold">AI Assistant</span>
          </>
        )}
      </button>

      {/* Drawer Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-scale-in"
          role="dialog"
          aria-label="AI Shopping Assistant"
        >
          {/* Header */}
          <div className="bg-emerald-800 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-none flex items-center gap-1.5">
                  ShopFlow AI <Sparkles className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
                </h3>
                <span className="text-[11px] text-emerald-200">Grounded catalog assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-emerald-200 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50">
            {messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} onProductClick={() => setIsOpen(false)} />
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                <span>Searching catalog...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, sizes, budget..."
              className="flex-1 text-xs bg-slate-100 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
