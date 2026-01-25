import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route.js"
import weddingRoutes from "./routes/wedding.route.js"
import guestRoutes from "./routes/guest.route.js"
import eventRoutes from "./routes/event.route.js"
import vendorRoutes from "./routes/vendor.route.js"
import expenseRoutes from "./routes/expense.route.js"

import { connectDb } from "./lib/db.js"

dotenv.config({ path: './src/.env' })
const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/weddings', weddingRoutes)
app.use('/api/weddings', guestRoutes)
app.use('/api/weddings', eventRoutes)
app.use('/api/weddings', vendorRoutes)
app.use('/api/weddings', expenseRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
    connectDb()
})