const mongoose = require("mongoose");
const VerificationScheme = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    token: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    expiresAt:{
        type:Date
    }
  },
  { timestamps: true }
);
const verify = mongoose.model("verify", VerificationScheme);
module.exports=verify;
