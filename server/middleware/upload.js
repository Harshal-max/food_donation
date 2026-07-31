// middleware/upload.js
//
// IMPORTANT: this used to write files to a local "uploads/" folder with
// multer.diskStorage. That works locally, but on Render (and most hosts)
// the filesystem is rebuilt from GitHub on every deploy/restart, so any
// file saved there disappears the moment the service redeploys. This now
// uploads directly to Cloudinary instead, which is permanent storage and
// survives every future deploy.
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'zerowastemart', // all uploads grouped under this folder in Cloudinary
    // Let Cloudinary auto-detect image type (jpg/png/webp/etc.) instead of forcing one.
    resource_type: 'image',
  },
});

const upload = multer({ storage });

export default upload;
