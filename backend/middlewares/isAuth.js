import  jwt  from 'jsonwebtoken';
import User from "../models/user.model.js";

const isAuth =async(req,res,next)=>{
  try{
  let token=req.cookies.token;
  if(!token){
    return res.status(400).json({message:"user doesn't have token"});
    
  }
  let verifyToken= jwt.verify(token,process.env.JWT_SECRET);
  if(!verifyToken){
     return res.status(400).json({message:"user doesn't have  valid token"});
  }
  const user = await User.findById(verifyToken.userId);
    req.user = user; 
  req.userId=verifyToken.userId
  next();
  }catch(error){
  return res.status(500).json({message:"is Auth error"});
  }
}
export default isAuth;