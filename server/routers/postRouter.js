const express=require('express')
const { verifyToken } = require('../middleware/middleware')
const { addPost,getPost,userParticularPost,getUserPosts ,getComments,likePost,likePostComment,commentPost,replyPostComment,deletePost} = require('../controller/postController')
const router=express.Router()
router.post('/add-post',verifyToken,addPost)
// get posts
router.post('/get-posts',verifyToken,getPost)
router.post('/get-post/:id',verifyToken,userParticularPost)

// get user post
router.get('/get-user-post/:id',verifyToken,getUserPosts)

// comments
router.post('/get-comments/:postId',verifyToken,getComments)

// like post
router.post("/like/:id",verifyToken,likePost)
// like a comments
router.post("/like/:id/:rid",verifyToken,likePostComment)

// post a comment
router.post('/comment/:id',verifyToken,commentPost)
router.post('reply-comment/:id',verifyToken,replyPostComment)

// delete a post
router.delete('/delete/:id',verifyToken,deletePost)
module.exports=router