const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Delete image from Cloudinary using public ID
 * @param {string} publicId - The Cloudinary public ID
 * @returns {Promise<object>} - Result from Cloudinary
 */
const deleteImage = async (publicId) => {
  if (!publicId) return null;
  
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error.message);
    throw error;
  }
};

/**
 * Get image info from Cloudinary
 * @param {string} publicId - The Cloudinary public ID
 * @returns {Promise<object>} - Image metadata
 */
const getImageInfo = async (publicId) => {
  if (!publicId) return null;
  
  try {
    return await cloudinary.api.resource(publicId);
  } catch (error) {
    console.error('Error fetching image info:', error.message);
    throw error;
  }
};

/**
 * Optimize image URL with transformation
 * @param {string} imageUrl - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} - Optimized image URL
 */
const optimizeImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl) return null;
  
  const {
    width = null,
    height = null,
    quality = 'auto',
    format = 'auto',
  } = options;
  
  let transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  
  // Replace /upload/ with /upload/{transformations}/
  const transformationString = transformations.join(',');
  return imageUrl.replace(
    '/upload/',
    `/upload/${transformationString}/`
  );
};

/**
 * Bulk delete images
 * @param {array} publicIds - Array of Cloudinary public IDs
 * @returns {Promise<array>} - Results of each deletion
 */
const bulkDeleteImages = async (publicIds) => {
  if (!Array.isArray(publicIds) || publicIds.length === 0) return [];
  
  try {
    return await Promise.all(
      publicIds.map(id => deleteImage(id))
    );
  } catch (error) {
    console.error('Error bulk deleting images:', error.message);
    throw error;
  }
};

/**
 * Generate responsive image URLs for different screen sizes
 * @param {string} imageUrl - Original Cloudinary URL
 * @returns {object} - URLs for different sizes
 */
const getResponsiveImageUrls = (imageUrl) => {
  if (!imageUrl) return null;
  
  return {
    thumbnail: optimizeImageUrl(imageUrl, { width: 150, height: 150 }),
    small: optimizeImageUrl(imageUrl, { width: 300, height: 300 }),
    medium: optimizeImageUrl(imageUrl, { width: 600, height: 600 }),
    large: optimizeImageUrl(imageUrl, { width: 1200, height: 1200 }),
    original: imageUrl,
  };
};

module.exports = {
  deleteImage,
  getImageInfo,
  optimizeImageUrl,
  bulkDeleteImages,
  getResponsiveImageUrls,
};
