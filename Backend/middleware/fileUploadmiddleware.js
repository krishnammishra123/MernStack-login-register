
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const fileUploadMiddleware = {
    
  storage : diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/image');
    },
    filename: function (req, file, cb) {
        const uniqueName = `aa${uuidv4().replaceAll("-", "")}.${file.mimetype.split("/")[1]}`;
      cb(null, uniqueName);
    }
  }),
  
  // File filter for images only
    fileFilter : function(req, file, cb)  {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPEG, WEBP and JPG files are allowed!'), false);
    }
  },
  
};