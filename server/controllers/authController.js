const bcrypt = require("bcrypt");
const {findUserByUsernameOrEmail, createUser} = require("../models/userModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenGenerator");
const pool = require("../config/db");

const signup = async (req, res) => {
    try{
        const {username, email, password} = req.body;

        //Checking if username, email and password fields are empty
        if(!username || !email || !password){
            return res.status(400).json({
                message:"Username, email and password are necessary"
            });
        }

        //Checking if user already exists
        const existingUser = await findUserByUsernameOrEmail(username, email);

        if(existingUser) {
            return res.status(409).json({
                message:"User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser(
            username, email, hashedPassword, "local"
        )

        return res.status(200).json({
            message: "User created successfully",
            user
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const login = async (req, res) => {
    try{
        const {identifier, password} = req.body;
        if(!identifier || !password){
            return res.status(400).json({
                message: "Provide valid username and email"
            });
        }

        const user = await findUserByUsernameOrEmail(identifier);
        if(!user){
            return res.status(401).json({
                message:"User not found"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "Invalid id or password"
            })
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await pool.query("UPDATE users SET refersh_token = $1 WHERE id = $2", [refreshToken, user.id]);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: "15*60*1000" 
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "api/auth/refresh",
            maxAge: "7*24*60*60*1000" 
        })

        res.status(200).json({
            message: "Login Successful",
            user: { id: user.id, username: user.username }
        })

    }catch(error){
        console.error("Login error", error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const refresh = async(req, res) =>{
    try{
        const refresh_token = req.cookies.refreshToken;
        if(!refresh_token){
            return res.status(401).json({
                message: "Refresh Token Missing"
            });
        }
        const payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        const userResult = await pool.query(
            "SELECT * FROM users WHERE id = $1 AND refresh_token = $2", [payload.id, refreshToken]
        );

        if (userResult.rows.length === 0) {
      return res.status(403).json({ error: "Invalid or revoked refresh token" });
    }

    const newAccessToken = generateAccessToken(payload.id);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });

    res.status(200).json({ message: "Access token refreshed successfully" });
    }catch(error){
        console.error("Refresh Error:", error.message);
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
}

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
        // Decode user ID to clear DB record (ignore verification errors if already expired)
        const payload = jwt.decode(refreshToken);
        if (payload && payload.id) {
            await pool.query("UPDATE users SET refresh_token = NULL WHERE id = $1", [payload.id]);
        }
        }

        // Clear both cookies in browser
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken", { path: "/api/auth/refresh" });

        res.status(200).json({ message: "Logged out successfully" });
    } 
    catch (err) {
    res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {signup, login, refresh, logout};