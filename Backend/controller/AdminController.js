import User from "../schema/UserSchema.js";
 


export const  getAdminDetails = async(req,res) =>{
    try{   
        const user = await User.findOne({ _id: req.userId});
        const details ={firstName:user.firstName, lastName:user.lastName, email:user.email, id:user._id, role:user.role,}
        if(!user){
            return res.status(404).json({message:"user not found",status:200})
        }
       return res.status(200).json({message:details,status:200})
      }catch(err){
        console.log(err)
       return res.status(500).json({ message: "Something went wrong while getAdminDetails ", status: 500 });
    }
}


export const  getAllUsers = async(req,res) =>{
    try{   
        const {page,limit,search}=req.query;
         const query={
            firstName : { $regex: search , $options: 'i' }
         }  
        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        const users = await User.find(query).skip((page - 1) * limit).limit(limit);
       
        if(!users){
            return res.status(404).json({message:"user not found",status:200})
        }

        const userDetails = users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            id: user._id,
            role: user.role,
        }));
        
       return res.status(200).json({message:userDetails,totalPages:totalPages,status:200})
      }catch(err){
        console.log(err)
       return res.status(500).json({ message: "Something went wrong while getAdminDetails ", status: 500 });
    }
}

export const  deleteUserByAdmin = async(req,res) =>{
    try{   
       const { id } = req.params;
       await User.findByIdAndDelete({_id:id});
       return res.status(200).json({message:"User deleted successfully",status:200})

      }catch(err){
        console.log(err)
       return res.status(500).json({ message: "Something went wrong while deleting user", status: 500 });
    }
}