import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Memory storage for Cloudinary stream with fallback
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed (jpg, png, webp, gif, svg).'), false);
    }
    cb(null, true);
  }
});

const router = express.Router();

// POST /api/upload - upload image (Cloudinary with local file fallback)
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided.' });
    }

    // Check if Cloudinary is configured
    const isCloudinaryConfigured = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (isCloudinaryConfigured) {
      const folder = (req.body.folder || req.query.folder || 'products').toString().slice(0, 60);

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `x-on/${folder}`,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        },
        (error, result) => {
          if (error) {
            // Fallback to local storage if Cloudinary upload fails
            console.error('Cloudinary upload failed, falling back to disk:', error);
            saveToDisk(req, res);
            return;
          }
          return res.status(201).json({
            success: true,
            url: result.secure_url,
            message: 'Image uploaded successfully',
            data: {
              url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format
            }
          });
        }
      );
      stream.end(req.file.buffer);
    } else {
      saveToDisk(req, res);
    }
  } catch (err) {
    next(err);
  }
});

function saveToDisk(req, res) {
  try {
    const ext = path.extname(req.file.originalname) || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = 'product-' + uniqueSuffix + ext;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, req.file.buffer);

    const fileUrl = `/uploads/${filename}`;
    return res.status(201).json({
      success: true,
      url: fileUrl,
      filename: filename,
      size: req.file.size,
      data: {
        url: fileUrl,
        public_id: filename
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export default router;
