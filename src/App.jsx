import { useState } from "react";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState(null);

  
  const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

  const getWeather = async () => {
    const trimmed = city.trim();
    setData(null);

    if (!trimmed) return setStatus("Please enter a city name.");
    if (!API_KEY) return setStatus("API key missing. Fix .env and restart server.");

    setStatus("Fetching weather...");

    try {
      const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmed)}` +
        `&appid=${API_KEY}&units=metric`;

      const res = await fetch(url);

      if (!res.ok) {
        if (res.status === 404) throw new Error("City not found.");
        if (res.status === 401) throw new Error("Invalid API key.");
        throw new Error("Request failed.");
      }

      const json = await res.json();

      setData({
        name: json.name,
        temp: Math.round(json.main.temp),
        condition: json.weather?.[0]?.description || "N/A",
      });

      setStatus("");
    } catch (e) {
      setStatus(e.message);
    }
  };

  return (
    <div className="page">
      <div className="app">
        <h1>Weather App</h1>

        <div className="controls">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            onKeyDown={(e) => e.key === "Enter" && getWeather()}
          />
          <button onClick={getWeather}>Get Weather</button>
        </div>

        {status && <p className="status">{status}</p>}

        {data && (
          <div className="result">
            <h2>{data.name}</h2>
            <p>
              <b>Temperature:</b> {data.temp} °C
            </p>
            <p>
              <b>Condition:</b> {data.condition}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
