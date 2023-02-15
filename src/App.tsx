import React, { useState, useEffect } from "react";
import { useCookies, CookiesProvider } from "react-cookie";
import MyRouter from "routers/index";

import 'swiper/css';

function App() {
  const [currentTheme, setCurrentTheme] = useState({
    backgroundColor: '#13131d',
    backgroundImage: '',
    blurMode: false,
  });

  const [cookies, setCookie] = useCookies(["updateThemeFlag"]);

  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem("website-theme"));
    console.log("MyApp useEffect log - 1 : ", theme);
    //      setCookie("updateThemeFlag", theme);
    if (theme && theme !== currentTheme) {
      setCurrentTheme(theme);
    }
  }, []);

  useEffect(() => {
    console.log("Cookies", cookies);
    if (cookies.updateThemeFlag != undefined) {
      const theme = JSON.parse(localStorage.getItem("website-theme"));
      console.log("MyApp useEffect log - 1 : ", theme);
      //      setCookie("updateThemeFlag", theme);
      if (theme && theme !== currentTheme) {
        setCurrentTheme(theme);
      }
    }
  }, [cookies]);

  return (
    <div className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
      <div
        style={{
          backgroundColor: currentTheme.backgroundColor,
          backgroundImage: `url("${currentTheme.backgroundImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "calc(100vw + 30px)",
          height: "calc(100vh + 30px)",
          top: "-15px",
          left: '-15px',
          position: "fixed",
          filter: `blur(${currentTheme.blurMode ? "7px" : "0px"})`,
        }}
      />
      <MyRouter />
    </div>
  );
}

export default App;
