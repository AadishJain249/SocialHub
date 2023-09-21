const mongoose = require("mongoose");
const commentScheme = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    postId:{
        type: mongoose.Schema.ObjectId,
         ref: "Posts"
    },
    comment:{
        type:String,
        required:true
    },
    from:{
        type:String,
        required:true
    },
    replies:[{
        rid:{type:mongoose.Schema.Types.ObjectId},
        userId:{
            type: mongoose.Schema.ObjectId,
            ref: "Users"
        },
        from:{
            type:String
        },
        replyAt:{
            type:String
        },
        comment:{
            type:String
        },
        created_At:{
            type:Date,
            default:Date.now()
        },
        updated_At:{
            type:Date,
            default:Date.now()
        },
        likes:[{
            type:String
        }]
    }],
    likes:[{
        type:String
    }]
}, { timestamps: true });
const Comments = mongoose.model("Comments", commentScheme);
module.exports=Comments;
