import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import {inngest} from "../inngest/client.js"

export const signUp = async(req, res) => {
    const {email, password, skills = [] } = req.body

    try {
        const existingUser = await User.findOne({email})
        if(existingUser) return res.status(401).json({error: "User already exist!"})
        const hashedPsw = await bcrypt.hash(password, 10)
        const user = await User.create({email, password: hashedPsw, skills})

        //Fire Inngest event
        await inngest.send({
            name: "user/signup",
            data: {
                email,
            },
        })

        const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET)

        res.json({user, token})
    } catch (error) {
        console.error("Sign-up error:", error);
        res.status(500).json({error: "Signup failed", details: error.message})
    }
}

// export const signUp = async (req, res) => {
//     const { email, password, skills = [] } = req.body;

//     try {
//         console.log("Incoming signup data:", req.body);

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             console.log("User already exists");
//             return res.status(401).json({ error: "User already exists!" });
//         }

//         const hashedPsw = await bcrypt.hash(password, 10);
//         console.log("Password hashed successfully");

//         const user = await User.create({ email, password: hashedPsw, skills });
//         console.log("User created:", user);

//         // Try-catch around inngest
//         try {
//             await inngest.send({
//                 name: "user/signup",
//                 data: { email }
//             });
//             console.log("Inngest event sent");
//         } catch (e) {
//             console.error("Inngest error:", e);
//         }

//         const token = jwt.sign(
//             { _id: user._id, role: user.role },
//             process.env.JWT_SECRET
//         );
//         console.log("JWT created");

//         res.json({ user, token });

//     } catch (error) {
//         console.error("Sign-up error:", error);
//         res.status(500).json({ error: "Sign-up failed", msg: error.message });
//     }
// };


export const logIn = async(req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.findOne({email})
        if(!user) return res.status(401).json({error: "User not Found!"})
             
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(401).json({error: "Invalid credentials!"})

         const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET)

        res.json({user, token})
    } catch (error) {
        res.status(500).json({error: "Login failed", msg: error.message})
    }
}

export const logOut = async(req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        if(!token) return res.status(401).json({error: "Unathorized!"})
        
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                return res.status(401).json({err: "Unauthorized"})
            }
        })

        res.json({message: "Logout successfully"})
    } catch (error) {
        res.status(500).json({error: "Logout failed", msg: error.message})
    }
}

export const updateUser = async(req, res) => {
    const {skills = [], role, email} = req.body

    try {
        if(req.user?.role !== "admin"){
            return res.status(403).json({error: "Forbidden"})
        }
        const user = await User.findOne({email})
        if(!user) return res.status(401).json({error: "User not found"})

        await User.updateOne({email},{skills: skills.length ? skills : user.skills, role})

        return res.json({message: "User updated successfully"})
    } catch (error) {
        res.status(500).json({error: "Update failed", msg: error.message})
    }
}

export const getUsers = async(req, res) => {
    try {
        if(req.user?.role !== "admin"){
            return res.status(403).json({error: "Forbidden"})
        }

        const users = await User.find().select("-password")
        return res.json({users})
    } catch (error) {
        res.status(500).json({error: "Get users failed", msg: error.message})
    }
}