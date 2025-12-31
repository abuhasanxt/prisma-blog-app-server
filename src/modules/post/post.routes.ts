import express, { NextFunction, Request, Response } from "express";
import { postController } from "./post.controller";
import {auth as betterAuth} from "../../lib/auth"

const router = express.Router();

const auth =(...roles:any)=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        //get user season 
const season=await betterAuth.api.getSession({
    headers:req.headers as any
})

console.log(season);
        next()
    }
}
router.post(
    "/",auth("ADMIN","USER"), postController.createPost
)

router.get("/",postController.getAllPost )

export const postRouter = router;
