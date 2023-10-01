// const errorMiddleware = (err, req, res, next) => {
//   console.log("aadish is good");
//   const defaultError = {
//     statusCode: 404,
//     success: "failed",
//     message: err,
//   };
//   if (err?.name === "ValidationError") {
//     console.log("aadish");
//     defaultError.statusCode=404
//     defaultError.message=Object.values(err,errors).map((el)=>el.message).join(",")
//   }
//   if(err.code && err.code===11000)
//   {
//     console.log("aadishjain");
//     defaultError.statusCode=404
//     defaultError.message=`${Object.values(err.keyValue)} Field has to be unique`
//   }
//   res.status(defaultError.statusCode).json({
//     success:defaultError.success,
//     message:defaultError.message
//   })
// };
// module.exports={errorMiddleware}