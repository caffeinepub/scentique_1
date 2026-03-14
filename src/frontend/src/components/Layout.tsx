import { Toaster } from "@/components/ui/sonner";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../hooks/useCart";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const routerState = useRouterState();
  const isAdmin = routerState.location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        {children}
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="font-display text-2xl text-foreground tracking-wide hover:text-primary transition-colors"
          >
            Scentique
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/shop"
              className="font-sans text-sm font-medium tracking-widest uppercase text-foreground/70 hover:text-primary transition-colors"
              data-ocid="nav.shop_link"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="font-sans text-sm font-medium tracking-widest uppercase text-foreground/70 hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/admin"
              className="font-sans text-sm font-medium tracking-widest uppercase text-foreground/70 hover:text-primary transition-colors"
              data-ocid="nav.admin_link"
            >
              Admin
            </Link>
            <Link
              to="/cart"
              className="relative flex items-center gap-1 font-sans text-sm font-medium tracking-widest uppercase text-foreground/70 hover:text-primary transition-colors"
              data-ocid="nav.cart_link"
            >
              <ShoppingBag className="w-4 h-4" />
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center font-sans">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>

          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-background border-t border-border px-6 py-4 flex flex-col gap-4">
            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className="font-sans text-sm font-medium tracking-widest uppercase"
              data-ocid="nav.shop_link"
            >
              Shop
            </Link>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="font-sans text-sm font-medium tracking-widest uppercase"
            >
              About
            </Link>
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="font-sans text-sm font-medium tracking-widest uppercase"
              data-ocid="nav.admin_link"
            >
              Admin
            </Link>
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="font-sans text-sm font-medium tracking-widest uppercase flex items-center gap-2"
              data-ocid="nav.cart_link"
            >
              <ShoppingBag className="w-4 h-4" /> Cart{" "}
              {totalItems > 0 && `(${totalItems})`}
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-foreground text-background mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-display text-2xl mb-3">Scentique</p>
            <p className="font-sans text-sm opacity-60 leading-relaxed">
              Curated luxury fragrances for the discerning connoisseur.
            </p>
          </div>
          <div>
            <p className="font-sans text-xs font-medium tracking-widest uppercase mb-4 opacity-60">
              Navigate
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to="/shop"
                className="font-sans text-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                Shop All
              </Link>
              <Link
                to="/about"
                className="font-sans text-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                Our Story
              </Link>
              <Link
                to="/cart"
                className="font-sans text-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                Cart
              </Link>
            </div>
          </div>
          <div>
            <p className="font-sans text-xs font-medium tracking-widest uppercase mb-4 opacity-60">
              Categories
            </p>
            <div className="flex flex-col gap-2">
              <span className="font-sans text-sm opacity-70">
                Men's Collection
              </span>
              <span className="font-sans text-sm opacity-70">
                Women's Collection
              </span>
              <span className="font-sans text-sm opacity-70">Unisex</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 max-w-6xl mx-auto px-6 py-4">
          <p className="font-sans text-xs opacity-40 text-center">
            &copy; {new Date().getFullYear()}. Built with &hearts; using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="hover:opacity-70 transition-opacity underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <Toaster richColors position="top-right" />
    </div>
  );
}
