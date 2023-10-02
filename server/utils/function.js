const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hashFunction = async (value) => {
  const salt = await bycrypt.genSalt(10);
  // console.log(salt);
  const hash = await bycrypt.hash(value, salt);
  // hash.replace('/','3')
  // let hashValue=""
  // for(let i=0;i<hash.length;i++)
  // {
  //   if(hash[i]!='/')
  //   {
  //     hashValue+=hash[i]
  //   }
  // }
  return hash;
};
const hashPasswords = async (value) => {
  const salt = await bycrypt.genSalt(10);
  // console.log(salt);
  const hash = await bycrypt.hash(value, salt);
  return hash;
};

const createJwt = (id) => {
  const token = jwt.sign({ userId: id }, process.env.Jwt_secret, {
    expiresIn: "1d",
  });
  // console.log(token);
  return token;
};

const compareToken = async (token, get_token) => {
  console.log(token+" "+get_token);
  if (token !== get_token) return false;
  return true;
};
const comparePassword = async (password, input_password) => {
  console.log(password);
  console.log(input_password);
  const matched = await bycrypt.compare(password, input_password);
  console.log(matched);
  return matched;
};
module.exports = { hashFunction, createJwt, comparePassword, compareToken,hashPasswords };
