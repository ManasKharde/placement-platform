const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
        const existingUser = (await findUserByUsernameOrEmail(username)) || (await findUserByUsernameOrEmail(email));

        if(existingUser) {
            return res.status(409).json({
                message:"User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser(
            username, email, hashedPassword, "local"
        );

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await pool.query("UPDATE users SET refresh_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [refreshToken, user.id]);

        res.cookie("accesstoken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15*60*1000 
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7*24*60*60*1000 
        });

        return res.status(200).json({
            message: "User created successfully",
            user: { id: user.id, username: user.username, email: user.email }
        });
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
        const {identifier, email, username, password} = req.body;
        const loginId = identifier || email || username;

        if(!loginId || !password){
            return res.status(400).json({
                message: "Provide valid username or email and password"
            });
        }

        const user = await findUserByUsernameOrEmail(loginId);
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

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await pool.query("UPDATE users SET refresh_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [refreshToken, user.id]);

        res.cookie("accesstoken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15*60*1000 
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7*24*60*60*1000 
        })

        res.status(200).json({
            message: "Login Successful",
            user: { id: user.id, username: user.username, email: user.email }
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
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({
                message: "Refersh Token not found"
            })
        }

        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userResult = await pool.query(
            `SELECT * FROM users WHERE id = $1 AND refresh_token = $2`, [payload.id, refreshToken]
        )

        if(userResult.rows.length === 0){
            return res.status(403).json({
                message: "Invalid or revoked refresh token"
            })
        }

        const newAccessToken = generateAccessToken({ id: payload.id });

        res.cookie("accesstoken", newAccessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000*60*15
        })

        return res.status(200).json({
            message: "Access Token successfully refreshed"
        })
    }
    catch(error){
        console.error("Refresh Error:", error.message);
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
}

const logout = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;

        if(refreshToken){
            const payload = jwt.decode(refreshToken);
            if(payload && payload.id){
                await pool.query(`UPDATE users SET refresh_token = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [payload.id])
            }
        }

        res.clearCookie("accesstoken");
        res.clearCookie("refreshToken", { path: "/" });

        res.status(200).json({
            message: "Logout successful"
        });
    }catch(error){
        console.error("Logout Error", error.message);
        res.status(500).json({
            message:"Internal Server Error"
        });
    }
}

const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    // 1. Generate lightweight, clean JWTs
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 2. Save refresh token to Postgres using user.id
    await pool.query(
      `UPDATE users SET refresh_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [refreshToken, user.id]
    );

    console.log(`Updated refresh token for user ID: ${user.id}`);

    // 3. Set Access Token Cookie ("sameSite: lax" permits cross-site redirects)
    res.cookie("accesstoken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // 4. Set Refresh Token Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 5. Redirect browser back to Vite React app
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${FRONTEND_URL}/dashboard`);

  } catch (error) {
    console.error("Google Callback Error:", error);
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
};

const getCurrentUser = async (req, res) => {
    try {
        const token = req.cookies.accesstoken;

        if (!token) {
        return res.status(401).json({ message: "Unauthenticated: No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Query user without password_hash or refresh_token
        const userResult = await pool.query(
        `SELECT id, username, email, created_at FROM users WHERE id = $1`,
        [decoded.id]
        );

        if (userResult.rows.length === 0) {
        return res.status(401).json({ message: "User not found" });
        }

        return res.status(200).json({ user: userResult.rows[0] });

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = {signup, login, refresh, logout, googleCallback, getCurrentUser};