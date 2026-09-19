import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getPurchases } from "../data/store";

const MerchantDashboard = () => {
  const [purchases, setPurchases] = useState([]);

  const loadPurchases = () => {
    setPurchases(getPurchases());
  };

  useEffect(() => {
    loadPurchases();

    const handleUpdate = () => {
      loadPurchases();
    };

    window.addEventListener("igbese-purchases-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("igbese-purchases-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const formatNaira = (amount) => {
    return `₦${Number(amount || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const stats = useMemo(() => {
    const totalSales = purchases.reduce(
      (total, purchase) => total + Number(purchase.amount || 0),
      0
    );

    const outstanding = purchases.reduce(
      (total, purchase) => total + Number(purchase.remaining || 0),
      0
    );

    const activeOrders = purchases.filter(
      (purchase) => purchase.status === "Active"
    );

    const completedOrders = purchases.filter(
      (purchase) => purchase.status === "Completed"
    );

    const paymentsReceived = totalSales - outstanding;

    return {
      totalSales,
      outstanding,
      activeOrders: activeOrders.length,
      completedOrders: completedOrders.length,
      paymentsReceived,
      totalOrders: purchases.length,
    };
  }, [purchases]);

  const recentOrders = useMemo(() => {
    return purchases.slice(0, 6);
  }, [purchases]);

  return (
    <div className="min-h-screen bg-[#f4f7f4] text-[#101711]">
      {/* HEADER */}
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f8e7] text-xl">
              🛒
            </div>

            <div>
              <div className="text-sm font-extrabold">Jumia</div>

              <div className="mono mt-1 text-[8px] uppercase tracking-[0.18em] text-black/35">
                Merchant portal
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              to="/merchant/checkout"
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-bold transition hover:bg-black/[0.03]"
            >
              Test Checkout
            </Link>

            <div className="rounded-xl bg-[#19B85A] px-4 py-2.5 text-xs font-bold text-white">
              Merchant Active
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-5 py-8">
        {/* TOP */}
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mono mb-2 text-[9px] uppercase tracking-[0.2em] text-[#19B85A]">
              Merchant dashboard
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight">
              Good morning, Jumia
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
              Monitor your iGbese financed orders, customer payments and
              outstanding balances.
            </p>
          </div>

          <div className="mono text-[9px] uppercase tracking-[0.15em] text-black/30">
            Live merchant data
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL SALES */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="mono text-[8px] uppercase tracking-[0.15em] text-black/35">
                Total financed
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e9f8e7] text-[#19B85A]">
                <DollarSign size={17} />
              </div>
            </div>

            <div className="mt-5 text-2xl font-extrabold">
              {formatNaira(stats.totalSales)}
            </div>

            <div className="mt-2 text-xs text-black/40">
              Across {stats.totalOrders} financed order
              {stats.totalOrders === 1 ? "" : "s"}
            </div>
          </div>

          {/* PAYMENTS */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="mono text-[8px] uppercase tracking-[0.15em] text-black/35">
                Payments received
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <CreditCard size={17} />
              </div>
            </div>

            <div className="mt-5 text-2xl font-extrabold">
              {formatNaira(stats.paymentsReceived)}
            </div>

            <div className="mt-2 text-xs text-black/40">
              Amount already paid by customers
            </div>
          </div>

          {/* OUTSTANDING */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="mono text-[8px] uppercase tracking-[0.15em] text-black/35">
                Outstanding
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Clock3 size={17} />
              </div>
            </div>

            <div className="mt-5 text-2xl font-extrabold">
              {formatNaira(stats.outstanding)}
            </div>

            <div className="mt-2 text-xs text-black/40">
              Remaining customer balances
            </div>
          </div>

          {/* ORDERS */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="mono text-[8px] uppercase tracking-[0.15em] text-black/35">
                Active orders
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <Activity size={17} />
              </div>
            </div>

            <div className="mt-5 text-2xl font-extrabold">
              {stats.activeOrders}
            </div>

            <div className="mt-2 text-xs text-black/40">
              {stats.completedOrders} completed order
              {stats.completedOrders === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        {/* SECONDARY OVERVIEW */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* RECENT ORDERS */}
          <section className="rounded-2xl border border-black/5 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-5">
              <div>
                <div className="text-sm font-extrabold">Recent orders</div>

                <div className="mt-1 text-xs text-black/35">
                  Latest iGbese financed purchases
                </div>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e9f8e7] text-[#19B85A]">
                <ShoppingBag size={17} />
              </div>
            </div>

            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/[0.04] text-black/30">
                  <Package size={23} />
                </div>

                <div className="mt-4 text-sm font-bold">
                  No financed orders yet
                </div>

                <p className="mt-2 max-w-sm text-xs leading-5 text-black/40">
                  Once a customer completes an iGbese checkout, their order will
                  appear here.
                </p>

                <Link
                  to="/merchant/checkout"
                  className="mt-5 rounded-xl bg-[#19B85A] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#11994a]"
                >
                  Open checkout
                </Link>
              </div>
            ) : (
              <div>
                {recentOrders.map((purchase) => {
                  const isCompleted = purchase.status === "Completed";

                  return (
                    <Link
                      key={purchase.id}
                      to={`/purchase/${purchase.id}`}
                      className="flex items-center gap-4 border-b border-black/5 px-5 py-4 transition last:border-b-0 hover:bg-black/[0.015]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-lg">
                        📱
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold">
                          {purchase.product}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-black/35">
                          <span>{purchase.id}</span>

                          <span>•</span>

                          <span>{formatDate(purchase.purchaseDate)}</span>
                        </div>
                      </div>

                      <div className="hidden text-right sm:block">
                        <div className="text-sm font-extrabold">
                          {formatNaira(purchase.amount)}
                        </div>

                        <div className="mt-1 text-[10px] text-black/35">
                          {purchase.months} months
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {isCompleted ? (
                          <span className="flex items-center gap-1 rounded-full bg-[#19B85A]/10 px-2.5 py-1 text-[9px] font-bold text-[#19B85A]">
                            <CheckCircle2 size={11} />
                            Completed
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold text-amber-600">
                            <Clock3 size={11} />
                            Active
                          </span>
                        )}

                        <ArrowRight size={15} className="text-black/20" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* RIGHT PANEL */}
          <aside className="space-y-6">
            {/* PERFORMANCE */}
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9f8e7] text-[#19B85A]">
                  <TrendingUp size={18} />
                </div>

                <div>
                  <div className="text-sm font-extrabold">
                    Portfolio overview
                  </div>

                  <div className="mt-1 text-xs text-black/35">
                    Current financing position
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-black/45">
                      Collection progress
                    </span>

                    <span className="text-xs font-bold">
                      {stats.totalSales > 0
                        ? Math.round(
                            (stats.paymentsReceived / stats.totalSales) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-black/5">
                    <div
                      className="h-full rounded-full bg-[#19B85A] transition-all"
                      style={{
                        width: `${
                          stats.totalSales > 0
                            ? Math.min(
                                Math.round(
                                  (stats.paymentsReceived / stats.totalSales) *
                                    100
                                ),
                                100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-black/[0.025] p-4">
                    <Users size={16} className="text-black/30" />

                    <div className="mt-3 text-lg font-extrabold">
                      {stats.totalOrders}
                    </div>

                    <div className="mt-1 text-[10px] text-black/35">
                      Financed orders
                    </div>
                  </div>

                  <div className="rounded-xl bg-black/[0.025] p-4">
                    <CheckCircle2 size={16} className="text-[#19B85A]" />

                    <div className="mt-3 text-lg font-extrabold">
                      {stats.completedOrders}
                    </div>

                    <div className="mt-1 text-[10px] text-black/35">
                      Completed
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="text-sm font-extrabold">Quick actions</div>

              <div className="mt-4 space-y-2">
                <Link
                  to="/merchant/checkout"
                  className="flex items-center justify-between rounded-xl border border-black/5 px-4 py-3 text-xs font-bold transition hover:bg-black/[0.025]"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag size={15} />
                    New checkout
                  </span>

                  <ArrowRight size={14} className="text-black/25" />
                </Link>

                <Link
                  to="/purchases"
                  className="flex items-center justify-between rounded-xl border border-black/5 px-4 py-3 text-xs font-bold transition hover:bg-black/[0.025]"
                >
                  <span className="flex items-center gap-2">
                    <Package size={15} />
                    Customer purchases
                  </span>

                  <ArrowRight size={14} className="text-black/25" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* FOOTER */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-black/5 pt-6 text-[9px] text-black/25 sm:flex-row">
          <div className="mono uppercase tracking-[0.12em]">
            iGbese merchant infrastructure
          </div>

          <div className="mono uppercase tracking-[0.12em]">
            Secure • Finance • Collect
          </div>
        </div>
      </main>
    </div>
  );
};

export default MerchantDashboard;
