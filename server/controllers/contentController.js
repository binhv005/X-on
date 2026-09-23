import { db } from '../config/db.js';

export const getPageContent = (req, res, next) => {
  try {
    const { pageKey } = req.params;
    const content = db.getPageContent(pageKey);
    if (!content) {
      return res.status(404).json({ success: false, message: `Content for page '${pageKey}' not found` });
    }
    res.json({ success: true, data: content });
  } catch (err) {
    next(err);
  }
};

export const getAllPageContents = (req, res, next) => {
  try {
    res.json({ success: true, data: db.data.pageContents });
  } catch (err) {
    next(err);
  }
};

export const updatePageContent = (req, res, next) => {
  try {
    const { pageKey } = req.params;
    const updated = db.updatePageContent(pageKey, req.body);
    res.json({ success: true, message: `Content for '${pageKey}' updated successfully`, data: updated });
  } catch (err) {
    next(err);
  }
};
