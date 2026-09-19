import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./components/AppLayout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Purchases from "./pages/Purchases";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import KYC from "./pages/KYC";
import Notifications from "./pages/Notifications";
import PurchaseDetails from "./pages/PurchaseDetails";
import MerchantCheckout from "./pages/MerchantCheckout";
import MerchantDashboard from "./pages/MerchantDashboard";
import MerchantProfile from "./pages/MerchantProfile";
import MerchantShop from "./pages/MerchantShop";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* CUSTOMER AUTH */}
        <Route path="/" element={<Login />} />

        {/* CUSTOMER APP */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/merchant/product/:productId"
            element={<ProductDetails />}
          />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/merchant/shop" element={<MerchantShop />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/merchant/profile" element={<MerchantProfile />} />
          <Route path="/purchase/:id" element={<PurchaseDetails />} />
        </Route>

        {/* MERCHANT */}
        <Route path="/merchant/dashboard" element={<MerchantDashboard />} />

        <Route path="/merchant/checkout" element={<MerchantCheckout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
