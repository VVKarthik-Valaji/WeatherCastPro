# Weather Application

## Overview

This is a full-stack weather application built with Express.js backend and React frontend. The application provides current weather information and forecasts by integrating with the OpenWeather API. It features a modern UI built with shadcn/ui components and Tailwind CSS, with real-time weather data visualization including charts and detailed weather metrics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Charts**: Chart.js for temperature visualization
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **API Integration**: OpenWeather API for weather data
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution in development

### Database Architecture
- **Database**: PostgreSQL 16 (configured but not actively used in current implementation)
- **ORM**: Drizzle ORM with migrations support
- **Schema**: Located in `shared/schema.ts` with Zod validation
- **Storage**: Currently using in-memory storage for user data with plans for PostgreSQL integration

## Key Components

### Weather Components
- **CurrentWeather**: Displays current weather conditions with location, temperature, and weather details
- **WeatherDetails**: Shows additional metrics like sunrise/sunset, humidity, pressure, visibility
- **ForecastCard**: Renders daily forecast information with weather icons and temperatures
- **TemperatureChart**: Interactive Chart.js visualization of hourly temperature trends

### API Endpoints
- `GET /api/weather/current` - Fetches current weather data (coordinates or city name)
- `GET /api/weather/forecast` - Retrieves 5-day weather forecast data

### Shared Schema
- Comprehensive Zod schemas for weather data validation
- Type-safe data structures shared between frontend and backend
- Support for OpenWeather API response formats

## Data Flow

1. **Weather Search**: User inputs city name or allows geolocation access
2. **API Request**: Frontend sends request to backend API endpoints
3. **External API Call**: Backend fetches data from OpenWeather API
4. **Data Validation**: Response validated against Zod schemas
5. **State Management**: TanStack Query caches and manages weather data
6. **UI Rendering**: Components render weather information with real-time updates

## External Dependencies

### APIs
- **OpenWeather API**: Primary weather data source
  - Current weather endpoint
  - 5-day forecast endpoint
  - Requires API key configuration

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Chart.js**: Data visualization
- **date-fns**: Date manipulation utilities

### Development Tools
- **Vite**: Frontend build tool with HMR
- **ESBuild**: Backend bundling for production
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling

## Deployment Strategy

### Development
- **Runtime**: Replit with Node.js 20 and PostgreSQL 16 modules
- **Hot Reload**: Vite HMR for frontend, tsx for backend development
- **Port Configuration**: Application runs on port 5000 with external port 80

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Deployment Target**: Autoscale deployment on Replit
- **Environment**: Production mode with optimized assets

### Environment Configuration
- Database URL configuration for PostgreSQL connection
- OpenWeather API key for weather data access
- Development vs production environment detection
- Static file serving in production mode

### Database Migration
- Drizzle kit configured for schema migrations
- PostgreSQL connection string from environment variables
- Migration files generated in `./migrations` directory
- Push command available for schema synchronization