const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.cookies?.accesstoken;

    if(!token){
        return res.status(401).json({
            message:"Token not found"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded;
        next();
    }
    catch(error){
        console.log("Auth Middleware Error", error);
        return res.status(403).json({
            message:"Invalid or expired Token"
        })
    }
}

module.exports = {authenticateToken};