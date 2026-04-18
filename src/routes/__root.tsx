import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppProvider } from "@/lib/app-context";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-navy px-4 text-brand-white">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-brand-white/70">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand-red px-6 py-3 text-sm font-bold text-brand-white hover:brightness-110"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: "MedNurse CodeAssist" },
      {
        name: "description",
        content:
          "Code-blue cognitive aid for nurses. AHA-aligned CPR metronome and ACLS workflow support.",
      },
      { name: "theme-color", content: "#1A2744" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
  return (
    <AppProvider>
      <Outlet />
      <DisclaimerModal />
      <Toaster position="top-center" />
    </AppProvider>
  );
}
