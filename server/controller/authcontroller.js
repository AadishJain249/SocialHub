const Users = require("../models/user");
const {
  comparePassword,
  createJwt,

  hashPasswords,
} = require("../utils/function");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");
const register = async (req, res, next) => {
  // console.log("aadish");
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    next("Please Provide Required Fields");
    return;
  }
  try {
    // console.log(email);
    let usersExist = await Users.findOne({ email });
    // console.log(usersExist);
    if (usersExist) {
      return res.status(401).send({ message: "User already exist" });
    }
    const hashPassword = await hashPasswords(password);
    // console.log(hashPassword);
    const users = new Users({
      firstname,
      lastname,
      email,
      password: hashPassword,
    });
    // console.log(users);
    await users.save();
    sendVerificationEmail(users, res);
  } catch (error) {
    console.log(error);
    res.status(404).send(error.message);
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      next("Please Provide Credentials");
      return;
    }
    // find user by email
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "-password",
    });
    if (!user) {
      next("Invalid email or password");
      return;
    }
    // console.log(user);
    if (!user.verified) {
      next("User email is not verified.Please Verify Your Email");
      return;
    }
    // now compare password
    const match = await comparePassword(password, user?.password);
    if (!match) {
      next("Wrong Password Please Check Your Password");
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
    res.status(404).json({ message: error.message });
  }
};
module.exports = { register, login };
