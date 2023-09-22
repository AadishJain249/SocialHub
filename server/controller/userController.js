const mongoose = require("mongoose");
const verify = require("../models/emailVerification");
const { comparePassword, compareToken } = require("../utils/hashPassword");
const Users = require("../models/user");
const verifyEmail = async (req, res) => {
  const { userId, token } = req.params;
//   console.log(userId);
//   console.log(token);
  try {
    const data = await verify.findOne({ userId });
    // console.log(data);
    // console.log("aadish");
    if (data) {
      const { expiresAt, token: hashedToken } = data;
    //   console.log(expiresAt);
    //   console.log(hashedToken);
      if (expiresAt < Date.now()) {
        verify.findOneAndDelete({ userId }).then(() => {
          Users.findOneAndDelete({ _id: userId })
            .then(() => {
              res
                .status(403)
                .send({ message: "Verification Token Has Expired" });
            })
            .catch((e) => {
              res.status(403).send(e.message);
            });
        });
      } else {
        compareToken(token, hashedToken)
          .then((matched) => {
            console.log(matched);
            if (matched) {
              Users.findByIdAndUpdate({ _id: userId }, { verified: true })
                .then(() => {
                  verify.findOneAndDelete({ userId }).then(() => {
                    const message = "Email Verified Succesfully";
                    res.status(203).send(message);
                  });
                })
                .catch((e) => {
                  console.log(e);
                  res.status(403).send(e.message);
                });
            } else {
              const message = "Verification Failed";
              res.status(403).send(message);
            }
          })
          .catch((e) => {
            console.log(e);
            res.status(403).send(e.message);
          });
      }
    }
  } catch (error) {}
};
module.exports = { verifyEmail };
