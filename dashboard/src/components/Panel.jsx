export function Panel({ title, eyebrow, action, children, className = '' }) {
  return (
    <section className={`rounded-[8px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:border-emerald-300/25 hover:bg-white/[0.075] ${className}`}>
      {(title || eyebrow || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300/80">{eyebrow}</p>}
            {title && <h2 className="mt-1 text-lg font-semibold text-slate-50">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
