import express from 'express';
import { getPageContent, getAllPageContents, updatePageContent } from '../controllers/contentController.js';

const router = express.Router();

router.get('/', getAllPageContents);
router.get('/:pageKey', getPageContent);
router.put('/:pageKey', updatePageContent);

export default router;
