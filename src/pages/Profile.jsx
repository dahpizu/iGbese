import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  CreditCard,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getSpendingLimit, getAvailableLimit } from "../data/store";

const DEFAULT_CUSTOMER = {
  firstName: "Oladapo",
  lastName: "",
  email: "customer@example.com",
  phone: "",
  kycStatus: "Pending",
  accountStatus: "Active",
  spendingLimit: 300000,
};

const Profile = () => {
  const [customer, setCustomer] = useState(null);
  const [availableLimit, setAvailableLimit] = useState(300000);
  const [spendingLimit, setSpendingLimit] = useState(300000);

  const loadProfile = () => {
    const savedCustomer = localStorage.getItem("igbese_customer");

    let currentCustomer = DEFAULT_CUSTOMER;

    if (savedCustomer) {
      try {
        currentCustomer = {
          ...DEFAULT_CUSTOMER,
          ...JSON.parse(savedCustomer),
        };
      } catch {
        currentCustomer = DEFAULT_CUSTOMER;
      }
    }

    setCustomer(currentCustomer);
    setSpendingLimit(getSpendingLimit());
    setAvailableLimit(getAvailableLimit());
  };

  useEffect(() => {
    loadProfile();

    const handleCustomerUpdated = () => {
      loadProfile();
    };

    const handlePurchasesUpdated = () => {
      loadProfile();
    };

    window.addEventListener("igbese-customer-updated", handleCustomerUpdated);

    window.addEventListener("igbese-purchases-updated", handlePurchasesUpdated);

    window.addEventListener("storage", handleCustomerUpdated);

    return () => {
      window.removeEventListener(
        "igbese-customer-updated",
        handleCustomerUpdated
      );

      window.removeEventListener(
        "igbese-purchases-updated",
        handlePurchasesUpdated
      );

      window.removeEventListener("storage", handleCustomerUpdated);
    };
  }, []);

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#050907] text-white cyber-grid">
        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
          <div className="rounded-2xl border border-white/8 bg-[#07100b] p-8 text-center">
            <div className="mono text-[8px] uppercase tracking-[0.15em] text-[#607166]">
              customer.profile
            </div>

            <div className="mt-4 text-sm font-bold">Loading profile...</div>
          </div>
        </main>
      </div>
    );
  }

  const fullName =
    `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
    "Customer";

  const initials = `${customer.firstName?.[0] || "O"}${
    customer.lastName?.[0] || ""
  }`.toUpperCase();

  const isVerified = customer.kycStatus === "Verified";
  const accountActive = customer.accountStatus !== "Suspended";

  const formattedSpendingLimit = Number(spendingLimit || 0).toLocaleString(
    "en-NG"
  );

  const formattedAvailableLimit = Number(availableLimit || 0).toLocaleString(
    "en-NG"
  );

  return (
    <div className="min-h-screen bg-[#050907] text-white cyber-grid">
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
        {/* HEADER */}
        <div className="mb-8">
          <div className="mono mb-2 text-[9px] uppercase tracking-[0.2em] text-[#8cff72]/50">
            customer.profile
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Your profile
          </h1>

          <p className="mt-2 text-sm text-[#607166]">
            Manage your personal information and account details.
          </p>
        </div>

        {/* PROFILE HERO */}
        <section className="mb-6 rounded-2xl border border-white/8 bg-[#07100b] p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* AVATAR */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#8cff72]/20 bg-[#8cff72]/10 text-xl font-bold text-[#8cff72]">
              {initials}
            </div>

            {/* NAME */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold">{fullName}</h2>

                {isVerified ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-[#8cff72]/20 bg-[#8cff72]/8 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#8cff72]">
                    <CheckCircle2 size={11} />
                    KYC verified
                  </span>
                ) : (
                  <span className="rounded-full border border-yellow-400/20 bg-yellow-400/[0.06] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-yellow-300">
                    KYC pending
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-[#607166]">
                iGbese customer account
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`status-pulse h-1.5 w-1.5 rounded-full ${
                    accountActive ? "bg-[#8cff72]" : "bg-red-400"
                  }`}
                />

                <span
                  className={`mono text-[8px] uppercase tracking-[0.12em] ${
                    accountActive ? "text-[#8cff72]" : "text-red-300"
                  }`}
                >
                  Account {accountActive ? "active" : "suspended"}
                </span>
              </div>
            </div>

            {/* AVAILABLE LIMIT */}
            <div className="text-left sm:text-right">
              <div className="mono text-[8px] uppercase tracking-[0.15em] text-[#607166]">
                Available limit
              </div>

              <div className="mt-1 text-lg font-bold text-[#8cff72]">
                ₦{formattedAvailableLimit}
              </div>

              <div className="mt-1 text-[9px] text-[#526158]">
                of ₦{formattedSpendingLimit}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* PERSONAL INFORMATION */}
          <section className="rounded-2xl border border-white/8 bg-[#07100b] p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8cff72]/8 text-[#8cff72]">
                  <UserRound size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    Personal information
                  </h2>

                  <p className="mt-1 text-[11px] text-[#607166]">
                    Information associated with your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <ProfileField
                icon={<UserRound size={15} />}
                label="Full name"
                value={fullName}
              />

              <ProfileField
                icon={<Mail size={15} />}
                label="Email address"
                value={customer.email || "Not provided"}
              />

              <ProfileField
                icon={<Phone size={15} />}
                label="Phone number"
                value={customer.phone || "Not provided"}
              />
            </div>

            {/* KYC INFORMATION */}
            <div className="mt-6 border-t border-white/5 pt-6">
              <div className="mb-4">
                <div className="mono text-[8px] uppercase tracking-[0.15em] text-[#607166]">
                  Verification status
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#0b140e] p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      isVerified
                        ? "bg-[#8cff72]/10 text-[#8cff72]"
                        : "bg-yellow-400/10 text-yellow-300"
                    }`}
                  >
                    <ShieldCheck size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold">
                      Identity verification
                    </div>

                    <div className="mt-1 text-[10px] text-[#607166]">
                      {isVerified
                        ? "Your identity has been verified."
                        : "Your identity verification is still pending."}
                    </div>
                  </div>

                  <span
                    className={`mono text-[8px] uppercase tracking-[0.12em] ${
                      isVerified ? "text-[#8cff72]" : "text-yellow-300"
                    }`}
                  >
                    {customer.kycStatus || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* ACCOUNT ID */}
            <div className="mt-6 border-t border-white/5 pt-6">
              <ProfileField
                icon={<CreditCard size={15} />}
                label="Customer account"
                value={
                  customer.email
                    ? customer.email.toLowerCase()
                    : "Account active"
                }
              />
            </div>
          </section>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* KYC */}
            <Link
              to="/kyc"
              className="group block rounded-2xl border border-white/8 bg-[#07100b] p-5 transition hover:border-[#8cff72]/20"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    isVerified
                      ? "bg-[#8cff72]/8 text-[#8cff72]"
                      : "bg-yellow-400/10 text-yellow-300"
                  }`}
                >
                  <ShieldCheck size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">
                      Identity verification
                    </h3>

                    <ChevronRight
                      size={16}
                      className="text-[#607166] transition group-hover:translate-x-1 group-hover:text-[#8cff72]"
                    />
                  </div>

                  <p className="mt-1 text-[11px] leading-5 text-[#607166]">
                    {isVerified
                      ? "Your identity has been verified."
                      : "Complete verification to verify your account."}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-white/5 pt-4">
                <span
                  className={`mono text-[8px] uppercase tracking-[0.12em] ${
                    isVerified ? "text-[#8cff72]" : "text-yellow-300"
                  }`}
                >
                  {isVerified
                    ? "verification.complete"
                    : "verification.pending"}
                </span>
              </div>
            </Link>

            {/* SECURITY */}
            <div className="rounded-2xl border border-white/8 bg-[#07100b] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8cff72]/8 text-[#8cff72]">
                  <LockKeyhole size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">Account security</h3>

                  <p className="mt-1 text-[11px] leading-5 text-[#607166]">
                    Your account is protected by secure authentication.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4">
                <span className="status-pulse h-1.5 w-1.5 rounded-full bg-[#8cff72]" />

                <span className="mono text-[8px] uppercase tracking-[0.12em] text-[#607166]">
                  Session protected
                </span>
              </div>
            </div>

            {/* CREDIT LIMIT */}
            <div className="rounded-2xl border border-[#8cff72]/10 bg-[#8cff72]/[0.03] p-5">
              <div className="flex items-center gap-3">
                <CreditCard size={17} className="text-[#8cff72]" />

                <div>
                  <div className="mono text-[8px] uppercase tracking-[0.15em] text-[#607166]">
                    Credit limit
                  </div>

                  <div className="mt-1 text-xl font-bold">
                    ₦{formattedSpendingLimit}
                  </div>

                  <div className="mt-1 text-[10px] text-[#607166]">
                    Available: ₦{formattedAvailableLimit}
                  </div>
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-[#8cff72] transition-all"
                  style={{
                    width: `${
                      spendingLimit > 0
                        ? Math.min(
                            Math.max((availableLimit / spendingLimit) * 100, 0),
                            100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between">
                <span className="mono text-[7px] uppercase tracking-[0.1em] text-[#526158]">
                  Available
                </span>

                <span className="mono text-[7px] uppercase tracking-[0.1em] text-[#526158]">
                  ₦{formattedAvailableLimit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ACCOUNT FOOTER */}
        <div className="mt-6 rounded-2xl border border-white/5 bg-[#07100b] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mono text-[8px] uppercase tracking-[0.15em] text-[#526158]">
                igbese.account
              </div>

              <div className="mt-1 text-xs text-[#607166]">
                Customer account is currently{" "}
                <span
                  className={accountActive ? "text-[#8cff72]" : "text-red-300"}
                >
                  {accountActive ? "active" : "suspended"}
                </span>
                .
              </div>
            </div>

            <div className="mono text-[8px] uppercase tracking-[0.12em] text-[#526158]">
              iGbese customer portal
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ProfileField = ({ icon, label, value }) => {
  return (
    <div className="rounded-xl border border-white/5 bg-[#0b140e] p-4">
      <div className="flex items-center gap-3">
        <div className="text-[#607166]">{icon}</div>

        <div className="min-w-0">
          <div className="mono text-[8px] uppercase tracking-[0.13em] text-[#607166]">
            {label}
          </div>

          <div className="mt-1 truncate text-sm text-[#DCE8DE]">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
