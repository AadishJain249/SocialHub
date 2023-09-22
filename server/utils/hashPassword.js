const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const hashFunction = async (password) => {
  const salt = await bycrypt.genSalt(10);
  const hash = await bycrypt.hash(password, salt);
  return hash;
};
const createJwt = (id) => {
  const token = jwt.sign({ userId: id }, process.env.Jwt_secret, {
    expiresIn: "1d",
  });
  console.log(token);
  return token;
};

const compareToken = async (pass, input_pass) => {
  if (pass !== input_pass) return false;
  return true;
};
const comparePassword = async (pass, input_pass) => {
  const matched = await bycrypt.compare(pass, input_pass);
  return matched;
};
module.exports = { hashFunction, createJwt, comparePassword, compareToken };
