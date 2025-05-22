import type { Express } from "express";
import { createServer, type Server } from "http";
import { WeatherQuerySchema, CurrentWeatherSchema, ForecastSchema } from "@shared/schema";

const API_KEY = process.env.OPENWEATHER_API_KEY || '87f51b3aa701fba5a4ff12e4e5d4df89';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get current weather
  app.get("/api/weather/current", async (req, res) => {
    try {
      const query = WeatherQuerySchema.parse(req.query);
      
      let url = `${API_BASE_URL}/weather?appid=${API_KEY}&units=${query.units}`;
      
      if (query.lat && query.lon) {
        url += `&lat=${query.lat}&lon=${query.lon}`;
      } else if (query.q) {
        url += `&q=${encodeURIComponent(query.q)}`;
      } else {
        return res.status(400).json({ error: "Either coordinates (lat, lon) or city name (q) is required" });
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "City not found" });
        }
        throw new Error(`OpenWeather API error: ${response.status}`);
      }

      const data = await response.json();
      const validatedData = CurrentWeatherSchema.parse(data);
      
      res.json(validatedData);
    } catch (error) {
      console.error('Weather API error:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to fetch weather data" });
      }
    }
  });

  // Get 5-day forecast (which contains 7 days of data in 3-hour intervals)
  app.get("/api/weather/forecast", async (req, res) => {
    try {
      const query = WeatherQuerySchema.parse(req.query);
      
      let url = `${API_BASE_URL}/forecast?appid=${API_KEY}&units=${query.units}`;
      
      if (query.lat && query.lon) {
        url += `&lat=${query.lat}&lon=${query.lon}`;
      } else if (query.q) {
        url += `&q=${encodeURIComponent(query.q)}`;
      } else {
        return res.status(400).json({ error: "Either coordinates (lat, lon) or city name (q) is required" });
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "City not found" });
        }
        throw new Error(`OpenWeather API error: ${response.status}`);
      }

      const data = await response.json();
      const validatedData = ForecastSchema.parse(data);
      
      // Process the forecast data to create daily summaries
      const dailyForecasts = processForecastData(validatedData);
      
      res.json({
        ...validatedData,
        dailyForecasts
      });
    } catch (error) {
      console.error('Forecast API error:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to fetch forecast data" });
      }
    }
  });

  // Get air quality data
  app.get("/api/weather/air-quality", async (req, res) => {
    try {
      const query = WeatherQuerySchema.parse(req.query);
      
      if (!query.lat || !query.lon) {
        return res.status(400).json({ error: "Coordinates (lat, lon) are required for air quality data" });
      }

      const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${query.lat}&lon=${query.lon}&appid=${API_KEY}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Air Quality API error: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Air Quality API error:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to fetch air quality data" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function processForecastData(forecast: any) {
  const dailyForecasts: any = {};
  
  forecast.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toDateString();
    
    if (!dailyForecasts[dateKey]) {
      dailyForecasts[dateKey] = {
        date: dateKey,
        dayName: getDayName(date),
        temps: [],
        conditions: [],
        humidity: [],
        clouds: [],
        pop: []
      };
    }
    
    dailyForecasts[dateKey].temps.push(item.main.temp);
    dailyForecasts[dateKey].conditions.push(item.weather[0]);
    dailyForecasts[dateKey].humidity.push(item.main.humidity);
    dailyForecasts[dateKey].clouds.push(item.clouds.all);
    dailyForecasts[dateKey].pop.push(item.pop * 100);
  });

  return Object.values(dailyForecasts)
    .slice(0, 7)
    .map((day: any, index: number) => ({
      date: day.date,
      dayName: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : day.dayName,
      tempHigh: Math.round(Math.max(...day.temps)),
      tempLow: Math.round(Math.min(...day.temps)),
      condition: day.conditions[0],
      humidity: Math.round(day.humidity.reduce((a: number, b: number) => a + b) / day.humidity.length),
      clouds: Math.round(day.clouds.reduce((a: number, b: number) => a + b) / day.clouds.length),
      pop: Math.round(day.pop.reduce((a: number, b: number) => a + b) / day.pop.length)
    }));
}

function getDayName(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
}
