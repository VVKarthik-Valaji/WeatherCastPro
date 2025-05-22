import type { CurrentWeather } from "@shared/schema";

interface WeatherDetailsProps {
  weather: CurrentWeather;
  airQuality?: any;
  units: 'imperial' | 'metric';
}

export function WeatherDetails({ weather, airQuality, units }: WeatherDetailsProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getUVIndexDescription = (uvi?: number) => {
    if (!uvi) return 'N/A';
    if (uvi <= 2) return `${uvi} (Low)`;
    if (uvi <= 5) return `${uvi} (Moderate)`;
    if (uvi <= 7) return `${uvi} (High)`;
    if (uvi <= 10) return `${uvi} (Very High)`;
    return `${uvi} (Extreme)`;
  };

  const getAQIDescription = (aqi?: number) => {
    if (!aqi) return 'N/A';
    const descriptions = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    return `${descriptions[aqi - 1] || 'Unknown'} (${aqi})`;
  };

  return (
    <>
      {/* Today's Details */}
      <div className="weather-details mb-6">
        <h5 className="mb-3 flex items-center">
          <i className="fas fa-info-circle me-2 text-primary"></i>
          Today's Details
        </h5>
        
        <div className="detail-item">
          <span><span className="emoji-icon sunrise-emoji">🌅</span>Sunrise</span>
          <strong>{formatTime(weather.sys.sunrise)}</strong>
        </div>
        
        <div className="detail-item">
          <span><span className="emoji-icon sunset-emoji">🌇</span>Sunset</span>
          <strong>{formatTime(weather.sys.sunset)}</strong>
        </div>
        
        <div className="detail-item">
          <span><i className="fas fa-droplet detail-icon"></i>Humidity</span>
          <strong>{weather.main.humidity}%</strong>
        </div>
        
        <div className="detail-item">
          <span><i className="fas fa-cloud detail-icon"></i>Cloud Cover</span>
          <strong>{weather.clouds.all}%</strong>
        </div>
        
        <div className="detail-item">
          <span><i className="fas fa-eye detail-icon"></i>UV Index</span>
          <strong>N/A</strong>
        </div>
      </div>

      {/* Air Quality */}
      <div className="weather-details">
        <h5 className="mb-3 flex items-center">
          <i className="fas fa-lungs me-2" style={{color: 'var(--accent-color)'}}></i>
          Air Quality
        </h5>
        
        <div className="detail-item">
          <span><i className="fas fa-smog detail-icon"></i>AQI</span>
          <strong>
            {airQuality ? getAQIDescription(airQuality.list?.[0]?.main?.aqi) : 'Loading...'}
          </strong>
        </div>
        
        <div className="detail-item">
          <span><i className="fas fa-leaf detail-icon"></i>PM2.5</span>
          <strong>
            {airQuality ? `${airQuality.list?.[0]?.components?.pm2_5?.toFixed(1) || 'N/A'} μg/m³` : 'Loading...'}
          </strong>
        </div>
      </div>
    </>
  );
}
