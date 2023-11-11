const mongoose = require("mongoose");
const verify = require("../models/emailVerification");
const {
  compareToken,
  hashFunction,
  createJwt,
  comparePassword,
} = require("../utils/function");
const Users = require("../models/user");
const { ResetPassword } = require("../utils/sendVerificationEmail");
const password = require("../models/password_reset");
const request = require("../models/request");
const verifyEmail = async (req, res) => {
  const { userId, token } = req.params;
  try {
    const data = await verify.findOne({ userId });
    if (data) {
      const { expiresAt, token: hashedToken } = data;
      if (expiresAt < Date.now()) {
        verify.findOneAndDelete({ userId }).then(() => {
            Users.findOneAndDelete({ _id: userId }).then(() => {
                const message = "Verification Token Has Expired";
                res.redirect(`/user/verified?status=error&message=${message}`);
              })
              .catch((e) => {
                res.redirect(`/user/verified?message=`);
              });
          })
          .catch((e) => {
            res.redirect(`/user/verified?message=`);
          });
      } else {
        compareToken(token, hashedToken)
          .then((matched) => {
            if (matched) {
              Users.findByIdAndUpdate({ _id: userId }, { verified: true })
                .then(() => {
                  verify.findOneAndDelete({ userId }).then(() => {
                    const message = "Email Verified Succesfully";
                    res.redirect(
                      `/user/verified?status=success&message=${message}`
                    );
                  });
                })
                .catch((e) => {
                  const message = "Verification Failed or link is expired";
                  res.redirect(
                    `/user/verified?status=error&message=${message}`
                  );
                });
            } else {
              const message = "Verification Failed or link is expired";
              res.redirect(`/user/verified?status=error&message=${message}`);
            }
          })
          .catch((error) => {
            console.log(error);
            res.redirect(`/user/verified?message=`);
          });
      }
    } else {
      const message = "Invalid verification link.Try Again later";
      res.redirect(`/user/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(error);
    res.redirect(`/user/verified?message=`);
  }
};
const passwordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const userExist = await Users.findOne({ email });
    if (!userExist) {
      res.status(403).json({status:"failed",message:"Email Doesn't Exist"});
    }
    const ExistUser = await password.findOne({ email });
    console.log("Exist User");
    if (ExistUser) {
      if (ExistUser.expiresAt > Date.now()) {
        return res
          .status(200)
          .send({status:"pending",message:"Password link has been sent to yoour email"});
      }
      await password.findOneAndDelete({ email });
    }
    await ResetPassword(userExist, res); // the details of user whose password need to be reset
  } catch (error) {
    console.log(error.message);
  }
};
const ResetThePassword = async (req, res) => {
  const { userId, token } = req.params;
  try {
    const userExist = await Users.findById(userId);
    if (!userExist) {
      res.status(403).send("User Doesn't Exist.");
    }
    const userPasswordReset = await password.findOne({ userId });
    if (!userPasswordReset) {
      res.status(403).send("Invalid password reset link.Try Again");
    }
    const { expiresAt, token: resetToken } = userPasswordReset;
    if (expiresAt < Date.now()) {
      res.status(403).send("Password reset link has been expired");
    } else {
      const isMatch = await compareToken(token, resetToken);
      if (!isMatch) {
        res.status(403).send("Invalid password reset link.Try Again");
      } else {
        res.status(200).send("All done");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).send("Error Has Occured");
  }
};
const changePassword = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const hashPassword = await hashFunction(password);
    const user = await Users.findByIdAndUpdate(
      {
        _id: userId,
      },
      { password: hashPassword }
    );
    if (user) {
      // await password.findByIdAndDelete(userId);
      // await password.findOneAndRemove({ userId });
      await user.save();
      res.status(200).send("Password Successfully Reset");
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(404).send("Error Has Occured");
  }
};
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id).populate({
      path: "friends",
      select: "-password",
    });
    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    }
    user.password = undefined;
    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error Has Occured");
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { firstname, lastname, location, profileUrl, profession } = req.body;
    if (!firstname || !lastname || !location || !profileUrl || !profession) {
      return res.status(200).send("Please provide all required fields");
    }
    const { userId } = req.body.user;
    const updateUser = {
      firstname,
      lastname,
      location,
      profileUrl,
      profession,
      _id: userId,
    };
    const user = await Users.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });
    await user.populate({ path: "friends", select: " -password" });
    const token = createJwt(user?._id);
    user.password = undefined;
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const friendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { requestTo } = req.body;
    // if we  have has sent a request
    const requestExist = await request.findOne({
      requestFrom: userId,
      requestTo,
    });
    if (requestExist) {
      return res.status(200).send("Friend Request Already Been Sent");
    }
    // if they have sent us a request
    const accountExist = await request.findOne({
      requestFrom: userId,
      requestTo,
    });
    if (accountExist) {
      return res.status(200).send("Friend Request Already Been Sent");
    }
    const newRequest = new request({
      requestTo,
      requestFrom: userId,
    });
    await newRequest.save();
    res.status(201).json({
      success: true,
      message: "Request Has Been Sent",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};
const getFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    // it will get the all person pending request populate who has sent this request
    const checkRequest = await request
      .find({
        requestTo: userId,
        requestStatus: "Pending",
      })
      .populate({
        path: "requestFrom",
        select: " -password",
      })
      .limit(10)
      .sort({ _id: -1 });
    res.status(200).json({
      success: true,
      data: checkRequest,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const acceptRequest = async (req, res, next) => {
  try {
    const userId = req.body.user.userId;
    const { rid, status } = req.body; // request from
    const requestExist = await request.findById(rid);
    if (!requestExist) {
      return res.status(200).send("No Request Exist");
    }
    const newRes = await request.findByIdAndUpdate(
      {
        _id: rid,
      },
      { requestStatus: status }
    );
    if (status === "Accepted") {
      const user = await Users.findById(userId);
      user.friends.push(newRes?.requestFrom);
      await user.save();
      const friend = await Users.findById(newRes?.requestFrom);
      friend.friends.push(newRes?.requestTo);
      await friend.save();
    }
    res.status(201).json({
      success: true,
      message: "Friend Request" + " " + status,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const profileView = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.body;
    const user = await Users.findById(id);
    user.views.push(userId);
    await user.save();
    res.status(201).json({
      success: true,
      message: "Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const suggestedFriends = async (req, res, next) => {
  const {userId}=req.body.user
  try {
    const people = await Users.find()
      .merge({
        _id: { $nin: userId },
        "friends": { $nin: userId},
      })
      .select('-password')
      .limit(6);
    res.status(200).json({ success: true, data: people });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  verifyEmail,
  passwordReset,
  ResetThePassword,
  changePassword,
  getUser,
  updateUser,
  friendRequest,
  getFriendRequest,
  acceptRequest,
  profileView,
  suggestedFriends,
};
