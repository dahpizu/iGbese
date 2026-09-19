import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Search,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const products = [
  {
    id: "a55",
    name: "Samsung Galaxy A55",
    category: "Phones",
    price: 145000,
    image: "📱",
    rating: 4.8,
    reviews: 342,
  },
  {
    id: "iphone15",
    name: "iPhone 15",
    category: "Phones",
    price: 980000,
    image: "📱",
    rating: 4.9,
    reviews: 517,
  },
  {
    id: "buds3",
    name: "Samsung Galaxy Buds3",
    category: "Audio",
    price: 185000,
    image: "🎧",
    rating: 4.7,
    reviews: 128,
  },
  {
    id: "watch6",
    name: "Samsung Galaxy Watch6",
    category: "Wearables",
    price: 275000,
    image: "⌚",
    rating: 4.6,
    reviews: 96,
  },
  {
    id: "ps5",
    name: "PlayStation 5",
    category: "Gaming",
    price: 850000,
    image: "🎮",
    rating: 4.9,
    reviews: 284,
  },
  {
    id: "macbook",
    name: "MacBook Air",
    category: "Computers",
    price: 1450000,
    image: "💻",
    rating: 4.8,
    reviews: 201,
  },
];

const categories = [
  "All",
  "Phones",
  "Audio",
  "Wearables",
  "Gaming",
  "Computers",
];

const MerchantShop = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const formatNaira = (amount) => {
    return `₦${Number(amount || 0).toLocaleString("en-NG")}`;
  };

  const getMonthly = (price) => {
    return Math.floor(price / 3);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f5f8f5] text-[#101711]">
      {/* HEADER */}
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <div className="flex items-center justify-between">
            <Link
              to="/merchant/profile"
              className="flex items-center gap-2 text-xs font-semibold text-black/45 transition hover:text-black"
            >
              <ArrowLeft size={15} />
              Jumia profile
            </Link>

            <div className="mono text-[9px] uppercase tracking-[0.18em] text-black/30">
              Merchant shop
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#e9f8e7] text-2xl">
                  🛒
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-extrabold">Jumia</h1>

                    <CheckCircle2 size={17} className="text-[#19B85A]" />
                  </div>

                  <div className="mt-1 text-xs text-black/35">
                    Online Marketplace • Nigeria
                  </div>
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-sm leading-6 text-black/45">
                Shop selected products from Jumia and pay over time with iGbese
                Buy Now, Pay Later.
              </p>
            </div>

            <div className="rounded-2xl border border-[#19B85A]/10 bg-[#19B85A]/[0.04] px-5 py-4">
              <div className="flex items-center gap-2 text-[#19B85A]">
                <ShoppingBag size={16} />

                <span className="text-xs font-bold">iGbese BNPL available</span>
              </div>

              <div className="mt-2 text-[10px] text-black/35">
                Split eligible purchases into monthly payments.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="mx-auto max-w-6xl px-5 py-8">
        {/* SEARCH */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/25"
            />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-black/5 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#19B85A]/40"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => {
              const selected = category === selectedCategory;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-xl px-4 py-3 text-xs font-bold transition ${
                    selected
                      ? "bg-[#19B85A] text-white"
                      : "border border-black/5 bg-white text-black/45 hover:bg-black/[0.02]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* RESULTS */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            <div className="text-sm font-extrabold">Products</div>

            <div className="mt-1 text-xs text-black/35">
              {filteredProducts.length} product
              {filteredProducts.length === 1 ? "" : "s"} available
            </div>
          </div>

          <div className="mono hidden text-[8px] uppercase tracking-[0.15em] text-black/25 sm:block">
            BNPL eligible products
          </div>
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-black/5 bg-white px-6 py-16 text-center">
            <Search size={25} className="mx-auto text-black/20" />

            <div className="mt-4 text-sm font-bold">No products found</div>

            <p className="mt-2 text-xs text-black/35">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* IMAGE */}
                <div className="flex h-52 items-center justify-center bg-[#f1f5f1] text-7xl">
                  {product.image}
                </div>

                {/* INFO */}
                <div className="p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-black/30">
                    {product.category}
                  </div>

                  <h2 className="mt-2 text-sm font-extrabold">
                    {product.name}
                  </h2>

                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star
                        size={13}
                        fill="currentColor"
                        className="text-[#19B85A]"
                      />

                      <span className="text-xs font-bold">
                        {product.rating}
                      </span>
                    </div>

                    <span className="text-[10px] text-black/30">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="text-lg font-extrabold">
                      {formatNaira(product.price)}
                    </div>

                    <div className="mt-1 text-[10px] text-black/35">
                      From{" "}
                      <span className="font-bold text-[#19B85A]">
                        {formatNaira(getMonthly(product.price))}
                      </span>{" "}
                      / month with iGbese
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate("/merchant/product/samsung-galaxy-a55")
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#19B85A] px-4 py-3.5 text-xs font-bold text-white transition hover:bg-[#11994a]"
                  >
                    {product.id === "a55" ? "Buy with iGbese" : "View product"}

                    <ChevronRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* INFO */}
        <div className="mt-10 rounded-2xl border border-[#19B85A]/10 bg-[#19B85A]/[0.035] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#19B85A] text-white">
              <ShoppingBag size={18} />
            </div>

            <div className="flex-1">
              <div className="text-sm font-extrabold">How iGbese works</div>

              <div className="mt-1 text-xs leading-5 text-black/40">
                Choose an eligible product, select a payment plan at checkout
                and spread the cost across scheduled monthly payments.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MerchantShop;
