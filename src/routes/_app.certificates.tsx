import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/certificates")({
  component: () => (
    <div className="mx-auto max-w-[1500px] px-8 py-10">
      <h1 className="font-display text-4xl uppercase tracking-widest text-gold-gradient">
        Certificates
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Every solved case earns a printable certificate.
      </p>
      <div className="mt-10 rounded-xl border border-dashed border-border/60 p-16 text-center text-muted-foreground">
        Certificates gallery coming in the next phase.
      </div>
    </div>
  ),
});
