import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

// Helper to extract Cloudinary public_id from a URL or raw public_id
export function extractPublicId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const clean = urlOrId.trim();

  // If it's a full Cloudinary URL
  if (clean.includes('res.cloudinary.com')) {
    // Matches path after /upload/ (with optional version v12345/) and strips file extension
    const match = clean.match(/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/) ||
                  clean.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If it has a file extension, strip it unless it's part of raw resource
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    return clean.replace(/\.[a-zA-Z0-9]+$/, '');
  }

  return null;
}

// Normalize folder name to avoid nested x-on/x-on/...
function normalizeFolder(rawFolder = 'products') {
  let folder = rawFolder.toString().trim().replace(/^\/+|\/+$/g, '');
  if (!folder || folder === 'x-on') return 'x-on';
  if (folder.startsWith('x-on/')) return folder;
  return `x-on/${folder}`;
}

// Memory storage for Cloudinary upload stream
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

const uploadBufferToCloudinary = (buffer, targetFolder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: targetFolder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const router = express.Router();

// POST /api/upload - Single image upload directly to Cloudinary
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided.' });
    }

    const folder = normalizeFolder(req.body.folder || req.query.folder || 'products');
    const result = await uploadBufferToCloudinary(req.file.buffer, folder);

    return res.status(201).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      message: 'Image uploaded successfully to Cloudinary',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        version: result.version,
        resource_type: result.resource_type
      }
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Image upload to Cloudinary failed'
    });
  }
});

// POST /api/upload/multiple - Batch upload up to 10 images directly to Cloudinary
router.post('/multiple', upload.array('images', 10), async (req, res, next) => {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided.' });
    }

    const folder = normalizeFolder(req.body.folder || req.query.folder || 'products');
    const uploadPromises = files.map(file => uploadBufferToCloudinary(file.buffer, folder));
    const results = await Promise.all(uploadPromises);

    const data = results.map(r => ({
      url: r.secure_url,
      public_id: r.public_id,
      width: r.width,
      height: r.height,
      format: r.format,
      version: r.version
    }));

    return res.status(201).json({
      success: true,
      count: results.length,
      urls: results.map(r => r.secure_url),
      data,
      message: `${results.length} images uploaded successfully to Cloudinary`
    });
  } catch (err) {
    console.error('Cloudinary batch upload error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Batch upload to Cloudinary failed'
    });
  }
});

// DELETE /api/upload - Delete image from Cloudinary by public_id or url
const handleDelete = async (req, res) => {
  try {
    const rawTarget = req.body.public_id || req.body.url || req.query.public_id || req.query.url;
    if (!rawTarget) {
      return res.status(400).json({ success: false, message: 'public_id or url is required to delete.' });
    }

    const publicId = extractPublicId(rawTarget);
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'Invalid public_id or Cloudinary URL provided.' });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: 'image'
    });

    return res.json({
      success: true,
      message: 'Image deleted from Cloudinary successfully',
      public_id: publicId,
      result: result.result
    });
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to delete image from Cloudinary'
    });
  }
};

router.delete('/', handleDelete);
router.post('/delete', handleDelete);

export default router;


