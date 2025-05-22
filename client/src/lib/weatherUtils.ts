export function getWeatherIcon(condition: string): string {
  const iconMap: Record<string, string> = {
    'Clear': 'fas fa-sun',
    'Clouds': 'fas fa-cloud',
    'Rain': 'fas fa-cloud-rain',
    'Drizzle': 'fas fa-cloud-drizzle',
    'Thunderstorm': 'fas fa-bolt',
    'Snow': 'fas fa-snowflake',
    'Mist': 'fas fa-smog',
    'Fog': 'fas fa-smog',
    'Haze': 'fas fa-smog',
    'Dust': 'fas fa-smog',
    'Sand': 'fas fa-smog',
    'Ash': 'fas fa-smog',
    'Squall': 'fas fa-wind',
    'Tornado': 'fas fa-tornado'
  };

  return iconMap[condition] || 'fas fa-cloud';
}

export function getWeatherAnimation(condition: string): string {
  const animationMap: Record<string, string> = {
    'Rain': 'rain-animation',
    'Drizzle': 'rain-animation',
    'Thunderstorm': 'storm-animation',
    'Snow': 'snow-animation'
  };

  return animationMap[condition] || '';
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function convertTemperature(temp: number, fromUnit: 'C' | 'F', toUnit: 'C' | 'F'): number {
  if (fromUnit === toUnit) return temp;
  
  if (fromUnit === 'C' && toUnit === 'F') {
    return (temp * 9/5) + 32;
  } else if (fromUnit === 'F' && toUnit === 'C') {
    return (temp - 32) * 5/9;
  }
  
  return temp;
}
