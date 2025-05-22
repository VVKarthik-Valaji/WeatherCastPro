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
                <h2 className="mb-1 text-white">
                  {weather.name}, {weather.sys.country}
                </h2>
                <p className="mb-0 opacity-75 text-white">{currentDate}</p>
              </div>
              <Button
                className="unit-toggle bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={onUnitToggle}
              >
                °{tempUnit === 'F' ? 'F / °C' : 'C / °F'}
              </Button>
            </div>
            <div className="d-flex align-items-center">
              <div className="temperature-display text-6xl font-light text-white">
                {Math.round(weather.main.temp)}°{tempUnit}
              </div>
              <div className="ms-3">
                <div className="weather-icon-large text-7xl text-white">
                  <i className={weatherIcon}></i>
                </div>
              </div>
            </div>
            <h4 className="mb-0 text-white">
              {weather.weather[0].description
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </h4>
            <p className="opacity-75 text-white">
              Feels like {Math.round(weather.main.feels_like)}°{tempUnit}
            </p>
          </div>
          <div className="col-md-4 text-end">
            <div className="weather-details bg-transparent border-0 p-0">
              <div className="detail-item border-0 text-white py-2">
                <span><i className="fas fa-eye detail-icon text-white"></i>Visibility</span>
                <strong>{visibility} {visibilityUnit}</strong>
              </div>
              <div className="detail-item border-0 text-white py-2">
                <span><i className="fas fa-wind detail-icon text-white"></i>Wind</span>
                <strong>
                  {Math.round(weather.wind.speed)} {speedUnit} {getWindDirection(weather.wind.deg)}
                </strong>
              </div>
              <div className="detail-item border-0 text-white py-2">
                <span><i className="fas fa-thermometer-half detail-icon text-white"></i>Pressure</span>
                <strong>{weather.main.pressure} hPa</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
