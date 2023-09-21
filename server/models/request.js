const mongoose = require("mongoose");
const requestScheme = new mongoose.Schema(
  {
    requestTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    
    requestFrom:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    requestStatus:{
        type:String,
        default:"Pending"
    }
  },
  { timestamps: true }
);
const request = mongoose.model("request", requestScheme);
module.exports=request;
