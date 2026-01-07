import { Request, Response } from "express"
import { commentServices } from "./comment.service"

const createComment=async(req:Request,res:Response)=>{
try {
    const user=req.user
    req.body.authorId=user?.id
    const result=await commentServices.createComment(req.body)
    res.status(201).json({
        success:true,
        message:"comment create successful!",
        data:result
    })
} catch (error) {
   res.status(400).json({
    success:false,
    message:"comment crate fail",
    details:error
   })
}
}


export const commentController={
    createComment
}