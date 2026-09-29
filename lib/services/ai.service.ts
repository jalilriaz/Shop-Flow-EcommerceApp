import { Product } from "@/lib/types/product";
import { productService } from "@/lib/services/product.service";
import { sleep } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  products?: Product[];
}

export const aiService = {
  async sendMessage(prompt: string, _history: ChatMessage[]): Promise<ChatMessage> {
    await sleep(800); // Simulate network & LLM latency

    const lower = prompt.toLowerCase();
    let replyText = "I can help you search our catalog, check product stock, and find recommendations. What are you looking for today?";
    let matchedProducts: Product[] = [];

    const allProductsRes = await productService.getAll();
    const allProducts = allProductsRes.data;

    if (lower.includes("shoe") || lower.includes("sneaker") || lower.includes("footwear")) {
      matchedProducts = allProducts.filter(p => p.categorySlug === "footwear" || p.name.toLowerCase().includes("shoe")).slice(0, 3);
      replyText = `Here are our top footwear recommendations based on your query:`;
    } else if (lower.includes("under") || lower.includes("cheap") || lower.includes("budget") || lower.includes("price")) {
      matchedProducts = allProducts.filter(p => (p.discountPrice ?? p.price) < 100).slice(0, 3);
      replyText = `Here are some popular items under $100 available right now:`;
    } else if (lower.includes("shirt") || lower.includes("apparel") || lower.includes("cloth")) {
      matchedProducts = allProducts.filter(p => p.categorySlug === "apparel").slice(0, 3);
      replyText = `Check out these trending apparel items from our collection:`;
    } else if (lower.includes("electronics") || lower.includes("tech") || lower.includes("watch")) {
      matchedProducts = allProducts.filter(p => p.categorySlug === "electronics" || p.categorySlug === "accessories").slice(0, 3);
      replyText = `Here are top electronics & tech accessories available in stock:`;
    } else {
      matchedProducts = allProducts.filter(p => p.featured).slice(0, 3);
      replyText = `I found these featured items that match your interest. Let me know if you'd like more details on size, color, or availability!`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      products: matchedProducts.length > 0 ? matchedProducts : undefined,
    };
  }
};
