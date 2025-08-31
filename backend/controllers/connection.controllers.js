
import Connection from "../models/connection.model.js"
import User from "../models/user.model.js"
import {io,userSocketMap} from "../index.js"
import Notification from "../models/notification.model.js"

//send connection request
export const sendConnection=async(req,res)=>{
  try{
     let {id}=req.params
     let sender=req.userId
   
      let user=await User.findById(sender);

      if(sender==id){
        return res.status(400).json({message:"you can not send request yourself"})
      }
      if(user.connection.includes(id)){
      return res.status(400).json({message:"you are already connection"})
      }
      let existingConnection=await Connection.findOne({
        sender,
        receiver:id,
        status:"pending"
      })
      if(existingConnection){
        return res.status(400).json({message:"request already exist"})
      }

      let newRequest=await Connection.create({
        sender,
        receiver:id
      })
      let receiverSocketId=userSocketMap.get(id)
      let senderSockectId=userSocketMap.get(sender)

      if(receiverSocketId){
        io.to(receiverSocketId).emit("statusUpdate",{updateUserId:sender,newStatus:"received"})
      }
      if(senderSockectId){
        io.to(senderSockectId).emit("statusUpdate",{updateUserId:id,newStatus:"pending"})
      }


     return res.status(200).json(newRequest)
     
  }catch(error){
    return res.status(500).json({message:`sendconnection error ${error}`})
  }
}

//accept connection request
export const acceptConnection=async(req,res)=>{
     try{
      let {connectionId}=req.params
      let connection = await Connection.findById(connectionId).populate("sender").populate("receiver")

    if(!connection){
      return res.status(400).json({message:"connection does not exist"})
    }
    if(connection.status!= "pending"){
       return res.status(400).json({message:"request under process"}) 
    }
    connection.status="accepted"
    let notification=await Notification.create({
          receiver:connection.sender,
          type:"connectionAccepted",
          relatedUser:userId
         })

   await connection.save()
   await User.findByIdAndUpdate(req.userId,{
    $addToSet:{connection:connection.sender._id}
   })
   await User.findByIdAndUpdate(connection.sender._id,{
    $addToSet:{connection:req.userId}
   })

    let receiverSocketId=userSocketMap.get(connection.receiver._id.toString())
      let senderSockectId=userSocketMap.get(connection.sender._id.toString())

      if(receiverSocketId){
        io.to(receiverSocketId).emit("statusUpdate",{updateUserId:connection.sender._id,newStatus:"disconnect"})
      }
      if(senderSockectId){
        io.to(senderSockectId).emit("statusUpdate",{updateUserId:req.userId,newStatus:"disconnect"})
      }

   return res.status(200).json({message:"connection accepts"})

     }catch(error){
       return res.status(500).json({message:`connection accepts erro ${error}`})

     }
}

//reject connection request
export const rejectConnection=async(req,res)=>{
     try{
      let {connectionId}=req.params
      let connection=await Connection.findById(connectionId)
    if(!connection){
      return res.status(400).json({message:"connection does not exist"})
    }
    if(connection.status!= "pending"){
       return res.status(400).json({message:"request under process"}) 
    }
    connection.status="rejected"
   await connection.save()
   
   return res.status(200).json({message:"connection rejected"})
     }catch(error){
       return res.status(500).json({message:`connection rejected erro ${error}`})

     }
}

//get connection request
export const getConnectionStatus=async(req,res)=>{
  try{
     const targetUserId=req.params.userId;
     const currentUserId=req.userId;

     let currentUser=await User.findById(currentUserId)
     if(currentUser.connection.includes(targetUserId)){
      return res.json({status:"disconnect"});
     }
    //pending request
     const pendingRequest =await Connection.findOne({
      $or:[
        {sender:currentUserId,receiver:targetUserId},
        {sender:targetUserId,receiver:currentUserId},
      ],
      status:"pending"
     });

     if(pendingRequest){
      if(pendingRequest.sender.toString()=== currentUserId.toString()){
        return res.json({status:"pending"});
      }else{
        return res.json ({status:"received", requestId:pendingRequest._id});
      }
     }
     //if no connection or prmding req found
     return res.json({status:"Connect"});

  }catch(error){
     return res.status(500).json({message: "getConnectionStatus erro"});
  }
};

//remove connection request
export const removeConnection=async(req,res)=>{
  try{
    const myId=req.userId;
    const otherUserId=req.params.userId;

    await User.findByIdAndUpdate(myId,{$pull: {connection:otherUserId}});
    await User.findByIdAndUpdate(otherUserId,{$pull:{connection:myId}});

     let receiverSocketId=userSocketMap.get(otherUserId)
      let senderSockectId=userSocketMap.get(myId)

      if(receiverSocketId){
        io.to(receiverSocketId).emit("statusUpdate",
          {updateUserId:myId,newStatus:"connect"})
      }
      if(senderSockectId){
        io.to(senderSockectId).emit("statusUpdate",{updateUserId:otherUserId,newStatus:"connect"})
      }

    res.json({message:"Connection removed successfully"});

  }catch(error){
    res.status(500).json({message:"removeConnection error"});
  }
};


//get all pending request
export const getConnectionRequests=async (req,res)=>{
  try{
    const userId=req.userId;
    console.log("req.userId =>", userId); 

    const requests=await Connection.find({receiver:userId,status:"pending"})
    .populate("sender","firstName lastName email userName profileImage headline")

    return res.status(200).json(requests);
  }catch(error){
   console.error("error in getConnectionRequests controller:",error);
   return res.status(500).json({message: "Server error"});
  }
}

//get all user connection
export const getUserConnections=async(req,res)=>{
  try{
    const userId=req.userId;
    const user=await User.findById(userId)
    .populate(
      "connection",
      "firstName lastName  userName profileImage headline connection"
    );
    return res.status(200).json(user.connection);
  }catch(error){
     console.error("error in getUsreConnection controller:",error)
     return res.status(500).json({message:"Serevre error"});
  }
}