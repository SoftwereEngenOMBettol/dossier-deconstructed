import type { StoredCase } from "@/lib/store";
import { resolveAsset } from "@/lib/casepack";
import { FileText, Stamp } from "lucide-react";

interface Props {
  doc: any;
  stored: StoredCase;
}

/**
 * Aged bilingual paper renderer for documents.
 * Falls back gracefully when a PDF file is referenced — we show a paper-styled
 * summary sheet plus a link to open the original.
 */
export function PaperDocument({ doc, stored }: Props) {
  const pdfUrl = resolveAsset(stored.assets, doc.file);
  const body: string = doc.body ?? doc.content ?? "";
  const fields: Record<string, any> = doc.fields ?? {};
  const caseCode = stored.manifest?.id ?? stored.id;
  const caseTitle = stored.manifest?.title ?? "";

  return (
    <div className="paper rounded-lg shadow-paper p-10 relative overflow-hidden min-h-[720px]">
      {/* Watermark */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-[0.06]">
        <div className="font-display text-[140px] tracking-widest text-paper-ink -rotate-12">
          CONFIDENTIAL
        </div>
      </div>
      <div className="paperclip" />

      {/* Header — bilingual */}
      <header className="border-b-2 border-paper-shadow pb-4 mb-6 flex items-center justify-between">
        <div>
          <div className="font-display text-2xl tracking-widest text-paper-ink">DOSSIER X</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-paper-ink/70">
            Special Investigation Division · قسم التحقيقات الخاصة
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-xs text-paper-ink/70">Case № {caseCode}</div>
          <div className="text-[10px] uppercase tracking-widest text-paper-ink/60 mt-1">{caseTitle}</div>
        </div>
      </header>

      {/* Title */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-stamp-red">{doc.type ?? "Document"}</div>
          <h2 className="font-display text-3xl uppercase tracking-wider text-paper-ink mt-1">
            {doc.title}
          </h2>
          {doc.titleAr && (
            <div dir="rtl" className="font-serif text-xl text-paper-ink/80 mt-1">
              {doc.titleAr}
            </div>
          )}
        </div>
        <div className="stamp text-sm shrink-0 rotate-[8deg]">
          <Stamp className="h-3 w-3 inline mr-1" />
          Confidential
        </div>
      </div>

      {/* Field grid */}
      {Object.keys(fields).length > 0 && (
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-y border-paper-shadow py-4 mb-6 text-sm">
          {Object.entries(fields).map(([k, v]) => (
            <div key={k}>
              <dt className="text-[10px] uppercase tracking-widest text-paper-ink/60">{k}</dt>
              <dd className="text-paper-ink font-serif">{String(v)}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Body */}
      {body ? (
        <div className="prose prose-sm max-w-none text-paper-ink font-serif leading-relaxed whitespace-pre-wrap">
          {body}
        </div>
      ) : (
        <div className="rounded border-2 border-dashed border-paper-shadow p-6 text-center">
          <FileText className="h-8 w-8 text-paper-ink/50 mx-auto mb-2" />
          <div className="font-display text-base uppercase tracking-widest text-paper-ink/80">
            {doc.type ?? "Report"} — {doc.title}
          </div>
          <p className="mt-2 text-sm text-paper-ink/70">
            This document is provided as an attached file in the casepack.
          </p>
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-gradient-to-b from-gold to-gold-deep px-4 py-2 text-xs font-semibold uppercase tracking-widest text-background"
            >
              Open original
            </a>
          )}
        </div>
      )}

      <footer className="mt-10 pt-4 border-t border-paper-shadow text-[10px] uppercase tracking-widest text-paper-ink/60 flex justify-between">
        <span>Filed by · Special Investigation Division</span>
        <span dir="rtl" className="font-serif">وثيقة سرية — للاستخدام الرسمي فقط</span>
      </footer>
    </div>
  );
}
