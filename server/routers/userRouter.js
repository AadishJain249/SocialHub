// const { verify } = require('crypto')
const {verifyEmail}=require('../controller/userController')
const express=require('express')
const path=require('path')
const router=express.Router()
const dir_name=path.resolve(path.dirname(""))
router.get('/verify/:userId/:token',verifyEmail)
module.exports =router