import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { Separator } from "../ui/separator";

function NavBar() {
  const token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  if (user) {
    user = JSON.parse(user);
  }
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="bg-black text-white px-6 py-3 flex items-center justify-between  dark:border-white border-b-2">
      <div className="flex-1">
        <Link to={"/"} className="text-xl font-bold">
          Ticket AI
        </Link>
      </div>
      <div className="flex gap-4">
        {!token ? (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <p>Hi, {user?.email}</p>
            {user && user?.role === "admin" ? (
              <>
                <Link to="/admin" className="">
                  Admin
                </Link>
                <Button
                  onClick={logout}
                  variant={"destructive"}
                  size={"sm"}
                  className={"rounded-none py-2"}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={logout}
                variant={"destructive"}
                size={"sm"}
                className={"rounded-none py-2"}
              >
                Logout
              </Button>
            )}
            <ThemeToggle />
          </>
        )}
      </div>
    </div>
  );
}

export default NavBar;
