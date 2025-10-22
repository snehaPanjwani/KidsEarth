import router from "express";
import {UserRouter} from "./UserRouter.js";
import ApiResponse from "../utils/ApiResponse.js";  
import {verifyToken} from "../utils/JWTconfig.js";

const authRouter = router.Router();

authRouter.use((req,res,next)=>{
    const token = req.headers["authorization"]; 
    if(!token){
        return res.json(new ApiResponse(false,"Access Denied. No Token Provided",null,null));
    }
    verifyToken(token,(err,tokenData)=>{
        if(err){
            return res.json(new ApiResponse(false,"Invalid Token",null,err?.message || err));
        }       
        req.tokenData = tokenData;
        next();
    }   
    );
});          


router.use("/user",UserRouter);

module.exports = authRouter;
