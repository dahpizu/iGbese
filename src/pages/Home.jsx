import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getPurchases,
  getSpendingLimit,
  getAvailableLimit,
  getUtilizationPercentage,
} from "../data/store";

const Home = () => {
  const [purchases, setPurchases] = useState([]);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const loadCustomer = () => {
      const savedCustomer = localStorage.getItem("igbese_customer");

      if (!savedCustomer) {
        setCustomer(null);
        return;
      }

      try {
        setCustomer(JSON.parse(savedCustomer));
      } catch {
        setCustomer(null);
      }
    };

    const loadPurchases = () => {
      setPurchases(getPurchases());
    };

    loadCustomer();
    loadPurchases();

    window.addEventListener("igbese-purchases-updated", loadPurchases);
    window.addEventListener("igbese-customer-updated", loadCustomer);
    window.addEventListener("storage", loadPurchases);
    window.addEventListener("storage", loadCustomer);

    return () => {
      window.removeEventListener("igbese-purchases-updated", loadPurchases);

      window.removeEventListener("igbese-customer-updated", loadCustomer);

      window.removeEventListener("storage", loadPurchases);
      window.removeEventListener("storage", loadCustomer);
    };
  }, []);

  const activePurchases = useMemo(() => {
    return purchases.filter((purchase) => purchase.status === "Active");
  }, [purchases]);

  const completedPurchases = useMemo(() => {
    return purchases.filter((purchase) => purchase.status === "Completed");
  }, [purchases]);

  const totalFinanced = useMemo(() => {
    return purchases.reduce(
      (total, purchase) => total + Number(purchase.amount || 0),
      0
    );
  }, [purchases]);

  const totalOutstanding = useMemo(() => {
    return activePurchases.reduce(
      (total, purchase) => total + Number(purchase.remaining || 0),
      0
    );
  }, [activePurchases]);

  const nextPayment = useMemo(() => {
    const upcoming = activePurchases
      .filter((purchase) => Number(purchase.nextPayment || 0) > 0)
      .sort((a, b) => {
        const dateA = new Date(a.nextDate || 0).getTime();
        const dateB = new Date(b.nextDate || 0).getTime();

        if (!Number.isNaN(dateA) && !Number.isNaN(dateB)) {
          return dateA - dateB;
        }

        return Number(a.nextPayment || 0) - Number(b.nextPayment || 0);
      });

    return upcoming[0] || null;
  }, [activePurchases]);

  const recentPurchases = purchases.slice(0, 3);

  const spendingLimit = getSpendingLimit();
  const availableLimit = getAvailableLimit();
  const limitPercentage = getUtilizationPercentage();

  const formatNaira = (amount) => {
    return `₦${Number(amount || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div className="min-h-screen bg-[#050907] px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <div>
            <div className="mono text-[8px] uppercase tracking-[0.2em] text-[#8cff72]">
              Customer dashboard
            </div>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
              Welcome back, {customer?.firstName || "Customer"}
            </h1>
          </div>

          <Link
            to="/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] text-[#607166] transition hover:text-white"
          >
            <Bell size={17} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#8cff72]" />
          </Link>
        </div>

        {/* SPENDING LIMIT */}
        <section className="green-glow relative mt-8 overflow-hidden rounded-2xl border border-[#8cff72]/15 bg-[#8cff72]/[0.035] p-6">
          <div className="absolute inset-0 cyber-grid opacity-40" />

          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#8cff72]/[0.06] blur-3xl" />

          <div className="relative">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="status-pulse h-1.5 w-1.5 rounded-full bg-[#8cff72]" />

                  <div className="mono text-[8px] uppercase tracking-[0.2em] text-[#8cff72]/70">
                    Credit engine / active
                  </div>
                </div>

                <div className="mt-4 text-[10px] uppercase tracking-[0.12em] text-[#607166]">
                  Available spending limit
                </div>

                <div className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
                  {formatNaira(availableLimit)}
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-[#607166]">
                  <span>of {formatNaira(spendingLimit)} total limit</span>

                  <span className="h-1 w-1 rounded-full bg-[#3f5045]" />

                  <span className="text-[#8cff72]">
                    {Math.max(100 - limitPercentage, 0)}% available
                  </span>
                </div>
              </div>

              <Link
                to="/merchant/checkout"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#8cff72] px-5 py-3 text-xs font-bold text-[#061008] transition hover:bg-[#a2ff91]"
              >
                <ShoppingBag size={15} />
                Shop with iGbese
                <ArrowRight
                  size={14}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between">
                <span className="mono text-[8px] uppercase tracking-[0.14em] text-[#607166]">
                  Credit utilization
                </span>

                <span className="mono text-[8px] text-[#8cff72]">
                  {limitPercentage}% used
                </span>
              </div>

              <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-[#8cff72] transition-all duration-700"
                  style={{
                    width: `${Math.min(Math.max(limitPercentage, 0), 100)}%`,
                  }}
                />

                <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="mono text-[8px] text-[#3f5045]">
                  USED {formatNaira(spendingLimit - availableLimit)}
                </span>

                <span className="mono text-[8px] text-[#3f5045]">
                  LIMIT {formatNaira(spendingLimit)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ACCOUNT STATUS */}
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {/* KYC */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition hover:border-[#8cff72]/15">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8cff72]/10 text-[#8cff72]">
                <ShieldCheck size={18} />
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${
                  customer?.kycStatus === "Verified"
                    ? "border-[#8cff72]/30 bg-[#8cff72]/10 text-[#8cff72]"
                    : "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
                }`}
              >
                {customer?.kycStatus || "Pending"}
              </span>
            </div>

            <div className="mt-5">
              <div className="mono text-[8px] uppercase tracking-[0.18em] text-[#607166]">
                Identity verification
              </div>

              <h3 className="mt-2 text-base font-bold">KYC verification</h3>

              <p className="mt-2 text-xs leading-5 text-[#607166]">
                {customer?.kycStatus === "Verified"
                  ? "Your identity has been successfully verified."
                  : "Complete your identity verification to continue."}
              </p>
            </div>

            {customer?.kycStatus !== "Verified" && (
              <Link
                to="/kyc"
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#8cff72] transition hover:gap-3"
              >
                Complete verification
                <ArrowRight size={13} />
              </Link>
            )}
          </div>

          {/* ACCOUNT */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition hover:border-[#8cff72]/15">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8cff72]/10 text-[#8cff72]">
                <CreditCard size={18} />
              </div>

              <span className="rounded-full border border-[#8cff72]/30 bg-[#8cff72]/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#8cff72]">
                {customer?.accountStatus || "Active"}
              </span>
            </div>

            <div className="mt-5">
              <div className="mono text-[8px] uppercase tracking-[0.18em] text-[#607166]">
                Account status
              </div>

              <h3 className="mt-2 text-base font-bold">
                iGbese customer account
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#607166]">
                Your iGbese account is currently active and available for
                purchases.
              </p>
            </div>

            <Link
              to="/profile"
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#8cff72] transition hover:gap-3"
            >
              View profile
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* STATS */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            icon={<WalletCards size={17} />}
            label="Active plans"
            value={activePurchases.length}
          />

          <Stat
            icon={<CreditCard size={17} />}
            label="Outstanding"
            value={formatNaira(totalOutstanding)}
          />

          <Stat
            icon={<ShoppingBag size={17} />}
            label="Total financed"
            value={formatNaira(totalFinanced)}
          />

          <Stat
            icon={<CalendarDays size={17} />}
            label="Completed"
            value={completedPurchases.length}
          />
        </div>

        {/* MAIN GRID */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* RECENT PURCHASES */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="mono text-[8px] uppercase tracking-[0.18em] text-[#607166]">
                  Activity
                </div>

                <h2 className="mt-1 text-sm font-bold">Recent purchases</h2>
              </div>

              <Link
                to="/purchases"
                className="inline-flex items-center gap-1 text-xs text-[#8cff72] transition hover:text-white"
              >
                View all
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-3">
              {recentPurchases.length > 0 ? (
                recentPurchases.map((purchase) => (
                  <Link
                    key={purchase.id}
                    to={`/purchase/${purchase.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.025] p-4 transition hover:border-[#8cff72]/15 hover:bg-[#8cff72]/[0.02]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#8cff72]">
                      <ShoppingBag size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">
                        {purchase.product}
                      </div>

                      <div className="mt-1 text-xs text-[#607166]">
                        {purchase.merchant}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold">
                        {formatNaira(purchase.amount)}
                      </div>

                      <div
                        className={`mt-1 text-[9px] ${
                          purchase.status === "Completed"
                            ? "text-[#8cff72]"
                            : "text-[#607166]"
                        }`}
                      >
                        {purchase.status}
                      </div>
                    </div>

                    <ArrowRight
                      size={15}
                      className="text-[#3f5045] transition group-hover:translate-x-1 group-hover:text-[#8cff72]"
                    />
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-8 text-center">
                  <ShoppingBag size={24} className="mx-auto text-[#607166]" />

                  <div className="mt-4 text-sm font-bold">No purchases yet</div>

                  <div className="mt-2 text-xs text-[#607166]">
                    Your iGbese purchases will appear here.
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* NEXT PAYMENT */}
          <section>
            <div className="mb-3">
              <div className="mono text-[8px] uppercase tracking-[0.18em] text-[#607166]">
                Repayment
              </div>

              <h2 className="mt-1 text-sm font-bold">Next payment</h2>
            </div>

            {nextPayment ? (
              <div className="rounded-2xl border border-[#8cff72]/10 bg-[#8cff72]/[0.035] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8cff72]/10 text-[#8cff72]">
                    <CalendarDays size={17} />
                  </div>

                  <div className="mono text-[8px] uppercase tracking-[0.12em] text-[#8cff72]">
                    Upcoming
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-3xl font-extrabold">
                    {formatNaira(nextPayment.nextPayment)}
                  </div>

                  <div className="mt-2 text-xs text-[#607166]">
                    Due {nextPayment.nextDate}
                  </div>
                </div>

                <div className="mt-5 border-t border-white/5 pt-4">
                  <div className="text-xs font-semibold">
                    {nextPayment.product}
                  </div>

                  <div className="mt-1 text-[10px] text-[#607166]">
                    {nextPayment.merchant}
                  </div>
                </div>

                <Link
                  to="/payments"
                  className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#8cff72] px-4 py-3 text-xs font-bold text-[#061008] transition hover:bg-[#a2ff91]"
                >
                  Make payment
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8cff72]/10 text-[#8cff72]">
                  <CreditCard size={17} />
                </div>

                <div className="mt-5 text-sm font-bold">
                  No upcoming payments
                </div>

                <div className="mt-2 text-xs leading-5 text-[#607166]">
                  You're all caught up.
                </div>
              </div>
            )}
          </section>
        </div>

        {/* SYSTEM FOOTER */}
        <div className="mono mt-10 pb-8 text-center text-[8px] uppercase tracking-[0.15em] text-[#3f5045]">
          iGbese finance.system • Customer account active
        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#8cff72]">
          {icon}
        </div>
      </div>

      <div className="mono mt-4 text-[8px] uppercase tracking-[0.12em] text-[#607166]">
        {label}
      </div>

      <div className="mt-2 text-lg font-extrabold">{value}</div>
    </div>
  );
};

export default Home;
