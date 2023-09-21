const mongoose =require('mongoose')
const url=process.env.url
mongoose.set("strictQuery", false);
mongoose.connect(url).then(function(result){
    console.log("connected");
})
.catch((err)=>
{
    console.log(err);
})
