import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import ResetPassword from './pages/Authentication/ResetPassword';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard/Dashboard';
import DashboardSummary from './pages/Dashboard/DashboardSummary';

// Core modules (existing)
import Products from './pages/Dashboard/Products';
import Customers from './pages/Dashboard/Customers';
import Orders from './pages/Dashboard/Orders';
import Analytics from './pages/Dashboard/Analytics';
import Employees from './pages/Dashboard/Employees';

// Pharmacy / Non-Pharmacy Products
import PharmacyProducts from './pages/Dashboard/Products/PharmacyProducts';
import NonPharmacyProducts from './pages/Dashboard/Products/NonPharmacyProducts';

// Orders sub-pages
import PharmacyOrders from './pages/Dashboard/Orders/PharmacyOrders';
import NonPharmacyOrders from './pages/Dashboard/Orders/NonPharmacyOrders';

// Purchase
import PurchasePharmacyProducts from './pages/Dashboard/Purchase/PurchasePharmacyProducts';
import PurchaseNonPharmacyProducts from './pages/Dashboard/Purchase/PurchaseNonPharmacyProducts';

// Returns
import CustomersReturns from './pages/Dashboard/Returns/CustomersReturns';
import ExpiresOrDamagesReturns from './pages/Dashboard/Returns/ExpiresOrDamagesReturns';

// Requested Items
import PharmacyItems from './pages/Dashboard/RequestedItems/PharmacyItems';
import NonPharmacyItems from './pages/Dashboard/RequestedItems/NonPharmacyItems';

// Suppliers
import SuppliersList from './pages/Dashboard/Suppliers/SuppliersList';
import SuppliersDocuments from './pages/Dashboard/Suppliers/SuppliersDocuments';
import SuppliersPayments from './pages/Dashboard/Suppliers/SuppliersPayments';

// Setup
import Categories from './pages/Dashboard/Setup/Categories';
import Companies from './pages/Dashboard/Setup/Companies';
import UnitTypes from './pages/Dashboard/Setup/UnitTypes';

// User pages
import Profile from './pages/User/Profile';
import Settings from './pages/User/Settings';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />

          {/* Protected dashboard routes */}
          <Route path="dashboard" element={<ProtectedRoute />}>
            <Route element={<Dashboard />}>
              <Route index element={<DashboardSummary />} />

              {/* Core modules */}
              <Route path="products" element={<Products />} />
              <Route path="customers" element={<Customers />} />
              <Route path="orders" element={<Orders />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="employees" element={<Employees />} />

              {/* Pharmacy / Non-Pharmacy Products */}
              <Route path="products/main" element={<PharmacyProducts />} />
              <Route path="products/supplies" element={<NonPharmacyProducts />} />

              {/* Orders sub-pages */}
              <Route path="orders/main" element={<PharmacyOrders />} />
              <Route path="orders/supplies" element={<NonPharmacyOrders />} />

              {/* Purchase */}
              <Route path="purchase/main" element={<PurchasePharmacyProducts />} />
              <Route path="purchase/supplies" element={<PurchaseNonPharmacyProducts />} />

              {/* Returns */}
              <Route path="returns/customers" element={<CustomersReturns />} />
              <Route path="returns/expires-damages" element={<ExpiresOrDamagesReturns />} />

              {/* Requested Items */}
              <Route path="requested-items/main" element={<PharmacyItems />} />
              <Route path="requested-items/supplies" element={<NonPharmacyItems />} />

              {/* Suppliers */}
              <Route path="suppliers/lists" element={<SuppliersList />} />
              <Route path="suppliers/documents" element={<SuppliersDocuments />} />
              <Route path="suppliers/payments" element={<SuppliersPayments />} />

              {/* Setup */}
              <Route path="setup/categories" element={<Categories />} />
              <Route path="setup/companies" element={<Companies />} />
              <Route path="setup/unit-types" element={<UnitTypes />} />

              {/* Fallback inside dashboard */}
              <Route path="*" element={<Navigate to="" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
