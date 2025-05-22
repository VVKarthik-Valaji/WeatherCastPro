import { Button } from "@/components/ui/button";
import { getWeatherIcon, getWeatherAnimation } from "@/lib/weatherUtils";
import type { CurrentWeather as CurrentWeatherType } from "@shared/schema";

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
  units: 'imperial' | 'metric';
  onUnitToggle: () => void;
  currentDate: string;
}

export function CurrentWeather({ weather, units, onUnitToggle, currentDate }: CurrentWeatherProps) {
  const tempUnit = units === 'imperial' ? 'F' : 'C';
  const speedUnit = units === 'imperial' ? 'mph' : 'm/s';
  const visibilityUnit = units === 'imperial' ? 'mi' : 'km';
  
  const visibility = units === 'imperial' 
    ? (weather.visibility * 0.000621371).toFixed(1)
    : (weather.visibility / 1000).toFixed(1);

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const weatherIcon = getWeatherIcon(weather.weather[0].main);
  const animationClass = getWeatherAnimation(weather.weather[0].main);

  return (
    <div className={`current-weather fade-in ${animationClass}`}>
      <div className="weather-animation"></div>
      <div className="current-weather-content relative z-10">
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h2 className="mb-1 location-title">
                  {weather.name}, {weather.sys.country}
                </h2>
                <p className="mb-0 current-date">{currentDate}</p>
              </div>
              <Button
                className="unit-toggle-new"
                onClick={onUnitToggle}
              >
                °{tempUnit === 'F' ? 'F / °C' : 'C / °F'}
              </Button>
            </div>
            <div className="d-flex align-items-center">
              <div className="temperature-display-new">
                {Math.round(weather.main.temp)}°{tempUnit}
              </div>
              <div className="ms-3">
                <div className="weather-icon-new">
                  <i className={weatherIcon}></i>
                </div>
              </div>
            </div>
            <h4 className="mb-0 weather-condition">
              {weather.weather[0].description
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </h4>
            <p className="feels-like-temp">
              Feels like {Math.round(weather.main.feels_like)}°{tempUnit}
            </p>
          </div>
          <div className="col-md-4 text-end">
            <div className="current-weather-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-eye"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-label">Visibility</span>
                  <span className="stat-value">{visibility} {visibilityUnit}</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-wind"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-label">Wind</span>
                  <span className="stat-value">
                    {Math.round(weather.wind.speed)} {speedUnit} {getWindDirection(weather.wind.deg)}
                  </span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-thermometer-half"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-label">Pressure</span>
                  <span className="stat-value">{weather.main.pressure} hPa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
