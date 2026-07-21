import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";
import { getCase } from "@/lib/catalog";
import { useStoredCase, type StoredCase, notebookKey } from "@/lib/store";
import { resolveAsset } from "@/lib/casepack";
import { placeholderFor } from "@/lib/placeholder";
import { PaperDocument } from "@/components/PaperDocument";

type PageId =
  | "crime-scene" | "evidence" | "documents" | "suspects"
  | "witnesses" | "timeline" | "notebook";

const LABELS: Record<PageId, string> = {
  "crime-scene": "Crime Scene",
  evidence: "Evidence Locker",
  documents: "Documents",
  suspects: "Suspects",
  witnesses: "Witnesses",
  timeline: "Timeline",
  notebook: "My Notebook",
};

export const Route = createFileRoute("/_app/case/$caseId/$section")({
  component: Section,
});

function Section() {
  const { caseId, section } = Route.useParams();
  const c = getCase(caseId);
  const { case: stored, ready } = useStoredCase(c?.packId);

  // "submit" and "certificate" have their own routes
  if (section === "submit") return <Navigate to="/case/$caseId/submit" params={{ caseId }} replace />;
  if (section === "certificate") return <Navigate to="/case/$caseId/certificate" params={{ caseId }} replace />;

  const label = LABELS[section as PageId] ?? section;

  if (!c) return <div className="p-10">Case not found.</div>;
  if (ready && !stored) {
    return (
      <div className="mx-auto max-w-3xl px-8 py-20 text-center">
        <h1 className="font-display text-3xl uppercase tracking-widest text-gold-gradient">Case locked</h1>
        <p className="mt-3 text-muted-foreground">
          Import the <code>.casepack</code> for {c.code} to access {label}.
        </p>
        <Link to="/archive" className="mt-6 inline-block rounded-md bg-gradient-to-b from-gold to-gold-deep px-4 py-2 text-sm font-semibold uppercase tracking-widest text-background">
          Back to Archive
        </Link>
      </div>
    );
  }
  if (!stored) return <div className="p-10 text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto max-w-[1500px] px-4 sm:px-8 py-6 sm:py-10">
      <Link to="/case/$caseId" params={{ caseId }} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-gold mb-6">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to case file
      </Link>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-widest text-gold-gradient">{label}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{c.code} — {c.title}</p>
        </div>
      </div>

      {section === "crime-scene" && <CrimeSceneView stored={stored} />}
      {section === "evidence" && <EvidenceView stored={stored} />}
      {section === "documents" && <DocumentsView stored={stored} />}
      {section === "suspects" && <SuspectsView stored={stored} />}
      {section === "witnesses" && <WitnessesView stored={stored} />}
      {section === "timeline" && <TimelineView stored={stored} />}
      {section === "notebook" && <NotebookView stored={stored} />}
    </div>
  );
}

/* ============ Crime Scene ============ */
function CrimeSceneView({ stored }: { stored: StoredCase }) {
  const scene = stored.crime_scene ?? {};
  const photos: string[] = Array.isArray(scene.photos) ? scene.photos : [];
  const [zoom, setZoom] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-8">
      <div>
        <div className="paper rounded-lg p-5 mb-6">
          <div className="text-[10px] uppercase tracking-widest text-paper-ink/60">Scene Report</div>
          <div className="font-display text-xl text-paper-ink">{scene.name ?? "Crime Scene"}</div>
          <p className="mt-2 text-sm text-paper-ink/90 leading-relaxed">{scene.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(photos.length ? photos : [null, null, null, null]).map((p, i) => {
            const url = (p && resolveAsset(stored.assets, p)) || placeholderFor("scene", `${stored.id}-scene-${i}`, scene.name || "Crime Scene");
            return (
              <button key={i} onClick={() => setZoom(url)} className="group relative overflow-hidden rounded-lg border border-border">
                <img src={url} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-0.5 font-mono text-[10px] text-gold">#{i + 1}</div>
              </button>
            );
          })}
        </div>
      </div>
      <aside className="paper rounded-lg p-5 h-fit sticky top-6">
        <div className="paperclip" />
        <div className="text-[10px] uppercase tracking-widest text-paper-ink/60">Detective's Notes</div>
        <p className="mt-2 font-hand text-lg text-paper-ink leading-tight">
          Examine every angle. What's out of place tells more than what's expected.
        </p>
      </aside>
      {zoom && (
        <div onClick={() => setZoom(null)} className="fixed inset-0 z-50 grid place-items-center bg-background/90 p-8 cursor-zoom-out">
          <img src={zoom} className="max-w-full max-h-full rounded-lg border border-gold/40" />
        </div>
      )}
    </div>
  );
}

