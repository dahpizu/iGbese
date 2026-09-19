import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  Star,
} from "lucide-react";

import { getAvailableLimit } from "../data/store";

const products = [
  {
    id: "samsung-galaxy-a55",
    name: "Samsung Galaxy A55",
    category: "Phones",
    price: 145000,
    rating: 4.7,
    reviews: 342,
    image: "📱",
    description:
      "The Samsung Galaxy A55 delivers a smooth everyday smartphone experience with a premium design, vibrant display, capable cameras, and dependable battery life.",
    features: [
      "6.6-inch Super AMOLED display",
      "50MP main camera",
      "8GB RAM",
      "128GB internal storage",
      "5,000mAh battery",
      "5G connectivity",
    ],
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    category: "Phones",
    price: 980000,
    rating: 4.9,
    reviews: 518,
    image: "📱",
    description:
      "The iPhone 15 combines a powerful processor, advanced camera system, bright display, and premium Apple design.",
    features: [
      "6.1-inch Super Retina XDR display",
      "48MP main camera",
      "A16 Bionic chip",
      "128GB internal storage",
      "USB-C",
      "5G connectivity",
    ],
  },
  {
    id: "samsung-galaxy-buds3",
    name: "Samsung Galaxy Buds3",
    category: "Audio",
    price: 185000,
    rating: 4.6,
    reviews: 189,
    image: "🎧",
    description:
      "Enjoy wireless audio with the Samsung Galaxy Buds3, designed for everyday listening, calls, and entertainment.",
    features: [
      "Wireless Bluetooth connectivity",
      "Active noise cancellation",
      "High-quality audio",
      "Compact charging case",
      "Touch controls",
      "Long battery life",
    ],
  },
  {
    id: "samsung-galaxy-watch6",
    name: "Samsung Galaxy Watch6",
    category: "Wearables",
    price: 275000,
    rating: 4.7,
    reviews: 156,
    image: "⌚",
    description:
      "The Galaxy Watch6 gives you convenient access to notifications, fitness tracking, health features, and everyday smartwatch functions.",
    features: [
      "Super AMOLED display",
      "Fitness tracking",
      "Heart-rate monitoring",
      "Sleep tracking",
      "Bluetooth connectivity",
      "Water resistant design",
    ],
  },
  {
    id: "playstation-5",
    name: "PlayStation 5",
    category: "Gaming",
    price: 850000,
    rating: 4.8,
    reviews: 271,
    image: "🎮",
    description:
      "Experience next-generation gaming with the PlayStation 5, featuring fast loading, immersive graphics, and a large library of games.",
    features: [
      "Ultra HD Blu-ray",
      "High-speed SSD",
      "4K gaming support",
      "Ray tracing",
      "DualSense controller",
      "3D audio support",
    ],
  },
  {
    id: "macbook-air",
    name: "MacBook Air",
    category: "Computers",
    price: 1450000,
    rating: 4.9,
    reviews: 204,
    image: "💻",
    description:
      "MacBook Air combines a thin, lightweight design with strong performance for work, school, creativity, and everyday computing.",
    features: [
      "Apple silicon processor",
      "13-inch display",
      "8GB unified memory",
      "256GB SSD",
      "All-day battery",
      "Lightweight design",
    ],
  },
];

const plans = [3, 6, 9];

const formatCurrency = (amount) => {
  return `₦${Number(amount || 0).toLocaleString("en-NG")}`;
};

