import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"

import { connectDb } from "./lib/db.js"

dotenv.config({ path: './src/.env' })
const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
    connectDb()
})