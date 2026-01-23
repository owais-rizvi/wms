import express from "express"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.route.js"

import { connectDb } from "./lib/db.js"

dotenv.config({ path: './src/.env' })
const app = express()
const PORT = process.env.PORT

console.log(PORT)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
    connectDb()
})