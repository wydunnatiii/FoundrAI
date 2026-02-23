import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Foundr AI",
  description: "Foundr AI – simulate startup decisions, investor reactions, and company health over time."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/90 shadow-lg shadow-emerald-500/40" />
                <div>
                  <div className="text-sm font-semibold tracking-tight">
                    Foundr AI
                  </div>
                  <div className="text-xs text-slate-400">
                    Train founder intuition with simulated quarters
                  </div>
                </div>
              </div>
              <nav className="flex items-center gap-3 text-xs text-slate-400">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                  MVP
                </span>
              </nav>
            </div>
          </header>
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
