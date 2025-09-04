import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    try {
      const { data } = await axios.get("/api/tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTickets(data.tickets);
    } catch (error) {
      console.error("Error fetching tickets", error.message);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/tickets", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 201) {
        setForm({ title: "", description: "" });
        fetchTickets();
      } else {
        console.log(res.data.message || "Failed creating ticket");
      }
    } catch (error) {
      console.error("Error creating ticket", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className={"border-black  dark:border-white border-2 rounded-none"}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4">
            Create Ticket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3 mb-8">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2 w-full">
                <Label htmlFor="title">Ticket Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Ticket Title"
                  className="rounded-none"
                  required
                />
              </div>
              <div className="grid gap-2 w-full">
                <Label htmlFor="description">Ticket Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  placeholder="Ticket Description"
                  onChange={handleChange}
                  className={"rounded-none"}
                  required
                />
              </div>
              <div className="grid gap-2 w-full">
                <Button
                  type="submit"
                  disabled={loading}
                  className={"rounded-none"}
                >
                  {loading ? "Submitting..." : "Submit Ticket"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="space-y-3 border-black dark:border-white border-2 p-4">
        <h2 className="text-xl font-semibold mb-2">All Tickets</h2>
        <div className="grid gap-4">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <Link key={ticket._id} to={`/tickets/${ticket._id}`}>
                <Card className={"rounded-none hover:shadow-lg transition-shadow"}>
                  <CardHeader>
                    <CardTitle>{ticket.title}</CardTitle>
                  </CardHeader>
                  <CardContent>{ticket.description}</CardContent>
                  <CardFooter>
                    <Badge variant={"secondary"} className={"p-2 rounded-none"}>
                      Created At: {new Date(ticket.createdAt).toLocaleString()}
                    </Badge>
                  </CardFooter>
                </Card>
              </Link>
            ))
          ) : (
            <Card className={"rounded-none"}>
              <CardContent>
                <p className="text-center text-gray-500">
                  No tickets available
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tickets;
