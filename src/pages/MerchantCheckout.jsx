import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CreditCard,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import {
  addPurchase,
  getAvailableLimit,
  getInstallmentAmount,
} from "../data/store";

import { addPurchaseNotification } from "../data/notifications";

const plans = [3, 6, 9];

const formatCurrency = (amount) => {
  return `₦${Number(amount || 0).toLocaleString("en-NG")}`;
};

export default function MerchantCheckout() {
  const navigate = useNavigate();

  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [selectedMonths, setSelectedMonths] = useState(3);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const numericAmount = Number(amount || 0);

  const monthlyPayment = useMemo(() => {
    if (!numericAmount || !selectedMonths) {
      return 0;
    }

    return Math.ceil(numericAmount / selectedMonths);
  }, [numericAmount, selectedMonths]);

  const customer = useMemo(() => {
    if (!customerEmail.trim()) {
      return null;
    }

    const savedCustomer = localStorage.getItem("igbese_customer");

    if (!savedCustomer) {
      return null;
    }

    try {
      const parsed = JSON.parse(savedCustomer);

      if (parsed.email?.toLowerCase() === customerEmail.trim().toLowerCase()) {
        return parsed;
      }

      return null;
    } catch {
      return null;
    }
  }, [customerEmail]);

  const customerLimit = customer
    ? Number(customer.spendingLimit || 300000)
    : getAvailableLimit();

  const availableLimit = customer ? customerLimit : getAvailableLimit();

  const validateForm = () => {
    if (!customerName.trim()) {
      setError("Enter the customer's name.");
      return false;
    }

    if (!customerEmail.trim()) {
      setError("Enter the customer's email.");
      return false;
    }

    if (!customerEmail.includes("@")) {
      setError("Enter a valid customer email.");
      return false;
    }

    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a valid purchase amount.");
      return false;
    }

    if (numericAmount > availableLimit) {
      setError(
        `This transaction exceeds the customer's available limit of ${formatCurrency(
          availableLimit
        )}.`
      );
      return false;
    }

    setError("");
    return true;
  };

  const handleReview = () => {
    if (!validateForm()) {
      return;
    }

    setShowConfirmation(true);
  };

  const handleCreateFinancing = () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    const purchaseDate = new Date().toISOString();

    const purchase = {
      id: `PUR-${Date.now()}`,
      merchant: "Merchant",
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      merchantReference: reference.trim() || `IGB-${Date.now()}`,
      product: "Merchant Purchase",
      category: "BNPL Financing",
      amount: numericAmount,
      months: selectedMonths,
      paymentsMade: 0,
      remaining: numericAmount,
      progress: 0,
      status: "Active",
      purchaseDate,
      nextPayment: getInstallmentAmount(
        {
          amount: numericAmount,
          months: selectedMonths,
        },
        1
      ),
    };

    addPurchase(purchase);

    addPurchaseNotification({
      purchase,
    });

    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(false);

      navigate(`/purchase/${purchase.id}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#020617] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-7">
          <Link
            to="/merchant/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Merchant Dashboard
          </Link>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Merchant Financing
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Create Financing
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Create a BNPL transaction for a customer. The customer will repay
              the financed amount according to the selected payment plan.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <CreditCard size={21} />
              </div>

              <div>
                <h2 className="font-bold">Financing Details</h2>

                <p className="text-xs text-slate-500">
                  Enter the transaction information below.
                </p>
              </div>
            </div>

            {/* Customer */}
            <div className="mt-7">
              <label className="mb-2 block text-sm font-semibold">
                Customer name
              </label>

              <div className="relative">
                <UserRound
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Enter customer name"
                  className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold">
                Customer email
              </label>

              <input
                type="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                placeholder="customer@example.com"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40"
              />

              <p className="mt-2 text-xs text-slate-600">
                This will identify the customer's iGbese account.
              </p>
            </div>

            {/* Amount */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold">
                Purchase amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                  ₦
                </span>

                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-9 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40"
                />
              </div>
            </div>

            {/* Merchant reference */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold">
                Merchant reference
                <span className="ml-2 font-normal text-slate-600">
                  Optional
                </span>
              </label>

              <input
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="e.g. ORDER-847291"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40"
              />
            </div>

            {/* Plans */}
            <div className="mt-7">
              <label className="mb-3 block text-sm font-semibold">
                Repayment plan
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                {plans.map((months) => {
                  const monthly = numericAmount
                    ? Math.ceil(numericAmount / months)
                    : 0;

                  const selected = selectedMonths === months;

                  return (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setSelectedMonths(months)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-emerald-400 bg-emerald-400/[0.08]"
                          : "border-white/10 bg-black/20 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{months} Months</span>

                        {selected && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
                            <Check size={14} />
                          </span>
                        )}
                      </div>

                      <p className="mt-4 text-lg font-black text-emerald-300">
                        {formatCurrency(monthly)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">per month</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/[0.05] px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleReview}
              className="mt-7 w-full rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
            >
              Review Financing
            </button>
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-xl font-black">Financing Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-slate-500">Customer</span>

                  <span className="text-right font-semibold">
                    {customerName || "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-slate-500">Amount</span>

                  <span className="font-bold">
                    {formatCurrency(numericAmount)}
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
                <div className="flex gap-3">
                  <ShieldCheck
                    size={20}
                    className="shrink-0 text-emerald-300"
                  />

                  <div>
                    <p className="text-sm font-semibold">Customer limit</p>

                    <p className="mt-1 text-lg font-black text-emerald-300">
                      {formatCurrency(availableLimit)}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-center text-[11px] leading-5 text-slate-600">
                Financing can only be created when the purchase amount is within
                the customer's available limit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#07111f] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10">
              <Check size={30} className="text-emerald-300" />
            </div>

            <h2 className="mt-5 text-center text-2xl font-black">
              Confirm Financing
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-slate-400">
              Create a{" "}
              <span className="font-semibold text-white">
                {selectedMonths}-month
              </span>{" "}
              BNPL financing of{" "}
              <span className="font-semibold text-emerald-300">
                {formatCurrency(numericAmount)}
              </span>{" "}
              for {customerName}.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Purchase amount</span>

                <span className="font-bold">
                  {formatCurrency(numericAmount)}
                </span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-sm text-slate-500">Monthly payment</span>

                <span className="font-bold text-emerald-300">
                  {formatCurrency(monthlyPayment)}
                </span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-sm text-slate-500">Duration</span>

                <span className="font-bold">{selectedMonths} months</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreateFinancing}
                disabled={isProcessing}
                className="flex-1 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"
              >
                {isProcessing ? "Creating..." : "Create Financing"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
