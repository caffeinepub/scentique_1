import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import ProductImage from "../components/ProductImage";
import { useCart } from "../hooks/useCart";
import { useGetProduct } from "../hooks/useQueries";

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/product/$id" });
  const productId = BigInt(id);
  const { data: product, isLoading } = useGetProduct(productId);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id.toString(),
      quantity: qty,
      name: product.name,
      priceInCents: Number(product.priceInCents),
      imageId: product.imageId,
      sizeML: Number(product.sizeML),
    });
    toast.success(`${product.name} added to cart`);
  };

  if (isLoading) {
    return (
      <div
        className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-16"
        data-ocid="product.loading_state"
      >
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="max-w-6xl mx-auto px-6 py-32 text-center"
        data-ocid="product.error_state"
      >
        <p className="font-display text-4xl text-muted-foreground mb-4">
          Fragrance not found
        </p>
        <Button asChild variant="outline">
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
        Back to Collection
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="aspect-square overflow-hidden bg-secondary">
            <ProductImage
              imageId={product.imageId}
              alt={product.name}
              className="w-full h-full object-cover"
              fallback="/assets/generated/perfume-oud.dim_800x800.jpg"
            />
          </div>
          {product.featured && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-sans text-xs tracking-widest uppercase">
              Featured
            </Badge>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col justify-center"
        >
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
            {product.category} &middot; {product.sizeML.toString()}ml
          </p>
          <h1 className="font-display text-5xl text-foreground mb-4 leading-tight">
            {product.name}
          </h1>
          <p className="font-display text-3xl text-primary mb-6">
            ${(Number(product.priceInCents) / 100).toFixed(2)}
          </p>
          <p className="font-sans text-base text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3 border border-border">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 hover:bg-secondary transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-sans text-sm w-8 text-center">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="p-3 hover:bg-secondary transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-sm tracking-widest uppercase py-6"
              data-ocid="product.add_to_cart.button"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart &middot; $
              {((Number(product.priceInCents) * qty) / 100).toFixed(2)}
            </Button>
          </div>

          <div className="border-t border-border pt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-1">
                Category
              </p>
              <p className="font-sans text-sm text-foreground capitalize">
                {product.category}
              </p>
            </div>
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-1">
                Size
              </p>
              <p className="font-sans text-sm text-foreground">
                {product.sizeML.toString()}ml
              </p>
            </div>
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-1">
                In Stock
              </p>
              <p className="font-sans text-sm text-foreground">
                {product.stockQuantity.toString()} units
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
