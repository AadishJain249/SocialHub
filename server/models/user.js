const mongoose=require('mongoose')
const userScheme=new mongoose.Schema({
    firstname:{
        type:String,
        require:[true,"first name is required"]
    },
    lastname:{
        type:String,
        require:[true,"last name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        minlength:[6,"Password length should be greater than 6"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        unique:true
    },
    location:{
        type:String
    },
    profileUrl:{
        type:String
    },
    profession:{
        type:String
    },
    friends:[{type:mongoose.Schema.Types.ObjectId,ref:"Users"}],
    views:[{
        type:String
    }],
    verified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
const Users=mongoose.model("Users",userScheme)
module.exports= Users