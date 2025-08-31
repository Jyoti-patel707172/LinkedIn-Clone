import React from 'react'
import Nav from '../components/Nav'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import dp from '../assets/dp.jpg'
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";

function Network() {
  let{serverUrl}=useContext(authDataContext);
  let [connection, setConnection] = useState([])

const handleGetRequests = async () => {
    try{
        let result=await axios.get(`${serverUrl}/api/connection/requests`,{withCredentials:true})
        setConnection(result.data)
    }catch(error){
     console.log(error)
    }
  }

  const handlAcceptConnection = async (requestId) => {
    try{
        let result=await axios.put(`${serverUrl}/api/connection/accept/${requestId}`,{},{withCredentials:true})
        setConnection(connection.filter((con)=>con.id==requestId))
    }catch(error){
     console.log(error)
    }
  }

  const handlRejectConnection = async (requestId) => {
    try{
        let result=await axios.put(`${serverUrl}/api/connection/reject/${requestId}`,{},{withCredentials:true})
         
         setConnection(connection.filter((con)=>con.id==requestId))
    }catch(error){
     console.log(error)
    }
  }

  


  useEffect(()=>{
    handleGetRequests()
  },[])
  return (

    <div className='w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col gap-[40px]'>
      <Nav />
        <div className='w-full h-[100px] bg-white shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-600'>
       Invitations {connection.length}
        </div>

        {connection.length>0 && 
         <div className='w-[100%] max-w-[900px] shadow-lg rounded-lg flex flex-col gap-[20px] min-h-[100px]'>
          {connection.map((connection,index)=>(
            
            <div  key={connection._id}className='w-full min-h-[100px] flex justify-between items-center'>
              <div className='flex justify-center items-center gap-[10px]'>
                   <div className='w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer' >
                             <img src={connection.sender.profileImage || dp} alt='dp' className='w-full h-full'/>
                           </div>   
                    <div className='text-[19px] font-semibold text-gray-700'>{`${connection.sender.firstName || "Loading..."} ${connection.sender.lastName || "Loading..."}`}</div>       
                
              </div>

              <div>
                    <button className='text-[#39a1f5] font-semibold' onClick={()=>handlAcceptConnection(connection._id)}>
                      <IoIosCheckmarkCircleOutline  className='w-[40px] h-[40px]' />
                      </button>
                    <button className='text-[#f51515] font-semibold' onClick={()=>handlRejectConnection(connection._id)}>
                      <RxCrossCircled className='w-[35px] h-[35px]' />
                      </button>
               
              </div>

            </div>
          ))}
        </div>
        }
       
    </div>
  )
}

export default Network
