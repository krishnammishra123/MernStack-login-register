import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../schema/UserSchema.js";


const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
  
     if (!authHeader || !authHeader.startsWith("Bearer ")) {
     return res.status(401).json({ message: "Unauthorized, no token provided!",status:401  });
    }

    const token = authHeader.split(" ")[1];

        let verifyToken;

        try {
            verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: "Unauthorized, token expired", status: 401 });
            }
            return res.status(401).json({ message: "Unauthorized, invalid tokens",status:401 });
        }
 
        const rootuser = await User.findOne({ _id: verifyToken.id});
        
        if (!rootuser) {
            return res.status(401).json({ message: "Unauthorized, user not found",status:401  });
        }

        req.token = token;
        req.rootuser = rootuser;
        req.userId = rootuser._id;
        req.role = rootuser.role;
     
        next();

    } catch (err) {
        res.status(500).json({ message: "Unauthorized, no token provided" });
    }
};


const verifyAdmin = async (req, res, next) => {
    try {
       await  authenticate(req, res, () => {
            if (req.role !== "admin") {
                res.status(401).json({ message: "Unauthorized, admin access required" , status:401 });
            } else {
                next();
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Unauthorized, internal server error" });
    }
};

 

 

const verifyUser = async (req, res, next) => {
    try {
        await authenticate(req, res, () => {
            if (req.role !== "user") {
                res.status(401).json({ message: "Unauthorized, user access required" , status:401 });
            } else {
                next();
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Unauthorized, internal server error" });
    }
};



export { authenticate, verifyAdmin, verifyUser };








//for the multiple role authentication

// const checkRole = (role) => {
//     return (req, res, next) => {
//       if (req.role && req.role === role) {
//         next();
//       } else {
//         res.status(403).json({ message: 'Unauthorized',status:403 });
//       }
//     };
//   };


// Define roles
// const ROLE = {
//     user: 'user',
//     admin: 'admin',
//   };
  
//   // Middleware to check role
//   const checkRole = (roles) => {
//     return (req, res, next) => {
//       if (!roles.includes(req.user.role)) {
//         return res.status(403).json({ message: 'Forbidden' });
//       }
//       next();
//     };
//   };
  
//   // Example route with role-based access
//   router.get("/profile", userAuth, checkRole([ROLE.user]), async (req, res) => {
//     res.status(200).json({ type: ROLE.user, user: serializeUser(req.user) });
//   });
  