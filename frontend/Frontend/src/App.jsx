import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import TradeForm from "./TradeTracking/TradeForm";
import AllTradeData from "./TradeTracking/AllTradeData";
import LiveTrades from "./TradeTracking/LiveTrades";
import "./App.css"; // Global styles

function App() {
  const location = useLocation();

  useEffect(() => {
    const routeToFavicon = {
      "/": "/icons/home.svg",
      "/traderegister": "/icons/globe.svg",
      "/all": "/icons/globe.svg",
      "/today": "/icons/globe.svg",
    };
    const favicon = routeToFavicon[location.pathname] || "/icons/default-favicon.svg";
    const setFavicon = (iconPath) => {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = iconPath;
    };
    setFavicon(favicon);
  }, [location]);

  return (
    <Routes>
      <Route
        path="/"
        element={<h1 style={{ color: "black" }}>Welcome to the Homepage!</h1>}
      />
      <Route path="/traderegister" element={<TradeForm />} />
      <Route path="/all" element={<AllTradeData />} />
      <Route path="/today" element={<LiveTrades />} />
    </Routes>
  );
}

export default App;
