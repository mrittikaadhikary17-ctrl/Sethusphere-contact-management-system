import React from "react";
import { Link } from "react-router-dom";

function BrandMark() {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#2E3342] bg-gradient-to-br from-[#1C1E26] to-[#0D0E11] shadow-md">
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="6" cy="12" r="2.5" fill="#C5A059" />
        <circle cx="18" cy="7" r="2.5" fill="#8B2635" />
        <circle cx="18" cy="17" r="2.5" fill="#4E6E55" />
        <path d="M6 12L18 7M6 12L18 17" stroke="#EDE8DF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function AuthLayout({ children, eyebrow = "Relationship intelligence, with intention." }) {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1E2024] lg:grid lg:grid-cols-[minmax(320px,0.85fr)_minmax(480px,1.15fr)]">
      <aside className="relative hidden overflow-hidden bg-[#121316] px-10 py-10 text-[#EDE8DF] lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#722F37]/25 blur-3xl" />
        <div className="relative">
          <Link to="/signin" className="inline-flex items-center gap-3">
            <BrandMark />
            <div>
              <div className="font-display text-sm font-bold tracking-[0.16em] text-white">SETHUSPHERE</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9C9FA8]">Relationship Intelligence</div>
            </div>
          </Link>
        </div>
        <div className="relative max-w-md">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">{eyebrow}</p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-white xl:text-5xl">
            Build a network that remembers what matters.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#CACCD2]">
            Bring context, cadence, and thoughtful follow-up into one calm workspace.
          </p>
          <div className="mt-8 h-px w-24 bg-[#C5A059]" />
        </div>
        <p className="relative text-[11px] text-[#757985]">Private workspace preview · Frontend demo</p>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <BrandMark />
            <div>
              <div className="font-display text-sm font-bold tracking-[0.16em] text-[#121316]">SETHUSPHERE</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#757985]">Relationship Intelligence</div>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

export function AuthField({ label, error, ...props }) {
  return (
    <label className="block text-sm font-semibold text-[#494C55]">
      {label}
      <input
        {...props}
        className={`mt-2 w-full rounded-xl border bg-white px-3.5 py-3 text-sm font-normal text-[#121316] outline-none transition placeholder:text-[#9C9FA8] focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/10 ${
          error ? "border-[#DC2626]" : "border-[#DCD7CE]"
        }`}
      />
      {error && <span className="mt-1 block text-xs font-medium text-[#B91C1C]">{error}</span>}
    </label>
  );
}

export function AuthButton({ children, variant = "primary", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#722F37]/25 ${
        variant === "secondary"
          ? "border border-[#DCD7CE] bg-white text-[#494C55] hover:bg-[#F5F2EB]"
          : "bg-[#722F37] text-white shadow-sm hover:bg-[#5C1521]"
      }`}
    >
      {children}
    </button>
  );
}

export function AuthHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-7">
      {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9B7830]">{eyebrow}</p>}
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[#121316]">{title}</h1>
      {description && <p className="mt-2 text-sm leading-relaxed text-[#757985]">{description}</p>}
    </div>
  );
}
