import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CaseCard } from "@/components/CaseCard";
import { PurchaseDialog } from "@/components/PurchaseDialog";
import { CATALOG, type CaseEntry } from "@/lib/catalog";
import { LayoutGrid, List } from "lucide-react";

export const Route = createFileRoute("/_app/archive")({
  head: () => ({
    meta: [
      { title: "Case Archive — DOSSIER X" },
      {
        name: "description",
        content: "Browse unlocked investigations and acquire new cases.",
      },
    ],
  }),
  component: Archive,
});

function Archive() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CaseEntry | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  const total = CATALOG.filter((c) => c.status !== "coming-soon").length;
  const owned = CATALOG.filter((c) => c.status === "owned").length;

  const handleCardClick = (entry: CaseEntry) => {
    if (entry.status === "owned") {
      navigate({ to: `/case/${entry.id}` });
    } else if (entry.status === "locked") {
      setSelected(entry);
    }
  };

  return (
    <div className="mx-auto max-w-[1500px] px-8 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h1 className="font-display text-4xl tracking-[0.12em] text-gold-gradient uppercase">
            Case Archive
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your unlocked investigations or acquire new cases.
          </p>
        </div>

        <div className="relative rotate-1 hidden lg:block">
          <div className="paper rounded p-3 pr-4 max-w-[240px]">
            <div className="paperclip" />
            <p className="text-xs text-paper-ink/85 leading-tight">
              Only purchased cases can be accessed.
            </p>
            <div className="mt-1 stamp text-[10px]">CONFIDENTIAL</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <div className="rounded-md border border-border bg-surface/50 px-3 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">
          Sort by: <span className="text-gold">Newest ▾</span>
        </div>
        <div className="flex rounded-md border border-border bg-surface/50 overflow-hidden">
          <button
            onClick={() => setView("grid")}
            className={`p-2 ${view === "grid" ? "bg-gold/15 text-gold" : "text-muted-foreground"}`}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 ${view === "list" ? "bg-gold/15 text-gold" : "text-muted-foreground"}`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {CATALOG.map((entry) => (
          <CaseCard key={entry.id} entry={entry} onClick={handleCardClick} />
        ))}
      </div>

      {/* Footer strip */}
      <div className="mt-10 flex items-end justify-between border-t border-border pt-6">
        <div className="relative -rotate-2 hidden md:block">
          <div className="paper rounded p-4 max-w-[260px]">
            <div className="text-[10px] uppercase tracking-widest text-paper-ink/60 mb-1">
              Detective Note
            </div>
            <p className="text-sm text-paper-ink/90 font-hand text-xl leading-tight">
              Justice is not about being right, it's about uncovering the truth.
            </p>
          </div>
        </div>
        <div className="flex gap-8 text-xs uppercase tracking-widest text-muted-foreground">
          <div>
            <div className="text-[10px]">Total Cases</div>
            <div className="mt-1 font-display text-2xl text-gold">{total}</div>
          </div>
          <div>
            <div className="text-[10px]">Cases Unlocked</div>
            <div className="mt-1 font-display text-2xl text-gold">{owned}</div>
          </div>
        </div>
      </div>

      <PurchaseDialog
        entry={selected}
        onClose={() => setSelected(null)}
        onBuy={(e) => {
          // Placeholder — would open Gumroad
          alert(`Redirecting to Gumroad to purchase ${e.code} — ${e.title}`);
        }}
      />
    </div>
  );
}
