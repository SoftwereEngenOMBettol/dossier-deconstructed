import { createFileRoute, Link } from "@tanstack/react-router";
import { getCase } from "@/lib/catalog";
import { ArrowLeft } from "lucide-react";

type PageId =
  | "crime-scene"
  | "evidence"
  | "documents"
  | "suspects"
  | "witnesses"
  | "timeline"
  | "notebook"
  | "questions"
  | "final-report";

const LABELS: Record<PageId, string> = {
  "crime-scene": "Crime Scene",
  evidence: "Evidence Locker",
  documents: "Documents",
  suspects: "Suspects",
  witnesses: "Witnesses",
  timeline: "Timeline",
  notebook: "My Notebook",
  questions: "Questions",
  "final-report": "Final Report",
};

export const Route = createFileRoute("/_app/case/$caseId/$section")({
  component: Section,
});

function Section() {
  const { caseId, section } = Route.useParams();
  const c = getCase(caseId);
  const label = LABELS[section as PageId] ?? section;

  return (
    <div className="mx-auto max-w-[1500px] px-8 py-10">
      <Link
        to={`/case/${caseId}`}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-gold mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to case file
      </Link>
      <h1 className="font-display text-4xl uppercase tracking-widest text-gold-gradient">
        {label}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {c?.code} — {c?.title}
      </p>

      <div className="mt-10 rounded-xl border border-dashed border-border/60 bg-surface/30 p-16 text-center">
        <div className="stamp text-lg mb-4 inline-block">Under Investigation</div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          This section is being assembled in the next phase. The <b>{label}</b> view will render
          the case data from your <code>.casepack</code> file, styled to match the reference
          designs.
        </p>
      </div>
    </div>
  );
}
