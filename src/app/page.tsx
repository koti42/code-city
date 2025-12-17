 "use client";

import { useState, useTransition } from "react";
import { AppShell } from "@/components/ui/AppShell";
import { CityScene } from "@/components/3d/CityScene";
import { CodeModal } from "@/components/ui/CodeModal";
import { MOCK_REPO_TREE } from "@/lib/github/mock";
import {
  buildRepoTree,
  fetchRepoTree,
  getExtensionFromPath,
  type RepoTreeNode,
} from "@/lib/github";
import { Loader2, TriangleAlert } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("facebook/react");
  const [tree, setTree] = useState<RepoTreeNode | null>(MOCK_REPO_TREE);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [currentRepo, setCurrentRepo] = useState<{ owner: string; repo: string } | null>({
    owner: "facebook",
    repo: "react",
  });

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);

  const handleGenerate = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const [owner, repo] = trimmed.split("/");
    if (!owner || !repo) {
      setError("Lutfen 'owner/repo' formatinda bir deger girin (ornegin: vercel/next.js).");
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const res = await fetchRepoTree(owner, repo);
        const root = buildRepoTree(res.tree, `${owner}/${repo}`);
        setTree(root);
        setCurrentRepo({ owner, repo });
      } catch (e) {
        console.error(e);
        setError("GitHub'dan veri cekilirken bir hata olustu. Bir sure sonra tekrar deneyin.");
      }
    });
  };

  const handleFileClick = async (path: string) => {
    if (!currentRepo) return;

    setSelectedPath(path);
    setFileModalOpen(true);
    setFileLoading(true);
    setFileContent(null);

    try {
      const url = `https://api.github.com/repos/${currentRepo.owner}/${currentRepo.repo}/contents/${encodeURIComponent(
        path,
      )}`;

      const res = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3.raw",
        },
      });

      if (!res.ok) {
        throw new Error(`GitHub contents hata: ${res.status}`);
      }

      const text = await res.text();
      setFileContent(text);
    } catch (e) {
      console.error(e);
      setFileContent("// Kod icerigi yuklenemedi. Daha sonra tekrar deneyin.");
    } finally {
      setFileLoading(false);
    }
  };

  const language = selectedPath
    ? (() => {
        const ext = getExtensionFromPath(selectedPath);
        switch (ext) {
          case "ts":
          case "tsx":
            return "tsx";
          case "js":
          case "jsx":
            return "jsx";
          case "py":
            return "python";
          case "css":
          case "scss":
          case "sass":
          case "less":
            return "css";
          case "json":
            return "json";
          case "md":
          case "mdx":
            return "markdown";
          case "html":
            return "html";
          case "yml":
          case "yaml":
            return "yaml";
          default:
            return undefined;
        }
      })()
    : undefined;

  return (
    <AppShell>
      <section className="flex flex-col gap-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            GitHub reposundan bir{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Code City
            </span>{" "}
            insa et.
          </h1>
          <p className="max-w-2xl text-sm text-slate-400 sm:text-base">
            Dosyalarin binalar, klasorlerin semtler oldugu 3D bir sehir
            goruntuleyici. Asagidaki alana bir GitHub reposu yaz ve sehirini
            olustur.
          </p>
        </div>

        <div className="relative h-[480px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 shadow-2xl shadow-emerald-500/10">
          {/* 3D City */}
          {tree && <CityScene root={tree} onFileClick={handleFileClick} />}

          {/* Overlay UI */}
          <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
            <div className="pointer-events-auto mt-6 w-full max-w-xl rounded-2xl border border-white/5 bg-slate-950/85 p-4 shadow-lg shadow-black/40 backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    GitHub Reposu
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-slate-500">
                      owner/repo
                    </span>
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleGenerate();
                        }
                      }}
                      className="h-10 w-full rounded-xl border border-slate-700/70 bg-slate-900/80 pl-24 pr-3 text-sm text-slate-100 outline-none ring-0 transition hover:border-slate-400/70 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      placeholder="facebook/react"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isPending}
                  className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-medium text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70 sm:mt-6"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Yukleniyor...
                    </>
                  ) : (
                    <>Sehri Olustur</>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/70 px-3 py-2 text-xs text-red-100">
                  <TriangleAlert className="h-3.5 w-3.5" />
                  <span>{error}</span>
                </div>
              )}

              {!error && !isPending && (
                <p className="mt-3 text-[11px] text-slate-500">
                  Ipuçlari: Kucuk/orta boyutlu bir repo secmeye calis. Cok buyuk
                  monorepolar (binlerce dosya) sahneyi yogunlastirabilir.
                </p>
              )}
            </div>
          </div>

          {/* Loading overlay */}
          {isPending && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/40">
              <div className="pointer-events-auto flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/40 bg-slate-950/90 px-6 py-4 text-xs text-slate-100 shadow-lg shadow-emerald-500/30">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                <p className="text-xs text-slate-300">
                  GitHub agac yapisi yukleniyor, lutfen bekleyin...
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <CodeModal
        open={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
        filename={selectedPath}
        language={language}
        content={fileContent}
        loading={fileLoading}
      />
    </AppShell>
  );
}
