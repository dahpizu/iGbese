import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { addWelcomeNotification } from "../data/notifications";

const Signup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [completed, setCompleted] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const finishSignup = () => {
    const customer = {
      ...form,
      kycStatus: "Pending",
      accountStatus: "Active",
      spendingLimit: 300000,
    };

    localStorage.removeItem("igbese_purchases");
    localStorage.removeItem("igbese_notifications");

    localStorage.setItem("igbese_customer", JSON.stringify(customer));

    addWelcomeNotification(customer);

    setCompleted(true);

    setTimeout(() => {
      navigate("/home");
    }, 1500);
  };

  return (
    <div className="cyber-grid min-h-screen bg-[#050907] px-5 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-[#607166] transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>

          <div className="mono text-[8px] uppercase tracking-[0.18em] text-[#8cff72]">
            iGbese / onboarding
          </div>
        </div>

        {/* BRAND */}
        <div className="mt-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#8cff72]/20 bg-[#8cff72]/[0.06] text-xl text-[#8cff72]">
            ₦
          </div>

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight">
            Create your iGbese account
          </h1>

          <p className="mt-2 text-sm text-[#607166]">
            Set up your account and unlock smarter payment options.
          </p>
        </div>

        {/* PROGRESS */}
        <div className="mt-8 flex items-center">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-1 items-center">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                  step >= item
                    ? "border-[#8cff72] bg-[#8cff72] text-[#061008]"
                    : "border-white/10 bg-white/[0.03] text-[#607166]"
                }`}
              >
                {step > item ? <Check size={14} /> : item}
              </div>

              {item !== 3 && (
                <div
                  className={`mx-2 h-px flex-1 ${
                    step > item ? "bg-[#8cff72]" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* CARD */}
        <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.025] p-6">
          {completed ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#8cff72] text-[#061008]">
                <Check size={30} />
              </div>

              <div className="mono mt-6 text-[8px] uppercase tracking-[0.18em] text-[#8cff72]">
                Account initialized
              </div>

              <h2 className="mt-3 text-xl font-extrabold">Welcome to iGbese</h2>

              <p className="mt-2 text-sm text-[#607166]">
                Preparing your customer dashboard...
              </p>
            </div>
          ) : (
            <>
              {/* STEP 1 */}
              {step === 1 && (
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8cff72]/10 text-[#8cff72]">
                    <UserRound size={18} />
                  </div>

                  <div className="mt-5">
                    <h2 className="text-lg font-bold">Personal information</h2>

                    <p className="mt-1 text-xs text-[#607166]">
                      Tell us a little about yourself.
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Input
                      label="First name"
                      value={form.firstName}
                      onChange={(value) => updateField("firstName", value)}
                      placeholder="Oladapo"
                    />

                    <Input
                      label="Last name"
                      value={form.lastName}
                      onChange={(value) => updateField("lastName", value)}
                      placeholder="Your surname"
                    />

                    <Input
                      label="Email address"
                      type="email"
                      value={form.email}
                      onChange={(value) => updateField("email", value)}
                      placeholder="you@example.com"
                    />

                    <Input
                      label="Phone number"
                      type="tel"
                      value={form.phone}
                      onChange={(value) => updateField("phone", value)}
                      placeholder="+234..."
                    />
                  </div>

                  <button
                    onClick={nextStep}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#8cff72] px-4 py-3.5 text-xs font-bold text-[#061008] transition hover:bg-[#a2ff91]"
                  >
                    Continue
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8cff72]/10 text-[#8cff72]">
                    <ShieldCheck size={18} />
                  </div>

                  <div className="mt-5">
                    <h2 className="text-lg font-bold">Secure your account</h2>

                    <p className="mt-1 text-xs text-[#607166]">
                      Create a password for your iGbese account.
                    </p>
                  </div>

                  <div className="mt-6">
                    <label className="mono text-[8px] uppercase tracking-[0.12em] text-[#607166]">
                      Password
                    </label>

                    <div className="relative mt-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(event) =>
                          updateField("password", event.target.value)
                        }
                        placeholder="Create a secure password"
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-[#3f5045] focus:border-[#8cff72]/30"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#607166] hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <div className="text-xs font-semibold">
                      Password requirements
                    </div>

                    <div className="mt-3 space-y-2 text-[10px] text-[#607166]">
                      <Requirement
                        active={form.password.length >= 8}
                        text="At least 8 characters"
                      />

                      <Requirement
                        active={/[A-Z]/.test(form.password)}
                        text="One uppercase letter"
                      />

                      <Requirement
                        active={/[0-9]/.test(form.password)}
                        text="One number"
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-[#607166] transition hover:bg-white/5 hover:text-white"
                    >
                      Back
                    </button>

                    <button
                      onClick={nextStep}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#8cff72] px-4 py-3 text-xs font-bold text-[#061008] transition hover:bg-[#a2ff91]"
                    >
                      Continue
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8cff72]/10 text-[#8cff72]">
                    <ShieldCheck size={18} />
                  </div>

                  <div className="mt-5">
                    <h2 className="text-lg font-bold">Ready to get started</h2>

                    <p className="mt-1 text-xs leading-5 text-[#607166]">
                      Your account will be created with a ₦300,000 initial
                      spending limit.
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Summary
                      label="Name"
                      value={`${form.firstName || "Customer"} ${form.lastName}`}
                    />

                    <Summary
                      label="Email"
                      value={form.email || "Not provided"}
                    />

                    <Summary
                      label="Phone"
                      value={form.phone || "Not provided"}
                    />

                    <Summary label="Initial spending limit" value="₦300,000" />
                  </div>

                  <div className="mt-5 rounded-xl border border-[#8cff72]/10 bg-[#8cff72]/[0.04] p-4">
                    <div className="flex gap-3">
                      <ShieldCheck
                        size={17}
                        className="mt-0.5 shrink-0 text-[#8cff72]"
                      />

                      <div>
                        <div className="text-xs font-bold">
                          Identity verification comes next
                        </div>

                        <div className="mt-1 text-[10px] leading-5 text-[#607166]">
                          Your account will be created first. You can then
                          complete KYC to activate your full spending
                          capabilities.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-[#607166] transition hover:bg-white/5 hover:text-white"
                    >
                      Back
                    </button>

                    <button
                      onClick={finishSignup}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#8cff72] px-4 py-3 text-xs font-bold text-[#061008] transition hover:bg-[#a2ff91]"
                    >
                      Create account
                      <Check size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="mono mt-6 text-center text-[8px] uppercase tracking-[0.15em] text-[#3f5045]">
          Secure onboarding • iGbese finance.system
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder }) => {
  return (
    <div>
      <label className="mono text-[8px] uppercase tracking-[0.12em] text-[#607166]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#3f5045] focus:border-[#8cff72]/30"
      />
    </div>
  );
};

const Requirement = ({ active, text }) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full ${
          active ? "bg-[#8cff72] text-[#061008]" : "border border-white/10"
        }`}
      >
        {active && <Check size={9} />}
      </div>

      {text}
    </div>
  );
};

const Summary = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
      <span className="mono text-[8px] uppercase tracking-[0.1em] text-[#607166]">
        {label}
      </span>

      <span className="max-w-[60%] truncate text-xs font-semibold">
        {value}
      </span>
    </div>
  );
};

export default Signup;
