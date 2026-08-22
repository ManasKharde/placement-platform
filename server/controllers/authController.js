const bcrypt = require("bcrypt");
const {findUserByUsernameOrEmail, createUser} = require("../models/userModel");

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
        if(isPasswordCorrect){
            return res.status(200).json({
                message: "Login successful"
            })
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = {signup, login};