const bycrypt = require("bcrypt");
const jwt=require('jsonwebtoken')
const hashFunction=async(password)=>{
    const salt = await bycrypt.genSalt(10)
    const hash = await bycrypt.hash(password, salt);
    return hash
}
const createJwt=(id)=>
{
    return jwt.sign({userId:id},process.env.Jwt_secret,{
        expiresIn:"1d"
    })
}
const comparePassword=async(pass,input_pass)=>
{
     const matched=await bycrypt.compare(pass,input_pass)
     return matched

}
module.exports={hashFunction,createJwt,comparePassword}