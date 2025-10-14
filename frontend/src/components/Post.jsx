import React, { useContext, useEffect, useState } from "react";
import dp from "../assets/dp.jpg";
import moment from "moment";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegCommentDots, FaEdit } from "react-icons/fa";
import { LuSendHorizontal } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { socket, userDataContext } from "../context/UserContext";
import ConnectionButton from "./ConnectionButton";

function Post({ id, author, like, comment, description, image, createdAt }) {
  const { serverUrl } = useContext(authDataContext);
  const { userData, getPost, handleGetProfile } = useContext(userDataContext);

  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [more, setMore] = useState(false);

  // Edit post states
  const [showEdit, setShowEdit] = useState(false);
  const [editDescription, setEditDescription] = useState(description);
  const [editImage, setEditImage] = useState(null);

  useEffect(() => {
    setLikes(like);
    setComments(comment);
  }, [like, comment]);

  // Socket listeners
  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId === id) setLikes(likes);
    });
    return () => socket.off("likeUpdated");
  }, [id]);

  useEffect(() => {
    socket.on("commentAdded", ({ postId, comm }) => {
      if (postId === id) setComments(comm);
    });
    return () => socket.off("commentAdded");
  }, [id]);

  // Like function
  const handleLike = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/post/like/${id}`, { withCredentials: true });
      setLikes(res.data.like);
    } catch (err) {
      console.log(err);
    }
  };

  // Comment function
  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${serverUrl}/api/post/comment/${id}`,
        { content: commentContent },
        { withCredentials: true }
      );
      setComments(res.data.comment);
      setCommentContent("");
    } catch (err) {
      console.log(err);
    }
  };

  // Delete function
  const handleDeletePost = async () => {
    try {
      await axios.delete(`${serverUrl}/api/post/delete/${id}`, { withCredentials: true });
      getPost();
    } catch (err) {
      console.log(err);
    }
  };

  // Update function
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("description", editDescription);
      if (editImage) formData.append("image", editImage);

      await axios.put(`${serverUrl}/api/post/update/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowEdit(false);
      getPost();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full min-h-[200px] flex flex-col gap-[10px] bg-white rounded-lg shadow-lg p-[20px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-[10px]" onClick={() => handleGetProfile(author.userName)}>
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer">
            <img src={author.profileImage || dp} alt="dp" className="h-full" />
          </div>
          <div>
            <div className="text-[24px] font-bold">{`${author.firstName} ${author.lastName}`}</div>
            <div className="text-[16px]">{author.headline}</div>
            <div className="text-[16px]">{moment(createdAt).fromNow()}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {userData._id !== author._id && <ConnectionButton userId={author._id} />}
          {userData._id === author._id && (
            <>
              {/* Delete Button */}
              <button
                onClick={handleDeletePost}
                className="flex items-center justify-center p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-shadow shadow-md"
                title="Delete Post"
              >
                <RiDeleteBin6Line className="w-6 h-6" />
              </button>

              {/* Edit Button */}
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center justify-center p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-shadow shadow-md"
                title="Edit Post"
              >
                <FaEdit className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {showEdit && (
        <form
          onSubmit={handleUpdate}
          className="flex flex-col gap-2 p-4 border rounded bg-gray-50"
        >
          <textarea
            className="p-2 border rounded"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <input type="file" onChange={(e) => setEditImage(e.target.files[0])} />
          <div className="flex gap-2">
            <button className="bg-green-500 text-white px-3 py-1 rounded" type="submit">
              Save
            </button>
            <button
              className="bg-gray-300 px-3 py-1 rounded"
              type="button"
              onClick={() => setShowEdit(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Description */}
      <div
        className={`w-full pl-[50px] ${more ? "max-h-none" : "max-h-[100px] overflow-hidden"}`}
      >
        {description}
      </div>
      {description.length > 200 && (
        <div
          className="pl-[50px] text-[19px] font-semibold cursor-pointer"
          onClick={() => setMore((prev) => !prev)}
        >
          {more ? "read less.." : "read more.."}
        </div>
      )}

      {/* Image */}
      {image && (
        <div className="w-full h-[300px] overflow-hidden flex justify-center rounded-lg">
          <img src={image} alt="" className="h-full rounded-lg" />
        </div>
      )}

      {/* Likes & Comments */}
      <div>
        <div className="w-full flex justify-between items-center p-[20px] border-b-2 border-gray-500">
          <div className="flex items-center gap-[5px] text-[18px]">
            <BiLike className="text-[#1ebbff] w-[20px] h-[20px]" />
            <span>{likes.length}</span>
          </div>
          <div
            className="flex items-center gap-[5px] text-[18px] cursor-pointer"
            onClick={() => setShowComment((prev) => !prev)}
          >
            <span>{comments.length}</span>
            <span>comments</span>
          </div>
        </div>

        {/* Like / Comment buttons */}
        <div className="flex justify-start items-center w-full p-[20px] gap-[20px]">
          {!likes.includes(userData._id) ? (
            <div className="flex gap-[5px] cursor-pointer" onClick={handleLike}>
              <BiLike className="w-[24px] h-[24px]" /> <span>Like</span>
            </div>
          ) : (
            <div className="flex gap-[5px] cursor-pointer" onClick={handleLike}>
              <BiSolidLike className="w-[24px] h-[24px] text-[#07a4ff]" />
              <span className="text-[#07a4ff]">Liked</span>
            </div>
          )}
          <div
            className="flex gap-[5px] cursor-pointer"
            onClick={() => setShowComment((prev) => !prev)}
          >
            <FaRegCommentDots className="w-[24px] h-[24px]" />
            <span>comment</span>
          </div>
        </div>

        {/* Comments */}
        {showComment && (
          <div>
            <form
              className="w-full flex justify-between items-center border-b-2 border-gray-300 p-[10px]"
              onSubmit={handleComment}
            >
              <input
                type="text"
                placeholder="leave a comment"
                className="outline-none border-none"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <button>
                <LuSendHorizontal className="text-[#07a4ff] w-[22px] h-[22px]" />
              </button>
            </form>
            <div className="flex flex-col gap-[10px]">
              {comments.map((com) => (
                <div
                  key={com._id}
                  className="flex flex-col gap-[20px] border-b-2 p-[20px] border-b-gray-300"
                >
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer">
                      <img src={com.user.profileImage || dp} alt="dp" className="h-full" />
                    </div>
                    <div>
                      <div className="text-[16px] font-semibold">{`${com.user.firstName} ${com.user.lastName}`}</div>
                      <div>{moment(com.createdAt).fromNow()}</div>
                    </div>
                  </div>
                  <div className="pl-[50px]">{com.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
