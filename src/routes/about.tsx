import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { CTASection } from "@/components/CTASection";
import { Building2, Sofa, Rocket, Shirt, Dumbbell, Car, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — X Tech Agency" },
      {
        name: "description",
        content:
          "X Tech Agency is a hybrid marketing and tech studio helping ambitious brands scale with bold creative and modern AI systems.",
      },
      { property: "og:title", content: "About X Tech Agency" },
      {
        property: "og:description",
        content: "Vision, mission and the industries we serve.",
      },
    ],
  }),
  component: AboutPage,
});

const INDUSTRY_ICONS = [Building2, Sofa, Rocket, Shirt, Dumbbell, Car, Sparkles];

function AboutPage() {
  const { t } = useApp();
  const industries = t.clients.items;

  return (
    <>
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 -z-10 hero-bg" />
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-bold tracking-tight sm:text-6xl"
          >
            <span className="text-gradient-brand">{t.about.title}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            {t.about.lead}
          </motion.p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="glass rounded-3xl p-8">
            <h2 className="font-display text-2xl font-bold">{t.about.visionTitle}</h2>
            <p className="mt-3 text-muted-foreground">{t.about.visionText}</p>
          </div>
          <div className="glass rounded-3xl p-8">
            <h2 className="font-display text-2xl font-bold">{t.about.missionTitle}</h2>
            <p className="mt-3 text-muted-foreground">{t.about.missionText}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">
            {t.about.industriesTitle}
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {industries.map((label, i) => {
              const Icon = INDUSTRY_ICONS[i % INDUSTRY_ICONS.length];
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass flex flex-col items-center gap-3 rounded-2xl p-6 text-center"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold">{label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
