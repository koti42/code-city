import { GithubIcon } from "lucide-react";
import { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-400/40">
              <GithubIcon className="h-4 w-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">
                Code City
              </p>
              <p className="text-xs text-slate-400">
                GitHub reposunu 3D sehir olarak goruntule.
              </p>
            </div>
          </div>
          <div className="hidden text-right text-[10px] text-slate-500 sm:block">
            <p className="font-medium text-slate-400">Yapi: Koti42</p>
            <p className="text-[10px]">
              LinkedIn: Mehmet Kucukcelebi
            </p>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
        {children}
      </main>
    </div>
  );
}


