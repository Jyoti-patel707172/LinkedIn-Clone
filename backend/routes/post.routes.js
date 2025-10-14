import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import upload from "../middlewares/multer.js"
import { comment, createPost, deletePost, getPost, like,  updatePost, } from '../controllers/post.controllers.js';

const postRouter=express.Router()

postRouter.post("/create",isAuth,upload.single("image"),createPost)
postRouter.get("/getpost",isAuth,getPost)
postRouter.get("/like/:id",isAuth,like)
postRouter.post("/comment/:id",isAuth,comment)
postRouter.delete("/delete/:id", isAuth, deletePost);
postRouter.put("/update/:id", isAuth, upload.single("image"), updatePost); // ✅ new route


export default postRouter
