// const { verify } = require('crypto')
const {verifyEmail,passwordReset,ResetThePassword,changePassword,getUser,updateUser,friendRequest,getFriendRequest,acceptRequest,suggestedFriends,profileView}=require('../controller/userController')
const express=require('express')
const path=require('path')
const { updateMany } = require('../models/emailVerification')
const { verifyToken } = require('../middleware/middleware')
const router=express.Router()
const dir_name=path.resolve(path.dirname(""))
router.get('/verify/:userId/:token',verifyEmail)
// to verify it
router.get('/reset-password/:userId/:token',ResetThePassword)
// to change the password in the db
router.post('/change-password',changePassword)
// when user sends the data for changing the password
router.post('/new-password',passwordReset)

// User Section
router.post('/get-user/:id?',verifyToken,  getUser)
router.put('/update-user',verifyToken,updateUser)

// friend section
router.post('/friend-request',verifyToken,friendRequest)
router.post('/get-friend-request',verifyToken,getFriendRequest)

// accept /deny friend request
router.post("/accept-request",verifyToken,acceptRequest)

// view profile
router.post("/profile-view",verifyToken, profileView)

// suggested Friends
router.post("/suggested-friends",suggestedFriends)
module.exports =router