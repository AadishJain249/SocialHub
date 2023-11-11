const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hashFunction = async (value) => {
  const salt = await bycrypt.genSalt(10);
  const hash = await bycrypt.hash(value, salt);
  return hash;
};
const hashPasswords = async (value) => {
  const salt = await bycrypt.genSalt(10);
  const hash = await bycrypt.hash(value, salt);
  return hash;
};

const createJwt = (id) => {
  const token = jwt.sign({ userId: id }, process.env.Jwt_secret, {
    expiresIn: "1d",
  });
  return token;
};

const compareToken = async (token, get_token) => {
  if (token !== get_token) return false;
  return true;
};
const comparePassword = async (password, input_password) => {
  const matched = await bycrypt.compare(password, input_password);
  return matched;
};
module.exports = {
  hashFunction,
  createJwt,
  comparePassword,
  compareToken,
  hashPasswords,
};
