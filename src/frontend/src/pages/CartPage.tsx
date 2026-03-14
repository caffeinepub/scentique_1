import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import ProductImage from "../components/ProductImage";
import { useCart } from "../hooks/useCart";
import { usePlaceOrder } from "../hooks/useQueries";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalCents } =
    useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { mutateAsync: placeOrder, isPending } = usePlaceOrder();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in your name and email.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    try {
      const orderItems = items.map((item) => ({
        productId: BigInt(item.productId),
        quantity: BigInt(item.quantity),
      }));
      const orderId = await placeOrder({
        customerName: name,
        customerEmail: email,
        items: orderItems,
      });
      clearCart();
      toast.success(
        `Order #${orderId} placed successfully! Thank you, ${name}.`,
      );
      setName("");
      setEmail("");
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="max-w-6xl mx-auto px-6 py-32 text-center"
        data-ocid="cart.empty_state"
      >
        <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-6" />
        <h1 className="font-display text-4xl text-foreground mb-3">
          Your Cart is Empty
        </h1>
        <p className="font-sans text-muted-foreground mb-8">
          Add some beautiful fragrances to begin.
        </p>
        <Button
          asChild
          className="bg-primary text-primary-foreground font-sans text-sm tracking-widest uppercase"
        >
          <Link to="/shop">
            Explore Collection <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
          Review
        </p>
        <h1 className="font-display text-5xl text-foreground">Your Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 border border-border bg-card p-4"
                data-ocid={`cart.item.${i + 1}`}
              >
                <div className="w-20 h-20 bg-secondary flex-shrink-0 overflow-hidden">
                  <ProductImage
                    imageId={item.imageId}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    fallback="/assets/generated/perfume-oud.dim_800x800.jpg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground">
                    {item.sizeML}ml
                  </p>
                  <p className="font-sans text-sm text-primary mt-1">
                    ${(item.priceInCents / 100).toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="w-6 h-6 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-sans text-sm w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="w-6 h-6 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-sans text-sm font-medium">
                    ${((item.priceInCents * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-secondary p-8 sticky top-24">
            <h2 className="font-display text-2xl text-foreground mb-6">
              Order Summary
            </h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between font-sans text-sm"
                >
                  <span className="text-muted-foreground truncate mr-2">
                    {item.name} &times;{item.quantity}
                  </span>
                  <span>
                    ${((item.priceInCents * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="mb-4" />
            <div className="flex justify-between mb-8">
              <span className="font-sans text-sm font-medium tracking-widest uppercase">
                Total
              </span>
              <span className="font-display text-2xl text-primary">
                ${(totalCents / 100).toFixed(2)}
              </span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <Label
                  htmlFor="checkout-name"
                  className="font-sans text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Your Name
                </Label>
                <Input
                  id="checkout-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="mt-1 font-sans bg-background"
                  required
                  data-ocid="cart.checkout.input"
                />
              </div>
              <div>
                <Label
                  htmlFor="checkout-email"
                  className="font-sans text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Email Address
                </Label>
                <Input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="mt-1 font-sans bg-background"
                  required
                  data-ocid="cart.checkout.input"
                />
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-sm tracking-widest uppercase py-6"
                data-ocid="cart.checkout.submit_button"
              >
                {isPending ? "Placing Order..." : "Place Order"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
