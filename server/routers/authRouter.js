const express=require('express')
const router=new express.Router()
const {register, login}=require('../controller/authcontroller')
router.post('/register',register)
router.post('/login',login)
module.exports =router