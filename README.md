# X-ON — Luxury Handmade Press-On Nails & Nail Essentials

> **Brand Line:** *Press On. Slay On. Repeat.*  
> **Studio Address:** 3168 Bill Beck Blvd, Kissimmee, FL 34744  
> **Hotline:** 689-212-8888  
> **Reference Architecture:** [https://lalafolie.us/](https://lalafolie.us/)

---

## 💎 Project Overview

**X-ON** is where modern nail artistry meets effortless beauty. Built with **React.js** on the frontend and **Node.js + Express** on the backend, this platform provides a 100% specification-compliant e-commerce showcase, content management system, and operational portal.

### Total Scope: 20 Page Templates
- **Customer-Facing (14 Page Templates):**
  1. `Home` (`/`)
  2. `Shop / Collection` (`/shop`)
  3. `Product Detail` (`/product/:slug`)
  4. `About` (`/about`)
  5. `Wholesale Signup` (`/wholesale-signup`)
  6. `Bundle & Save` (`/bundle-and-save`)
  7. `Sizing Chart` (`/sizing-chart`)
  8. `Gallery Product` (`/gallery-product`)
  9. `Gallery Coming Soon` (`/gallery-coming-soon`)
  10. `Blog` (`/blog`)
  11. `Blog Detail` (`/blog/:slug`)
  12. `Contact Us` (`/contact-us`)
  13. `My Account` (`/my-account`)
  14. `Legal / Content Page` (`/legal/:slug`)
- **Admin Management (6 Page Templates):**
  15. `Dashboard` (`/admin`)
  16. `Products` (`/admin/products`) - Sliding Drawer CRUD + Delete Confirmation Popup
  17. `Orders` (`/admin/orders`) - Detail Drawer + Fulfillment Updater
  18. `Website Content` (`/admin/content`) - Live CMS Editor for Home, About, Bundle, Sizing, Contact, Legal
  19. `Blog & Gallery` (`/admin/blog-gallery`) - Multi-tab Media Manager & Editor
  20. `Users / Wholesale / Inquiries` (`/admin/users`) - Application review & Status management

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### 2. Run the Development Environment
```bash
# In one terminal: run Backend Node.js API (Port 5000)
npm run server

# In second terminal: run Frontend React Client (Port 3000)
npm run client
```

### 3. Build & Run Production Mode
```bash
npm run build
npm start
```
The server will start at `http://localhost:5000` serving both the REST API and the React production bundle!

---

## 🔑 Default Credentials

- **Admin Portal:** `http://localhost:5000/admin` (or `http://localhost:3000/admin`)
- **Admin Login:** `admin@x-on.com` / `admin123`
- **Demo Customer:** `sarah.salon@example.com` / `user123`

---

## 📂 Project Architecture

```
X-on/
├── client/                     # React Frontend (Vite + React Router)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Modal, Drawer, ConfirmDialog, RatingStars, Badges
│   │   │   ├── footer/         # Footer with exact X-ON details + Newsletter
│   │   │   ├── header/         # Mega Menu + Mobile Hamburger Drawer
│   │   │   ├── layout/         # CustomerLayout, AdminLayout
│   │   │   ├── pagination/     # Dynamic Pagination
│   │   │   └── product/        # ProductCard, PriceDisplay, FilterSidebar
│   │   ├── context/            # AuthContext, CartContext, ToastContext
│   │   ├── pages/              # 20 page templates
│   │   ├── routes/             # AppRoutes (20 routes)
│   │   ├── services/           # api.js client service layer
│   │   ├── styles/             # index.css luxury theme design system
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js + Express REST API
│   ├── config/                 # db.js (persistent multi-driver store), seedData.js
│   ├── controllers/            # product, content, blog, gallery, user, wholesale, inquiry, order, review, auth
│   ├── middleware/             # JWT auth, requireAdmin, errorHandler
│   ├── routes/                 # productRoutes, categoryRoutes, contentRoutes, blogRoutes, etc.
│   ├── package.json
│   └── server.js
├── package.json                # Root automation scripts
└── README.md
```
