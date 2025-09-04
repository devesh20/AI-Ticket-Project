import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Search } from "lucide-react";


function Admin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({ role: "", skills: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (error) {
      console.error("Error fetching users", error.message);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.email);
    setForm({
      role: user.role,
      skills: user.skills.join(", "),
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.post(
        "/api/auth/update-user",
        {
          email: editingUser,
          role: form.role,
          skills: form.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingUser(null);
      setForm({ role: "", skills: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user", error.message);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Admin Panel | Manage Users</h1>
      <div className="relative">
        <Search className="absolute top-1/2 left-2 -translate-y-1/2 h-4 w-4"/>
        <Input
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearch}
        className={"rounded-none pl-8"}
      />
      </div>
      {filteredUsers.map((user) => (
        <Card key={user._id} className={"my-4 rounded-none dark:border-white border-black border-2"}>
          <CardContent>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Current Role:</strong> {user.role}
            </p>
            <p>
              <strong>Skills:</strong>{" "}
              {user.skills && user.skills.length > 0
                ? user.skills.join(", ")
                : "N/A"}
            </p>
            {editingUser === user.email ? (
              <div className="mt-4 space-y-3">
                {/* Role Select */}
                <Select
                  value={form.role}
                  onValueChange={(value) =>
                    setForm({ ...form, role: value })
                  }
                >
                  <SelectTrigger className="w-full rounded-none">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="text"
                  placeholder="Comma-separated skills"
                  className="w-full rounded-none"
                  value={form.skills}
                  onChange={(e) =>
                    setForm({ ...form, skills: e.target.value })
                  }
                />

                <div className="flex gap-2">
                  <Button className={"rounded-none"} size="sm" onClick={handleUpdate}>
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={"rounded-none"}
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="mt-2 rounded-none"
                size="sm"
                variant="outline"
                onClick={() => handleEditClick(user)}
              >
                Edit
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Admin;
