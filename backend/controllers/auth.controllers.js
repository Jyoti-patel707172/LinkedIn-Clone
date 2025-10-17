import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signUp=async(req,res)=>{
   try{
    let {firstName,lastName,userName,email,password}=req.body;
      let existEmail=await User.findOne({email})
      if(existEmail){
        return res.status(400).json({message:"email already exist !"})
      }
      let existUsername=await User.findOne({userName})
      if(existUsername){
        return res.status(400).json({message:"userName already exist !"})
      }
      if(password.length<8){
         return res.status(400).json({message:"password must be at least 8 characters"})
      }
      let  hashedPassword=await bcrypt.hash(password,10)

      const user=await User.create({
          firstName,
          lastName,
          userName,
          email,
          password:hashedPassword
      })
      
      let token=await genToken(user._id)
     res.cookie('token', token,{
      httpOnly:true,
      maxAge:7*24*60*60*1000,
      sameSite:"None",
      secure:true"
     });
      let { password: pass, ...rest } = user._doc;
return res.status(201).json(rest);

   }catch(error){
    console.log(error);
     return res.status(500).json({message:"signup error"})
     
   }

}
export const login=async(req,res)=>{
  try{

    let {email,password}=req.body;
      let user=await User.findOne({email})
      if(!user){
        return res.status(400).json({message:"user  does not exist !"})
      }
      
     const isMatch=await bcrypt.compare(password,user.password)
     if(!isMatch){
      return res.status(400).json({message:"incorrect password"});
     }
  
      
      let token=await genToken(user._id)
     res.cookie('token', token,{
      httpOnly:true,
      maxAge:7*24*60*60*1000,
      sameSite:"None",
      secure:true
     });
      let { password: pass, ...rest } = user._doc;
return res.status(201).json(rest);

  }catch(error){
          console.log(error);
       return res.status(500).json({message:"login error"})
     
  }
}
export const logOut=async(req,res)=>{
  try{

    res.clearCookie("token")
    return res.status(200).json({message:"log out successfully"})
  }catch(error){
    console.log(error);
     return res.status(500).json({message:"logOut error"})
     
  }
}
