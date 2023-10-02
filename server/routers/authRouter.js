const express=require('express')
const router=new express.Router()
const {register, login}=require('../controller/authcontroler')
router.post('/register',register)
router.post('/login',login)
module.exports =router