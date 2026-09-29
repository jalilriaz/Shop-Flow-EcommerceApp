import Link from "next/link";
import { ShoppingCart, Mail, Phone, MapPin } from "lucide-react";

const FOOTER_LINKS = {
  Shop: [
    { label: "All Products", href: "/products" },
    { label: "Categories", href: "/products" },
    { label: "Deals & Offers", href: "/products?sort=discount" },
    { label: "New Arrivals", href: "/products?sort=newest" },
  ],
  Account: [
    { label: "My Profile", href: "/profile" },
    { label: "My Orders", href: "/orders" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Sign In", href: "/login" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Track Order", href: "/orders" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white mt-auto">
      <div className="page-container py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="ShopFlow home">
              <div className="w-8 h-8 rounded-[8px] bg-[#7C3AED] flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-700 text-lg">Shop<span className="text-[#A78BFA]">Flow</span></span>
            </Link>
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-5">
              Modern. Clean. Premium. Your destination for curated products and a seamless shopping experience.
            </p>
            <div className="space-y-2">
              <a href="mailto:hello@shopflow.com" className="flex items-center gap-2 text-xs text-[#64748B] hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5" /> hello@shopflow.com
              </a>
              <a href="tel:+15551234567" className="flex items-center gap-2 text-xs text-[#64748B] hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5" /> +1 (555) 123-4567
              </a>
              <span className="flex items-center gap-2 text-xs text-[#64748B]">
                <MapPin className="w-3.5 h-3.5" /> San Francisco, CA
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-600 text-white mb-4">{heading}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#64748B] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1E293B]">
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#475569]">
            © {new Date().getFullYear()} ShopFlow. All rights reserved.
          </p>
          <p className="text-xs text-[#475569]">
            Modern. Clean. Premium.
          </p>
        </div>
      </div>
    </footer>
  );
}
