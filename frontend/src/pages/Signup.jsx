import React, { useContext, useState } from 'react'
import logo from "../assets/logo.svg"
import   {useNavigate}  from 'react-router-dom'
import { authDataContext } from '../context/AuthContext';
import axios from 'axios'
import { userDataContext } from '../context/UserContext';

function Signup() {
  let [show,setShow]=useState(false)
  let navigate=useNavigate();
  let {userData,setUserData}=useContext(userDataContext)
  let {serverUrl}=useContext(authDataContext)
  let [firstName,setFirstName]=useState("")
  let [lastName,setLastName]=useState("")
  let [userName,setUserName]=useState("")
  let  [email,setEmail]=useState("")
  let [password,setPassword]=useState("")
  let [loading,setLoading]=useState(false)
  let [err,setErr]=useState("")

  const handleSighnUp=async(e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      let result=await axios.post(serverUrl+"/api/auth/signup",{
        firstName,
        lastName,
        userName,
        email,
        password
        
      },{withCredentials:true})
       console.log(result)
       setUserData(result.data)
       navigate("/")
       setErr("")
      setLoading(false)
      setFirstName("")
      setLastName("")
      setUserName("")
      setEmail("")
      setPassword("")
     
    }catch(error){
    
      
     setErr(error.response.data.message)
      setLoading(false)
    }
  }
  return (
    <div className='w-full h-screen bg-[white] flex flex-col items-center justify-start gap-[10px]'>
      <div className='p-[30px] lg:p-[35px] w-full h-[80px] flex items-center'>
        <img src={logo} alt='' />
      </div>
      <form className="w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center  gap-[10px] p-[15px]" onSubmit={handleSighnUp}>
       <h1 className='text-gray-800 text-[30px] font-semibold mb-[30px]'>Sign Up</h1>
       <input type='text' placeholder='firstname' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md'value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
       <input type='text' placeholder='lastname' required  className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
        <input type='text' placeholder='usename' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md ' value={userName} onChange={(e)=>setUserName(e.target.value)}/>
        <input type='email' placeholder='email' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md ' value={email} onChange={(e)=>setEmail(e.target.value)}/>

        <div className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px]  rounded-md relative'>
           <input type={show? "text" : "password"} placeholder='password' required className='w-full h-full border-none text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={password} onChange={(e)=>setPassword(e.target.value)}/>
           <span className='absolute right-[20px] top-[10px] text-[#0898c4] cursor-pointer font-semibold'onClick={()=>setShow(prev=>!prev)}>{show? "hidden":"show"}</span>
        </div>
       
       {err && <p className='text-red-500 text-center mt-[10px]'>
         {err}
        </p>}
        <button className='w-[100%] h-[50px] rounded-full bg-[#0898c4] mt-[40px] text-white' disabled={loading}>{loading? "Loading...": "Sign Up"}</button>
        <p className='text-center cursor-pointer' onClick={()=>navigate('/login')}>Already have an account ?<span className='text-[#0898c4]' >Sign In</span></p>
      </form>
    </div>
  )
}

export default Signup