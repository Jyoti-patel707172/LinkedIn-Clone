import React, { createContext, useContext, useEffect, useState } from 'react'
import {authDataContext} from './AuthContext.jsx'
import axios from 'axios';
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
 export let socket=io("https://linkedin-backend-vrmf.onrender.com") 
  
export const userDataContext=createContext();

function UserContext({children})  {
  let [userData,setUserData]=useState(null)
  let{serverUrl}=useContext(authDataContext)
  let [edit,setEdit] = useState(false);
  let [postData,setPostData]=useState([]);
  let [profileData,setProfileData]=useState([])
  let navigate=useNavigate()

  const  getCurrentUser =async()=>{
    try{
      let result=await axios.get(serverUrl+"/api/user/currentuser",{withCredentials:true});
      console.log("Current User Response:", result.data);
   
      setUserData(result.data);
      

    }catch(error){
      console.log(error)
      setUserData(null)
    }
  };

  const getPost=async()=>{
    try{
       let result=await axios.get(serverUrl+ "/api/post/getpost",{withCredentials:true
       })
        console.log("Get Post Response:", result.data);
       setPostData(result.data.posts)
    }catch(error){
      console.log(error);

    } 
  }

  const handleGetProfile=async(userName)=>{
     try{
       let result=await axios.get(serverUrl+ `/api/user/profile/${userName}`,{withCredentials:true
       })
      console.log(result.data);

       setProfileData(result.data)
       navigate("/profile")
    }catch(error){
      console.log(error);

    } 
  }

   useEffect(() => {
    getCurrentUser();
    getPost();

    // Connect socket

    // Listen for new posts
    socket.on("newPost", (newPost) => {
      console.log("New Post Arrived:", newPost);
      setPostData((prev) => [newPost, ...prev]); // Add new post at top
    });

    return () => socket.close();
  }, []);
  const value={userData,setUserData,edit,setEdit,postData,setPostData,getPost,handleGetProfile,profileData,setProfileData};
  return (
  
      <userDataContext.Provider value={value}>
      {children}
      </userDataContext.Provider>
  
  );
};

export default UserContext;
