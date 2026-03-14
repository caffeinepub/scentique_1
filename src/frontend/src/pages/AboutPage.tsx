import { motion } from "motion/react";

const VALUES = [
  {
    title: "Authenticity",
    desc: "Every fragrance we carry is sourced directly from master perfumers and storied houses that refuse to compromise on quality.",
  },
  {
    title: "Rarity",
    desc: "We seek out scents that transcend the ordinary — limited editions, artisanal compositions, and hidden gems from around the world.",
  },
  {
    title: "Longevity",
    desc: "Great fragrance should outlast the morning. We curate only those with the depth and character to evolve beautifully on skin.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-foreground text-background py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-sans text-xs tracking-[0.3em] uppercase opacity-50 mb-4">
              Our Story
            </p>
            <h1 className="font-display text-6xl md:text-8xl text-background leading-none mb-8">
              Born from
              <span className="block italic text-primary">Obsession.</span>
            </h1>
            <p className="font-sans text-lg opacity-70 max-w-2xl leading-relaxed">
              Scentique began as a private collection — bottles gathered from
              Grasse, Tokyo, Marrakech, and New York. What started as one
              person's obsession became a curated destination for those who
              believe scent is the highest art.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/assets/generated/perfume-hero.dim_1600x900.jpg"
              alt="Scentique atelier"
              className="w-full aspect-[4/3] object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="font-display text-4xl text-foreground mb-6">
              The Atelier
            </h2>
            <p className="font-sans text-base text-muted-foreground leading-relaxed mb-4">
              Our founders spent years traveling the world, meeting perfumers in
              their ateliers — from small-batch artisans in Grasse to
              avant-garde creators reshaping modern luxury in Tokyo.
            </p>
            <p className="font-sans text-base text-muted-foreground leading-relaxed">
              The result is Scentique: a carefully edited collection of
              fragrances that deserve to be discovered, worn, and remembered.
              Every bottle has a story. Every scent, a soul.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
              What We Believe
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card p-8"
              >
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-primary mb-3">
                  0{i + 1}
                </p>
                <h3 className="font-display text-2xl text-foreground mb-4">
                  {val.title}
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
