import Post from "../models/post.model.js";
import uploadOnCloudinary from "../config/cloudinary.js"
import { io } from "../index.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
  try {
    let { description } = req.body;
    let newPost;

    if (req.file) {
      let image = await uploadOnCloudinary(req.file.path);
      newPost = await Post.create({
        author: req.userId,
        description,
        image
      });
    } else {
      newPost = await Post.create({
        author: req.userId,
        description
      });
    }

    // Populate user info taaki frontend direct use kar sake
    newPost = await Post.findById(newPost._id)
      .populate("author", "firstName lastName profileImage headline");

    // Emit new post to all clients
    io.emit("newPost", newPost);

    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json(`create post error ${error}`);
  }
};
export const getPost = async (req, res) => {
  try {
    const post = await Post.find()
      .populate("author", "firstName lastName profileImage headline userName")
      .populate("comment.user", "firstName lastName profileImage headline")
      .sort({ createdAt: -1 });
    return res.status(200).json({ posts: post });
  } catch (error) {
    return res.status(500).json({ message: "getPost error" });
  }
};

export const like =async(req,res)=>{
  try{
    let postId=req.params.id;
    let userId=req.userId;

    let post=await Post.findById(postId)
    if(!post){
      return res.status(400).json({message:"post not found"});
    }
    if(post.like.includes(userId)){
      post.like=post.like.filter((id)=>id!=userId)
    }else{
     post.like.push(userId);
     if(post.author!=userId){
     let notification=await Notification.create({
      receiver:post.author,
      type:"like",
      relatedUser:userId,
      relatedPost:postId
     })
    }
    }
    await post.save();
    io.emit("likeUpdated",{postId,likes:post.like})
    
    return res.status(200).json(post);
    
  }catch(error){
      return res.status(500).json({message:`like error ${error}`});
  }
};
export const comment=async(req,res)=>{
  try{
        let postId=req.params.id;
        let userId=req.userId;
        let {content}=req.body;
        let post=await Post.findByIdAndUpdate(postId,{
          $push:{comment:{content,user:userId}}
        },{new:true})
        .populate("comment.user","firstName lastName profileImage headline");
        if(post.author!=userId){
        let notification=await Notification.create({
      receiver:post.author,
      type:"comment",
      relatedUser:userId,
      relatedPost:postId
     })
     }
        io.emit("commentAdded",{postId,comm:post.comment})
        return res.status(200).json(post)

  }catch(error){
    return res.status(500).json({message:`comment error ${error}`});
  }
  
}

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // केवल author को ही delete करने का अधिकार होगा
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this post" });
    }

    await Post.findByIdAndDelete(postId);

    // Socket emit ताकि frontend realtime update कर सके
    io.emit("postDeleted", { postId });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: `delete error ${error}` });
  }
};
// UPDATE POST
export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    let post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // केवल author को ही edit करने का अधिकार
    if (post.author.toString() !== userId.toString())
      return res.status(403).json({ message: "Not authorized" });

    if (req.body.description) post.description = req.body.description;

    if (req.file) {
      const imageUrl = await uploadOnCloudinary(req.file.path);
      post.image = imageUrl;
    }

    await post.save();

    // Populate author info for frontend
    const populatedPost = await post.populate(
      "author",
      "firstName lastName profileImage userName headline"
    );

    // Emit updated post for realtime
    io.emit("postUpdated", populatedPost);

    return res.status(200).json(populatedPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
