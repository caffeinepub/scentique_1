import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { useCart } from "../hooks/useCart";
import ProductImage from "./ProductImage";

const FALLBACK_IMAGES: Record<string, string> = {
  noir: "/assets/generated/perfume-noir.dim_800x800.jpg",
  rose: "/assets/generated/perfume-rose.dim_800x800.jpg",
  oud: "/assets/generated/perfume-oud.dim_800x800.jpg",
  fleur: "/assets/generated/perfume-fleur.dim_800x800.jpg",
  aqua: "/assets/generated/perfume-aqua.dim_800x800.jpg",
  obsidian: "/assets/generated/perfume-obsidian.dim_800x800.jpg",
};

function getFallback(imageId: string): string {
  const lower = imageId.toLowerCase();
  for (const [key, val] of Object.entries(FALLBACK_IMAGES)) {
    if (lower.includes(key)) return val;
  }
  return "/assets/generated/perfume-oud.dim_800x800.jpg";
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id.toString(),
      quantity: 1,
      name: product.name,
      priceInCents: Number(product.priceInCents),
      imageId: product.imageId,
      sizeML: Number(product.sizeML),
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link to="/product/$id" params={{ id: product.id.toString() }}>
        <div
          className="group relative bg-card overflow-hidden cursor-pointer"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
        >
          <div className="relative overflow-hidden aspect-square">
            <ProductImage
              imageId={product.imageId}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              fallback={getFallback(product.imageId)}
            />
            {product.featured && (
              <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-sans font-medium px-3 py-1 tracking-widest uppercase">
                Featured
              </div>
            )}
          </div>
          <div className="p-5">
            <p className="text-xs font-sans font-medium tracking-widest uppercase text-muted-foreground mb-1">
              {product.category} · {product.sizeML.toString()}ml
            </p>
            <h3 className="font-display text-lg text-foreground leading-snug mb-2">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <span className="font-display text-xl text-primary">
                ${(Number(product.priceInCents) / 100).toFixed(2)}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-sans text-xs tracking-widest uppercase"
                onClick={handleAddToCart}
                data-ocid="product.add_to_cart.button"
              >
                <ShoppingBag className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
