const mongoose = require("mongoose");
const passwordScheme = new mongoose.Schema(
  {
   userId:{
    type:String,
    unique:true
   },
   email:{
    type:String,
    unique:true
   },
   token:{
    type:String
   },
   createdAt:{
    type:Date
   },
   expiresAt:{
    type:Date
   }

  },
  { timestamps: true }
);
const password = mongoose.model("password", passwordScheme);
module.exports=password;
