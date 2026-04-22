import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Mail, MapPin, MessageCircle, Phone, Send, User } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { CONTACT_EMAIL, LOCATION, PHONE_LINK, PHONE_NUMBER, WHATSAPP_NUMBER } from "@/lib/constants";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — X Tech Agency" },
      {
        name: "description",
        content:
          "Tell us about your project. The X Tech Agency team will get back within 24 hours.",
      },
      { property: "og:title", content: "Contact — X Tech Agency" },
      {
        property: "og:description",
        content: "Let's talk about your next big move.",
      },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().trim().min(5, "Phone is required").max(30),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  service: z.string().trim().min(1, "Service is required").max(80),
  message: z.string().trim().min(5, "Message is required").max(2000),
});

function ContactPage() {
  const { t } = useApp();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const parsed = contactSchema.safeParse({
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email") ?? "",
      service: data.get("service"),
      message: data.get("message"),
    });

    if (!parsed.success) {
      setStatus("error");
      setErrorMsg(t.contact.requiredError);
      return;
    }

    setStatus("sending");

    const { name, phone, email, service, message } = parsed.data;

    // Build mailto (opens user's email client) — fallback delivery to inbox
    const subject = encodeURIComponent(`New inquiry from ${name} — ${service}`);
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nEmail: ${email || "-"}\nService: ${service}\n\nMessage:\n${message}`,
    );
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    // WhatsApp prefilled message
    const waText = encodeURIComponent(
      `Hello X Tech,\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`,
    );
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

    // Trigger email (silent best-effort) then redirect to WhatsApp
    try {
      const a = document.createElement("a");
      a.href = mailto;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // ignore
    }

    setStatus("ok");
    form.reset();
    setTimeout(() => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }, 400);
  };

  return (
    <>
      <section className="relative pt-32 pb-12">
        <div className="absolute inset-0 -z-10 hero-bg" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-bold tracking-tight sm:text-6xl"
          >
            <span className="text-gradient-brand">{t.contact.title}</span>
          </motion.h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{t.contact.lead}</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-2">
            <div className="glass rounded-3xl p-8">
              <h3 className="font-display text-xl font-bold">X Tech Agency</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Marketing · Technology · Automation
              </p>
              <div className="mt-6 space-y-4 text-sm">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 text-foreground/90 hover:text-primary"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand text-white">
                    <Mail className="h-4 w-4" />
                  </span>
                  {CONTACT_EMAIL}
                </a>
                <a
                  href={PHONE_LINK}
                  className="flex items-center gap-3 text-foreground/90 hover:text-primary"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand text-white">
                    <Phone className="h-4 w-4" />
                  </span>
                  {PHONE_NUMBER}
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-foreground/90 hover:text-primary"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand text-white">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  +20 114 522 2991
                </a>
                <div className="flex items-start gap-3 text-foreground/90">
                  <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-white">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="pt-2">{LOCATION}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 lg:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field icon={<User className="h-4 w-4" />} label={t.contact.name + " *"}>
                <input
                  name="name"
                  required
                  maxLength={100}
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field icon={<Phone className="h-4 w-4" />} label={t.contact.phone + " *"}>
                <input
                  name="phone"
                  required
                  maxLength={30}
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field icon={<Mail className="h-4 w-4" />} label={t.contact.email}>
                <input
                  type="email"
                  name="email"
                  maxLength={255}
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field label={t.contact.service + " *"}>
                <select
                  name="service"
                  required
                  defaultValue=""
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
                >
                  <option value="" disabled>
                    —
                  </option>
                  {t.contact.services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-4">
              <Field label={t.contact.message + " *"}>
                <textarea
                  name="message"
                  required
                  rows={5}
                  maxLength={2000}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </Field>
            </div>

            {status === "error" && (
              <p className="mt-3 text-sm text-destructive">{errorMsg}</p>
            )}
            {status === "ok" && (
              <p className="mt-3 text-sm text-[oklch(0.65_0.18_145)]">{t.contact.success}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-elevated transition-transform hover:scale-[1.02] disabled:opacity-60 sm:w-auto"
            >
              <Send className="h-4 w-4" /> {t.contact.submit}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
