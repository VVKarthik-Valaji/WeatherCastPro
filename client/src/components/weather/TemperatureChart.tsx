import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import type { Forecast } from "@shared/schema";

Chart.register(...registerables);

interface TemperatureChartProps {
  forecast: Forecast & { dailyForecasts: any[] };
  units: 'imperial' | 'metric';
}

export function TemperatureChart({ forecast, units }: TemperatureChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !forecast.list) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Get hourly data for next 24 hours
    const hourlyData = forecast.list.slice(0, 8); // 8 data points = 24 hours (3-hour intervals)
    
    const hours = hourlyData.map(item => {
      const date = new Date(item.dt * 1000);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    });
    
    const temps = hourlyData.map(item => Math.round(item.main.temp));
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: hours,
        datasets: [{
          label: 'Temperature',
          data: temps,
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2196F3',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              callback: function(value) {
                return value + '°';
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [forecast, units]);

  return (
    <div className="chart-container">
      <h5 className="mb-3 flex items-center">
        <i className="fas fa-chart-line me-2 text-primary"></i>
        Temperature Trend (Next 24 Hours)
      </h5>
      <div style={{ position: 'relative', height: '200px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
