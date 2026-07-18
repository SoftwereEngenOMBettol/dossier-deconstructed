import { X, Lock, Star, Clock, FileText, Camera, Users, ShoppingCart } from "lucide-react";
import type { CaseEntry } from "@/lib/catalog";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  entry: CaseEntry | null;
  onClose: () => void;
  onBuy: (entry: CaseEntry) => void;
}

export function PurchaseDialog({ entry, onClose, onBuy }: Props) {
  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl grid md:grid-cols-[1.1fr,1fr] gap-6 rounded-xl border border-border bg-card p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-surface transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left: dossier folder */}
            <div className="relative rounded-lg paper p-6 min-h-[420px]">
              <div className="paperclip" />
              <div className="text-center border-b border-paper-shadow pb-3 mb-4">
                <div className="font-display text-lg tracking-widest text-paper-ink">
                  DOSSIER X
                </div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-paper-ink/70">
                  Special Investigation Division
                </div>
              </div>
              <div className="relative overflow-hidden rounded border-2 border-paper-shadow">
                {entry.cover && (
                  <img
                    src={entry.cover}
                    alt={entry.title}
                    className="w-full aspect-[4/3] object-cover grayscale-[60%] brightness-[0.6]"
                  />
                )}
                <div className="absolute inset-0 grid place-items-center">
                  <div className="stamp text-xl">
                    CLASSIFIED
                    <div className="text-[10px] mt-0.5 tracking-widest">Access Denied</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center font-mono text-[10px] tracking-widest text-paper-ink/60">
                DOSSIER № {entry.code.replace("DX-", "")}
              </div>
            </div>

            {/* Right: details */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="rounded border border-border bg-background/50 px-2 py-1 font-mono text-[11px] tracking-widest text-gold">
                  {entry.code}
                </span>
              </div>
              <h2 className="mt-2 font-display text-3xl uppercase tracking-wider">
                {entry.title}
              </h2>
              <div className="mt-1 inline-flex items-center gap-1.5 text-stamp-red text-xs font-semibold uppercase tracking-widest">
                <Lock className="h-3.5 w-3.5" /> Case Locked
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {entry.description}
              </p>

              <dl className="mt-6 space-y-3 text-sm">
                <Row label="Difficulty" icon={Star}>
                  <StarRating value={entry.difficulty} />
                </Row>
                <Row label="Estimated Play Time" icon={Clock}>
                  {entry.playMinutes[0]}–{entry.playMinutes[1]} minutes
                </Row>
                <Row label="Documents" icon={FileText}>
                  {entry.documentsCount} files
                </Row>
                <Row label="Photos" icon={Camera}>
                  {entry.photosCount} photos
                </Row>
                <Row label="Witnesses" icon={Users}>
                  {entry.witnessCount} witnesses
                </Row>
              </dl>

              <div className="mt-6 rounded-md border border-warning/30 bg-warning/10 px-3 py-2.5 text-xs text-warning/90 flex gap-2 items-start">
                <span>⚠</span>
                <span>Purchase this case to gain full access to all files and evidence.</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={onClose}
                  className="rounded-md border border-border bg-surface px-4 py-3 text-sm uppercase tracking-widest hover:bg-surface-2 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onBuy(entry)}
                  className="flex items-center justify-center gap-2 rounded-md bg-gradient-to-b from-gold to-gold-deep px-4 py-3 text-sm font-semibold uppercase tracking-widest text-background hover:brightness-110 transition"
                >
                  <ShoppingCart className="h-4 w-4" /> Buy Case
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-2">
      <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-gold" />
        {label}
      </span>
      <span className="text-sm text-foreground/90">{children}</span>
    </div>
  );
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < value ? "fill-gold text-gold" : "text-muted-foreground/40"}`}
        />
      ))}
    </span>
  );
}
