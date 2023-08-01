import Admin from "../Model/adminModel.js"
import bcrypt from "bcrypt"
import generateToken from "../Utils/generateToken.js"
import randomstring from "randomstring"


// Register
const register = async(req, res) => {
    try {
        const {name, email, password} = req.body
        const adminExist = await Admin.findOne({email: email})
        if (adminExist) {
            res.status(400).json({status: false, message: "Admin already exist"})
        } else {
            const newAmin = await new Admin({
                name,
                email,
                password: bcrypt.hashSync(password, 10),
                 
            })

            const saveAdmin = await newAmin.save()
            if (saveAdmin) {
                res.json({status: true, message: "Admin Registered Successfully", saveAdmin})
            } else {
                res.status(400).json({status: false, message: "Unable to save admin"})
            }
        }
    } catch (error) {
        throw new Error(error)
    }
}

// login
const login = async(req, res) => {
    try {
        const {email, password} = req.body
        const adminExist = await Admin.findOne({email: email})
        // console.log(adminExist)
        if (adminExist) {
            const confirmPassword = bcrypt.compareSync(password, adminExist.password)
            // console.log(confirmPassword)
            if (confirmPassword) {
                generateToken(res, adminExist._id)
                res.json({status: true, message: "Login Successful", adminExist})
            } else {
                res.status(400).json({status: false, message: "Invalid email or password"})
            }
        } else {
            res.status(400).json({status: false, message: "Admin not found"})
        }
    } catch (error) {
        throw new Error(error) 
    }
}

// logout
const logout = async(req, res) => {
    try {
        
    } catch (error) {
        throw new Error(error)
    }
}

export {register, login, logout}