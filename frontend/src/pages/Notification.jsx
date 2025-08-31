import React from "react";
import Nav from "../components/Nav";
import { useContext } from "react";
import { authDataContext } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import dp from "../assets/dp.jpg";

function Notification() {
  let { serverUrl } = useContext(authDataContext);
  let [notificationData, setNotificationData] = useState([]);

  const handleGetNotification = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/notification/get", {
        withCredentials: true,
      });
      setNotificationData(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handledeleteNotification = async (id) => {
    try {
      let result = await axios.delete(serverUrl + `/api/notification/deleteone/${id}`, {
        withCredentials: true,
      });
     await handleGetNotification()
    } catch (error) {
      console.log(error);
    }
  };
  const handlClearAllNotification = async () => {
    try {
      let result = await axios.delete(serverUrl + "/api/notification", {
        withCredentials: true,
      });
      await handleGetNotification()
    } catch (error) {
      console.log(error);
    }
  };


  function handleMessage(type){
      if(type=="like"){
        return "like your post"
      }
       if(type=="comment"){
        return "commented on your post"
      }
       else if(type=="like"){
        return "like your post"
      }else{
        return "Accept your connection"
      }
  }

  useEffect(() => {
    handleGetNotification();
  }, []);
  return (
    <div className="w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col gap-[40px]">
      <Nav />
 
      <div className="w-full h-[100px] bg-white shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-600  justify-between">
        <div>
        Notifications {notificationData.length}
        </div>
        {notificationData.length >0 && <button className='min-w-[100px] h-[40px] rounded-full border-2 border-[#ff3d3d] text-[#ff3d3d] ' onClick={handlClearAllNotification}>clear All</button>}
        
      </div>
      {notificationData.length > 0 && (
        <div className="w-[100%] max-w-[900px] bg-white shadow-lg rounded-lg flex flex-col gap-[20px] h-[100vh] mx-auto px-[10px] overflow-auto p-[20px]">
          {notificationData.map((noti, index) => (
            <div className="w-full min-h-[100px] p-[20px] flex justify-between items-center pl-[10px] border-b-2 border-b-gray-200" key={noti._id || index} > 
            <div>
              <div className="flex justify-center items-center gap-[10px]">
                <div className="w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer">
                  <img
                    src={noti.relatedUser.profileImage || dp}
                    alt="dp"
                    className="w-full h-full"
                  />
                </div>
                <div className="text-[19px] font-semibold text-gray-700">{`${
                  noti.relatedUser.firstName || "Loading..."
                } ${noti.relatedUser.lastName || "Loading..."} ${handleMessage(noti.type)}`}</div>
                 </div>
                 {noti.relatedPost &&
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[10px] sm:ml-[80px] mt-[10px]">
              <div className="w-[80px] h-[50px] overflow-hidden">
                <img src={noti.relatedPost.image} alt=""  className="h-full " />
              </div >
              <div className="text-[16px] text-gray-800 break-words whitespace-pre-wrap">{noti.relatedPost.description}</div>
        </div>
        }
          
                 </div>
                  
                  <div className="flex justify-center items-center gap-[10px]" onClick={()=>handledeleteNotification(noti._id)}>
                     <RxCross1 className="w-[25px] h-[25px] text-gray-700 font-bold cursor-pointer" />
                  </div>
              </div>
            
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
