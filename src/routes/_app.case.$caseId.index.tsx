import { createFileRoute, Link } from "@tanstack/react-router";
import { getCase } from "@/lib/catalog";
import { FolderOpen, Camera, Archive, Users, UserCheck, Clock, Notebook, FileCheck } from "lucide-react";

export const Route = createFileRoute("/_app/case/$caseId/")({
  head: ({ params }) => {
    const c = getCase(params.caseId);
    return {
      meta: [
        { title: c ? `${c.code} — ${c.title} · DOSSIER X` : "Case File — DOSSIER X" },
        { name: "description", content: c?.description ?? "Case file." },
      ],
    };
  },
  component: CaseFile,
});

const SECTIONS = [
  { label: "Crime Scene", icon: Camera, to: "crime-scene", desc: "Examine the scene photograph-by-photograph." },
  { label: "Evidence Locker", icon: Archive, to: "evidence", desc: "Every item collected and catalogued." },
  { label: "Documents", icon: FileCheck, to: "documents", desc: "Reports, autopsy, forensics, records." },
  { label: "Suspects", icon: Users, to: "suspects", desc: "Profiles, motives, alibis." },
  { label: "Witnesses", icon: UserCheck, to: "witnesses", desc: "Statements — some may contradict." },
  { label: "Timeline", icon: Clock, to: "timeline", desc: "Reconstruct the sequence of events." },
  { label: "My Notebook", icon: Notebook, to: "notebook", desc: "Your private detective log." },
];

function CaseFile() {
  const { caseId } = Route.useParams();
  const c = getCase(caseId);

  if (!c) return <div className="p-10">Case not found.</div>;

  return (
    <div className="mx-auto max-w-[1500px] px-8 py-10">
      <div className="flex items-start justify-between gap-8 mb-8">
        <div className="flex items-center gap-4">
          <FolderOpen className="h-8 w-8 text-gold" />
          <div>
            <h1 className="font-display text-3xl tracking-widest uppercase text-gold-gradient">
              Case File
            </h1>
            <p className="text-sm text-muted-foreground">
              {c.code} — {c.title}
            </p>
          </div>
        </div>
        <div className="text-right text-xs uppercase tracking-widest text-muted-foreground">
          <div>Progress</div>
          <div className="mt-1 font-display text-3xl text-gold">{c.progress ?? 0}%</div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl border border-border">
        <img src={c.cover} alt={c.title} className="w-full h-[320px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <div className="text-xs uppercase tracking-[0.28em] text-gold mb-2">
            {c.code} · {c.playMinutes[0]}–{c.playMinutes[1]} min
          </div>
          <h2 className="font-display text-5xl uppercase tracking-wider">{c.title}</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">{c.description}</p>
        </div>
      </div>

      {/* Sections grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SECTIONS.map(({ label, icon: Icon, to, desc }) => (
          <Link
            key={to}
            to={`/case/${c.id}/${to}`}
            className="group rounded-lg border border-border bg-card/70 p-5 hover:border-gold/50 hover:bg-card transition"
          >
            <Icon className="h-6 w-6 text-gold mb-3" />
            <div className="font-display text-lg uppercase tracking-widest text-foreground group-hover:text-gold transition">
              {label}
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
