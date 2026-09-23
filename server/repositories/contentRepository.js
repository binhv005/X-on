import { db } from '../config/db.js';

class ContentRepository {
  getPageContent(pageKey) {
    return db.getPageContent(pageKey);
  }

  getAll() {
    return db.data.pageContents;
  }

  updatePageContent(pageKey, content) {
    return db.updatePageContent(pageKey, content);
  }
}

export const contentRepository = new ContentRepository();
