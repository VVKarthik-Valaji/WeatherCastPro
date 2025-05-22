import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CurrentWeather } from "@/components/weather/CurrentWeather";
import { WeatherDetails } from "@/components/weather/WeatherDetails";
import { ForecastCard } from "@/components/weather/ForecastCard";
import { TemperatureChart } from "@/components/weather/TemperatureChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Search, MapPin, AlertCircle } from "lucide-react";
import type { CurrentWeather as CurrentWeatherType, Forecast } from "@shared/schema";

type Units = 'imperial' | 'metric';

export default function Weather() {
  const [searchQuery, setSearchQuery] = useState("");
  const [units, setUnits] = useState<Units>('imperial');
  const [coordinates, setCoordinates] = useState<{lat: number, lon: number} | null>(null);
  const [city, setCity] = useState<string>("");
  const { toast } = useToast();

  // Fetch current weather
  const { data: currentWeather, isLoading: currentLoading, error: currentError, refetch: refetchCurrent } = useQuery<CurrentWeatherType>({
    queryKey: ['/api/weather/current', coordinates, city, units],
    enabled: !!(coordinates || city),
    queryFn: async () => {
      const params = new URLSearchParams({ units });
      if (coordinates) {
        params.append('lat', coordinates.lat.toString());
        params.append('lon', coordinates.lon.toString());
      } else if (city) {
        params.append('q', city);
      }
      
      const response = await fetch(`/api/weather/current?${params}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch weather data');
      }
      return response.json();
    },
  });

  // Fetch forecast
  const { data: forecast, isLoading: forecastLoading } = useQuery<Forecast & { dailyForecasts: any[] }>({
    queryKey: ['/api/weather/forecast', coordinates, city, units],
    enabled: !!(coordinates || city),
    queryFn: async () => {
      const params = new URLSearchParams({ units });
      if (coordinates) {
        params.append('lat', coordinates.lat.toString());
        params.append('lon', coordinates.lon.toString());
      } else if (city) {
        params.append('q', city);
      }
      
      const response = await fetch(`/api/weather/forecast?${params}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch forecast data');
      }
      return response.json();
    },
  });

  // Fetch air quality
  const { data: airQuality } = useQuery({
    queryKey: ['/api/weather/air-quality', currentWeather?.coord],
    enabled: !!currentWeather?.coord,
    queryFn: async () => {
      if (!currentWeather?.coord) return null;
      
      const params = new URLSearchParams({
        lat: currentWeather.coord.lat.toString(),
        lon: currentWeather.coord.lon.toString(),
      });
      
      const response = await fetch(`/api/weather/air-quality?${params}`);
      if (!response.ok) {
        return null; // Air quality is optional
      }
      return response.json();
    },
  });

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setCity("");
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location Error",
            description: "Could not get your location. Please search for a city instead.",
            variant: "destructive",
          });
          // Default to San Francisco
          setCity("San Francisco");
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation. Please search for a city.",
        variant: "destructive",
      });
      setCity("San Francisco");
    }
  };

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setCity(searchQuery.trim());
      setCoordinates(null);
      setSearchQuery("");
    }
  };

  // Handle unit toggle
  const toggleUnits = () => {
    setUnits(units === 'imperial' ? 'metric' : 'imperial');
  };

  // Set current date
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Initialize with user location
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const isLoading = currentLoading || forecastLoading;

  return (
    <div className="weather-container">
      <div className="container mx-auto px-4 py-5">
        {/* Header Section */}
        <div className="header-section mb-8">
          <div className="text-center mb-4">
            <h1 className="app-title">
              <i className="fas fa-cloud-sun weather-logo"></i>
              WeatherCast Pro
            </h1>
            <p className="app-subtitle">7-Day Weather Forecast</p>
          </div>
          
          <div className="search-wrapper">
            <div className="search-container">
              <Input
                type="text"
                className="search-input"
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                className="search-btn"
                size="sm"
                onClick={handleSearch}
              >
                <Search className="h-3 w-3" />
              </Button>
              <Button
                className="location-btn"
                size="sm"
                onClick={getCurrentLocation}
                title="Use current location"
              >
                <MapPin className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {currentError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {currentError.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="loading-spinner text-center py-12">
            <div className="spinner mx-auto mb-4 w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        {/* Current Weather Section */}
        {currentWeather && (
          <CurrentWeather
            weather={currentWeather}
            units={units}
            onUnitToggle={toggleUnits}
            currentDate={getCurrentDate()}
          />
        )}

        <div className="row">
          {/* Today's Details */}
          <div className="col-lg-4">
            {currentWeather ? (
              <WeatherDetails 
                weather={currentWeather} 
                airQuality={airQuality}
                units={units}
              />
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            )}
          </div>

          {/* 7-Day Forecast */}
          <div className="col-lg-8">
            <div className="weather-details">
              <h5 className="mb-3 flex items-center">
                <i className="fas fa-calendar-week me-2 text-primary"></i>
                7-Day Forecast
              </h5>
              
              {forecast?.dailyForecasts ? (
                <div className="space-y-3">
                  {forecast.dailyForecasts.map((day, index) => (
                    <ForecastCard 
                      key={index} 
                      forecast={day} 
                      units={units}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Temperature Chart */}
        {forecast && (
          <TemperatureChart forecast={forecast} units={units} />
        )}
      </div>
    </div>
  );
}
