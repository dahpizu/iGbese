import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  getPurchases,
  savePurchases,
  getTotalOutstanding,
  getInstallmentAmount,
  getNextInstallmentNumber,
  getNextPaymentDate,
} from "../data/store";

import { addPaymentNotification } from "../data/notifications";

const Payments = () => {
  const [purchases, setPurchases] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const activePurchases = useMemo(() => {
    return purchases.filter(
      (purchase) =>
        purchase.status === "Active" && Number(purchase.remaining || 0) > 0
    );
  }, [purchases]);

  const totalOutstanding = getTotalOutstanding();

  const nextPayment = useMemo(() => {
    if (!activePurchases.length) {
      return null;
    }

    return activePurchases.reduce((lowest, purchase) => {
      if (!lowest) {
        return purchase;
      }

      return Number(purchase.nextPayment || 0) < Number(lowest.nextPayment || 0)
        ? purchase
        : lowest;
    }, null);
  }, [activePurchases]);

  const paidThisYear = useMemo(() => {
    return purchases.reduce((total, purchase) => {
      const amount = Number(purchase.amount || 0);
      const remaining = Number(purchase.remaining || 0);

      return total + Math.max(amount - remaining, 0);
    }, 0);
  }, [purchases]);

  const formatNaira = (amount) => {
    return `₦${Number(amount || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const openPaymentModal = (purchase) => {
    setSelectedPurchase(purchase);
    setShowModal(true);
  };

  const closePaymentModal = () => {
    setShowModal(false);
    setSelectedPurchase(null);
  };

  const handleConfirmPayment = () => {
    if (!selectedPurchase) {
      return;
    }

    const purchases = getPurchases();

    const current = purchases.find(
      (purchase) => purchase.id === selectedPurchase.id
    );

    if (!current) {
      closePaymentModal();
      return;
    }

    if (current.status === "Completed" || Number(current.remaining || 0) <= 0) {
      closePaymentModal();
      return;
    }

    const months = Math.max(Number(current.months || 1), 1);

    const total = Math.max(Number(current.amount || 0), 0);

    const currentRemaining = Math.max(Number(current.remaining || 0), 0);

    const currentPaymentsMade = Math.min(
      Math.max(Number(current.paymentsMade || 0), 0),
      months
    );

    const installmentNumber = getNextInstallmentNumber(current);

    const paymentAmount = Math.min(
      getInstallmentAmount(current, installmentNumber),
      currentRemaining
    );

    const newRemaining = Math.max(currentRemaining - paymentAmount, 0);

    const newPaymentsMade = Math.min(currentPaymentsMade + 1, months);

    const isCompleted = newPaymentsMade >= months || newRemaining <= 0;

    const updatedPurchase = {
      ...current,

      remaining: newRemaining,

      paymentsMade: newPaymentsMade,

      progress: isCompleted
        ? 100
        : Math.min(Math.round((newPaymentsMade / months) * 100), 100),

      nextPayment: isCompleted
        ? 0
        : getInstallmentAmount(current, newPaymentsMade + 1),

      nextDate: isCompleted
        ? "Completed"
        : getNextPaymentDate({
            ...current,
            paymentsMade: newPaymentsMade,
            remaining: newRemaining,
            status: "Active",
          }),

      status: isCompleted ? "Completed" : "Active",
    };

    const updatedPurchases = purchases.map((purchase) =>
      purchase.id === current.id ? updatedPurchase : purchase
    );

    savePurchases(updatedPurchases);

    addPaymentNotification(current, paymentAmount);

    window.dispatchEvent(new Event("igbese-notifications-updated"));

    setPurchases(updatedPurchases);

    setShowModal(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setSelectedPurchase(null);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#050907] px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div>
          <div className="mono mb-2 text-[8px] uppercase tracking-[0.2em] text-[#8cff72]">
            Finance system / payments
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">Payments</h1>

          <p className="mt-2 text-sm text-[#607166]">
            Manage your iGbese repayment plans.
          </p>
        </div>

        {/* SUMMARY */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Outstanding" value={formatNaira(totalOutstanding)} />

          <Stat label="Active plans" value={activePurchases.length} />

          <Stat label="Paid this year" value={formatNaira(paidThisYear)} />

          <Stat
            label="Next payment"
            value={nextPayment ? formatNaira(nextPayment.nextPayment) : "₦0"}
          />
        </div>

        {/* NEXT PAYMENT */}
        {nextPayment && (
          <section className="mt-6 rounded-2xl border border-[#8cff72]/10 bg-[#8cff72]/[0.035] p-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="mono text-[8px] uppercase tracking-[0.18em] text-[#8cff72]">
                  Next payment
                </div>

                <div className="mt-3 text-3xl font-extrabold">
                  {formatNaira(nextPayment.nextPayment)}
                </div>

                <div className="mt-2 text-xs text-[#607166]">
                  {nextPayment.product}
                </div>

                <div className="mt-1 text-xs text-[#607166]">
                  Due {nextPayment.nextDate}
                </div>
              </div>

              <button
                type="button"
                onClick={() => openPaymentModal(nextPayment)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8cff72] px-5 py-3 text-xs font-bold text-[#061008] transition hover:bg-[#a2ff91]"
              >
                <CreditCard size={15} />
                Pay now
              </button>
            </div>
          </section>
        )}

        {/* ACTIVE PLANS */}
        <section className="mt-8">
          <div className="mb-3">
            <div className="mono text-[8px] uppercase tracking-[0.18em] text-[#607166]">
              Repayment plans
            </div>

            <h2 className="mt-1 text-sm font-bold">Active plans</h2>
          </div>

          <div className="space-y-3">
            {activePurchases.map((purchase) => {
              const months = Math.max(Number(purchase.months || 1), 1);

              const paymentsMade = Number(purchase.paymentsMade || 0);

              const installmentNumber = getNextInstallmentNumber(purchase);

              const installment = getInstallmentAmount(
                purchase,
                installmentNumber
              );

              return (
                <div
                  key={purchase.id}
                  className="rounded-2xl border border-white/5 bg-white/[0.025] p-5"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#8cff72]">
                      <CalendarDays size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold">
                        {purchase.product}
                      </div>

                      <div className="mt-1 text-xs text-[#607166]">
                        {purchase.merchant}
                      </div>

                      <div className="mono mt-2 text-[8px] text-[#3f5045]">
                        INSTALLMENT {installmentNumber} / {months}
                      </div>
                    </div>

                    <div>
                      <div className="mono text-[8px] uppercase tracking-[0.12em] text-[#607166]">
                        Next payment
                      </div>

                      <div className="mt-1 text-sm font-bold">
                        {formatNaira(installment)}
                      </div>
                    </div>

                    <div>
                      <div className="mono text-[8px] uppercase tracking-[0.12em] text-[#607166]">
                        Remaining
                      </div>

                      <div className="mt-1 text-sm font-bold">
                        {formatNaira(purchase.remaining)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openPaymentModal(purchase)}
                      className="rounded-xl border border-[#8cff72]/20 bg-[#8cff72]/[0.06] px-4 py-3 text-xs font-bold text-[#8cff72] transition hover:bg-[#8cff72]/10"
                    >
                      Pay
                    </button>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <span className="mono text-[8px] uppercase tracking-[0.1em] text-[#607166]">
                        Repayment progress
                      </span>

                      <span className="mono text-[8px] text-[#8cff72]">
                        {purchase.progress}%
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-[#8cff72] transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            Number(purchase.progress || 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!activePurchases.length && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
              <CheckCircle2 size={28} className="mx-auto text-[#8cff72]" />

              <h2 className="mt-4 text-sm font-bold">You're all caught up</h2>

              <p className="mt-2 text-xs text-[#607166]">
                You have no active repayment plans.
              </p>
            </div>
          )}
        </section>

        {/* SECURITY */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#8cff72]" />

          <div>
            <div className="text-xs font-semibold">
              Secure payment processing
            </div>

            <div className="mt-1 text-[10px] leading-5 text-[#607166]">
              This frontend demo records payment activity locally. No real money
              is transferred.
            </div>
          </div>
        </div>

        {/* PAYMENT MODAL */}
        {showModal && selectedPurchase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b140e] p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mono text-[8px] uppercase tracking-[0.15em] text-[#8cff72]">
                    Payment confirmation
                  </div>

                  <h2 className="mt-2 text-lg font-bold">Confirm payment</h2>
                </div>

                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[#607166] transition hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.025] p-4">
                <div className="text-sm font-bold">
                  {selectedPurchase.product}
                </div>

                <div className="mt-1 text-xs text-[#607166]">
                  {selectedPurchase.merchant}
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div className="mono text-[8px] uppercase tracking-[0.1em] text-[#607166]">
                      Installment {getNextInstallmentNumber(selectedPurchase)}{" "}
                      of {selectedPurchase.months}
                    </div>

                    <div className="mt-1 text-2xl font-extrabold">
                      {formatNaira(
                        getInstallmentAmount(
                          selectedPurchase,
                          getNextInstallmentNumber(selectedPurchase)
                        )
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="mono text-[8px] uppercase tracking-[0.1em] text-[#607166]">
                      Remaining
                    </div>

                    <div className="mt-1 text-sm font-bold">
                      {formatNaira(selectedPurchase.remaining)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/5 pt-4">
                  <div className="mono text-[8px] uppercase tracking-[0.1em] text-[#607166]">
                    Payment date
                  </div>

                  <div className="mt-1 text-xs font-semibold text-white">
                    {selectedPurchase.nextDate}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmPayment}
                className="mt-5 w-full rounded-xl bg-[#8cff72] px-4 py-3 text-xs font-bold text-[#061008] transition hover:bg-[#a2ff91]"
              >
                Confirm payment
              </button>

              <div className="mt-4 text-center text-[9px] text-[#3f5045]">
                Demo mode • No real charge
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS MODAL */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-[#8cff72]/20 bg-[#0b140e] p-7 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#8cff72]/10 text-[#8cff72]">
                <CheckCircle2 size={28} />
              </div>

              <h2 className="mt-5 text-lg font-bold">Payment successful</h2>

              <p className="mt-2 text-xs leading-5 text-[#607166]">
                Your repayment has been recorded successfully.
              </p>

              <div className="mono mt-5 text-[8px] uppercase tracking-[0.15em] text-[#8cff72]">
                Payment system updated
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mono mt-10 pb-8 text-center text-[8px] uppercase tracking-[0.15em] text-[#3f5045]">
          iGbese finance.system • Secure repayment interface
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

export default Payments;
