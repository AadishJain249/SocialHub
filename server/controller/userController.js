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
const passwordmodel = require("../models/password_reset");
const request = require("../models/request");
const verifyEmail = async (req, res) => {
  const { userId, token } = req.params;
  console.log(userId + "yess");
  console.log(token + "verify");
  try {
    const data = await verify.findOne({ userId });
    console.log(data);
    if (data) {
      console.log(data);
      const { expiresAt, token: hashedToken } = data;
      if (expiresAt < Date.now()) {
        verify
          .findOneAndDelete({ userId })
          .then(() => {
            Users.findOneAndDelete({ _id: userId })
              .then(() => {
                const message = "Verification Token Has Expired";
                console.log("aadish1");
                res.redirect(`/user/verified?status=error&message=${message}`);
              })
              .catch((e) => {
                console.log("aadish12");
                res.redirect(`/user/verified?message=`);
              });
          })
          .catch((e) => {
            res.redirect(`/user/verified?message=`);
          });
      } else {
        console.log("aadishisgood");
        compareToken(token, hashedToken)
          .then((matched) => {
            console.log(matched);
            if (matched) {
              Users.findByIdAndUpdate({ _id: userId }, { verified: true })
                .then(() => {
                  verify.findOneAndDelete({ userId }).then(() => {
                    const message = "Email Verified Succesfully";
                    console.log("aadish2");
                    res.redirect(
                      `/user/verified?status=success&message=${message}`
                    );
                  });
                })
                .catch((e) => {
                  console.log(e);
                  const message = "Verification Failed or link is expired";
                  console.log("aadish3");
                  res.redirect(
                    `/user/verified?status=error&message=${message}`
                  );
                });
            } else {
              const message = "Verification Failed or link is expired";
              console.log("aadish4");
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
    // console.log(userExist);
    if (!userExist) {
      res.status(403).send("Email Doesn't Exist");
    }
    const ExistUser = await passwordmodel.findOne({ email });
    // console.log(ExistUser);
    if (ExistUser) {
      if (ExistUser.expiresAt > Date.now()) {
        return res
          .status(200)
          .send("Password Reset Link Has Been Sent To Your Email");
      }
      await passwordmodel.findOneAndDelete({ email });
    }
    await ResetPassword(userExist, res); // the details of user whose password need to be reset
  } catch (error) {}
};
const ResetThePassword = async (req, res) => {
  const { userId, token } = req.params;
  try {
    const userExist = await Users.findById(userId);
    if (!userExist) {
      res.status(403).send("User Doesn't Exist.");
    }
    // console.log(userExist);
    const userPasswordReset = await passwordmodel.findOne({ userId });
    // console.log(userPasswordReset);
    if (!userPasswordReset) {
      res.status(403).send("Invalid password reset link.Try Again");
    }
    const { expiresAt, token: resetToken } = userPasswordReset;
    // console.log(userPasswordReset+" "+"aadish");
    if (expiresAt < Date.now()) {
      // console.log("aa");
      res.status(403).send("Password reset link has been expired");
    } else {
      // console.log(token);
      const isMatch = await compareToken(token, resetToken);
      if (!isMatch) {
        // console.log("aad");
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
    console.log(req.body);
    const hashPassword = await hashFunction(password);
    const user = await Users.findByIdAndUpdate(
      {
        _id: userId,
      },
      { password: hashPassword }
    );
    console.log(user);
    if (user) {
      await passwordmodel.findOneAndRemove({ userId });
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
    // console.log(id);
    // console.log(req.body.user);
    // const { userId } = req.body.user;
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
    console.log(user);
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
    // console.log(userId);
    // console.log(id);
    // if we  have has sent a request
    const requestExist = await request.findOne({
      requestFrom: userId,
      requestTo,
    });
    // console.log(requestExist);
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
    // console.log(newRequest);
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
    // console.log(userId);
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
    // console.log(checkRequest);
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
    // console.log(userId); // request to
    // console.log(id);
    const { rid, status } = req.body; // request from
    // console.log(rid); // rid that person data id we need to fetch
    const requestExist = await request.findById(rid);
    // console.log(requestExist);
    if (!requestExist) {
      return res.status(200).send("No Request Exist");
    }
    const newRes = await request.findByIdAndUpdate(
      {
        _id: rid,
      },
      { requestStatus: status }
    );
    console.log(newRes);
    if (status === "Accepted") {
      const user = await Users.findById(userId);
      // console.log(user);
      user.friends.push(newRes?.requestFrom);
      // console.log(user);
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
    console.log(people);
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
