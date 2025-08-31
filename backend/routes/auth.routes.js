import  express  from 'express';
import { signUp,login ,logOut} from '../controllers/auth.controllers.js';

 let authoRouter=express.Router()
 authoRouter.post("/signup",signUp);
 authoRouter.post("/login",login);
  authoRouter.get("/logout",logOut);

  
 export default authoRouter