"use client";

import { X } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type CodeModalProps = {
  open: boolean;
  onClose: () => void;
  filename: string | null;
  language?: string;
  content: string | null;
  loading?: boolean;
};

export function CodeModal({
  open,
  onClose,
  filename,
  language,
  content,
  loading = false,
}: CodeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative flex h-[70vh] w-[min(960px,92vw)] flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950/95 shadow-2xl shadow-emerald-500/20">
        <header className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-slate-200">
              {filename ?? "Secili dosya yok"}
            </p>
            <p className="text-[10px] text-slate-500">
              Dosya icerigi GitHub API uzerinden okunur.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900 text-slate-300 shadow-sm transition hover:border-slate-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        <div className="relative flex-1 bg-[#0b1120] overflow-y-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-300">
              Kod icerigi yukleniyor...
            </div>
          ) : content ? (
            <SyntaxHighlighter
              language={language}
              style={oneDark}
              wrapLongLines
              customStyle={{
                margin: 0,
                background: "transparent",
                fontSize: "12px",
                padding: "12px 16px",
                minHeight: "100%",
              }}
              showLineNumbers
            >
              {content}
            </SyntaxHighlighter>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Gosterilecek kod icerigi bulunamadi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


