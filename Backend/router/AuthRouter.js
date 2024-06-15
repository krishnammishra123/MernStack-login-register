import  express  from "express";
import { signIn,googleLogin, signUp, verifyEmail,forgotPassword ,resetPassword} from "../controller/AuthController.js";
import { forgotPasswordValidation, resetPasswordValidation, signInValidation, signUpValidationRules } from "../validation/validation.js";


const router = express.Router();

router.post("/signUp",signUpValidationRules(),signUp)

router.post("/googleLogin" ,googleLogin)

router.get("/emailVerify/:token",verifyEmail)

router.post("/signIn",signInValidation(),signIn)


router.post("/forgotPassword",forgotPasswordValidation(),forgotPassword)

router.post("/resetPassword/:id/:token",resetPasswordValidation(),resetPassword)


export default router;