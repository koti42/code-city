"use client";

import { X } from "lucide-react";

type IntroModalProps = {
  open: boolean;
  onClose: () => void;
};

export function IntroModal({ open, onClose }: IntroModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-[min(560px,92vw)] rounded-2xl border border-slate-700/80 bg-slate-950/95 p-5 shadow-2xl shadow-emerald-500/20">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900 text-slate-300 shadow-sm transition hover:border-slate-400 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="space-y-3 pr-6">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-emerald-400">
            Hos geldin
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-slate-50">
            Code City, eglenmek ve kesfetmek icin gelistirildi.
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            GitHub reposunu 3D bir siberpunk sehir olarak goruntuleyebilecegin,
            deneysela bir yan proje. Dosyalar binalara, klasorler semtlere
            donusuyor; binalara tiklayarak kod icerigini acabilirsin.
          </p>
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 text-xs text-slate-300">
            <p className="font-semibold text-slate-100">Yapimci</p>
            <p className="mt-1">Koti42 &mdash; Mehmet Kucukcelebi</p>
            <p className="text-[11px] text-slate-400">
              LinkedIn uzerinden ulasmak icin &quot;Mehmet Kucukcelebi&quot; olarak
              aratabilirsin.
            </p>
          </div>
          <p className="text-[11px] text-slate-500">
            Bu arac, acik kaynak projeleri veya kendi projelerini daha oyunlasmis
            bir sekilde kesfetmek icin tasarlandi. Tum veriler dogrudan GitHub
            API uzerinden okunur; hicbir sey sunucuda saklanmaz.
          </p>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-1.5 text-xs font-medium text-emerald-950 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-400"
            >
              Sehre gir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


