import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { getCase } from "@/lib/catalog";
import { useStoredCase, saveCertificate } from "@/lib/store";
import { useProfile } from "@/lib/session";
import { gradeAnswers } from "@/lib/grading";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/case/$caseId/submit")({
  head: ({ params }) => ({
    meta: [
      { title: `Case ${params.caseId} — Submit Your Verdict | DOSSIER X` },
      { name: "description", content: `Name the culprit and close case ${params.caseId}.` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SubmitPage,
});

function SubmitPage() {
  const { caseId } = Route.useParams();
  const c = getCase(caseId);
  const { case: stored, ready } = useStoredCase(c?.packId);
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!c) return <div className="p-10">Case not found.</div>;
  if (ready && !stored) {
    return (
      <div className="p-10 text-center">
        <p className="text-muted-foreground">Case not imported.</p>
        <Link to="/archive" className="text-gold underline">Back to Archive</Link>
      </div>
    );
  }
  if (!stored) return <div className="p-10 text-muted-foreground">Loading…</div>;

  const questions = stored.questions ?? [];

  const submit = async () => {
    if (!profile) return;
    setSubmitting(true);
    const result = gradeAnswers(stored, answers);
    await saveCertificate({
      caseId: stored.id,
      caseTitle: stored.manifest?.title ?? c.title,
      detectiveName: profile.name,
      score: result.correct,
      total: result.total,
      percent: result.percent,
      rank: result.rank,
      date: new Date().toISOString(),
      answers,
    });
    toast.success(`Investigation filed — ${result.percent}%`, {
      description: `Rank: ${result.rank}`,
    });
    navigate({ to: "/case/$caseId/certificate", params: { caseId } });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-8 py-6 sm:py-10">
      <Link to="/case/$caseId" params={{ caseId }} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-gold mb-6">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to case file
      </Link>
      <h1 className="font-display text-4xl uppercase tracking-widest text-gold-gradient">Submit Investigation</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Answer the questions below. Your responses are graded against the case solution and a certificate is issued in your name.
      </p>

      <div className="mt-8 space-y-6">
        {questions.map((q: any, i: number) => (
          <div key={q.id} className="paper rounded-lg p-6">
            <div className="text-[10px] uppercase tracking-widest text-paper-ink/60">
              Question {i + 1} · {q.id}
            </div>
            <div className="font-display text-lg text-paper-ink mt-1">{q.question}</div>
            {q.type === "multiple_choice" && Array.isArray(q.options) ? (
              <div className="mt-3 grid gap-2">
                {q.options.map((opt: string) => {
                  const selected = answers[q.id] === opt;
                  return (
                    <label key={opt} className={`flex items-center gap-3 rounded border-2 px-3 py-2 cursor-pointer transition ${selected ? "border-stamp-red bg-stamp-red/10" : "border-paper-shadow bg-paper/40 hover:border-paper-ink/40"}`}>
                      <input
                        type="radio"
                        name={q.id}
                        checked={selected}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                        className="accent-stamp-red"
                      />
                      <span className="text-sm text-paper-ink">{opt}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <textarea
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                placeholder="Your answer…"
                className="mt-3 w-full rounded border-2 border-paper-shadow bg-paper/40 p-3 font-serif text-paper-ink resize-y min-h-[80px]"
              />
            )}
          </div>
        ))}

        <button
          disabled={submitting || questions.length === 0}
          onClick={submit}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-b from-gold to-gold-deep px-4 py-3 text-sm font-semibold uppercase tracking-widest text-background disabled:opacity-60"
        >
          <Send className="h-4 w-4" /> File Final Report
        </button>
      </div>
    </div>
  );
}
