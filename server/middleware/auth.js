const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    let token = req.cookies?.accesstoken || req.cookies?.accessToken;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            message: "Token not found"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired Token",
            expired: error.name === "TokenExpiredError"
        });
    }
};

module.exports = { authenticateToken };