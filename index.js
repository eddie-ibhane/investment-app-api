import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './Config/db.js'
import adminRoute from './Route/adminRoute.js'
import userRoute from './Route/userRoute.js'
import planRoute from './Route/planRoute.js'
import investmentRoute from './Route/investmentRoute.js'

const app = express()
dotenv.config()
connectDB()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/users', userRoute)
app.use('/api/2023/admins', adminRoute)
app.use('/api/plans', planRoute)
app.use('/api/investments', investmentRoute)

const PORT = process.env.PORT
app.listen(PORT, console.log(`Server running on port ${PORT}`))