const getMonthlyAmount = (price, months) => {
  return Math.ceil(Number(price || 0) / Number(months || 1));
};

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = products.find((item) => item.id === productId);

  const availableLimit = getAvailableLimit();

  const planDetails = useMemo(() => {
    if (!product) {
      return [];
    }

    return plans.map((months) => ({
      months,
      monthly: getMonthlyAmount(product.price, months),
    }));
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#020617] text-white px-5 py-8">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/merchant/shop"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Jumia Shop
          </Link>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-3xl">
              🛍️
            </div>

            <h1 className="text-2xl font-bold">Product not found</h1>

            <p className="mt-2 text-sm text-slate-400">
              The product you are looking for is not available.
            </p>

            <Link
              to="/merchant/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950"
            >
              Return to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canAfford = availableLimit >= product.price;

  const handleBuy = () => {
    if (!canAfford) {
      return;
    }

    navigate(`/merchant/checkout?product=${product.id}`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <Link
            to="/merchant/profile"
            className="text-slate-500 transition hover:text-white"
          >
            Jumia
          </Link>

          <ChevronRight size={15} className="text-slate-700" />

          <Link
            to="/merchant/shop"
            className="text-slate-500 transition hover:text-white"
          >
            Shop
          </Link>

          <ChevronRight size={15} className="text-slate-700" />

          <span className="truncate text-slate-300">{product.name}</span>
        </div>

        {/* Product */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Product image */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01]">
              <span className="text-[150px] drop-shadow-2xl">
                {product.image}
              </span>
            </div>
          </div>

          {/* Product information */}
          <div className="flex flex-col">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                {product.category}
              </span>

              <span className="flex items-center gap-1 text-sm text-yellow-300">
                <Star size={15} fill="currentColor" />
                {product.rating}
              </span>

              <span className="text-sm text-slate-500">
                ({product.reviews} reviews)
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-2xl font-black text-emerald-300">
              {formatCurrency(product.price)}
            </p>

            <p className="mt-5 leading-7 text-slate-400">
              {product.description}
            </p>

            {/* Merchant */}
            <Link
              to="/merchant/profile"
              className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-emerald-400/30"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl">
                🛒
              </div>

              <div className="flex-1">
                <p className="text-xs text-slate-500">Sold by</p>

                <div className="flex items-center gap-2">
                  <p className="font-bold">Jumia</p>

                  <span className="inline-flex items-center gap-1 text-xs text-emerald-300">
                    <ShieldCheck size={13} />
                    Verified
                  </span>
                </div>
              </div>

              <ChevronRight size={18} className="text-slate-500" />
            </Link>

            {/* Available limit */}
            <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  Available iGbese limit
                </span>

                <span className="font-bold text-emerald-300">
                  {formatCurrency(availableLimit)}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{
                    width: `${Math.min((availableLimit / 300000) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Buy button */}
            <button
              type="button"
              onClick={handleBuy}
              disabled={!canAfford}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black transition ${
                canAfford
                  ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                  : "cursor-not-allowed bg-white/10 text-slate-500"
              }`}
            >
              <ShoppingBag size={19} />

              {canAfford ? "Buy with iGbese" : "Insufficient Spending Limit"}
            </button>

            {!canAfford && (
              <p className="mt-3 text-center text-xs text-rose-300">
                Your available iGbese limit is below this product price.
              </p>
            )}
          </div>
        </div>

        {/* BNPL plans */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <CreditCard size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold">Pay with iGbese</h2>

              <p className="text-sm text-slate-500">
                Split your purchase into manageable monthly payments.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {planDetails.map((plan) => (
              <div
                key={plan.months}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">
                    {plan.months} Months
                  </span>

                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    BNPL
                  </span>
                </div>

                <p className="mt-5 text-2xl font-black">
                  {formatCurrency(plan.monthly)}
                </p>

                <p className="mt-1 text-xs text-slate-500">per month</p>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Check size={14} className="text-emerald-400" />
                    No upfront full payment
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Check size={14} className="text-emerald-400" />
                    Simple monthly payments
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-bold">Product Details</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {product.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 px-4 py-3"
                >
                  <Check size={16} className="shrink-0 text-emerald-400" />

                  <span className="text-sm text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6">
            <ShieldCheck size={25} className="text-emerald-300" />

            <h3 className="mt-4 font-bold">Protected by iGbese</h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Your purchase is recorded in your iGbese account, and your payment
              schedule is tracked automatically.
            </p>
          </div>
        </section>

        {/* Bottom navigation */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/merchant/shop"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
          >
            <ArrowLeft size={17} />
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
