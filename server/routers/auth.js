const express=require('express')
const authRoute=require('./authRouter')
const router=express.Router()
router.use('/auth',authRoute)
module.exports =router