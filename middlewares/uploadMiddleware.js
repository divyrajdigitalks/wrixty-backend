const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const sharp = require('sharp');
const path = require('path');

// Configure multer for memory storage (temporary)
const storage = multer.memoryStorage();

// Helper function to compress image
async function compressImage(buffer, mimetype) {
  try {
    let pipeline = sharp(buffer);
    const metadata = await pipeline.metadata();

    // Resize if width is greater than 1920px
    if (metadata.width > 1920) {
      pipeline = pipeline.resize(1920, null, { withoutEnlargement: true });
    }

    if (mimetype === 'image/gif') {
      return await pipeline.gif({ colours: 128 }).toBuffer();
    } else if (mimetype === 'image/webp') {
      return await pipeline.webp({ quality: 80 }).toBuffer();
    } else {
      // Convert to webp by default for better compression
      return await pipeline.webp({ quality: 80 }).toBuffer();
    }
  } catch (error) {
    console.error('Image compression error:', error);
    return buffer; // Return original buffer if compression fails
  }
}

// File filter - allow images, gifs, and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|avif|bmp|tiff|tif|svg|ico|heic|heif|mp4|webm|ogg|mov|quicktime/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype.startsWith('video/');

  if (isImage || isVideo || extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  },
  fileFilter: fileFilter
});

// Helper function to upload file to external API
async function uploadToExternalAPI(file, projectName = 'banaya', folderName = 'interiors') {
  let fileBuffer = file.buffer;
  let filename = file.originalname;
  let mimetype = file.mimetype;

  // Apply compression based on file type
  if (mimetype.startsWith('image/') || mimetype === 'image/gif') {
    fileBuffer = await compressImage(fileBuffer, mimetype);
    // If converted to webp, update extension
    if (mimetype !== 'image/gif' && !filename.toLowerCase().endsWith('.webp')) {
      filename = path.parse(filename).name + '.webp';
      mimetype = 'image/webp';
    }
  }

  const formData = new FormData();
  formData.append('project', projectName);
  formData.append('folder_structure', folderName);
  formData.append('file', fileBuffer, {
    filename: filename,
    contentType: mimetype
  });

  try {
    const response = await axios.post('https://service.digitalks.co.in/upload-file', formData, {
      headers: {
        ...formData.getHeaders(),
        'accept': 'application/json'
      }
    });
    
    if (response.data && response.data.file_url) {
      return response.data.file_url;
    }
    return null;
  } catch (error) {
    console.error('Error uploading to external API:', error.response?.data || error.message);
    return null;
  }
}

// Helper function to delete file from external API
async function deleteFromExternalAPI(fileUrl) {
  if (!fileUrl) return true;
  
  try {
    await axios.delete('https://service.digitalks.co.in/delete-file-by-url', {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        file_url: fileUrl
      }
    });
    return true;
  } catch (error) {
    console.error('Error deleting from external API:', error.response?.data || error.message);
    return false;
  }
}

// Helper function to update file in external API
async function updateInExternalAPI(fileUrl, newFile, project = 'banaya', folder = 'interiors') {
  try {
    // 1. Upload new file first
    const newFileUrl = await uploadToExternalAPI(newFile, project, folder);
    
    if (newFileUrl) {
      // 2. If upload successful, try to delete old file
      if (fileUrl) {
        deleteFromExternalAPI(fileUrl).catch(err => 
          console.error('Error deleting old file during update:', err.message)
        );
      }
      return newFileUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error in updateInExternalAPI:', error.message);
    return null;
  }
}

module.exports = upload;
module.exports.uploadToExternalAPI = uploadToExternalAPI;
module.exports.deleteFromExternalAPI = deleteFromExternalAPI;
module.exports.updateInExternalAPI = updateInExternalAPI;
