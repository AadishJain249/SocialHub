const express=require('express')
const { verifyToken } = require('../middleware/middleware')
const { addPost,getPost,userParticularPost,getUserPosts ,getComments,likePost,likePostComment,commentPost,replyPostComment,deletePost} = require('../controller/postController')
const router=express.Router()
router.post('/add-post',verifyToken,addPost)
// get posts all 
router.post('/get-posts',verifyToken,getPost)
// get a single post
router.post('/:id',verifyToken,userParticularPost)

// get user post all post
router.post('/get-user-post/:id',verifyToken,getUserPosts)

// comments
router.get('/get-comments/:postId',getComments)

// like post
router.post("/like/:id",verifyToken,likePost)
// like a comments
router.post("/like-comment/:id/:rid?",verifyToken,likePostComment)

// post a comment
router.post('/comment/:id',verifyToken,commentPost)
router.post('/reply-comments/:id',verifyToken,replyPostComment)

// delete a post
router.delete('/delete/:id',verifyToken,deletePost)
module.exports=router