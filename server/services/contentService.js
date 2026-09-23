import { contentRepository } from '../repositories/contentRepository.js';

class ContentService {
  getPageContent(pageKey) {
    return contentRepository.getPageContent(pageKey);
  }

  getAllContents() {
    return contentRepository.getAll();
  }

  updatePageContent(pageKey, content) {
    return contentRepository.updatePageContent(pageKey, content);
  }
}

export const contentService = new ContentService();
