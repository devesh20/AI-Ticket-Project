import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router-dom";

function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchTicketDetails = async () => {
    try {
      const { data } = await axios.get(`/api/tickets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTicket(data.ticket);
    } catch (error) {
      console.error("Error fetching ticket details", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  if (loading)
    return <div className="text-center mt-10">Loading ticket details...</div>;

  if (!ticket) return <div className="text-center mt-10">Ticket not found</div>;
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Ticket Details</h2>
      <Card className={"border-black border-2 rounded-none"}>
        <CardHeader>
          <CardTitle>{ticket.title}</CardTitle>
        </CardHeader>
        <CardContent className={"space-y-2"}>
          <p>{ticket.description}</p>
          {ticket.status && (
            <>
              <Separator className={"mb-6"}>Metadata</Separator>
              <p>
                <strong>Status:</strong>{" "}
                {ticket.status}
              </p>
              {ticket.priority && (
                <p>
                  <strong>Priority:</strong>{" "}
                  {ticket.priority}
                </p>
              )}
              {ticket.relatedSkills && ticket.relatedSkills.length > 0 && (
                <p>
                  <strong>Related Skills:</strong>{" "}
                  {ticket.relatedSkills.join(", ")}
                </p>
              )}
              {ticket.helpfulNotes && (
                <div>
                  <strong>Helpful Notes:</strong>
                  <div className="max-w-none mt-2">
                    <Markdown>{ticket.helpfulNotes}</Markdown>
                  </div>
                </div>
              )}
              {ticket.assignedTo && (
                <p>
                  <strong>Assign To:</strong> {ticket.assignedTo?.email}
                </p>
              )}
              {ticket.createdAt && (
                <Badge variant={"secondary"} className={"p-2"}>
                  Created At: {new Date(ticket.createdAt).toLocaleString()}
                </Badge>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TicketDetailsPage;
