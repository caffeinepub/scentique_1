import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { useListFeatured } from "../hooks/useQueries";

const CATEGORIES = [
  {
    id: "men",
    label: "Men's",
    desc: "Bold, woody, and powerful scents for the modern man.",
    img: "/assets/generated/perfume-noir.dim_800x800.jpg",
  },
  {
    id: "women",
    label: "Women's",
    desc: "Floral, delicate, and intoxicating fragrances.",
    img: "/assets/generated/perfume-rose.dim_800x800.jpg",
  },
  {
    id: "unisex",
    label: "Unisex",
    desc: "Boundary-defying aromas for every soul.",
    img: "/assets/generated/perfume-oud.dim_800x800.jpg",
  },
];

export default function HomePage() {
  const { data: featured, isLoading } = useListFeatured();

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/perfume-hero.dim_1600x900.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-white/60 mb-6">
              The Art of Fragrance
            </p>
            <h1 className="font-display text-6xl md:text-8xl text-white leading-none mb-6 max-w-3xl">
              Wear Your
              <span className="block italic text-primary">Signature.</span>
            </h1>
            <p className="font-sans text-lg text-white/70 max-w-md mb-10 leading-relaxed">
              Each fragrance is a story waiting to be told. Discover scents that
              define who you are.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-sm tracking-widest uppercase px-8"
              >
                <Link to="/shop">
                  Explore Collection <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 font-sans text-sm tracking-widest uppercase px-8"
              >
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-px h-12 bg-white/40 mx-auto"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Handpicked
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              Featured Scents
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 font-sans text-sm tracking-widest uppercase text-primary hover:gap-3 transition-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card"
                data-ocid="products.loading_state"
              >
                <Skeleton className="aspect-square w-full" />
                <div className="p-5 space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(featured ?? []).slice(0, 3).map((product, i) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-secondary">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="mb-12 text-center">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Explore
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              Shop by Category
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to="/shop" search={{ category: cat.id }}>
                  <div className="group relative overflow-hidden aspect-[3/4] cursor-pointer">
                    <img
                      src={cat.img}
                      alt={cat.label}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-display text-3xl text-white mb-1">
                        {cat.label}
                      </h3>
                      <p className="font-sans text-sm text-white/70">
                        {cat.desc}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-primary font-sans text-xs tracking-widest uppercase">
                        <Sparkles className="w-3 h-3" /> Explore
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand promise */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            The Scentique Promise
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-foreground leading-tight mb-6">
            Every bottle tells
            <br />
            <em>a story.</em>
          </h2>
          <p className="font-sans text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We believe fragrance is the most intimate form of self-expression.
            Our curation spans the world's finest perfumers, bringing you
            extraordinary scents that linger in memory long after the moment has
            passed.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
