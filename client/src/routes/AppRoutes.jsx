import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import CustomerLayout from '../components/layout/CustomerLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Customer-Facing Pages (14 Page Templates)
import HomePage from '../pages/Home/HomePage';
import ShopPage from '../pages/Shop/ShopPage';
import ProductDetailPage from '../pages/ProductDetail/ProductDetailPage';
import AboutPage from '../pages/About/AboutPage';
import WholesaleSignupPage from '../pages/WholesaleSignup/WholesaleSignupPage';
import BundleAndSavePage from '../pages/BundleAndSave/BundleAndSavePage';
import SizingChartPage from '../pages/SizingChart/SizingChartPage';
import GalleryProductPage from '../pages/GalleryProduct/GalleryProductPage';
import GalleryComingSoonPage from '../pages/GalleryComingSoon/GalleryComingSoonPage';
import BlogPage from '../pages/Blog/BlogPage';
import BlogDetailPage from '../pages/BlogDetail/BlogDetailPage';
import ContactPage from '../pages/Contact/ContactPage';
import MyAccountPage from '../pages/MyAccount/MyAccountPage';
import LegalPage from '../pages/Legal/LegalPage';
import CartPage from '../pages/Cart/CartPage';

// Admin Pages (6 Page Templates)
import AdminDashboardPage from '../pages/admin/Dashboard/AdminDashboardPage';
import AdminProductsPage from '../pages/admin/Products/AdminProductsPage';
import AdminOrdersPage from '../pages/admin/Orders/AdminOrdersPage';
import AdminContentPage from '../pages/admin/WebsiteContent/AdminContentPage';
import AdminBlogGalleryPage from '../pages/admin/BlogGallery/AdminBlogGalleryPage';
import AdminUsersWholesalePage from '../pages/admin/UsersWholesale/AdminUsersWholesalePage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Customer Storefront Routes (14 Page Templates) */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/wholesale-signup" element={<WholesaleSignupPage />} />
        <Route path="/bundle-and-save" element={<BundleAndSavePage />} />
        <Route path="/sizing-chart" element={<SizingChartPage />} />
        <Route path="/gallery-product" element={<GalleryProductPage />} />
        <Route path="/gallery-coming-soon" element={<GalleryComingSoonPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/my-account" element={<MyAccountPage />} />
        <Route path="/legal" element={<Navigate to="/legal/terms" replace />} />
        <Route path="/legal/:slug" element={<LegalPage />} />
      </Route>

      {/* Admin Management Routes (6 Page Templates) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="content" element={<AdminContentPage />} />
        <Route path="blog-gallery" element={<AdminBlogGalleryPage />} />
        <Route path="users" element={<AdminUsersWholesalePage />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
