import { Router } from "express";
import { User } from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import { constants } from "../utils/SystemConstant.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import { generateToken } from "../utils/JWTconfig.js";

const router = Router();

router.post("/register",async (req,res)=>{
    try
    {
        const obj = req.body;
        const { email, password } = obj;
        if(!email || !validator.isEmail(email)){
            return res.json(new ApiResponse(false,"Invalid email",null,null));
        }
        if(!password || password.length < 6){
            return res.json(new ApiResponse(false,"Password must be at least 6 characters",null,null));
        }
        const existing = await User.findOne({ email });
        if(existing){
            return res.json(new ApiResponse(false,"Email already registered",null,null));
        }
        const hashed = await bcrypt.hash(password,10);
        obj.password = hashed;
        const created = await User.create(obj);
        res.json(new ApiResponse(true,"Successfully Registered",{ id: created.id, email: created.email },null));
    } catch(error){
          res.json(new ApiResponse(false,"Registration Failed",null,error?.message || error));
    }

});
router.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    if(email==undefined || email.length==0) {
       res.json(new ApiResponse(false,"Email Not Found",null,null));
    }
    else if(password==undefined || password.length==0) {
       res.json(new ApiResponse(false,"Password Not Found",null,null));
    }
    else{
        const userob = await User.findOne({ email });
        if(userob == null){
            return res.json(new ApiResponse(false,"Invalid credentials",null,null));
        }
        const ok = await bcrypt.compare(password, userob.password);
        if(!ok){
            return res.json(new ApiResponse(false,"Invalid credentials",null,null));
        }
        const token = generateToken(userob.id);
        res.json(new ApiResponse(true,"Login Success!!",{
            name : userob.name,
            token
        },null));
    }

});
router.get('/constants',(req,res)=>{
     res.json(new ApiResponse(true,"Constants",constants));
     console.log(constants)
})

export default router;