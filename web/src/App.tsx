import React, { useState, useEffect } from "react";
import { Routes } from "./Routes";
import { setAccessToken } from "./accessToken";

interface Props {}

export const App: React.FC<Props> = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/refresh_token", {
        method: "POST",
        credentials: "include" 
    }).then(async resp => {
        const { accessToken } = await resp.json();
        console.log(accessToken);
        setAccessToken(accessToken);
        setLoading(false);
    });
  }, []);

  if (loading) return <div>loading...</div>; // loading animation goes here

  return <Routes />;
};
