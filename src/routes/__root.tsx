import { useEffect } from "react";
import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppProvider, useApp } from "@/lib/app-context";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { Onboarding } from "@/components/Onboarding";
import { Toaster } from "@/components/ui/sonner";
import { captureInstallPrompt } from "@/lib/pwa";
import { configureVoice } from "@/lib/voice";

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
      { name: "apple-mobile-web-app-capable", content: "yes" },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
      { name: "apple-mobile-web-app-title", content: "CodeAssist" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
      { rel: "icon", href: "/icons/icon-192.png", type: "image/png" },
    ],
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
      <VoiceConfigBridge />
      <Outlet />
      <Onboarding />
      <DisclaimerModal />
      <Toaster position="top-center" />
    </AppProvider>
  );
}

function VoiceConfigBridge() {
  const { voicePromptsEnabled, voiceVolume, preferredVoiceURI, hydrated } = useApp();
  useEffect(() => {
    captureInstallPrompt();
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    configureVoice({
      enabled: voicePromptsEnabled,
      volume: voiceVolume,
      preferredVoiceURI,
    });
  }, [voicePromptsEnabled, voiceVolume, preferredVoiceURI, hydrated]);
  return null;
}
