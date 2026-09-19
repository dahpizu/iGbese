import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Star,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const merchant = {
  name: "Jumia",
  category: "Online Marketplace",
  location: "Nigeria",
  website: "https://www.jumia.com.ng/",
  description:
    "Jumia is an online marketplace offering electronics, fashion, beauty, home products, phones, appliances and everyday essentials.",
  rating: 4.7,
  reviewCount: 2481,
  customerCount: 12500,
  logo: "🛒",
};

const demoReviews = [
  {
    id: 1,
    name: "Verified Customer",
    rating: 5,
    text: "Smooth checkout experience and my order arrived as expected.",
    date: "Recent",
  },
  {
    id: 2,
    name: "Verified Customer",
    rating: 5,
    text: "The product selection was good and the buying process was simple.",
    date: "Recent",
  },
  {
    id: 3,
    name: "Verified Customer",
    rating: 4,
    text: "Good shopping experience. I would use the merchant again.",
    date: "Recent",
  },
];

const MerchantProfile = () => {
  const navigate = useNavigate();

  const formatNumber = (number) => {
    return Number(number || 0).toLocaleString("en-NG");
  };

  const handleVisitWebsite = () => {
    window.open(merchant.website, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#f5f8f5] text-[#101711]">
      {/* HEADER */}
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-semibold text-black/45 transition hover:text-black"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <div className="mono text-[9px] uppercase tracking-[0.18em] text-black/30">
            Merchant profile
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        {/* HERO */}
        <section className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-[#07100b] via-[#102b17] to-[#19B85A]" />

          <div className="px-6 pb-7 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {/* LOGO */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#e9f8e7] text-4xl shadow-lg">
                  {merchant.logo}
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tight">
                      {merchant.name}
                    </h1>

                    <span className="flex items-center gap-1 rounded-full bg-[#19B85A]/10 px-2.5 py-1 text-[9px] font-bold text-[#19B85A]">
                      <CheckCircle2 size={11} />
                      Verified merchant
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-black/40">
                    <span>{merchant.category}</span>

                    <span>•</span>

                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {merchant.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* WEBSITE */}
              <button
                onClick={handleVisitWebsite}
                className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-xs font-bold transition hover:bg-black/[0.03]"
              >
                Visit official website
                <ExternalLink size={14} />
              </button>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-7 max-w-3xl">
              <div className="mono text-[8px] uppercase tracking-[0.18em] text-black/30">
                About the merchant
              </div>

              <p className="mt-3 text-sm leading-7 text-black/55">
                {merchant.description}
              </p>
            </div>

            {/* STATS */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-[#f6f8f6] p-4">
                <div className="flex items-center gap-2 text-[#19B85A]">
                  <Star size={15} fill="currentColor" />

                  <span className="text-sm font-extrabold">
                    {merchant.rating}
                  </span>
                </div>

                <div className="mt-2 text-[10px] text-black/35">
                  Merchant rating
                </div>
              </div>

              <div className="rounded-xl bg-[#f6f8f6] p-4">
                <div className="text-sm font-extrabold">
                  {formatNumber(merchant.reviewCount)}
                </div>

                <div className="mt-2 text-[10px] text-black/35">Reviews</div>
              </div>

              <div className="rounded-xl bg-[#f6f8f6] p-4">
                <div className="flex items-center gap-2 text-[#19B85A]">
                  <Users size={15} />

                  <span className="text-sm font-extrabold">
                    {formatNumber(merchant.customerCount)}
                  </span>
                </div>

                <div className="mt-2 text-[10px] text-black/35">Customers</div>
              </div>

              <div className="rounded-xl bg-[#f6f8f6] p-4">
                <div className="flex items-center gap-2 text-[#19B85A]">
                  <ShieldCheck size={15} />

                  <span className="text-sm font-extrabold">Protected</span>
                </div>

                <div className="mt-2 text-[10px] text-black/35">
                  iGbese merchant
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* REVIEWS */}
          <section className="rounded-2xl border border-black/5 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
              <div>
                <div className="text-sm font-extrabold">Customer reviews</div>

                <div className="mt-1 text-xs text-black/35">
                  Reviews displayed here are currently demo content.
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Star
                  size={15}
                  fill="currentColor"
                  className="text-[#19B85A]"
                />

                <span className="text-sm font-extrabold">
                  {merchant.rating}
                </span>
              </div>
            </div>

            <div>
              {demoReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-black/5 px-6 py-5 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold">{review.name}</div>

                      <div className="mt-2 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            size={12}
                            fill={
                              index < review.rating ? "currentColor" : "none"
                            }
                            className={
                              index < review.rating
                                ? "text-[#19B85A]"
                                : "text-black/15"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <span className="text-[9px] text-black/25">
                      {review.date}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-6 text-black/50">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SIDE */}
          <aside className="space-y-6">
            {/* SHOP */}
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f8e7] text-[#19B85A]">
                <ShoppingBag size={19} />
              </div>

              <h2 className="mt-5 text-base font-extrabold">
                Shop with iGbese
              </h2>

              <p className="mt-2 text-xs leading-5 text-black/40">
                Purchase eligible products from {merchant.name} and spread your
                payments using your iGbese spending limit.
              </p>

              <Link
                to="/merchant/shop"
                className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#19B85A] px-4 py-3.5 text-xs font-bold text-white transition hover:bg-[#11994a]"
              >
                Start shopping
              </Link>
            </div>

            {/* VERIFIED */}
            <div className="rounded-2xl border border-[#19B85A]/10 bg-[#19B85A]/[0.04] p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#19B85A] text-white">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <div className="text-xs font-extrabold">
                    Verified by iGbese
                  </div>

                  <p className="mt-2 text-[11px] leading-5 text-black/45">
                    This merchant has been registered on the iGbese platform.
                    Merchant verification information can be expanded as the
                    platform grows.
                  </p>
                </div>
              </div>
            </div>

            {/* WEBSITE */}
            <button
              onClick={handleVisitWebsite}
              className="flex w-full items-center justify-between rounded-2xl border border-black/5 bg-white p-5 text-left shadow-sm transition hover:bg-black/[0.02]"
            >
              <div>
                <div className="text-xs font-extrabold">Official website</div>

                <div className="mt-1 text-[10px] text-black/35">
                  Open {merchant.name}'s website
                </div>
              </div>

              <ExternalLink size={16} className="text-black/30" />
            </button>
          </aside>
        </div>

        {/* FOOTER */}
        <div className="mono mt-8 text-center text-[8px] uppercase tracking-[0.16em] text-black/25">
          Merchant information • iGbese
        </div>
      </main>
    </div>
  );
};

export default MerchantProfile;
