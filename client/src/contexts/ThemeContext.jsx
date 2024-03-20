import { createContext, useEffect, useState } from "react"

export const ThemeContext = createContext({
  currentTheme: "green",
  theme: {
    green: {
      backgroundColor: "bg-green-700",
      color: "text-white",
    },
    green: {
      backgroundColor: "bg-sky-500",
      color: "text-black",
    },
  },
  setCurrentTheme: () => { }
});

export function ThemeProvider(props) {
  const { children } = props
  const [currentTheme, setCurrentTheme] = useState("green")

  useEffect(() => {
    const localTheme = localStorage.getItem("theme")
    if (!localTheme) {
      localStorage.setItem("theme", "green")
    } else if (localTheme === "green" || localTheme === "sky") {
      setCurrentTheme(localTheme)
    }
  }, [])

  const changeTheme = () => {

    setCurrentTheme((current_theme) => {
      const newTheme = current_theme === "green" ? "sky" : "green";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    })
  }

  return (
    <ThemeContext.Provider value={{
      currentTheme: currentTheme,
      theme: {
        green: {
          backgroundColor: "bg-green-700",
          textColor: "text-black",
          buttonColor: "primary"
        },
        sky: {
          backgroundColor: "bg-sky-500",
          textColor: "text-white",
          buttonColor: "success"
        },
      },
      changeTheme: changeTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}