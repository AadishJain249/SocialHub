const express=require('express')
const authRoute=require('./authRouter')
const userRouter=require('./userRouter')
const router=express.Router()
router.use('/auth',authRoute)
router.use('/user',userRouter)
module.exports =router