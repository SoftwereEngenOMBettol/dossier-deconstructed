import { Lock, CheckCircle2, Star, Clock, FileText, Users, ArrowRight } from "lucide-react";
import type { CaseEntry } from "@/lib/catalog";

interface Props {
  entry: CaseEntry;
  onClick: (entry: CaseEntry) => void;
  owned?: boolean;
  progress?: number | null;
}

// Builds the Gumroad URL for a case, e.g. "DX-003" -> https://dossierxdx.gumroad.com/l/Dx003
function getGumroadUrl(code: string): string {
  const match = code.match(/(\d+)/);
  const num = match ? match[1].padStart(3, "0") : "001";
  return `https://dossierxdx.gumroad.com/l/Dx${num}`;
}

export function CaseCard({ entry, onClick, owned = false, progress = null }: Props) {
  const isComing = entry.status === "coming-soon";
  const isOwned = owned;
  const isLocked = !isOwned && entry.status === "locked";

  if (isComing) {
    return (
      <div className="relative rounded-lg border-2 border-dashed border-border/60 bg-surface/30 min-h-[420px] flex flex-col items-center justify-center text-center px-6 opacity-60">
        <div className="text-6xl mb-4 opacity-40">🕵</div>
        <div className="font-display text-xl tracking-widest text-muted-foreground">
          NEW CASE
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70 mt-1">
          Coming soon
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(entry)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(entry);
      }}
      className="group relative overflow-hidden rounded-lg border border-border bg-card text-left transition hover:border-gold/50 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] cursor-pointer"
    >
      {/* Cover */}
      <div className="relative aspect-[4/3] overflow-hidden bg-background">
        <img
          src={entry.cover}
          alt={entry.title}
          loading="lazy"
          className={`h-full w-full object-cover transition duration-700 ${
            isLocked ? "grayscale-[70%] brightness-[0.55]" : "group-hover:scale-105"
          }`}
        />
        {/* Corner code */}
        <div className="absolute top-3 left-3 rounded border border-gold/40 bg-background/80 px-2 py-1 font-mono text-[10px] tracking-widest text-gold backdrop-blur">
          {entry.code}
        </div>
        {/* Status pill */}
        <div className="absolute top-3 right-3">
          {isOwned ? (
            <div className="flex items-center gap-1 rounded border border-success/50 bg-success/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-success">
              <CheckCircle2 className="h-3 w-3" /> Owned
            </div>
          ) : (
            <div className="rounded border border-border bg-background/70 p-1.5 backdrop-blur">
              <Lock className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
        </div>
        {/* Classified stamp overlay */}
        {isLocked && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="stamp text-lg">
              CLASSIFIED
              <div className="text-[10px] tracking-widest mt-0.5">Access Denied</div>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-display text-xl uppercase tracking-wider text-foreground">
          {entry.title}
        </h3>
        {isOwned && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{entry.tagline}</p>
        )}

        {isLocked && (
          <ul className="mt-3 space-y-1.5 text-[11px] text-muted-foreground">
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Star className="h-3 w-3 text-gold" />
                <span className="uppercase tracking-widest">Difficulty</span>
              </span>
              <StarRating value={entry.difficulty} />
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-gold" />
                <span className="uppercase tracking-widest">Play time</span>
              </span>
              <span className="text-foreground/90">
                {entry.playMinutes[0]}–{entry.playMinutes[1]} min
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-3 w-3 text-gold" />
                <span className="uppercase tracking-widest">Evidence</span>
              </span>
              <span className="text-foreground/90">{entry.evidenceCount}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-3 w-3 text-gold" />
                <span className="uppercase tracking-widest">Witnesses</span>
              </span>
              <span className="text-foreground/90">{entry.witnessCount}</span>
            </li>
          </ul>
        )}

        {isOwned && progress != null && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              <span>Progress</span>
              <span className="text-gold">{progress}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full bg-gradient-to-r from-gold-deep to-gold"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Solve it Now — links out to Gumroad, doesn't trigger the card's own onClick */}
        <a
          href={getGumroadUrl(entry.code)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-gradient-to-r from-gold-deep to-gold px-2 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-background transition hover:brightness-110"
        >
          Solve it Now <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </a>
      </div>
    </div>
  );
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i < value ? "fill-gold text-gold" : "text-muted-foreground/40"}`}
        />
      ))}
    </span>
  );
}
