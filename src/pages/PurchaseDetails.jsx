import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import {
  getPurchaseById,
  getInstallmentAmount,
  getPaymentDate,
} from "../data/store";

const PurchaseDetails = () => {
  const { id } = useParams();

  const [purchase, setPurchase] = useState(null);

  useEffect(() => {
    const loadPurchase = () => {
      setPurchase(getPurchaseById(id));
    };

    loadPurchase();

    window.addEventListener("igbese-purchases-updated", loadPurchase);
    window.addEventListener("storage", loadPurchase);

    return () => {
      window.removeEventListener("igbese-purchases-updated", loadPurchase);
      window.removeEventListener("storage", loadPurchase);
    };
  }, [id]);

  const schedule = useMemo(() => {
    if (!purchase) {
      return [];
    }

    const months = Math.max(Number(purchase.months || 1), 1);

    const paymentsMade = Math.min(
      Math.max(Number(purchase.paymentsMade || 0), 0),
      months
    );

    return Array.from({ length: months }, (_, index) => {
      const installmentNumber = index + 1;

      const amount = getInstallmentAmount(purchase, installmentNumber);

      const date = getPaymentDate(purchase.purchaseDate, installmentNumber);

      const isPaid = installmentNumber <= paymentsMade;

      const isNext =
        installmentNumber === paymentsMade + 1 &&
        !isPaid &&
        purchase.status !== "Completed";

      return {
        number: installmentNumber,
        amount,
        date,
        isPaid,
        isNext,
      };
    });
  }, [purchase]);

  const formatNaira = (amount) => {
    return `₦${Number(amount || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  if (!purchase) {
    return (
      <div className="min-h-screen bg-[#050907] px-5 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/purchases"
            className="inline-flex items-center gap-2 text-xs text-[#8cff72]"
          >
            <ArrowLeft size={14} />
            Back to purchases
          </Link>

          <div className="mt-10 rounded-2xl border border-white/5 bg-white/[0.025] p-10 text-center">
            <div className="mono text-[8px] uppercase tracking-[0.18em] text-[#607166]">
              Finance system
            </div>

            <h1 className="mt-3 text-lg font-bold">Purchase not found</h1>

            <p className="mt-2 text-xs text-[#607166]">
              This purchase could not be found in your local account data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const paymentsMade = Math.min(
    Math.max(Number(purchase.paymentsMade || 0), 0),
    Number(purchase.months || 1)
  );

  const months = Math.max(Number(purchase.months || 1), 1);

  const isCompleted =
    purchase.status === "Completed" ||
    paymentsMade >= months ||
    Number(purchase.remaining || 0) <= 0;

  const nextInstallment = schedule.find((item) => item.isNext);

  return (
    <div className="min-h-screen bg-[#050907] px-5 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        {/* BACK */}
        <Link
          to="/purchases"
          className="inline-flex items-center gap-2 text-xs text-[#607166] transition hover:text-[#8cff72]"
        >
          <ArrowLeft size={14} />
          Back to purchases
        </Link>

        {/* HEADER */}
        <div className="mt-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mono mb-2 text-[8px] uppercase tracking-[0.2em] text-[#8cff72]">
              Finance system / purchase
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight">
              {purchase.product}
            </h1>

            <p className="mt-2 text-sm text-[#607166]">{purchase.merchant}</p>
          </div>

          <div>
            {isCompleted ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#8cff72]/10 px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-[#8cff72]">
                <CheckCircle2 size={12} />
                Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-[#8EA394]">
                <Clock3 size={12} />
                Active
              </span>
            )}
          </div>
        </div>

        {/* OVERVIEW */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Purchase amount" value={formatNaira(purchase.amount)} />

          <Stat label="Remaining" value={formatNaira(purchase.remaining)} />

          <Stat label="Payments made" value={`${paymentsMade} / ${months}`} />

          <Stat
            label="Progress"
            value={`${Math.min(Number(purchase.progress || 0), 100)}%`}
          />
        </div>

        {/* NEXT PAYMENT */}
        {!isCompleted && nextInstallment && (
          <section className="mt-6 rounded-2xl border border-[#8cff72]/10 bg-[#8cff72]/[0.035] p-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <div className="mono text-[8px] uppercase tracking-[0.18em] text-[#8cff72]">
                  Next installment
                </div>

                <div className="mt-3 text-3xl font-extrabold">
                  {formatNaira(nextInstallment.amount)}
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-[#607166]">
                  <CalendarDays size={13} />
                  Due {nextInstallment.date}
                </div>
              </div>

              <Link
                to="/payments"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8cff72] px-5 py-3 text-xs font-bold text-[#061008] transition hover:bg-[#a2ff91]"
              >
                <CreditCard size={15} />
                Make payment
              </Link>
            </div>
          </section>
        )}

        {/* COMPLETED MESSAGE */}
        {isCompleted && (
          <section className="mt-6 rounded-2xl border border-[#8cff72]/10 bg-[#8cff72]/[0.035] p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8cff72]/10 text-[#8cff72]">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <div className="text-sm font-bold">Repayment complete</div>

                <div className="mt-1 text-xs text-[#607166]">
                  All {months} installments have been successfully paid.
                </div>
              </div>
            </div>
          </section>
        )}

        {/* REPAYMENT SCHEDULE */}
        <section className="mt-8">
          <div className="mb-3">
            <div className="mono text-[8px] uppercase tracking-[0.18em] text-[#607166]">
              Repayment schedule
            </div>

            <h2 className="mt-1 text-sm font-bold">
              {months}-month payment plan
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.025]">
            {schedule.map((item) => (
              <div
                key={item.number}
                className={`flex flex-col gap-4 border-b border-white/5 p-5 last:border-b-0 md:flex-row md:items-center ${
                  item.isNext ? "bg-[#8cff72]/[0.025]" : ""
                }`}
              >
                {/* NUMBER */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    item.isPaid
                      ? "bg-[#8cff72]/10 text-[#8cff72]"
                      : item.isNext
                      ? "bg-[#8cff72]/10 text-[#8cff72]"
                      : "bg-white/5 text-[#607166]"
                  }`}
                >
                  {item.isPaid ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <span className="mono text-xs">
                      {String(item.number).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* DETAILS */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold">
                      Installment {item.number}
                    </span>

                    {item.isPaid && (
                      <span className="rounded-full bg-[#8cff72]/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-[#8cff72]">
                        Paid
                      </span>
                    )}

                    {item.isNext && (
                      <span className="rounded-full bg-white/5 px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-[#8EA394]">
                        Next
                      </span>
                    )}
                  </div>

                  <div className="mt-1 text-xs text-[#607166]">{item.date}</div>
                </div>

                {/* AMOUNT */}
                <div className="md:text-right">
                  <div className="mono text-[8px] uppercase tracking-[0.1em] text-[#607166]">
                    Amount
                  </div>

                  <div className="mt-1 text-sm font-bold">
                    {formatNaira(item.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PURCHASE INFORMATION */}
        <section className="mt-8 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
            <div className="mono text-[8px] uppercase tracking-[0.15em] text-[#607166]">
              Purchase information
            </div>

            <div className="mt-5 space-y-4">
              <InfoRow label="Purchase ID" value={purchase.id} />

              <InfoRow label="Merchant" value={purchase.merchant} />

              <InfoRow label="Purchase date" value={purchase.purchaseDate} />

              <InfoRow label="Payment plan" value={`${months} months`} />

              <InfoRow
                label="Next payment"
                value={isCompleted ? "Completed" : purchase.nextDate}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
            <div className="mono text-[8px] uppercase tracking-[0.15em] text-[#607166]">
              Account protection
            </div>

            <div className="mt-5 flex items-start gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-[#8cff72]"
              />

              <div>
                <div className="text-sm font-semibold">Protected financing</div>

                <p className="mt-2 text-xs leading-5 text-[#607166]">
                  Your repayment plan and purchase information are stored in
                  your iGbese account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div className="mono mt-10 pb-8 text-center text-[8px] uppercase tracking-[0.15em] text-[#3f5045]">
          iGbese finance.system • Purchase record
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

const InfoRow = ({ label, value }) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="mono text-[8px] uppercase tracking-[0.1em] text-[#607166]">
        {label}
      </span>

      <span className="text-right text-xs font-medium text-white">{value}</span>
    </div>
  );
};

export default PurchaseDetails;
