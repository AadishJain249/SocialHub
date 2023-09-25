const jwt=require('jsonwebtoken');

 const verifyToken = async(req, res, next) => {
    try {
        let token = req.header('Authorization')
        if(!token) {
            return res.status(403).send('Access Denied!');
        }

        if(token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.Jwt_secret);
        // console.log(verified);
        // console.log(verified.userId);
        req.body.user = {
            userId:verified.userId
        };
        next();
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}
module.exports={verifyToken}