/* ============ Evidence ============ */
function EvidenceView({ stored }: { stored: StoredCase }) {
  const items = stored.evidence ?? [];
  const [sel, setSel] = useState<any>(items[0] ?? null);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((e: any) => {
          const url = resolveAsset(stored.assets, e.image) || placeholderFor("evidence", `${stored.id}-${e.id}`, e.title || e.id, e.type);
          const active = sel?.id === e.id;
          return (
            <button key={e.id} onClick={() => setSel(e)} className={`text-left rounded-lg border overflow-hidden transition ${active ? "border-gold shadow-gold" : "border-border hover:border-gold/40"}`}>
              <img src={url} className="w-full aspect-square object-cover" />
              <div className="p-3">
                <div className="text-[10px] font-mono tracking-widest text-gold">{e.id}</div>
                <div className="font-display text-sm uppercase tracking-wider mt-1">{e.title}</div>
              </div>
            </button>
          );
        })}
      </div>
      <aside className="paper rounded-lg p-5 h-fit sticky top-6">
        <div className="paperclip" />
        {sel ? (
          <>
            <div className="text-[10px] uppercase tracking-widest text-paper-ink/60">Evidence · {sel.id}</div>
            <h3 className="font-display text-xl text-paper-ink mt-1">{sel.title}</h3>
            <div className="text-[10px] uppercase tracking-widest text-stamp-red mt-2">{sel.type} · {sel.location}</div>
            <img
              src={resolveAsset(stored.assets, sel.image) || placeholderFor("evidence", `${stored.id}-${sel.id}`, sel.title || sel.id, sel.type)}
              className="mt-3 rounded border-2 border-paper-shadow"
            />
            <p className="mt-3 text-sm text-paper-ink/90 leading-relaxed">{sel.description}</p>
          </>
        ) : (
          <div className="text-paper-ink/70 text-sm">No evidence catalogued.</div>
        )}
      </aside>
    </div>
  );
}

/* ============ Documents ============ */
function DocumentsView({ stored }: { stored: StoredCase }) {
  const docs = stored.documents ?? [];
  const [sel, setSel] = useState<any>(docs[0] ?? null);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
      <div className="rounded-lg border border-border bg-card/60 p-2 h-fit sticky top-6">
        {docs.map((d: any) => (
          <button
            key={d.id}
            onClick={() => setSel(d)}
            className={`w-full flex items-center justify-between gap-2 rounded px-3 py-2 text-left text-xs uppercase tracking-widest transition ${
              sel?.id === d.id ? "bg-gold/15 text-gold" : "text-muted-foreground hover:bg-surface"
            }`}
          >
            <span className="truncate">{d.title}</span>
            <ChevronRight className="h-3 w-3 shrink-0" />
          </button>
        ))}
        {docs.length === 0 && <div className="p-4 text-sm text-muted-foreground">No documents.</div>}
      </div>
      <div>
        {sel && <PaperDocument doc={sel} stored={stored} />}
      </div>
    </div>
  );
}

