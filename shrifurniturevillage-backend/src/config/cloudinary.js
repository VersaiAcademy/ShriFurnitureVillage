import { v2 as cloudinary } from 'cloudinary';

let cloudinaryConfigured = false;

export function configureCloudinary() {
  if (cloudinaryConfigured) return cloudinary;
  
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary env vars not set');
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
  });
  cloudinaryConfigured = true;
  return cloudinary;
}

export default cloudinary;


