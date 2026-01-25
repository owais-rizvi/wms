import User from "../models/user.model.js";
import {generateToken} from "../lib/generateToken.js"
import userModel from "../models/user.model.js";

export async function signupController(req, res) {
    const {name, email, password} = req.body
    try {
        if (!name || !email || !password) {
            return res.status(400).json({message: "Fill all the fields."})
        }
        if (password.length < 6) {
            return res.status(400).json({message: "Password length should be atleast 6 characters."})
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }
        
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({message: "Email already exists. Signup with a different email or login."})
        }
        const newUser = await User.create({
            name,
            email,
            password
        })
        const token = generateToken(newUser._id)
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(201).json({success: true, token, user: {id: newUser._id, name: newUser.name, email: newUser.email}})
    }
    catch(error) {
        console.log("Error while signup in server: ", error)
        return res.status(500).json({message: "Server error during signup."})
    }
}

export async function loginController(req, res) {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({message: "All fields are required."})
        }

        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({message: "Invalid email or password"})
        }
        const isPasswordMatch = await user.matchPassword(password)
        if (!isPasswordMatch) {
            return res.status(401).json({message: "Invalid email or password"})
        }
        const token = generateToken(user._id)
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({success: true, token, user: {id: user._id, name: user.name, email: user.email}})
    }
    catch (error) {
        console.log("Error during login on the server.", error)
        res.status(500).json({message: "Internal server error during login"})
    }
}

export async function logoutController (req, res) {
    try {
        res.clearCookie("jwt")
        res.status(200).json({success: true, message: "Successful log out"})
    }
    catch (error) {
        console.log("Error while logout", error)
        res.status(500).json({message: "Server error while logout"})
    }
}

export async function getMe(req, res) {
  const user = await userModel.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
}
