import { NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `text-sm font-semibold transition-colors ${
    isActive ? "text-primary" : "text-muted hover:text-ink"
  }`;

export default function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white text-ink">
      {/* top promo banner — Saleshandy pattern */}
      <div className="flex h-10 shrink-0 items-center justify-center bg-primary px-4 text-center text-[12px] font-bold tracking-wide text-white">
        Collect testimonials in minutes — moderate, then showcase them anywhere.
      </div>

      {/* nav */}
      <header className="z-10 shrink-0 border-b border-line bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <NavLink to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="h-8 w-8" />
            <span className="text-[17px] font-bold tracking-headline">SaleshandyAssignment</span>
          </NavLink>
          <div className="flex items-center gap-6">
            <NavLink to="/" className={linkClass} end>
              Submit
            </NavLink>
            <NavLink to="/wall" className={linkClass}>
              Wall
            </NavLink>
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <footer className="shrink-0 border-t border-line py-3 text-center text-[13px] text-muted">
        SaleshandyAssignment — a testimonial platform demo.
      </footer>
    </div>
  );
}
