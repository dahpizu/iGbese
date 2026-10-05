import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CreditCard,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { addPurchase, getAvailableLimit } from "../data/store";

import { addPurchaseNotification } from "../data/notifications";

const products = {
  "samsung-galaxy-a55": {
    id: "samsung-galaxy-a55",
    name: "Samsung Galaxy A55",
    merchant: "Jumia",
    category: "Phones",
    price: 145000,
    image: "📱",
  },
  "iphone-15": {
    id: "iphone-15",
    name: "iPhone 15",
    merchant: "Jumia",
    category: "Phones",
    price: 980000,
    image: "📱",
  },
  "samsung-galaxy-buds3": {
    id: "samsung-galaxy-buds3",
    name: "Samsung Galaxy Buds3",
    merchant: "Jumia",
    category: "Audio",
    price: 185000,
    image: "🎧",
  },
  "samsung-galaxy-watch6": {
    id: "samsung-galaxy-watch6",
    name: "Samsung Galaxy Watch6",
    merchant: "Jumia",
    category: "Wearables",
    price: 275000,
    image: "⌚",
  },
  "playstation-5": {
    id: "playstation-5",
    name: "PlayStation 5",
    merchant: "Jumia",
    category: "Gaming",
    price: 850000,
    image: "🎮",
  },
  "macbook-air": {
    id: "macbook-air",
    name: "MacBook Air",
    merchant: "Jumia",
    category: "Laptops",
    price: 1450000,
    image: "💻",
  },
};

const plans = [3, 6, 9];

const formatCurrency = (amount) => {
  return `₦${Number(amount || 0).toLocaleString("en-NG")}`;
};

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const productId = searchParams.get("product");
  const product = products[productId] || products["samsung-galaxy-a55"];

  const [selectedMonths, setSelectedMonths] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const customer = useMemo(() => {
    const savedCustomer = localStorage.getItem("igbese_customer");

    if (!savedCustomer) {
      return null;
    }

    try {
      return JSON.parse(savedCustomer);
    } catch {
      return null;
    }
  }, []);

  const availableLimit = getAvailableLimit();

  const monthlyPayment = useMemo(() => {
    return Math.ceil(product.price / selectedMonths);
  }, [product.price, selectedMonths]);

  const totalPayments = selectedMonths;

  const canAfford = availableLimit >= product.price;

  const handleConfirmPurchase = () => {
    if (isProcessing) {
      return;
    }

    if (!customer) {
      setError("Please log in to your iGbese account before continuing.");
      return;
    }

    if (!canAfford) {
      setError(
        `This purchase exceeds your available limit of ${formatCurrency(
          availableLimit
        )}.`
      );
      return;
    }

    setError("");
    setIsProcessing(true);

    const purchaseDate = new Date();

    const nextPaymentDate = new Date(purchaseDate);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    const purchase = {
      id: `IGB-${Date.now()}`,
      merchant: product.merchant,
      customerName: `${customer.firstName || ""} ${
        customer.lastName || ""
      }`.trim(),
      customerEmail: customer.email || "",
      merchantReference: `IGB-${Date.now()}`,
      product: product.name,
      productId: product.id,
      category: product.category,
      amount: product.price,
      months: selectedMonths,
      paymentsMade: 0,
      remaining: product.price,
      progress: 0,
      status: "Active",
      purchaseDate: purchaseDate.toISOString(),
      nextPayment: monthlyPayment,
      nextPaymentDate: nextPaymentDate.toISOString(),
    };

    addPurchase(purchase);

    addPurchaseNotification({
      purchase,
    });

    setTimeout(() => {
      setIsProcessing(false);
      navigate(`/purchase/${purchase.id}`);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#050907] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-7">
          <Link
            to={`/merchant/product/${product.id}`}
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Product
          </Link>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              iGbese Checkout
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Choose your payment plan
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Split your purchase into manageable monthly payments with iGbese.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Main Checkout */}
          <div className="space-y-6">
            {/* Product */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-4xl">
                  {product.image}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    {product.merchant}
                  </p>

                  <h2 className="mt-1 text-xl font-black">{product.name}</h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {product.category}
                  </p>
                </div>

                <div className="ml-auto text-right">
                  <p className="text-xs text-slate-500">Purchase price</p>

                  <p className="mt-1 text-xl font-black text-emerald-300">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Plans */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <CreditCard size={21} />
                </div>

                <div>
                  <h2 className="font-bold">Choose repayment plan</h2>

                  <p className="text-xs text-slate-500">
                    Select how long you want to repay.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {plans.map((months) => {
                  const monthly = Math.ceil(product.price / months);
                  const selected = selectedMonths === months;

                  return (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setSelectedMonths(months)}
                      className={`rounded-2xl border p-5 text-left transition ${
                        selected
                          ? "border-emerald-400 bg-emerald-400/[0.08] shadow-[0_0_0_1px_rgba(134,239,172,0.08)]"
                          : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">
                          {months} Months
                        </span>

                        {selected && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
                            <Check size={14} strokeWidth={3} />
                          </span>
                        )}
                      </div>

                      <p className="mt-5 text-2xl font-black text-emerald-300">
                        {formatCurrency(monthly)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">per month</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Repayment Breakdown */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-lg font-black">Repayment breakdown</h2>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Purchase amount
                  </span>

                  <span className="font-bold">
                    {formatCurrency(product.price)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Repayment period
                  </span>

                  <span className="font-bold">{selectedMonths} months</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Monthly payment
                  </span>

                  <span className="font-bold text-emerald-300">
                    {formatCurrency(monthlyPayment)}
                  </span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Total scheduled payments
                    </span>

                    <span className="font-black">{totalPayments} payments</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-4">
              <div className="flex gap-3">
                <ShieldCheck
                  size={21}
                  className="mt-0.5 shrink-0 text-emerald-300"
                />

                <div>
                  <p className="text-sm font-semibold">
                    Secure iGbese purchase
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your repayment plan will be added to your iGbese account.
                    You can track your payments from the Payments section.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <ShoppingBag size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black">Order Summary</h2>

                  <p className="text-xs text-slate-500">
                    Review before confirming
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl">
                    {product.image}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{product.name}</p>

                    <p className="mt-1 text-xs text-slate-500">
                      {product.merchant}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-slate-500">Price</span>

                  <span className="font-bold">
                    {formatCurrency(product.price)}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-slate-500">Plan</span>

                  <span className="font-bold">{selectedMonths} months</span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-slate-500">Monthly repayment</p>

                  <p className="mt-1 text-3xl font-black text-emerald-300">
                    {formatCurrency(monthlyPayment)}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      Available iGbese limit
                    </p>

                    <p className="mt-1 text-lg font-black text-emerald-300">
                      {formatCurrency(availableLimit)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500">After purchase</p>

                    <p className="mt-1 text-lg font-black">
                      {formatCurrency(
                        Math.max(availableLimit - product.price, 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/[0.05] px-4 py-3 text-sm leading-5 text-rose-300">
                  {error}
                </div>
              )}

              {!canAfford && !error && (
                <div className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/[0.05] px-4 py-3 text-sm leading-5 text-rose-300">
                  This purchase is above your available iGbese limit.
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={!canAfford || isProcessing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check size={18} strokeWidth={3} />

                {isProcessing ? "Processing Purchase..." : "Confirm Purchase"}
              </button>

              <p className="mt-4 text-center text-[11px] leading-5 text-slate-600">
                By confirming, you agree to repay the purchase according to your
                selected {selectedMonths}-month plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
