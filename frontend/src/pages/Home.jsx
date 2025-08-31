import React, { useState, useRef, useContext,useEffect } from "react";
import Nav from "../components/Nav";
import dp from "../assets/dp.jpg";
import { FaPlus } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa";
import { userDataContext } from "../context/UserContext";
import { HiPencil } from "react-icons/hi2";
import { RxCross1 } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa6";
import EditProfile from "../components/EditProfile";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import Post from "../components/Post";

function Home() {
  let { userData, setUserData, edit, setEdit,postData,setPostData ,getPost,handleGetProfile} = useContext(userDataContext);
  let {serverUrl}=useContext(authDataContext);
  let [frontendImage,setFrontendImage]=useState("");
  let [backendImage,setBackendImage]=useState("");
  let [description,setDescription]=useState("");
  let [uploadPost,setUploadPost]=useState(false);
   let image=useRef();
   let [posting,setPosting]=useState(false) ;
   let [suggestUsers,setSuggestUsers]=useState([])


   function handleImage(e){
    let file=e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
   }
   async function handleUploadpost(){
    setPosting(true);
     try{
        let formdata=new FormData()
        formdata.append("description",description);

        if(backendImage){
          formdata.append("image",backendImage);
        }
         let result=await axios.post(serverUrl +"/api/post/create",formdata,{withCredentials:true});
          console.log(result);
         setPosting(false)
         setUploadPost(false);
          getPost(); 
         
     }catch(error){
      setPosting(false);
        console.log(error);
     }
   }
   const handleSuggestedUsers=async()=>{
    try{
      let result=await axios.get(serverUrl+ "/api/user/suggestedusers",{withCredentials:true});
      console.log(result.data)
      setSuggestUsers(result.data);

    }catch(error){
       console.log(error)
    }
   }

   useEffect(()=>{
    handleSuggestedUsers()
   },[])

   useEffect(()=>{
    getPost()
   },[uploadPost])

  return (
    <div className="w-full min-h-[100vh] bg-[#f0efe7] pt-[100px] flex   items-center lg:items-start lg:justify-center gap-[20px] px-[20px] flex-col lg:flex-row relative pd-[50px]">
      {edit && <EditProfile />}

      <Nav />

      {/* Main Content */}
      <div className="w-full lg:w-[25%] min-h-[200px] bg-[white] shadow-lg rounded-lg p-[10px] relative ">
        {/* CoverIMage */}
        <div
          className="w-[100%] h-[100px] bg-gray-500 rounded overflow-hidden flex items-center justify-center  relative cursor-pointer"
          onClick={() => setEdit(true)}
        >
          <img src={userData.coverImage || ""} alt="" className="w-full" />
          <FaCamera className="absolute right-[20px] top-[20px] w-[25px] h-[25px] text-white cursor-pointer" />
        </div>
        {/* Profile Image */}
        <div
          className="w-[70px] h-[70px] rounded-full overflow-hidden  flex items-center justify-center absolute top-[60px] left-[35px] cursor-pointer"
          onClick={() => setEdit(true)}
        >
          <img src={userData.profileImage || dp} alt="dp" className="h-full" />
        </div>
        <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[108px] left-[85px] rounded-full flex justify-center items-center">
          <FaPlus className="text-white" />
        </div>
        {/* user detail  */}
        <div className="mt-[25px] pl-[26px]  font-semibold text-gray-700 ">
          <div className="text-[22px]">{`${userData.firstName} ${userData.lastName}`}</div>
          <div className="text-[18px] font-semibold text-gray-600">
            {userData.headline || ""}
          </div>
          <div className=" text-[16px] text-gray-500">
            {" "}
            {userData.location}{" "}
          </div>
        </div>
        <button
          className="w-[90%] h-[40px] my-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px]"
          onClick={() => setEdit(true)}
        >
          Edit Profile <HiPencil />
        </button>
      </div>

        {uploadPost && <div className="w-full h-full bg-black fixed top-0 left-0  z-[100] opacity-[0.6]"></div>
        }
        
       {uploadPost && <div className="w-[90%] max-w-[500px] h-[600px] bg-white shadow-lg top-[100px] rounded-lg fixed z-[200] p-[20px] flex items-start justify-start flex-col gap-[20px]">
        <div className="absolute top-[20px] right-[20px] cursor-pointer ">
          <RxCross1 className="w-[25px] h-[25px] text-gray-700 font-bold cursor-pointer"  onClick={()=>setUploadPost(false)}/>
        </div>
        <div className="flex justify-start items-center gap-[10px]">
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden  flex items-center justify-center  cursor-pointer">
            <img
              src={userData.profileImage || dp}
              alt="dp"
              className="h-full"
            />
          </div>
          <div className="text-[22px]">{`${userData.firstName} ${userData.lastName}`}</div>
        </div>
        <textarea className={`w-full ${frontendImage?"h-[200px]":"h-[550px]"} outline-none border-none p-[10px] resize-none text-[19px] `} placeholder="what do you want to talk about....?" value={description} onChange={(e)=>setDescription(e.target.value)} ></textarea>
        <input  type="file" ref={image} hidden onChange={handleImage} />
            <div className="w-full h-[300px] overflow-hidden flex justify-center items-center rounded-lg">
               <img  src={frontendImage || ""} alt=""  className="h-full rounded-lg "/>
            </div>
          <div className="w-full h-[200px]  flex flex-col">
            <div className="p-[20px] flex items-center justify-start border-b-2 border-gray-500">
              <FaRegImage  className="w-[24px] h-[24px] text-gray-500" onClick={()=>image.current.click()}/>
            </div>
            

            <div className="flex justify-end items-center" >
              <button className='w-[100px] h-[50px] rounded-full bg-[#0898c4] mt-[40px] text-white ' disabled={posting} onClick={handleUploadpost}>{posting? "Posting...": "Post"}</button>
            </div>
          </div>
        
      </div>
      }
      

      {/* post */}
      <div className=" w-full lg:w-[50%] min-h-[200px] bg-[#f0efe7]  flex flex-col gap-[20px]">
        <div className="w-full h-[100px] bg-white shadow-lg rounded-lg flex items-center  p-[20px] justify-center gap-[10px]">
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden  flex items-center justify-center cursor-pointer">
            <img
              src={userData.profileImage || dp}
              alt="dp"
              className="h-full"
            />
          </div>
          <button className="w-[80%] h-[60%] border-2 border-gray-500 rounded-full flex items-center justify-start px-[20px] hover:bg-gray-200" onClick={()=>setUploadPost(true)}>
            start a post
          </button>
        </div>
         {postData.map((post,index)=>(
            <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt} />
         )
        )}

      </div>

      <div className="lg:block flex w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg flex-col p-[20px]">
        <h1 className="text-[20px] text-gray-600 font-semibold">Suggested Users</h1>
        {suggestUsers.length>0 && <div className="flex flex-col gap-[10px]">
          {suggestUsers.map((su)=>(
            <div className="flex items-center gap-[10px] mt-[10px]  cursor-pointer hover:bg-gray-200 rounded-lg p-[5px]" onClick={()=>handleGetProfile(su.userName)}>
               <div className='w-[40px] h-[40px] rounded-full overflow-hidden'>
                        <img src={su.profileImage || dp} alt='dp' className='w-full h-full'/>
                      </div>
                 <div>
            <div className='text-[19px] font-semibold text-gray-700'>{`${su?.firstName || "Loading..."} ${su?.lastName || "Loading..."}`}</div>
            <div className='text-[12px] font-semibold text-gray-700'>{su.headline}</div>
                 </div>      
            </div>
          ))}
          </div>}

          {suggestUsers.length==0 && <div>
            no sugggest
          </div>}
  
</div>



    </div>
  );
}


export default Home;
