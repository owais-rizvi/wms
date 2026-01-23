import User from "../models/user.model.js";

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
        res.status(201).json({success: "User created successfully: ", newUser})
    }
    catch(error) {
        console.log("Error while signup in server: ", error)
        return res.status(500).json({message: "Server error during signup."})
    }
}