import { Router } from "express";
import ApiResponse from "../utils/ApiResponse.js";
import { constants } from "../utils/SystemConstant.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import { Admin } from "../models/Admin.js";
import { Product } from "../models/Product.js";
import path from "path";
import uuidv4 from "uuid";


const router = Router();

router.post("/register",async (req,res)=>{
        try{
            const obj = req.body;
            const { email, password } = obj;
            if(!email || !validator.isEmail(email)){
                return res.json(new ApiResponse(false,"Invalid email",null,null));
            }
            if(!password || password.length < 6){
                return res.json(new ApiResponse(false,"Password must be at least 6 characters",null,null));
            }   
            const existing = await Admin.findOne({ email });
            if(existing){
                return res.json(new ApiResponse(false,"Email already registered",null,null));
            }   
            const hashed = await bcrypt.hash(password,10);  
            obj.password = hashed;
            const created = await Admin.create(obj);
            res.json(new ApiResponse(true,"Successfully Registered",{ id: created.id, email: created.email },null));
        }
        catch(error){
            res.json(new ApiResponse(false,"Registration Failed",null,error?.message || error));
        }
})

router.post("/login",async (req,res)=>{
    try{
        const {email,password} = req.body;  
        if(email==undefined || email.length==0) {
        res.json(new ApiResponse(false,"Email Not Found",null,null));
        }       
        else if(password==undefined || password.length==0) {    
            res.json(new ApiResponse(false,"Password Not Found",null,null));
        }
        else{
            const adminob = await Admin.findOne({ email });
            if(adminob == null){
                return res.json(new ApiResponse(false,"Invalid credentials",null,null));
            }       
            const ok = await bcrypt.compare(password, adminob.password);
            if(!ok){
                return res.json(new ApiResponse(false,"Invalid credentials",null,null));
            }                   
            res.json(new ApiResponse(true,"Login Success!!",{
                name : adminob.name
            },null));
        }                  
    }
    catch(error){
        res.json(new ApiResponse(false,"Login Failed",null,error?.message || error));
    }                                                               
});
router.post("/additem",async (req,res)=>{
    try{
        const reqfile = req.files.image;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(reqfile.mimetype)) {
           return res.status(400).send('Invalid file type');
        }
        const filename = uuidv4() + path.extname(reqfile.name);
        const dir = 'images';
        const filepath = path.join(dir,filename);
        reqfile.mv(filepath);
        const data = {...req.body,image: filepath,
           status: req.body.status === "true" || req.body.status === true 
        };
        const newproduct = await Product.create(data);
        res.json(new ApiResponse(true,"Product Added Successfully",newproduct,null));
      }  catch(error){
        res.json(new ApiResponse(false,"Product submission failed",null,error?.message || error));     
    } 
    
});
router.get("/products",async (req,res)=>{
    try{
        const products = await Product.find();      
        res.json(new ApiResponse(true,"Products List",products,null));
    }       
    catch(error){
        res.json(new ApiResponse(false,"Failed to fetch products",null,error?.message || error));
    }   
});

router.get('/constants',(req,res)=>{
    res.json(new ApiResponse(true,"System Constants",constants,null));
});

export default router;