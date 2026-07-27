import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { defaultProfile, saveProfile, loadProfile } from "@/lib/session";
import logo from "@/assets/dx-logo.png";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: "DOSSIER X — Detective Investigation Game | Solve Fictional Cases",
      description:
        "Play DOSSIER X, a free browser-based detective game. Create your detective profile, analyze fictional case files and evidence, and solve the mystery yourself.",
      path: "/",
    }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loadProfile()) {
      navigate({ to: "/archive", replace: true });
    } else {
      setChecking(false);
    }
  }, [navigate]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveProfile(defaultProfile(name.trim()));
    navigate({ to: "/archive" });
  };

  if (checking) return <div className="h-screen" />;

  return (
    <main className="relative min-h-screen grid place-items-center px-4 texture-grain overflow-hidden">
      {/* Ambient beams */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[120px]" />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleStart}
        className="relative w-full max-w-md rounded-xl border border-border bg-card/80 backdrop-blur p-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.img
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            src={logo}
            alt="Dossier X logo"
            width={96}
            height={96}
            fetchPriority="high"
            decoding="async"
            className="mx-auto h-24 w-24 object-contain"
          />
          <h1 className="mt-4 font-display text-3xl tracking-[0.2em] text-gold-gradient">
            DOSSIER X<span className="sr-only"> — Detective Investigation Game</span>
          </h1>
          <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Special Investigation Division
          </p>
          <div className="mt-4 h-px w-16 bg-gold/50 mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground italic">
            "Truth hides in the details."
          </p>
        </div>

        <label htmlFor="detective-name" className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
          Detective Name
        </label>
        <input
          id="detective-name"
          name="detectiveName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name…"
          maxLength={40}
          autoFocus
          className="w-full rounded-md border border-border bg-background/60 px-4 py-3 text-foreground outline-none focus:border-gold/60 focus:shadow-[0_0_0_3px_oklch(from_var(--gold)_l_c_h/0.15)] transition"
        />

        <button
          type="submit"
          disabled={!name.trim()}
          className="mt-6 w-full rounded-md bg-gradient-to-b from-gold to-gold-deep py-3 text-sm font-bold uppercase tracking-[0.2em] text-background disabled:opacity-40 hover:brightness-110 transition"
        >
          Begin Investigation
        </button>

        <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-muted-foreground/70">
          Your name appears on every certificate.
        </p>
      </motion.form>
    </main>
  );
}
