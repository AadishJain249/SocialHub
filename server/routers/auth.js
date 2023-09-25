const express=require('express')
const authRoute=require('./authRouter')
const userRouter=require('./userRouter')
const postRouter=require('./postRouter')
const router=express.Router()
router.use('/auth',authRoute)
router.use('/user',userRouter)
router.use('/post',postRouter)
module.exports =router