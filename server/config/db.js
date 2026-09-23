import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedInitialData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Database {
  constructor() {
    this.data = {
      products: [],
      categories: [],
      pageContents: {},
      blogPosts: [],
      galleryItems: [],
      comingSoonCollections: [],
      users: [],
      wholesaleApplications: [],
      inquiries: [],
      orders: [],
      reviews: []
    };
    this.init();
  }

  init() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const stats = fs.statSync(DB_FILE);
        this.lastModified = stats.mtimeMs;
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(fileContent);
        this.data = { ...this.data, ...parsed };
        console.log('📦 Local persistent database loaded successfully.');
      } catch (err) {
        console.error('Error reading db.json, re-seeding...', err);
        this.seed();
      }
    } else {
      this.seed();
    }
  }

  reloadIfModified() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const stats = fs.statSync(DB_FILE);
        if (this.lastModified && stats.mtimeMs > this.lastModified) {
          const fileContent = fs.readFileSync(DB_FILE, 'utf8');
          const parsed = JSON.parse(fileContent);
          this.data = { ...this.data, ...parsed };
          this.lastModified = stats.mtimeMs;
          console.log('🔄 db.json changed on disk, reloaded in-memory.');
        }
      }
    } catch (e) {
      // ignore concurrent write reads
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
      const stats = fs.statSync(DB_FILE);
      this.lastModified = stats.mtimeMs;
    } catch (err) {
      console.error('Failed to persist database to disk:', err);
    }
  }

  // Collection Accessors
  getCollection(name) {
    this.reloadIfModified();
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return this.data[name];
  }

  // Generic helpers
  find(collectionName, filterFn = () => true) {
    const col = this.getCollection(collectionName);
    if (Array.isArray(col)) {
      return col.filter(filterFn);
    }
    return col;
  }

  findOne(collectionName, filterFn) {
    const col = this.getCollection(collectionName);
    if (Array.isArray(col)) {
      return col.find(filterFn) || null;
    }
    return null;
  }

  findById(collectionName, id) {
    const col = this.getCollection(collectionName);
    return col.find(item => item.id === id || item._id === id) || null;
  }

  insert(collectionName, item) {
    const col = this.getCollection(collectionName);
    const newItem = {
      id: item.id || `xon_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    col.unshift(newItem);
    this.save();
    return newItem;
  }

  update(collectionName, id, updates) {
    const col = this.getCollection(collectionName);
    const index = col.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return null;
    
    col[index] = {
      ...col[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return col[index];
  }

  delete(collectionName, id) {
    const col = this.getCollection(collectionName);
    const index = col.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return false;
    
    col.splice(index, 1);
    this.save();
    return true;
  }

  // Page Content specific handlers
  getPageContent(pageKey) {
    return this.data.pageContents[pageKey] || null;
  }

  updatePageContent(pageKey, content) {
    if (!this.data.pageContents) {
      this.data.pageContents = {};
    }
    this.data.pageContents[pageKey] = {
      ...this.data.pageContents[pageKey],
      ...content,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.pageContents[pageKey];
  }
}

export const db = new Database();
