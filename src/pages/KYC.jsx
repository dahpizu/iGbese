import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { addKycNotification } from "../data/notifications";

const KYC = () => {
  const navigate = useNavigate();

  const getCustomer = () => {
    const savedCustomer = localStorage.getItem("igbese_customer");

    if (!savedCustomer) {
      return {
        firstName: "Oladapo",
        lastName: "",
        email: "",
        phone: "",
        kycStatus: "Pending",
        spendingLimit: 300000,
      };
    }

    try {
      return JSON.parse(savedCustomer);
    } catch {
      return {
        firstName: "Oladapo",
        lastName: "",
        email: "",
        phone: "",
        kycStatus: "Pending",
        spendingLimit: 300000,
      };
    }
  };

  const customer = getCustomer();

  const [step, setStep] = useState(
    customer.kycStatus === "Verified" ? "verified" : "intro"
  );

  const [form, setForm] = useState({
    dateOfBirth: customer.dateOfBirth || "",
    idType: customer.idType || "",
    idNumber: customer.idNumber || "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const startVerification = () => {
    setStep("form");
    setError("");
  };

  const validateForm = () => {
    if (!form.dateOfBirth || !form.idType || !form.idNumber.trim()) {
      return "Please complete all verification fields.";
    }

    const dateOfBirth = new Date(form.dateOfBirth);
    const today = new Date();

    if (Number.isNaN(dateOfBirth.getTime())) {
      return "Please enter a valid date of birth.";
    }

    if (dateOfBirth >= today) {
      return "Date of birth must be in the past.";
    }

    const idNumber = form.idNumber.trim();

    if (form.idType === "NIN" && !/^\d{11}$/.test(idNumber)) {
      return "NIN must contain exactly 11 digits.";
    }

    if (form.idType === "BVN" && !/^\d{11}$/.test(idNumber)) {
      return "BVN must contain exactly 11 digits.";
    }

    if (form.idType === "Passport" && idNumber.length < 6) {
      return "Please enter a valid passport number.";
    }

    if (form.idType === "Drivers License" && idNumber.length < 5) {
      return "Please enter a valid driver's license number.";
    }

    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    const updatedCustomer = {
      ...customer,
      kycStatus: "Verified",
      kycCompletedAt: new Date().toISOString(),
      dateOfBirth: form.dateOfBirth,
      idType: form.idType,
      idNumber: form.idNumber.trim(),
    };

    localStorage.setItem("igbese_customer", JSON.stringify(updatedCustomer));

    addKycNotification();

    setTimeout(() => {
      setIsSubmitting(false);
      setStep("success");
    }, 500);
  };

  const finishVerification = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-[#050907] text-white cyber-grid">
      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10">
        {/* BACK */}
        <Link
          to="/profile"
          className="mb-8 inline-flex items-center gap-2 text-xs text-[#607166] transition hover:text-[#8cff72]"
        >
          <ArrowLeft size={15} />
          Back to profile
        </Link>

        {/* HEADER */}
        <div className="mb-8">
          <div className="mono mb-2 text-[9px] uppercase tracking-[0.2em] text-[#8cff72]/50">
            identity.verification
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Identity verification
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#607166]">
            Verify your identity to complete your iGbese customer profile.
          </p>
        </div>

        {/* INTRO */}
        {step === "intro" && (
          <section className="rounded-2xl border border-white/8 bg-[#07100b] p-6 sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#8cff72]/20 bg-[#8cff72]/8 text-[#8cff72]">
              <ShieldCheck size={25} />
            </div>

            <h2 className="mt-6 text-xl font-bold">
              Complete your verification
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#607166]">
              We need a few details to verify your identity. This is a frontend
              demo, so the information remains inside your browser and is not
              sent to an external verification service.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <KycCheck
                icon={<UserRound size={17} />}
                title="Personal details"
                text="Confirm your identity."
              />

              <KycCheck
                icon={<CreditCard size={17} />}
                title="ID document"
                text="Provide identification details."
              />

              <KycCheck
                icon={<FileCheck2 size={17} />}
                title="Verification"
                text="Complete your account."
              />
            </div>

            <div className="mt-8 border-t border-white/5 pt-6">
              <button
                onClick={startVerification}
                className="rounded-xl bg-[#8cff72] px-6 py-3.5 text-sm font-bold text-[#061008] transition hover:bg-[#a2ff91]"
              >
                Start verification
              </button>
            </div>
          </section>
        )}

        {/* FORM */}
        {step === "form" && (
          <section className="rounded-2xl border border-white/8 bg-[#07100b] p-6 sm:p-8">
            <div className="mb-7">
              <div className="mono mb-2 text-[8px] uppercase tracking-[0.15em] text-[#607166]">
                verification.form
              </div>

              <h2 className="text-xl font-bold">Confirm your identity</h2>

              <p className="mt-2 text-sm text-[#607166]">
                Enter the requested information below.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3 text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* DOB */}
              <div>
                <label className="mono mb-2 block text-[9px] uppercase tracking-[0.15em] text-[#607166]">
                  Date of birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/8 bg-[#0b140e] px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#8cff72]/40 focus:ring-1 focus:ring-[#8cff72]/20"
                />
              </div>

              {/* ID TYPE */}
              <div>
                <label className="mono mb-2 block text-[9px] uppercase tracking-[0.15em] text-[#607166]">
                  Identification type
                </label>

                <select
                  name="idType"
                  value={form.idType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/8 bg-[#0b140e] px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#8cff72]/40 focus:ring-1 focus:ring-[#8cff72]/20"
                >
                  <option value="">Select identification type</option>

                  <option value="NIN">
                    National Identification Number (NIN)
                  </option>

                  <option value="BVN">Bank Verification Number (BVN)</option>

                  <option value="Passport">International Passport</option>

                  <option value="Drivers License">Driver's License</option>
                </select>
              </div>

              {/* ID NUMBER */}
              <div>
                <label className="mono mb-2 block text-[9px] uppercase tracking-[0.15em] text-[#607166]">
                  Identification number
                </label>

                <input
                  type="text"
                  name="idNumber"
                  value={form.idNumber}
                  onChange={handleChange}
                  placeholder="Enter identification number"
                  autoComplete="off"
                  className="w-full rounded-xl border border-white/8 bg-[#0b140e] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#526158] focus:border-[#8cff72]/40 focus:ring-1 focus:ring-[#8cff72]/20"
                />
              </div>

              {/* SECURITY NOTICE */}
              <div className="rounded-xl border border-[#8cff72]/10 bg-[#8cff72]/[0.03] p-4">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={17}
                    className="mt-0.5 shrink-0 text-[#8cff72]"
                  />

                  <p className="text-[11px] leading-5 text-[#607166]">
                    Demo mode: these details are stored locally in your browser
                    only. No information is transmitted to a backend or
                    verification provider.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#8cff72] px-4 py-3.5 text-sm font-bold text-[#061008] transition hover:bg-[#a2ff91] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Verifying..." : "Complete verification"}
              </button>
            </form>
          </section>
        )}

        {/* SUCCESS */}
        {step === "success" && (
          <section className="rounded-2xl border border-[#8cff72]/20 bg-[#07100b] p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8cff72]/10 text-[#8cff72]">
              <CheckCircle2 size={32} />
            </div>

            <div className="mono mt-6 text-[9px] uppercase tracking-[0.2em] text-[#8cff72]/60">
              verification.complete
            </div>

            <h2 className="mt-3 text-2xl font-bold">Identity verified</h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#607166]">
              Your iGbese customer profile has been successfully verified.
            </p>

            <div className="mx-auto mt-8 max-w-sm rounded-xl border border-white/5 bg-[#0b140e] p-4">
              <div className="mono text-[8px] uppercase tracking-[0.15em] text-[#607166]">
                Account status
              </div>

              <div className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-[#8cff72]">
                <span className="status-pulse h-1.5 w-1.5 rounded-full bg-[#8cff72]" />
                Verified
              </div>
            </div>

            <button
              onClick={finishVerification}
              className="mt-8 rounded-xl bg-[#8cff72] px-6 py-3.5 text-sm font-bold text-[#061008] transition hover:bg-[#a2ff91]"
            >
              Return to profile
            </button>
          </section>
        )}

        {/* ALREADY VERIFIED */}
        {step === "verified" && (
          <section className="rounded-2xl border border-[#8cff72]/20 bg-[#07100b] p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8cff72]/10 text-[#8cff72]">
              <CheckCircle2 size={32} />
            </div>

            <div className="mono mt-6 text-[9px] uppercase tracking-[0.2em] text-[#8cff72]/60">
              verification.complete
            </div>

            <h2 className="mt-3 text-2xl font-bold">Identity verified</h2>

            <p className="mt-3 text-sm text-[#607166]">
              Your identity verification is complete.
            </p>

            {customer.kycCompletedAt && (
              <p className="mt-2 text-[10px] text-[#526158]">
                Verification completed{" "}
                {new Date(customer.kycCompletedAt).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}

            <button
              onClick={() => navigate("/profile")}
              className="mt-7 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
            >
              Back to profile
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

const KycCheck = ({ icon, title, text }) => {
  return (
    <div className="rounded-xl border border-white/5 bg-[#0b140e] p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8cff72]/8 text-[#8cff72]">
        {icon}
      </div>

      <div className="mt-4 text-xs font-semibold">{title}</div>

      <div className="mt-1 text-[10px] leading-5 text-[#607166]">{text}</div>
    </div>
  );
};

export default KYC;
