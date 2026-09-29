"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Package,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/products" },
  { label: "Deals", href: "/products?sort=discount" },
];

export function Header() {
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-white transition-shadow duration-200",
          scrolled ? "shadow-sm border-b border-[#E2E8F0]" : "border-b border-[#E2E8F0]"
        )}
        style={{ height: "72px" }}
      >
        <div className="page-container h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="ShopFlow home"
          >
            <div className="w-8 h-8 rounded-[8px] bg-[#7C3AED] flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[#0F172A] font-700 text-lg tracking-tight">
              Shop<span className="text-[#7C3AED]">Flow</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-500 text-[#475569] hover:text-[#0F172A] transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-700 rounded-full flex items-center justify-center leading-none">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label={`Cart (${totalItems} items)`}
              className="relative w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#7C3AED] text-white text-[10px] font-700 rounded-full flex items-center justify-center leading-none">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2 px-3 h-10 min-h-[44px] rounded-[10px] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
                  aria-expanded={accountOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-xs font-700">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-500 hidden lg:block max-w-[80px] truncate">
                    {user?.name.split(" ")[0]}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-150", accountOpen && "rotate-180")} />
                </button>

                {accountOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setAccountOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-52 card-base shadow-lg z-20 py-1 animate-fade-in">
                      <div className="px-4 py-3 border-b border-[#E2E8F0]">
                        <p className="text-sm font-600 text-[#0F172A] truncate">{user?.name}</p>
                        <p className="text-xs text-[#64748B] truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        {isAdmin && (
                          <Link href="/admin/dashboard" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#7C3AED] transition-colors">
                            <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                          </Link>
                        )}
                        <Link href="/profile" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">
                          <User className="w-4 h-4" /> My Account
                        </Link>
                        <Link href="/orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">
                          <Package className="w-4 h-4" /> My Orders
                        </Link>
                        <hr className="border-[#E2E8F0] my-1" />
                        <button
                          type="button"
                          onClick={() => { logout(); setAccountOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center px-4 h-10 min-h-[44px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-600 rounded-[10px] transition-colors duration-150"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] text-[#475569] hover:bg-[#F1F5F9] transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-xl md:hidden animate-slide-in-right">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <span className="font-700 text-[#0F172A]">Menu</span>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="w-5 h-5 text-[#475569]" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-500 text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] rounded-[10px] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="px-4 border-t border-[#E2E8F0] pt-4 space-y-1">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-sm font-700">
                      {user?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-600 text-[#0F172A]">{user?.name}</p>
                      <p className="text-xs text-[#64748B]">{user?.email}</p>
                    </div>
                  </div>
                  {isAdmin && <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#475569] hover:bg-[#F8FAFC] rounded-[10px]"><LayoutDashboard className="w-4 h-4" /> Admin</Link>}
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#475569] hover:bg-[#F8FAFC] rounded-[10px]"><User className="w-4 h-4" /> My Account</Link>
                  <Link href="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#475569] hover:bg-[#F8FAFC] rounded-[10px]"><Package className="w-4 h-4" /> My Orders</Link>
                  <button type="button" onClick={() => { logout(); setMobileOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#EF4444] hover:bg-[#FEF2F2] rounded-[10px]"><LogOut className="w-4 h-4" /> Sign Out</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-3 bg-[#7C3AED] text-white text-sm font-600 rounded-[10px]">Sign In</Link>
              )}
            </div>
          </div>
        </>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="fixed top-0 left-0 right-0 z-50 p-4 animate-fade-in">
            <div className="max-w-2xl mx-auto mt-16 bg-white rounded-[16px] shadow-lg border border-[#E2E8F0] overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E2E8F0]">
                <Search className="w-5 h-5 text-[#94A3B8] shrink-0" />
                <input
                  type="search"
                  placeholder="Search for products..."
                  autoFocus
                  className="flex-1 text-[#0F172A] placeholder-[#94A3B8] text-base outline-none bg-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSearchOpen(false);
                    if (e.key === "Enter") {
                      const q = (e.target as HTMLInputElement).value;
                      if (q) {
                        window.location.href = `/products?q=${encodeURIComponent(q)}`;
                        setSearchOpen(false);
                      }
                    }
                  }}
                />
                <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
                  <X className="w-5 h-5 text-[#94A3B8]" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs text-[#64748B] mb-2 font-500">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Headphones", "MacBook", "Sneakers", "Watch", "Coffee"].map((term) => (
                    <a
                      key={term}
                      href={`/products?q=${term}`}
                      onClick={() => setSearchOpen(false)}
                      className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-xs text-[#475569] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors"
                    >
                      {term}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
