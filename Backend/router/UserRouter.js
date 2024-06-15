import  express  from "express";
import { getUserDetails, uploadUserProfileImage } from "../controller/UserController.js";
import {  verifyUser } from "../middleware/authenticate.js";
import multer from "multer";
import { fileUploadMiddleware } from "../middleware/fileUploadmiddleware.js";


const router = express.Router();

const upload = multer({ storage: fileUploadMiddleware.storage ,fileFilter:fileUploadMiddleware.fileFilter  });
 

router.get("/getUserDetails",verifyUser,getUserDetails)

router.post("/uploadUserProfile",upload.single('fileUrl'),verifyUser,uploadUserProfileImage)

export default router;