import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Sun, Moon } from "lucide-react";

function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        document.documentElement.classList.contains("dark")
    })

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")
        if(savedTheme === "dark"){
            document.documentElement.classList.add("dark")
            setIsDark(true)
        }

    }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", newTheme)
    setIsDark(!isDark)
  };
  return (
    <Button
      onClick={toggleTheme}
      size="sm"
      variant="ghost"
      className="bg-background text-white transition-colors rounded-full"
    >
      {isDark ? (<Sun/>) : (<Moon/>)}
    </Button>
  );
}

export default ThemeToggle;
