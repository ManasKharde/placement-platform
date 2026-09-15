const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const preparationRoutes = require("./routes/preparationRoutes");
const progressRoutes = require("./routes/progress"); 
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./config/passport");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api", preparationRoutes)
app.use("/api", progressRoutes);

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            message: "Server and database are connected",
            time: result.rows[0].now
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Database connection failed"
        })
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`System is running on ${PORT}`);
});