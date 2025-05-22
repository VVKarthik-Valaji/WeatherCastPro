import { getWeatherIcon } from "@/lib/weatherUtils";

interface ForecastCardProps {
  forecast: {
    date: string;
    dayName: string;
    tempHigh: number;
    tempLow: number;
    condition: {
      main: string;
      description: string;
    };
    humidity: number;
    clouds: number;
    pop: number;
  };
  units: 'imperial' | 'metric';
}

export function ForecastCard({ forecast, units }: ForecastCardProps) {
  const tempUnit = units === 'imperial' ? '°' : '°';
  const date = new Date(forecast.date);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  const weatherIcon = getWeatherIcon(forecast.condition.main);
  
  return (
    <div className="forecast-card hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="row align-items-center">
        <div className="col-3">
          <div className="forecast-day font-semibold">{forecast.dayName}</div>
          <small className="text-muted">{formattedDate}</small>
        </div>
        <div className="col-2 text-center">
          <i className={`${weatherIcon} weather-icon text-2xl text-primary`}></i>
        </div>
        <div className="col-4">
          <div className="small text-muted">
            {forecast.condition.description
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </div>
          <div className="small">Rain: {forecast.pop}%</div>
        </div>
        <div className="col-3 text-end">
          <div className="forecast-temps flex justify-end items-center">
            <span className="temp-high font-semibold text-lg">
              {forecast.tempHigh}{tempUnit}
            </span>
            <span className="temp-low text-gray-500 ml-2">
              {forecast.tempLow}{tempUnit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
