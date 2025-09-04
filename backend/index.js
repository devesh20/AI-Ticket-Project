import dotenv from "dotenv"
import mongoose from "mongoose"

import { app } from "./app.js";

const port = process.env.PORT

dotenv.config();


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully")
        app.listen(port || 3000, () => console.log("Server started at http://localhost:3000"))
    })
    .catch((err) => console.error("MongoDB error", err))