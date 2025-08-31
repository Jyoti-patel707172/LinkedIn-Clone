import mongoose from "mongoose";
import mangoose from "mongoose";
const postSchema = new mangoose.Schema({
   author:{
     type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   description:{
     type: String,  
      default: "",
   },
   image:{
     type: String,
   },
   like:[
    {
     type:mongoose.Schema.Types.ObjectId,
     ref:"User",
   },
  ],
   comment:[
    {  
       content:{type:String},
       user:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
       },
   },
  ],
},{timestamps:true});

const Post= mongoose.model("Post",postSchema);
export default Post;