import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Search,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getPurchases } from "../data/store";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const loadPurchases = () => {
      setPurchases(getPurchases());
    };

    loadPurchases();

    window.addEventListener("igbese-purchases-updated", loadPurchases);
    window.addEventListener("storage", loadPurchases);

    return () => {
      window.removeEventListener("igbese-purchases-updated", loadPurchases);

      window.removeEventListener("storage", loadPurchases);
    };
  }, []);

  const filteredPurchases = useMemo(() => {
    const query = search.trim().toLowerCase();

    return purchases.filter((purchase) => {
      const product = purchase.product?.toLowerCase() || "";
      const merchant = purchase.merchant?.toLowerCase() || "";

      const matchesSearch =
        !query || product.includes(query) || merchant.includes(query);

      const matchesFilter =
        filter === "All" ||
        (filter === "Active" && purchase.status === "Active") ||
        (filter === "Completed" && purchase.status === "Completed");

      return matchesSearch && matchesFilter;
    });
  }, [purchases, search, filter]);

  const activeCount = useMemo(() => {
    return purchases.filter((purchase) => purchase.status === "Active").length;
  }, [purchases]);

  const completedCount = useMemo(() => {
    return purchases.filter((purchase) => purchase.status === "Completed")
      .length;
  }, [purchases]);

  const totalValue = useMemo(() => {
    return purchases.reduce(
      (total, purchase) => total + Number(purchase.amount || 0),
      0
    );
  }, [purchases]);

  const outstandingValue = useMemo(() => {
    return purchases.reduce(
      (total, purchase) => total + Number(purchase.remaining || 0),
      0
    );
  }, [purchases]);

  const formatNaira = (amount) => {
    return `₦${Number(amount || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div className="min-h-screen bg-[#050907] px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mono mb-2 text-[8px] uppercase tracking-[0.2em] text-[#8cff72]">
              Finance system / purchases
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight">
              Your purchases
            </h1>

            <p className="mt-2 text-sm text-[#607166]">
              Track every purchase financed through iGbese.
            </p>
          </div>

          <Link
            to="/merchant/checkout"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#8cff72] px-4 py-3 text-xs font-bold text-[#061008] transition hover:bg-[#a2ff91]"
          >
            <ShoppingBag size={15} />
            Test checkout
          </Link>
        </div>

        {/* SEARCH */}
        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#607166]"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search purchases or merchants..."
              className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#45534a] focus:border-[#8cff72]/30"
            />
          </div>

          <div className="flex rounded-xl border border-white/5 bg-white/[0.02] p-1">
            {["All", "Active", "Completed"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-lg px-4 py-2 text-xs transition ${
                  filter === item
                    ? "bg-[#8cff72] font-bold text-[#061008]"
                    : "text-[#607166] hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total purchases" value={purchases.length} />

          <Stat label="Active plans" value={activeCount} />

          <Stat label="Total financed" value={formatNaira(totalValue)} />

          <Stat label="Outstanding" value={formatNaira(outstandingValue)} />
        </div>

        {/* FILTER SUMMARY */}
        <div className="mt-6 flex items-center justify-between">
          <div className="mono text-[8px] uppercase tracking-[0.18em] text-[#607166]">
            {filteredPurchases.length} purchase
            {filteredPurchases.length !== 1 ? "s" : ""} found
          </div>

          <div className="mono text-[8px] uppercase tracking-[0.15em] text-[#3f5045]">
            {activeCount} active • {completedCount} completed
          </div>
        </div>

        {/* PURCHASE LIST */}
        <section className="mt-3">
          <div className="space-y-3">
            {filteredPurchases.map((purchase) => (
              <Link
                key={purchase.id}
                to={`/purchase/${purchase.id}`}
                className="group block rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition hover:border-[#8cff72]/20 hover:bg-[#8cff72]/[0.025]"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                  {/* ICON */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#8cff72]/[0.07] text-[#8cff72]">
                    <ShoppingBag size={19} />
                  </div>

                  {/* PRODUCT */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-sm font-bold">
                        {purchase.product}
                      </h2>

                      {purchase.status === "Completed" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#8cff72]/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-[#8cff72]">
                          <CheckCircle2 size={10} />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-[#8EA394]">
                          <Clock3 size={10} />
                          Active
                        </span>
                      )}
                    </div>

                    <div className="mt-1 text-xs text-[#607166]">
                      {purchase.merchant}
                    </div>

                    <div className="mono mt-2 text-[8px] uppercase tracking-[0.1em] text-[#3f5045]">
                      {purchase.id}
                    </div>
                  </div>

                  {/* AMOUNT */}
                  <div className="md:w-36">
                    <div className="mono text-[8px] uppercase tracking-[0.12em] text-[#607166]">
                      Purchase
                    </div>

                    <div className="mt-1 text-sm font-bold">
                      {formatNaira(purchase.amount)}
                    </div>
                  </div>

                  {/* REMAINING */}
                  <div className="md:w-36">
                    <div className="mono text-[8px] uppercase tracking-[0.12em] text-[#607166]">
                      Remaining
                    </div>

                    <div
                      className={`mt-1 text-sm font-bold ${
                        Number(purchase.remaining || 0) === 0
                          ? "text-[#8cff72]"
                          : ""
                      }`}
                    >
                      {formatNaira(purchase.remaining)}
                    </div>
                  </div>

                  {/* PROGRESS */}
                  <div className="md:w-40">
                    <div className="flex items-center justify-between">
                      <span className="mono text-[8px] uppercase tracking-[0.1em] text-[#607166]">
                        Progress
                      </span>

                      <span className="mono text-[8px] text-[#8cff72]">
                        {Math.min(Number(purchase.progress || 0), 100)}%
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-[#8cff72] transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            Math.max(Number(purchase.progress || 0), 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* ARROW */}
                  <ArrowRight
                    size={17}
                    className="shrink-0 text-[#3f5045] transition group-hover:translate-x-1 group-hover:text-[#8cff72]"
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredPurchases.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[#607166]">
                <Search size={18} />
              </div>

              <h2 className="mt-4 text-sm font-bold">No purchases found</h2>

              <p className="mt-2 text-xs text-[#607166]">
                Try another search or change the selected filter.
              </p>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <div className="mono mt-10 pb-8 text-center text-[8px] uppercase tracking-[0.15em] text-[#3f5045]">
          iGbese finance.system • Live local frontend state
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
      <div className="mono text-[8px] uppercase tracking-[0.15em] text-[#607166]">
        {label}
      </div>

      <div className="mt-3 text-lg font-extrabold">{value}</div>
    </div>
  );
};

export default Purchases;
