import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, GitCompare, LayoutDashboard } from "lucide-react";

const navItems = [
  { to: "/", label: "Portfolio", icon: LayoutDashboard },
  { to: "/fund-analysis", label: "Fund Analysis", icon: BarChart3 },
  { to: "/fund-comparison", label: "Compare Funds", icon: GitCompare },
];

export default function AppLayout() {
  return (
    <div className="min-h-svh bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              iWealth
            </p>
            <h1 className="text-lg font-semibold text-slate-900">
              Mutual Fund Insights
            </h1>
          </div>

          <nav className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