/* ============ Suspects ============ */
function SuspectsView({ stored }: { stored: StoredCase }) {
  const items = stored.suspects ?? [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((s: any) => {
        const url = resolveAsset(stored.assets, s.photo) || placeholderFor("portrait", `${stored.id}-${s.id}`, s.name || s.id, s.occupation || "Suspect");
        return (
          <article key={s.id} className="rounded-lg border border-border bg-card/70 overflow-hidden">
            <div className="grid grid-cols-[120px,1fr]">
              <img src={url} className="w-full h-full object-cover" />
              <div className="p-4">
                <div className="text-[10px] font-mono tracking-widest text-gold">{s.id}</div>
                <div className="font-display text-lg uppercase tracking-wider">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.occupation} · Age {s.age}</div>
              </div>
            </div>
            <div className="p-4 border-t border-border space-y-3 text-sm">
              <Field label="Relationship">{s.relationship}</Field>
              <Field label="Motive"><span className="text-stamp-red/90">{s.motive}</span></Field>
              {s.biography && <Field label="Biography">{s.biography}</Field>}
              {s.alibi && <Field label="Alibi">{s.alibi}</Field>}
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ============ Witnesses ============ */
function WitnessesView({ stored }: { stored: StoredCase }) {
  const items = stored.witnesses ?? [];
  const [sel, setSel] = useState<any>(items[0] ?? null);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
      <div className="rounded-lg border border-border bg-card/60 overflow-hidden">
        {items.map((w: any) => {
          const url = resolveAsset(stored.assets, w.photo) || placeholderFor("witness", `${stored.id}-${w.id}`, w.name || w.id, "Witness");
          const active = sel?.id === w.id;
          return (
            <button key={w.id} onClick={() => setSel(w)} className={`w-full flex items-center gap-4 p-4 border-b border-border last:border-b-0 text-left transition ${active ? "bg-gold/10" : "hover:bg-surface"}`}>
              <img src={url} className="h-14 w-14 rounded-full object-cover border border-border" />
              <div className="flex-1">
                <div className="font-display text-base uppercase tracking-wider">{w.name}</div>
                <div className="text-xs text-muted-foreground">Reliability {w.reliability}%</div>
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-widest ${w.reliability >= 70 ? "text-success" : "text-warning"}`}>
                {w.reliability >= 70 ? "Interviewed" : "Uncertain"}
              </span>
            </button>
          );
        })}
      </div>
      <aside className="paper rounded-lg p-6 h-fit sticky top-6">
        <div className="paperclip" />
        {sel ? (
          <>
            <div className="text-[10px] uppercase tracking-widest text-paper-ink/60">Witness Statement</div>
            <h3 className="font-display text-2xl text-paper-ink mt-1">{sel.name}</h3>
            <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-widest">
              <span className="rounded border border-paper-shadow px-2 py-0.5 text-paper-ink/70">Reliability {sel.reliability}%</span>
            </div>
            <p className="mt-4 text-sm text-paper-ink/90 leading-relaxed italic">"{sel.statement}"</p>
            {sel.contradictions && (
              <div className="mt-4 border-t border-paper-shadow pt-3">
                <div className="text-[10px] uppercase tracking-widest text-stamp-red">Contradictions</div>
                <p className="mt-1 text-sm text-paper-ink/85">{sel.contradictions}</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-paper-ink/70 text-sm">No witnesses.</div>
        )}
      </aside>
    </div>
  );
}

/* ============ Timeline ============ */
function TimelineView({ stored }: { stored: StoredCase }) {
  const items = stored.timeline ?? [];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
      <ol className="relative border-l-2 border-gold/40 ml-4 space-y-6">
        {items.map((e: any) => (
          <li key={e.id} className="pl-6 relative">
            <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-gold border-2 border-background" />
            <div className="font-mono text-xs tracking-widest text-gold">{e.time}</div>
            <div className="font-display text-lg uppercase tracking-wider mt-0.5">{e.title}</div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{e.description}</p>
          </li>
        ))}
        {items.length === 0 && <li className="text-muted-foreground text-sm">No timeline entries.</li>}
      </ol>
      <aside className="hidden lg:block">
        <div className="relative rotate-2 paper rounded p-3 shadow-paper">
          <div className="text-[10px] uppercase tracking-widest text-paper-ink/60 mb-2">Pinned</div>
          <div className="font-hand text-lg text-paper-ink leading-tight">
            Time is the coldest evidence — it cannot lie.
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ============ Notebook ============ */
function NotebookView({ stored }: { stored: StoredCase }) {
  const key = notebookKey(stored.id);
  const [text, setText] = useState("");
  useEffect(() => {
    setText(localStorage.getItem(key) ?? "");
  }, [key]);
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem(key, text), 300);
    return () => clearTimeout(t);
  }, [text, key]);
  return (
    <div className="paper rounded-lg p-8 min-h-[540px] relative">
      <div className="paperclip" />
      <div className="text-[10px] uppercase tracking-widest text-paper-ink/60 mb-4">Detective's Notebook — auto-saved</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Record your observations, hypotheses, and connections here…"
        className="w-full min-h-[440px] bg-transparent outline-none resize-none font-hand text-2xl text-paper-ink leading-relaxed placeholder:text-paper-ink/40"
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-foreground/90 leading-relaxed">{children}</div>
    </div>
  );
}
