import red from "../assets/backgrounds/Table_0.png";
import green from "../assets/backgrounds/Table_4.png";
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  currentTheme: "green",
  theme: {
    green: {
      backgroundImage: green,
    },
    red: {
      backgroundImage: red,
    },
  },
  setCurrentTheme: () => {},
});

export function ThemeProvider(props) {
  const { children } = props;
  const [currentTheme, setCurrentTheme] = useState("green");

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (!localTheme) {
      localStorage.setItem("theme", "green");
    } else if (localTheme === "green" || localTheme === "red") {
      setCurrentTheme(localTheme);
    }
  }, []);

  const changeTheme = () => {
    setCurrentTheme((current_theme) => {
      const newTheme = current_theme === "green" ? "red" : "green";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: currentTheme,
        theme: {
          green: {
            backgroundImage: green,
          },
          red: {
            backgroundImage: red,
          },
        },
        changeTheme: changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
