import { inngest } from "../client.js";
import Ticket from "../../models/ticket.model.js"
import User from "../../models/user.model.js"
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/ai-ticket.js"

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({event, step}) => {
    const {ticketId} = event.data
    try {
        //fetch ticket fro data base
        const ticket = await step.run("fetch-ticket", async () => {
            const ticketObject = await Ticket.findById(ticketId)
            if(!ticketObject){
                throw new NonRetriableError("Ticket not found!")
            }
            return ticketObject
        })

        //update ticket status
        await step.run("update-ticket-status", async() => {
            await Ticket.findByIdAndUpdate(ticket._id, {status: "TODO"})
        })

        const aiResponse = await analyzeTicket(ticket)

        const relatedSkills = await step.run("ai-proccessing", async() =>{
            let skills = []
            if(aiResponse){
                await Ticket.findByIdAndUpdate(ticket._id, {
                    priority: ["low", "medium", "high"].includes(String(aiResponse.priority || "").toLowerCase()) ? String(aiResponse.priority).toLowerCase() : "medium",
                    helpfulNotes: aiResponse.helpfulNotes,
                    relatedSkills: aiResponse.relatedSkills,
                })
                skills = Array.isArray(aiResponse.relatedSkills) ? aiResponse.relatedSkills : []
            }
            return skills
        })

        const moderator = await step.run("assign-moderator", async () => {
            let user = null
            if (Array.isArray(relatedSkills) && relatedSkills.length > 0) {
                user = await User.findOne({
                    role: "moderator", 
                    skills: {
                        $elemMatch: {
                            $regex: relatedSkills.join("|"),
                            $options: "i"
                        }
                    }
                })
            }
            if(!user){
                user = await User.findOne({ role: "admin" })
            }
            await Ticket.findByIdAndUpdate(ticket._id, {
                assignedTo: user?._id || null
            })
            return user
        })

        await step.run("send-email-notification", async() => {
            if(moderator){
                const finalTicket = await Ticket.findById(ticket._id)
                await sendMail(
                    moderator.email,
                    `Ticket Assigned: ${finalTicket.title}`,
                    `A new ticket is assigned to you. \n"${finalTicket.title}"
                    \n\n${finalTicket.description}`
                )
            }
        })

        return {success: true}
    } catch (error) {
        console.error("Error running step", error?.message)
        return {success: false}
    }

  }
);
