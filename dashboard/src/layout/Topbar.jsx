import { FaBell, FaMagnifyingGlass } from 'react-icons/fa6';

import { StatusPill } from '../components/StatusPill';
import { navItems } from './navItems';

export function Topbar({ socketStatus, apiError, activeSection, onNavigate }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#020403]/75 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300/80">Real-Time Operations</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Ride Command Center</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {apiError && (
            <div className="rounded-full border border-rose-300/25 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-rose-100">
              API waiting
            </div>
          )}
          <StatusPill status={socketStatus} />
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-400 md:flex">
            <FaMagnifyingGlass className="text-slate-500" />
            <span>Search city, zone, stream</span>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-200 transition duration-300 hover:border-emerald-300/30 hover:bg-emerald-300/10 hover:text-emerald-200" type="button">
            <FaBell />
          </button>
        </div>
      </div>
      <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            aria-current={activeSection === item.id ? 'page' : undefined}
            className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition duration-300 ${
              activeSection === item.id
                ? 'bg-emerald-400 text-black shadow-[0_0_22px_rgba(29,185,84,0.22)]'
                : 'border border-white/10 bg-white/[0.06] text-slate-300 hover:border-emerald-300/25 hover:text-white'
            }`}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            <item.icon />
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
