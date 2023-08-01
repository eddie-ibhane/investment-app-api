import jwt from 'jsonwebtoken'
import User from '../Model/userModel.js'
import Admin from '../Model/adminModel.js'

const protect = async(req, res, next) => {
  let token
  token = req.cookies.jwt_token

  if(token){
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      req.admin = await Admin.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      res.status(401).json({status: false, message: 'Not Authorized, invalid or expired token', error})
    }
  }else{
    res.status(401).json({status: false, message: 'Not Authorized, No token'})
  }
}

const user = async(req, res, next) => {
  try {
    if(req.user){
      next()
    }else{
      res.status(400).json({status: false, message: "Not authorized as a user"})
    }
  } catch (error) {
    throw new Error(error)
  }
}

const admin = async(req, res, next) => {
  try {
    if(req.admin){
      next()
    }else{
      res.status(400).json({status: false, message: "Not authorized as an admin"})
    }
  } catch (error) {
    throw new Error(error)
  }
}

export {protect, user, admin}