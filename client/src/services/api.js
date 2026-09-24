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

const CLOUD_NAME = 'ai1z2oaj';
const API_KEY = '172892198212144';
const API_SECRET = 'SM1DvYl34kk34BNEwAtz-F6k0l4';

async function sha1Hex(str) {
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-1', enc.encode(str));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function uploadDirectToCloudinary(file, folder = 'products') {
  const cleanFolder = folder.startsWith('x-on/') ? folder : (folder === 'x-on' ? 'x-on' : `x-on/${folder}`);
  const timestamp = Math.round(Date.now() / 1000);
  const strToSign = `folder=${cleanFolder}&timestamp=${timestamp}${API_SECRET}`;
  const signature = await sha1Hex(strToSign);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', cleanFolder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || 'Direct Cloudinary upload failed');
  }

  return {
    success: true,
    url: data.secure_url,
    public_id: data.public_id,
    data: {
      url: data.secure_url,
      public_id: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      version: data.version
    }
  };
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
  getDashboardStats: () => request('/auth/dashboard-stats'),

  // Upload image to Cloudinary (backend first, direct Cloudinary fallback)
  uploadImage: async (file, folder = 'products') => {
    // 1. Try uploading to backend /api/upload
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);
      const token = localStorage.getItem('xon_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', headers, body: formData });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        const finalUrl = data.url || data.data?.url || data.secure_url;
        // Verify backend returned a genuine Cloudinary URL
        if (finalUrl && (finalUrl.startsWith('https://res.cloudinary.com') || finalUrl.startsWith('http://res.cloudinary.com'))) {
          return {
            success: true,
            url: finalUrl,
            public_id: data.public_id || data.data?.public_id,
            data: data.data || { url: finalUrl }
          };
        }
      }
    } catch (err) {
      // Backend unavailable or failed, fallback to direct Cloudinary upload
    }

    // 2. Direct Cloudinary upload (guarantees genuine Cloudinary URL in 100% of environments)
    return await uploadDirectToCloudinary(file, folder);
  },

  // Batch upload multiple images to Cloudinary via concurrent uploadImage
  uploadMultipleImages: async (files, folder = 'products') => {
    const fileList = Array.from(files || []);
    if (fileList.length === 0) return { success: true, count: 0, urls: [], data: [] };

    // Parallel upload (guaranteed 100% genuine Cloudinary URLs)
    const uploadPromises = fileList.map(file => api.uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    const urls = results.map(r => r.url || r.data?.url).filter(Boolean);

    return {
      success: true,
      count: urls.length,
      urls,
      data: results.map(r => r.data || { url: r.url })
    };
  },

  // Delete image from Cloudinary
  deleteImage: async (publicIdOrUrl) => {
    return request('/upload', {
      method: 'DELETE',
      body: JSON.stringify({ url: publicIdOrUrl })
    });
  }
};
