const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cors=require('cors') 
const morgan=require('morgan')
const helmet=require('helmet')
require('dotenv').config();
const mongoose=require('./database/mongodb')
const Userrouter  = require('./routers/auth')
app.use(helmet())
app.use(cors())
// app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.json({limit:"10mb"}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(morgan("dev"))
app.use(Userrouter)
app.get('/',(req,res)=>{
    res.send("hello")
})
app.listen(3000)