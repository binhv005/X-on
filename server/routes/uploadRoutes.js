import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Memory storage - không ghi file tạm xuống disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB theo spec Media
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed (jpg, png, webp, avif).'), false);
    }
    cb(null, true);
  }
});

// POST /api/upload - upload 1 ảnh lên Cloudinary, trả về secure_url
router.post('/', upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided.' });
    }
    const folder = (req.body.folder || req.query.folder || 'x-on').toString().slice(0, 60);

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `x-on/${folder}`,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      },
      (error, result) => {
        if (error) return next(error);
        res.status(201).json({
          success: true,
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
  } catch (err) {
    next(err);
  }
});

export default router;
