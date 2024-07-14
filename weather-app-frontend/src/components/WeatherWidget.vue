<template>
  <div class="">
    <div class="city-header text-center mb-4">
      <h2 class="city-name">{{ capitalize(city) }}</h2>
      <p class="city-subtitle">Weather Forecast</p>
    </div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else>
      <div class="row">
        <div v-for="(forecast, date) in groupedWeather" :key="date" class="col mb-4">
          <div class="card mb-3" @click="selectDate(date)">
            <div class="card-body text-center">
              <h5 class="card-title">{{ formatDate(date, 'day') }}</h5>
              <img class="img-fluid" :src="`http://openweathermap.org/img/wn/${forecast.icon}.png`" alt="weather icon" >
              <p class="card-text"> {{ forecast.description }}</p>
              <span class="badge bg-primary" style="margin-right: 5px;"> {{ forecast.minTemp }}°C</span>
              <span class="badge bg-warning">{{ forecast.maxTemp }}°C</span>
              <hr>
              <p class="card-text"><i class="bi bi-moisture"></i> {{ forecast.avgHumidity }}%</p>
              <p class="card-text"><i class="bi bi-wind"></i> {{ forecast.avgWindSpeed }} m/s</p>
              <p class="card-text"><i class="bi bi-speedometer"></i> {{ forecast.avgPressure }} hPa</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="selectedDate" class="mt-4">
        <ul class="nav nav-pills justify-content-center">
          <li class="nav-item" v-for="date in Object.keys(groupedWeather)" :key="date">
            <a class="nav-link nav-text-color" aria-current="page" :class="{ active: selectedDate === date }"  @click="selectDate(date)" >{{ formatDate(date, 'day') }}</a>
          </li>
        </ul>
        <div class="tab-content mt-3">
          <div class="row justify-content-center">
            <div v-for="forecast in groupedWeather[selectedDate].hourly" :key="forecast.dt" class="col-sm-1 mb-4">
              <div class="card mb-3">
                <div class="card-body text-center">
                  <h6 class="card-title">{{ formatDate(forecast.dt_txt, 'hour') }}</h6>
                  <img :src="`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`" alt="weather icon" class="img-fluid">
                  <br><span class="badge bg-primary"> {{ (forecast.main.temp_min - 273.15).toFixed(2) }}°C</span>
                  <br><span class="badge bg-warning"> {{ (forecast.main.temp_max - 273.15).toFixed(2) }}°C</span>
                  <hr>
                  <i class="bi bi-moisture"></i><p class="card-text"> {{ forecast.main.humidity }}%</p>
                  <i class="bi bi-wind"></i><p class="card-text"> {{ forecast.wind.speed }}<br> m/s</p>
                  <i class="bi bi-speedometer"></i><p class="card-text"> {{ forecast.main.pressure }} hPa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { createToaster } from '@meforma/vue-toaster';

const toaster = createToaster({
    // Global/Default options
    position: 'top',
    timeout: 3000,
    pauseOnHover: true
});

const props = defineProps({
  city: {
    type: String,
    required: true
  }
});

const weatherData = ref([]);
const groupedWeather = ref({});
const selectedDate = ref('');
const error = ref(null);

// Fetch weather data from the API
const fetchWeather = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token provided');
    }

    const response = await axios.get(`http://localhost:3000/weather/${props.city}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    weatherData.value = response.data.list;
    groupedWeather.value = groupByDay(weatherData.value);
    if (Object.keys(groupedWeather.value).length > 0) {
      selectedDate.value = Object.keys(groupedWeather.value)[0];
    }
  } catch (err) {
    error.value = 'Error fetching weather data';
    toaster.error('Error fetching weather data');
  }
};

// Function to group weather data by day
const groupByDay = (data) => {
  const dailyData = {};

  data.forEach(forecast => {
    const date = forecast.dt_txt.split(' ')[0];
    if (!dailyData[date]) {
      dailyData[date] = {
        temps: [],
        minTemps: [],
        maxTemps: [],
        humidities: [],
        windSpeeds: [],
        pressures: [],
        description: forecast.weather[0].description,
        icon: forecast.weather[0].icon,
        hourly: []
      };
    }
    dailyData[date].temps.push(forecast.main.temp);
    dailyData[date].minTemps.push(forecast.main.temp_min);
    dailyData[date].maxTemps.push(forecast.main.temp_max);
    dailyData[date].humidities.push(forecast.main.humidity);
    dailyData[date].windSpeeds.push(forecast.wind.speed);
    dailyData[date].pressures.push(forecast.main.pressure);
    dailyData[date].hourly.push(forecast);
  });

  for (const date in dailyData) {
    dailyData[date].minTemp = (Math.min(...dailyData[date].minTemps) - 273.15).toFixed(2);
    dailyData[date].maxTemp = (Math.max(...dailyData[date].maxTemps) - 273.15).toFixed(2);
    dailyData[date].avgHumidity = (dailyData[date].humidities.reduce((a, b) => a + b, 0) / dailyData[date].humidities.length).toFixed(2);
    dailyData[date].avgWindSpeed = (dailyData[date].windSpeeds.reduce((a, b) => a + b, 0) / dailyData[date].windSpeeds.length).toFixed(2);
    dailyData[date].avgPressure = (dailyData[date].pressures.reduce((a, b) => a + b, 0) / dailyData[date].pressures.length).toFixed(2);
  }

  return dailyData;
};

const selectDate = (date) => {
  selectedDate.value = date;
};

// Function to format date
const formatDate = (dateString, formatType) => {
  const date = new Date(dateString);
  if (formatType === 'hour') {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } else if (formatType === 'day') {
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  return dateString;
};

// Function to capitalize the first letter of a string
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// Watch for changes in the city prop and fetch weather data when it changes
watch(() => props.city, fetchWeather, { immediate: true });
</script>

<style scoped>
.nav-text-color {
  color: #4e4e4e;
}

/*.weather-widget {
  margin-top: 20px;
}*/

.card {
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card-body {
  justify-content: space-between;
  
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.city-header {
  margin-bottom: 2rem;
}

.city-name {
  font-size: 3rem;
  font-weight: 700;;
  letter-spacing: 1px;
  color: #333;
}

.city-subtitle {
  font-size: 1.25rem;
  color: #666;
  margin-top: 0.5rem;
  font-style: italic;
}
</style>
