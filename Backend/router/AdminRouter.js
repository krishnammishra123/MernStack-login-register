import  express  from "express";
import {  verifyAdmin } from "../middleware/authenticate.js";
import { getAdminDetails, getAllUsers ,deleteUserByAdmin} from "../controller/AdminController.js";


const router = express.Router();

router.get("/getAdminDetails",verifyAdmin,getAdminDetails);


router.get("/getAllUsers",verifyAdmin,getAllUsers);

router.delete("/deleteUser/:id",verifyAdmin,deleteUserByAdmin);

export default router;