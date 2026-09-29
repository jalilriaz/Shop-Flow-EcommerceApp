"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bot, User as UserIcon } from "lucide-react";
import { ChatMessage } from "@/lib/services/ai.service";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { cn } from "@/lib/utils";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onProductClick?: () => void;
}

export function ChatMessageBubble({ message, onProductClick }: ChatMessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <div className={cn("flex gap-3 mb-4", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold shadow-xs",
          isUser ? "bg-purple-800 text-white" : "bg-emerald-800 text-white"
        )}
      >
        {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble Content */}
      <div className={cn("max-w-[80%] space-y-2", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "p-3.5 rounded-2xl text-sm leading-relaxed",
            isUser
              ? "bg-purple-800 text-white rounded-tr-none shadow-sm"
              : "bg-slate-100 text-slate-900 border border-slate-200/80 rounded-tl-none"
          )}
        >
          {message.text}
        </div>

        {/* Embedded Products Cards */}
        {message.products && message.products.length > 0 && (
          <div className="grid grid-cols-1 gap-2 pt-1">
            {message.products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={onProductClick}
                className="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-xl hover:border-emerald-600 hover:shadow-xs transition-all group"
              >
                <div className="relative w-12 h-12 rounded-lg bg-slate-50 overflow-hidden shrink-0">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 truncate group-hover:text-emerald-700">
                    {product.name}
                  </p>
                  <PriceDisplay
                    price={product.price}
                    discountPrice={product.discountPrice}
                    size="sm"
                    showBadge={false}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

        <span className="text-[10px] text-slate-400 block px-1">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
