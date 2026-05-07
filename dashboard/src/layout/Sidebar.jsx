import { FaCircleNodes } from 'react-icons/fa6';

import { navItems } from './navItems';

export function Sidebar({ activeSection, onNavigate }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-black/25 p-5 backdrop-blur-2xl lg:block">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-emerald-400 text-black shadow-[0_0_30px_rgba(29,185,84,0.35)]">
          <FaCircleNodes className="text-xl" />
        </div>
        <div>
          <p className="text-lg font-bold text-white">Ops Pulse</p>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Ride Control</p>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            aria-current={activeSection === item.id ? 'page' : undefined}
            className={`flex w-full items-center gap-3 rounded-[8px] px-4 py-3 text-left text-sm font-semibold transition duration-300 ${
              activeSection === item.id
                ? 'bg-emerald-400 text-black shadow-[0_0_24px_rgba(29,185,84,0.25)]'
                : 'text-slate-400 hover:bg-white/[0.07] hover:text-white'
            }`}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            <item.icon />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-10 rounded-[8px] border border-emerald-300/20 bg-emerald-300/[0.07] p-4">
        <p className="text-sm font-semibold text-emerald-100">Production Signal</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Real-time ride, surge, demand, and streaming telemetry from the existing service.
        </p>
      </div>
    </aside>
  );
}
