import { z } from "zod";

// Weather data schemas based on OpenWeather API structure
export const WeatherConditionSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const MainWeatherSchema = z.object({
  temp: z.number(),
  feels_like: z.number(),
  temp_min: z.number(),
  temp_max: z.number(),
  pressure: z.number(),
  humidity: z.number(),
  sea_level: z.number().optional(),
  grnd_level: z.number().optional(),
});

export const WindSchema = z.object({
  speed: z.number(),
  deg: z.number(),
  gust: z.number().optional(),
});

export const CloudsSchema = z.object({
  all: z.number(),
});

export const SysSchema = z.object({
  type: z.number().optional(),
  id: z.number().optional(),
  country: z.string(),
  sunrise: z.number(),
  sunset: z.number(),
});

export const CoordSchema = z.object({
  lon: z.number(),
  lat: z.number(),
});

export const CurrentWeatherSchema = z.object({
  coord: CoordSchema,
  weather: z.array(WeatherConditionSchema),
  base: z.string(),
  main: MainWeatherSchema,
  visibility: z.number(),
  wind: WindSchema,
  clouds: CloudsSchema,
  dt: z.number(),
  sys: SysSchema,
  timezone: z.number(),
  id: z.number(),
  name: z.string(),
  cod: z.number(),
});

export const ForecastItemSchema = z.object({
  dt: z.number(),
  main: MainWeatherSchema,
  weather: z.array(WeatherConditionSchema),
  clouds: CloudsSchema,
  wind: WindSchema,
  visibility: z.number(),
  pop: z.number(),
  sys: z.object({
    pod: z.string(),
  }),
  dt_txt: z.string(),
});

export const ForecastSchema = z.object({
  cod: z.string(),
  message: z.number(),
  cnt: z.number(),
  list: z.array(ForecastItemSchema),
  city: z.object({
    id: z.number(),
    name: z.string(),
    coord: CoordSchema,
    country: z.string(),
    population: z.number(),
    timezone: z.number(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
});

export const WeatherQuerySchema = z.object({
  lat: z.string().optional(),
  lon: z.string().optional(),
  q: z.string().optional(),
  units: z.enum(['imperial', 'metric']).default('imperial'),
});

// Processed forecast data for frontend consumption
export const DailyForecastSchema = z.object({
  date: z.string(),
  dayName: z.string(),
  tempHigh: z.number(),
  tempLow: z.number(),
  condition: WeatherConditionSchema,
  humidity: z.number(),
  clouds: z.number(),
  pop: z.number(),
});

export type WeatherCondition = z.infer<typeof WeatherConditionSchema>;
export type CurrentWeather = z.infer<typeof CurrentWeatherSchema>;
export type Forecast = z.infer<typeof ForecastSchema>;
export type ForecastItem = z.infer<typeof ForecastItemSchema>;
export type WeatherQuery = z.infer<typeof WeatherQuerySchema>;
export type DailyForecast = z.infer<typeof DailyForecastSchema>;
