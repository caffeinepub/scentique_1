import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { useListByCategory } from "../hooks/useQueries";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "men", label: "Men's" },
  { value: "women", label: "Women's" },
  { value: "unisex", label: "Unisex" },
];

export default function ShopPage() {
  const search = useSearch({ from: "/shop" }) as { category?: string };
  const [activeTab, setActiveTab] = useState(search.category ?? "all");
  const { data: products, isLoading } = useListByCategory(activeTab);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
          Collection
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-foreground">
          All Fragrances
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
        <TabsList className="bg-secondary h-auto p-1 gap-1">
          {CATEGORIES.map((cat) => (
            <TabsTrigger
              key={cat.value}
              value={cat.value}
              className="font-sans text-xs font-medium tracking-widest uppercase px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-ocid="shop.category.tab"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} data-ocid="shop.loading_state">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <div className="text-center py-24" data-ocid="shop.empty_state">
          <p className="font-display text-3xl text-muted-foreground mb-3">
            No fragrances found
          </p>
          <p className="font-sans text-sm text-muted-foreground">
            Check back soon for new arrivals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <div
              key={product.id.toString()}
              data-ocid={`shop.product.item.${i + 1}`}
            >
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
