import { useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../components/Logo";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const savedSession = localStorage.getItem("igbese_session");

    if (!savedSession) {
      return;
    }

    try {
      const session = JSON.parse(savedSession);

      if (session?.authenticated) {
        navigate("/home", { replace: true });
      }
    } catch {
      localStorage.removeItem("igbese_session");
    }
  }, [navigate]);

  const handleLogin = (event) => {
    event.preventDefault();

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const savedCustomer = localStorage.getItem("igbese_customer");

    if (!savedCustomer) {
      setError("No customer account found. Create an account first.");
      return;
    }

    let customer;

    try {
      customer = JSON.parse(savedCustomer);
    } catch {
      setError(
        "Account data could not be loaded. Please create your account again."
      );
      return;
    }

    const customerEmail = customer.email?.trim().toLowerCase() || "";

    const emailMatch = customerEmail === normalizedEmail;

    const passwordMatch = customer.password === password;

    if (!emailMatch || !passwordMatch) {
      setError("Invalid email or password.");
      return;
    }

    localStorage.setItem(
      "igbese_session",
      JSON.stringify({
        authenticated: true,
        email: customer.email,
        loginAt: new Date().toISOString(),
      })
    );

    navigate("/home", { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050907] text-white cyber-grid">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(140,255,114,0.08),transparent_35%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-8">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <Logo />

          <div className="mono flex items-center gap-2 text-[8px] uppercase tracking-[0.18em] text-[#607166]">
            <span className="status-pulse h-1.5 w-1.5 rounded-full bg-[#8cff72]" />
            Secure access
          </div>
        </header>

        {/* LOGIN AREA */}
        <main className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-md">
            <div className="mono mb-4 text-center text-[9px] uppercase tracking-[0.25em] text-[#8cff72]/50">
              customer.authentication
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#07100b]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              {/* TITLE */}
              <div className="mb-8">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[#8cff72]/20 bg-[#8cff72]/8 text-[#8cff72]">
                  <LockKeyhole size={20} />
                </div>

                <h1 className="text-2xl font-bold tracking-tight">
                  Welcome back.
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#8EA394]">
                  Sign in to manage your purchases, payments and spending limit.
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3 text-xs leading-5 text-red-300"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label className="mono mb-2 block text-[9px] uppercase tracking-[0.15em] text-[#607166]">
                    Email address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-white/8 bg-[#0b140e] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#526158] focus:border-[#8cff72]/40 focus:ring-1 focus:ring-[#8cff72]/20"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="mono text-[9px] uppercase tracking-[0.15em] text-[#607166]">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setError(
                          "Password recovery is not available in this demo yet."
                        )
                      }
                      className="text-[10px] text-[#8cff72]/70 transition hover:text-[#8cff72]"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-white/8 bg-[#0b140e] px-4 py-3.5 pr-12 text-sm text-white outline-none transition placeholder:text-[#526158] focus:border-[#8cff72]/40 focus:ring-1 focus:ring-[#8cff72]/20"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#607166] transition hover:text-[#8cff72]"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-xl bg-[#8cff72] px-4 py-3.5 text-sm font-bold text-[#061008] transition hover:bg-[#a2ff91] active:scale-[0.99]"
                >
                  Enter iGbese
                </button>
              </form>

              {/* SIGNUP */}
              <div className="mt-7 border-t border-white/5 pt-6 text-center">
                <p className="text-xs text-[#607166]">Don't have an account?</p>

                <Link
                  to="/signup"
                  className="mt-2 inline-block text-sm font-semibold text-[#8cff72] transition hover:text-white"
                >
                  Create an account
                </Link>
              </div>

              {/* SECURITY */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[#526158]">
                <ShieldCheck size={14} />

                <span className="mono text-[8px] uppercase tracking-[0.12em]">
                  Secure customer session
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
