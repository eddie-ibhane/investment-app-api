import User from "../Model/userModel.js"
import bcrypt from "bcrypt"
import randomstring from "randomstring"
import generateToken from "../Utils/generateToken.js"


// Register
const register = async(req, res) => {
    try {
        const {name, email, password, mobile, address} = req.body
        const userExist = await User.findOne({email: email})
        if (userExist) {
            res.status(400).json({status: false, message: "User already exist"})
        } else {
            const newUser = await new User({
                name,
                email,
                password: bcrypt.hashSync(password, 10),
                mobile, 
                address,
                refCode: randomstring.generate({
                    length: 6,
                    charset: 'alphanumeric'
                })
            })

            const saveUser = await newUser.save()
            if (saveUser) {
                res.json({status: true, message: "User Registered Successfully", saveUser})
            } else {
                res.status(400).json({status: false, message: "Unable to save user"})
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
        const userExist = await User.findOne({email: email})
        console.log(userExist.email)
        if (userExist) {
            const confirmPassword = bcrypt.compareSync(password, userExist.password)
            if (confirmPassword) {
                generateToken(res, userExist._id)
                res.json({status: true, message: "Login Successful", userExist})
            } else {
                res.status(400).json({status: false, message: "Invalid email or password"})
            }
        } else {
            res.status(499).json({status: false, message: "User not found"})
        }
    } catch (error) {
        throw new Error(error)
    }
}

// logout
const logout = async(req, res) => {
    try {
        res.cookie('jwt_token', '', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: new Date(0)
        })
        res.json({status: true, message: "User Logged out"})
    } catch (error) {
        throw new Error(error)
    }
}

export {register, login, logout}