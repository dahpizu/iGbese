const STORAGE_KEY = "igbese_purchases";

/*
|--------------------------------------------------------------------------
| STORAGE
|--------------------------------------------------------------------------
*/

const getStorageKey = () => {
  const savedCustomer = localStorage.getItem("igbese_customer");

  if (!savedCustomer) {
    return STORAGE_KEY;
  }

  try {
    const customer = JSON.parse(savedCustomer);

    const email = customer.email || "guest";

    return `${STORAGE_KEY}_${email.toLowerCase()}`;
  } catch {
    return STORAGE_KEY;
  }
};

/*
|--------------------------------------------------------------------------
| DATE HELPERS
|--------------------------------------------------------------------------
*/

const parsePurchaseDate = (purchaseDate) => {
  if (!purchaseDate) {
    return new Date();
  }

  const parsed = new Date(purchaseDate);

  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  return parsed;
};

export const getPaymentDate = (purchaseDate, installmentNumber) => {
  const date = parsePurchaseDate(purchaseDate);

  date.setMonth(date.getMonth() + Number(installmentNumber || 1));

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/*
|--------------------------------------------------------------------------
| INSTALLMENT HELPERS
|--------------------------------------------------------------------------
*/

export const getInstallmentAmount = (purchase, installmentNumber) => {
  const months = Math.max(Number(purchase?.months || 1), 1);

  const total = Math.max(Number(purchase?.amount || 0), 0);

  const installment = Number(installmentNumber || 1);

  const basePayment = Math.floor(total / months);

  const finalPayment = total - basePayment * (months - 1);

  return installment >= months ? finalPayment : basePayment;
};

export const getNextInstallmentNumber = (purchase) => {
  const months = Math.max(Number(purchase?.months || 1), 1);

  const paymentsMade = Math.min(
    Math.max(Number(purchase?.paymentsMade || 0), 0),
    months
  );

  return Math.min(paymentsMade + 1, months);
};

export const getNextPaymentDate = (purchase) => {
  if (!purchase) {
    return null;
  }

  const months = Math.max(Number(purchase.months || 1), 1);

  const paymentsMade = Number(purchase.paymentsMade || 0);

  const remaining = Number(purchase.remaining || 0);

  const isCompleted =
    purchase.status === "Completed" || paymentsMade >= months || remaining <= 0;

  if (isCompleted) {
    return "Completed";
  }

  const nextInstallment = getNextInstallmentNumber(purchase);

  return getPaymentDate(purchase.purchaseDate, nextInstallment);
};

/*
|--------------------------------------------------------------------------
| PURCHASE NORMALIZATION
|--------------------------------------------------------------------------
*/

const normalizePurchase = (purchase) => {
  const months = Math.max(Number(purchase.months || 1), 1);

  const amount = Math.max(Number(purchase.amount || 0), 0);

  let paymentsMade = Number(purchase.paymentsMade);

  if (Number.isNaN(paymentsMade)) {
    const progress = Number(purchase.progress || 0);

    paymentsMade =
      purchase.status === "Completed"
        ? months
        : Math.floor((progress / 100) * months);
  }

  paymentsMade = Math.min(Math.max(paymentsMade, 0), months);

  let remaining = Number(purchase.remaining);

  if (Number.isNaN(remaining)) {
    remaining = Math.max(amount - amount * (paymentsMade / months), 0);
  }

  remaining = Math.min(Math.max(remaining, 0), amount);

  const isCompleted =
    purchase.status === "Completed" || paymentsMade >= months || remaining <= 0;

  const normalized = {
    ...purchase,
    amount,
    months,
    paymentsMade,
    remaining: isCompleted ? 0 : remaining,
    progress: isCompleted
      ? 100
      : Math.min(Math.round((paymentsMade / months) * 100), 100),
    status: isCompleted ? "Completed" : "Active",
  };

  normalized.nextPayment = isCompleted
    ? 0
    : getInstallmentAmount(normalized, getNextInstallmentNumber(normalized));

  normalized.nextDate = isCompleted
    ? "Completed"
    : getNextPaymentDate(normalized);

  return normalized;
};

/*
|--------------------------------------------------------------------------
| PURCHASES
|--------------------------------------------------------------------------
*/

export const getPurchases = () => {
  const key = getStorageKey();

  const saved = localStorage.getItem(key);

  if (!saved) {
    return [];
  }

  try {
    const purchases = JSON.parse(saved);

    if (!Array.isArray(purchases)) {
      return [];
    }

    return purchases.map(normalizePurchase);
  } catch {
    return [];
  }
};

export const savePurchases = (purchases) => {
  const key = getStorageKey();

  const normalizedPurchases = Array.isArray(purchases)
    ? purchases.map(normalizePurchase)
    : [];

  localStorage.setItem(key, JSON.stringify(normalizedPurchases));

  window.dispatchEvent(new Event("igbese-purchases-updated"));
};

export const addPurchase = (purchase) => {
  const purchases = getPurchases();

  const normalizedPurchase = normalizePurchase({
    ...purchase,
    paymentsMade: Number(purchase.paymentsMade || 0),
  });

  const updated = [
    normalizedPurchase,
    ...purchases.filter((item) => item.id !== normalizedPurchase.id),
  ];

  savePurchases(updated);

  return updated;
};

export const getPurchaseById = (id) => {
  const purchases = getPurchases();

  return purchases.find((purchase) => purchase.id === id);
};

export const getActivePurchases = () => {
  return getPurchases().filter((purchase) => purchase.status === "Active");
};

export const getCompletedPurchases = () => {
  return getPurchases().filter((purchase) => purchase.status === "Completed");
};

/*
|--------------------------------------------------------------------------
| FINANCIAL TOTALS
|--------------------------------------------------------------------------
*/

export const getTotalOutstanding = () => {
  return getActivePurchases().reduce(
    (total, purchase) => total + Number(purchase.remaining || 0),
    0
  );
};

export const getTotalFinanced = () => {
  return getPurchases().reduce(
    (total, purchase) => total + Number(purchase.amount || 0),
    0
  );
};

/*
|--------------------------------------------------------------------------
| SPENDING LIMIT
|--------------------------------------------------------------------------
*/

export const getSpendingLimit = () => {
  const savedCustomer = localStorage.getItem("igbese_customer");

  if (!savedCustomer) {
    return 300000;
  }

  try {
    const customer = JSON.parse(savedCustomer);

    return Number(customer.spendingLimit || 300000);
  } catch {
    return 300000;
  }
};

export const getAvailableLimit = () => {
  const spendingLimit = getSpendingLimit();

  const outstanding = getTotalOutstanding();

  return Math.max(spendingLimit - outstanding, 0);
};

export const getUtilizationPercentage = () => {
  const spendingLimit = getSpendingLimit();

  if (!spendingLimit) {
    return 0;
  }

  const outstanding = getTotalOutstanding();

  return Math.min(Math.round((outstanding / spendingLimit) * 100), 100);
};
