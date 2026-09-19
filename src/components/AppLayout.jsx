import { useEffect, useState } from "react";
import {
  Bell,
  CreditCard,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { Link, NavLink, Outlet } from "react-router-dom";

import Logo from "./Logo";
import { getUnreadCount } from "../data/notifications";

const AppLayout = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateUnreadCount = () => {
      setUnreadCount(getUnreadCount());
    };

    updateUnreadCount();

    window.addEventListener("igbese-notifications-updated", updateUnreadCount);

    window.addEventListener("storage", updateUnreadCount);

    return () => {
      window.removeEventListener(
        "igbese-notifications-updated",
        updateUnreadCount
      );

      window.removeEventListener("storage", updateUnreadCount);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050907] text-white">
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/5 bg-[#07100b] lg:flex lg:flex-col">
        <div className="flex h-full flex-col p-5">
          {/* LOGO */}
          <div className="border-b border-white/5 pb-6">
            <Logo />
          </div>

          {/* SYSTEM STATUS */}
          <div className="mt-6 rounded-xl border border-[#8cff72]/10 bg-[#8cff72]/[0.03] p-3">
            <div className="mono flex items-center gap-2 text-[8px] uppercase tracking-[0.15em] text-[#607166]">
              <span className="status-pulse h-1.5 w-1.5 rounded-full bg-[#8cff72]" />
              System online
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="mt-8 flex-1 space-y-1">
            <NavItem
              to="/home"
              icon={<LayoutDashboard size={17} />}
              label="Dashboard"
            />

            <NavItem
              to="/purchases"
              icon={<ShoppingBag size={17} />}
              label="Purchases"
            />

            <NavItem
              to="/payments"
              icon={<CreditCard size={17} />}
              label="Payments"
            />

            <NavItem
              to="/notifications"
              icon={<Bell size={17} />}
              label="Notifications"
              badge={unreadCount}
            />

            <NavItem
              to="/profile"
              icon={<UserRound size={17} />}
              label="Profile"
            />
          </nav>

          {/* USER */}
          <div className="border-t border-white/5 pt-4">
            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-white/[0.03]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8cff72]/10 text-sm font-bold text-[#8cff72]">
                O
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold">Oladapo</div>

                <div className="mono mt-1 text-[8px] uppercase tracking-[0.1em] text-[#607166]">
                  Customer
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("igbese_session");
                window.location.href = "/";
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold text-[#607166] transition hover:bg-white/5 hover:text-white"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="lg:pl-64">
        {/* MOBILE HEADER */}
        <header className="border-b border-white/5 bg-[#050907] lg:hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <Logo compact />

            <div className="flex items-center gap-2">
              <Link
                to="/notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[#8EA394]"
              >
                <Bell size={17} />

                {unreadCount > 0 && (
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#8cff72]" />
                )}
              </Link>

              <Link
                to="/profile"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#8cff72]/20 bg-[#8cff72]/10 text-sm font-bold text-[#8cff72]"
              >
                O
              </Link>
            </div>
          </div>

          {/* MOBILE NAV */}
          <nav className="flex gap-1 overflow-x-auto px-4 pb-4">
            <MobileNavItem
              to="/home"
              icon={<LayoutDashboard size={15} />}
              label="Home"
            />

            <MobileNavItem
              to="/purchases"
              icon={<ShoppingBag size={15} />}
              label="Purchases"
            />

            <MobileNavItem
              to="/payments"
              icon={<CreditCard size={15} />}
              label="Payments"
            />

            <MobileNavItem
              to="/notifications"
              icon={<Bell size={15} />}
              label="Alerts"
            />

            <MobileNavItem
              to="/profile"
              icon={<UserRound size={15} />}
              label="Profile"
            />
          </nav>
        </header>

        {/* PAGE CONTENT */}
        <div className="min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
          isActive
            ? "border border-[#8cff72]/10 bg-[#8cff72]/[0.08] text-[#8cff72]"
            : "text-[#607166] hover:bg-white/[0.03] hover:text-[#C9D5CC]"
        }`
      }
    >
      {icon}

      <span className="flex-1">{label}</span>

      {badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8cff72] px-1.5 text-[9px] font-bold text-[#061008]">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

const MobileNavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[11px] transition ${
          isActive
            ? "bg-[#8cff72] font-semibold text-[#061008]"
            : "border border-white/5 bg-white/[0.02] text-[#607166]"
        }`
      }
    >
      {icon}

      {label}
    </NavLink>
  );
};

export default AppLayout;
