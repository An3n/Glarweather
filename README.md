# Weather Forecast Application (Glarweather)

This is a Vue.js-based Weather Forecast Application that allows users to view weather forecasts for selected cities. Users can register, login, and access weather data securely.

## Features

- User registration and login
- Secure access using JWT authentication
- Display weather forecasts for selected cities
- View daily and hourly weather data

## Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)
- SQLite (or any other SQL database compatible with Sequelize)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/An3n/Glarweather.git
cd Glarweather
```

### 2. Install Backend Dependencies

```bash
cd weather-app-backend
npm install
```

### 3. Initialize the Database

The database will be created automatically upon the first run of the application.

### 4. Start the Backend Server

To start the backend server, run:

```bash
node src/index.js
```

### 5. Install Frontend Dependencies

Open a new terminal window and navigate to the `weather-app-frontend` directory:

```bash
cd weather-app-frontend
npm install
```

### 6. Start the Frontend Server

```bash
npm run serve
```

## Usage
### Registration
1. Open your browser and navigate to http://localhost:8080.
2. Click on the `Register` link to navigate to the registration page.
3. Enter your desired username and password, then click Register.
4. After successful registration, you will be redirected to the login page.

### Login
1. Enter your username and password on the login page.
2. Click `Login` to authenticate.
3. Upon successful login, you will be redirected to the weather forecast page.

### Viewing Weather Data
1. Select a city from the navigation bar.
2. View daily weather data and click on any day to view hourly data.
3. Use the logout button to log out and end your session.

## API Endpoints
### Authentication Endpoints
- POST /register - Register a new user
- POST /login - Login a user and receive a JWT token
### Weather Data Endpoint
- GET /weather/:city - Fetch weather data for a specific city (protected route)
