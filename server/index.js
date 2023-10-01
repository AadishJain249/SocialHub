const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();
// const {errorMiddleware}=require('./middleware/errorMiddleware')
const path = require("path");
// console.log(errorMiddleware);
// app.use(errorMiddleware)
// const { expressCspHeader, INLINE, NONCE } = require('express-csp-header');
// app.use(expressCspHeader({
//     directives: {
//         'script-src': [INLINE,'somehost.com'],
//         'style-src': [ 'mystyles.net'],
//         'img-src': ['data:', 'images.com'],
//         'worker-src': [NONCE],
//         'block-all-mixed-content': true
//     }
// }));
// app.use(expressCspHeader({
//   directives: {
//       'script-src': [NONCE]
//   }
// }));
const __dirnames = path.resolve(path.dirname(""));
require("./database/mongodb");
const Userrouter = require("./routers/auth");
app.use(express.static("views/build"));
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(Userrouter);
app.get("/", (req, res) => {
});

app.listen(process.env.port);
