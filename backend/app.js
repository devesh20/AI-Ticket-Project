import express from "express"
import cors from "cors"
import userRoutes from "./routes/user.routes.js"
import ticketRoutes from "./routes/ticket.routes.js"
import { serve } from "inngest/express"
import {inngest} from "./inngest/client.js"
import {onUserSignup} from "./inngest/functions/on-signup.js"
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/auth", userRoutes)
app.use("/api/tickets", ticketRoutes)

app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions: [onUserSignup, onTicketCreated]
    })
)

export { app }