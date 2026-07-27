import { seo } from "@/lib/seo";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CaseCard } from "@/components/CaseCard";
import { PurchaseDialog } from "@/components/PurchaseDialog";
import { ImportButton } from "@/components/ImportButton";
import { CATALOG, type CaseEntry } from "@/lib/catalog";
import { LayoutGrid, List } from "lucide-react";
import { listCaseIds, normalizeCaseId, useOwnedCaseIds, refreshOwned } from "@/lib/store";

export const Route = createFileRoute("/_app/archive")({
  head: () =>
    seo({
      title: "Case Archive — Browse Fictional Criminal Cases | DOSSIER X",
      description: "Browse the DOSSIER X case archive. Open a fictional criminal investigation, review the briefing, and start solving the mystery.",
      path: "/archive",
    }),
  component: Archive,
});

function Archive() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CaseEntry | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const owned = useOwnedCaseIds();
  useEffect(() => {
    refreshOwned();
    listCaseIds();
  }, []);

  const isOwned = (c: CaseEntry) => owned.includes(normalizeCaseId(c.packId));

  const total = CATALOG.filter((c) => c.status !== "coming-soon").length;
  const ownedCount = CATALOG.filter(isOwned).length;

  const handleCardClick = (entry: CaseEntry) => {
    if (isOwned(entry)) navigate({ to: "/case/$caseId", params: { caseId: entry.id } });
    else if (entry.status === "locked") setSelected(entry);
  };

  return (
    <div className="mx-auto max-w-[1500px] px-4 sm:px-8 py-6 sm:py-10">
      <div className="flex items-start justify-between gap-6 mb-6 flex-wrap">
        <div>
          <h1 className="font-display text-4xl tracking-[0.12em] text-gold-gradient uppercase">
            Case Archive
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Purchase a case on Gumroad, then click <b className="text-gold">Import Investigation</b> to load its <code>.casepack</code> file and start playing.
          </p>
        </div>
        <ImportButton demoUrl="/casepacks/DX003.casepack" />
      </div>

      <div className="flex items-center justify-end gap-3 mb-6">
        <div className="rounded-md border border-border bg-surface/50 px-3 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">
          Sort by: <span className="text-gold">Newest ▾</span>
        </div>
        <div className="flex rounded-md border border-border bg-surface/50 overflow-hidden">
          <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-gold/15 text-gold" : "text-muted-foreground"}`} aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-gold/15 text-gold" : "text-muted-foreground"}`} aria-label="List view">
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {CATALOG.map((entry) => (
          <CaseCard key={entry.id} entry={entry} owned={isOwned(entry)} onClick={handleCardClick} />
        ))}
      </div>

      <div className="mt-10 flex items-end justify-between border-t border-border pt-6 flex-wrap gap-6">
        <div className="relative -rotate-2 hidden md:block">
          <div className="paper rounded p-4 max-w-[260px]">
            <div className="text-[10px] uppercase tracking-widest text-paper-ink/60 mb-1">Detective Note</div>
            <p className="text-paper-ink/90 font-hand text-xl leading-tight">
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
            <div className="mt-1 font-display text-2xl text-gold">{ownedCount}</div>
          </div>
        </div>
      </div>

      <PurchaseDialog
        entry={selected}
        onClose={() => setSelected(null)}
        onBuy={(e) => {
          if (e.gumroadUrl) window.open(e.gumroadUrl, "_blank", "noopener,noreferrer");
        }}
      />
    </div>
  );
}
