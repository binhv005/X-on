const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getAuthHeader() {
  const token = localStorage.getItem('xon_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getProductBySlug: (slug) => request(`/products/${slug}`),
  getProductById: (id) => request(`/products/id/${id}`),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Categories & Taxonomies
  getCategories: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/categories${query ? `?${query}` : ''}`);
  },
  createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),

  // Website Content
  getPageContent: (pageKey) => request(`/pages/${pageKey}`),
  getAllPageContents: () => request('/pages'),
  updatePageContent: (pageKey, data) => request(`/pages/${pageKey}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Blog
  getBlogPosts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/blog${query ? `?${query}` : ''}`);
  },
  getBlogPostBySlug: (slug) => request(`/blog/${slug}`),
  createBlogPost: (data) => request('/blog', { method: 'POST', body: JSON.stringify(data) }),
  updateBlogPost: (id, data) => request(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBlogPost: (id) => request(`/blog/${id}`, { method: 'DELETE' }),
  addBlogComment: (slug, data) => request(`/blog/${slug}/comments`, { method: 'POST', body: JSON.stringify(data) }),

  // Gallery
  getGalleryItems: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/gallery${query ? `?${query}` : ''}`);
  },
  createGalleryItem: (data) => request('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  updateGalleryItem: (id, data) => request(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGalleryItem: (id) => request(`/gallery/${id}`, { method: 'DELETE' }),

  // Coming Soon Collections
  getComingSoonCollections: () => request('/gallery/coming-soon/all'),
  createComingSoonCollection: (data) => request('/gallery/coming-soon', { method: 'POST', body: JSON.stringify(data) }),
  updateComingSoonCollection: (id, data) => request(`/gallery/coming-soon/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteComingSoonCollection: (id) => request(`/gallery/coming-soon/${id}`, { method: 'DELETE' }),

  // Wholesale Applications
  submitWholesale: (data) => request('/wholesale/signup', { method: 'POST', body: JSON.stringify(data) }),
  getWholesaleApplications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/wholesale${query ? `?${query}` : ''}`);
  },
  updateWholesaleStatus: (id, data) => request(`/wholesale/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Inquiries / Contact Form
  submitInquiry: (data) => request('/inquiries', { method: 'POST', body: JSON.stringify(data) }),
  getInquiries: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/inquiries${query ? `?${query}` : ''}`);
  },
  updateInquiry: (id, data) => request(`/inquiries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Orders
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/orders${query ? `?${query}` : ''}`);
  },
  getOrderById: (id) => request(`/orders/${id}`),
  updateOrderStatus: (id, data) => request(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  createOrder: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),

  // Reviews
  getReviews: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/reviews${query ? `?${query}` : ''}`);
  },
  createReview: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  // Users
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/users${query ? `?${query}` : ''}`);
  },
  updateUserStatus: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Auth & Dashboard
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getCurrentUser: () => request('/auth/me'),
  getDashboardStats: () => request('/auth/dashboard-stats')
};
