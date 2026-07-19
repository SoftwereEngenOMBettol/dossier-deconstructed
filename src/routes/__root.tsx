import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="stamp text-2xl mb-6">Case Closed</div>
        <h1 className="text-7xl font-display text-gold-gradient">404</h1>
        <h2 className="mt-4 font-display text-2xl uppercase tracking-widest">Dossier not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The file you're looking for has been misplaced or never existed.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-gradient-to-b from-gold to-gold-deep px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-background"
        >
          Return to headquarters
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl uppercase tracking-widest text-foreground">
          Investigation stalled
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on the scene. Try again or return to headquarters.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-gradient-to-b from-gold to-gold-deep px-4 py-2 text-sm font-semibold uppercase tracking-widest text-background"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-border bg-surface px-4 py-2 text-sm uppercase tracking-widest"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DOSSIER X — Truth hides in the details." },
      {
        name: "description",
        content:
          "DOSSIER X is a digital criminal investigation platform. Analyze real case files, interview witnesses, follow the evidence, and solve the case yourself.",
      },
      { name: "author", content: "Dossier X — Special Investigation Division" },
      { property: "og:title", content: "DOSSIER X — Truth hides in the details." },
      {
        property: "og:description",
        content:
          "A document-driven detective investigation platform. Real files, real evidence, no hand-holding.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;900&family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Inter:wght@400;500;600;700&family=Caveat:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { Toaster } = require("sonner");
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster theme="dark" position="top-right" richColors />
    </QueryClientProvider>
  );
}
