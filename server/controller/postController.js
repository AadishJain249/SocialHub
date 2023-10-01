const Comments = require("../models/comment");
const Posts = require("../models/post");
const Users = require("../models/user");
// const { post } = require("../routers/userRouter");
const addPost = async (req, res, next) => {
  console.log("aadish");
  try {
    const { userId } = req.body.user; // during login time middleware will provide the user id req next(attach id) res
    const { description, image } = req.body;
    if (!description) {
      return res.status(200).send("Please provide description of your post");
    }
    const newPost = await Posts({
      userId,
      description,
      image,
    });
    await newPost.save();
    return res.status(201).json({
      success: true,
      message: "successfully created",
      data: newPost,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};
const getPost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { search } = req.body;
    const user = await Users.findById(userId);
    const friends = user?.friends?.toString().split(",") ?? [];
    friends.push(userId);
    const searchPost = {
      $or: [
        {
          description: { $regex: search, $options: "i" },
        },
      ],
    };
    const posts = await Posts.find(search ? searchPost : {})
      .populate({
        path: "userId",
        select: "-password",
      })
      .sort({ _id: -1 });
    const friendsPost = posts?.filter((post) => {
      return friends.includes(post?.userId?._id.toString());
    });
    const otherPost = posts?.filter((post) => {
      return !friends.includes(post?.userId?._id.toString());
    });
    let postRes = null;
    if (friendsPost?.length > 0) {
      postRes = search ? friendsPost : [...friendsPost, ...otherPost];
    } else {
      postRes = posts;
    }
    res.status(200).json({
      success: true,
      message: "Successfully",
      data: postRes,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};
const userParticularPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Posts.findById(id).populate({
      path: "userId",
      select: "-password",
    });
    res.status(200).json({
      success: true,
      message: "Successfully",
      data: post,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};
const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const post = await Posts.find({userId:id})
      .populate({
        path: "userId",
        select: "-password",
      })
      .sort({ _id: -1 });
      console.log(post);
    res.status(200).json({
      success: true,
      data: post,
      message: "Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};
const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    console.log(postId);
    const postComments = await Comments.find({postId})
      .populate({
        path: "userId",
        select: "-password",
      })
      .populate({
        path: "replies.userId",
        select: "-password",
      })
      .sort({ _id: -1 });
      console.log(postComments);
    res.status(200).json({
      success: true,
      data: postComments,
      message: "Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};
const likePost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const post = await Posts.findById(id);
    const index = post.likes.findIndex((pid) => pid == String(userId));
    console.log(index);
    console.log(id);
    console.log(userId);
    // likes
    if (index == -1) {
      post.likes.push(userId);
    }
    // unlikes
    else {
      post.likes = post.likes.filter((pid) => pid != String(userId));
    }
    const newPost = await Posts.findByIdAndUpdate(id, post, {
      new: true,
    });
    res.status(201).json({
      success: true,
      data: newPost,
      message: "Successfully Updated",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};
const likePostComment = async (req, res, next) => {
  const { userId } = req.body.user;
  const { id, rid } = req.params;
  console.log(id);
  console.log(userId);
  try {
    if (rid === null || rid === undefined || rid === "false") {
      const comment = await Comments.findById(id);
      console.log(comment);
      const index = comment.likes.findIndex((pid) => pid === String(userId));
      console.log(index);
      // likes
      if (index === -1) {
        console.log(comment.likes);
        comment.likes.push(userId);
        console.log(comment.likes);
      }
      // unlikes
      else {
        comment.likes = comment.likes.filter((pid) => pid !== String(userId));
      }
      const updated = await Comments.findByIdAndUpdate(id, comment, {new: true,});
      res.status(201).json({
        success: true,
        data: updated,
        message: "Successfully Updated",
      });
    } else {
      const repliedComments = await Comments.findOne(
        {
          _id: id,
        },
        {
          replies: {
            $elemMatch: {
              _id: rid,
            },
          },
        }
      );
      const index = repliedComments?.replies[0].likes.findIndex(
        (i) => i === String(userId)
      );
      if (index === -1) {
        repliedComments.replies[0].likes.push(userId);
      } else {
        repliedComments.replies[0].likes =
          repliedComments.replies[0].likes.filter((i) => i !== String(userId));
      }
      const query = { _id: id, "replies._id": rid };
      const updated = {
        $set: {
          "replies.$.likes": repliedComments.replies[0].likes,
        },
      };
      const result = await Comments.updateOne(query, updated, { new: true });
      res.status(201).json(result);
    }
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};
const commentPost = async (req, res, next) => {
  try {
    const { comment, from } = req.body;
    const { userId } = req.body.user;
    const { id } = req.params;
    if (comment === null) {
      res.status(200).send({ message: "Comment is required" });
    }
    const newComment = new Comments({ comment, from, userId, postId: id });
    
    await newComment.save();
    const post = await Posts.findById(id);
    post.comments.push(newComment._id);
    const updatedPost = await Posts.findByIdAndUpdate(id, post, {
      new: true,
    });
    console.log(newComment);
    console.log(updatedPost);
    res.status(201).json(newComment);
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};

const replyPostComment = async (req, res, next) => {
  console.log("aadish");
  const { comment, replyAt, from } = req.body;
  const { userId } = req.body.user;
  const { id } = req.params;
  console.log(id);
  console.log("aadish");
  try {
    if (comment === null) {
      res.status(200).send({ message: "Comment is required" });
    }
    const commentInfo = await Comments.findById(id);
    console.log(commentInfo);
    commentInfo.replies.push({
      comment,
      replyAt,
      from,
      userId,
      created_At: Date.now(),
    });
    await commentInfo.save();
    res.status(201).json(commentInfo);
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Posts.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};
module.exports = {
  addPost,
  getPost,
  userParticularPost,
  getUserPosts,
  getComments,
  likePost,
  likePostComment,
  commentPost,
  replyPostComment,
  deletePost,
};
