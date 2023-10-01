const Users = require("../models/user");
const {
  comparePassword,
  createJwt,
  hashPasswords,
} = require("../utils/function");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");
const register = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname || !email || !password) {
    res.status(200).json({
      success:"failed",
      message:"Please Fill All Fields"
    })
    return;
  }
  try {
    let usersExist = await Users.findOne({ email });
    if (usersExist) {
      res.status(200).json({
        success:"failed",
        message:"User Already Exist"
      })
      return
    }
    const hashPassword = await hashPasswords(password);
    const users = new Users({
      firstname,
      lastname,
      email,
      password: hashPassword,
    });
    await users.save();
    sendVerificationEmail(users, res);
  } catch (error) {
    console.log(error);
    // console.log("aadish");
    res.status(500).send(error.message);
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(200).json({
        success:"failed",
        message:"Please Fill All Fields"
      })
      return;
    }
    // find user by email
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "-password",
    });
    if (!user) {
      // next("Invalid email or password");
      res.status(200).json({
        success:"failed",
        message:"Invalid Email Or Password"
      })
      return;
    }
    // console.log(user);
    if (!user.verified) {
      res.status(200).json({
        success:"failed",
        message:"Please Verify Yourself On Email First"
      })
      return;
    }
    // now compare password
    const match = await comparePassword(password, user?.password);
    if (!match) {
      res.status(200).json({
        success:"failed",
        message:"Password Doesn't Match"
      })
      return;
    }
    // now make user password in the database undefined
    user.password = undefined;
    const token = await createJwt(user?._id);

    res.status(201).json({
      success: true,
      message: "Login Successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
module.exports = { register, login };
