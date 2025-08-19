// API Configuration
const API_KEY = "25d4df7c6c5949cac2106f9db050b664";
const BASE_URL = "https://api.openweathermap.org/data/2.5";


const popularCities = [
  { name: "New York", country: "US" },
  { name: "London", country: "GB" },
  { name: "Tokyo", country: "JP" },
  { name: "Paris", country: "FR" },
  { name: "Sydney", country: "AU" },
  { name: "Mumbai", country: "IN" },
  { name: "Dubai", country: "AE" },
  { name: "Singapore", country: "SG" },
  { name: "Toronto", country: "CA" },
  { name: "Berlin", country: "DE" }
];


const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const currentLocationBtn = document.getElementById("currentLocationBtn");
const citySelect = document.getElementById("citySelect");
const weatherDisplay = document.getElementById("weatherDisplay");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const errorMessage = document.getElementById("errorMessage");


const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const visibility = document.getElementById("visibility");


const weatherIcons = {
  "01d": "fas fa-sun",
  "01n": "fas fa-moon",
  "02d": "fas fa-cloud-sun",
  "02n": "fas fa-cloud-moon",
  "03d": "fas fa-cloud",
  "03n": "fas fa-cloud",
  "04d": "fas fa-clouds",
  "04n": "fas fa-clouds",
  "09d": "fas fa-cloud-rain",
  "09n": "fas fa-cloud-rain",
  "10d": "fas fa-cloud-sun-rain",
  "10n": "fas fa-cloud-moon-rain",
  "11d": "fas fa-bolt",
  "11n": "fas fa-bolt",
  "13d": "fas fa-snowflake",
  "13n": "fas fa-snowflake",
  "50d": "fas fa-smog",
  "50n": "fas fa-smog"
};


const initApp = () => {
  populateCitySelect();
  setupEventListeners();
  loadLastSearchedCity();
};


const populateCitySelect = () => {
  popularCities.forEach(city => {
    const option = document.createElement("option");
    option.value = `${city.name},${city.country}`;
    option.textContent = city.name;
    citySelect.appendChild(option);
  });
};


const setupEventListeners = () => {

  searchBtn.addEventListener("click", handleSearch);
  

  cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });
  

  currentLocationBtn.addEventListener("click", getCurrentLocation);
  
 
  citySelect.addEventListener("change", (e) => {
    if (e.target.value) {
      fetchWeatherByCity(e.target.value);
    }
  });
};


const handleSearch = () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherByCity(city);
  } else {
    showError("Please enter a city name");
  }
};


const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser");
    return;
  }
  
  setLoading(true);
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    },
    (error) => {
      setLoading(false);
      showError("Unable to get your location. Please check your permissions.");
    }
  );
};


const fetchWeatherByCity = async (city) => {
  try {
    setLoading(true);
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(response.status === 404 ? "City not found" : "Weather data unavailable");
    }
    
    const data = await response.json();
    displayWeather(data);
    saveLastSearchedCity(city);
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
};


const fetchWeatherByCoords = async (lat, lon) => {
  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Weather data unavailable");
    }
    
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
};


const displayWeather = (data) => {
  const {
    name,
    sys: { country },
    main: { temp, feels_like, humidity },
    weather: [weatherInfo],
    wind: { speed },
    visibility: visibilityData
  } = data;


  cityName.textContent = `${name}, ${country}`;
  temperature.textContent = Math.round(temp);
  description.textContent = weatherInfo.description;
  

  const iconClass = weatherIcons[weatherInfo.icon] || "fas fa-cloud";
  weatherIcon.className = iconClass;
  
 
  feelsLike.textContent = `${Math.round(feels_like)}°C`;
  humidity.textContent = `${humidity}%`;
  windSpeed.textContent = `${Math.round(speed * 3.6)} km/h`; // Convert m/s to km/h
  visibility.textContent = `${(visibilityData / 1000).toFixed(1)} km`;
  
  
  showWeatherDisplay();
  

  cityInput.value = "";
};


const setLoading = (isLoading) => {
  if (isLoading) {
    loading.classList.add("show");
    weatherDisplay.classList.remove("show");
    error.classList.remove("show");
    currentLocationBtn.disabled = true;
    searchBtn.disabled = true;
  } else {
    loading.classList.remove("show");
    currentLocationBtn.disabled = false;
    searchBtn.disabled = false;
  }
};

const showWeatherDisplay = () => {
  weatherDisplay.classList.add("show");
  error.classList.remove("show");
};

const showError = (message) => {
  errorMessage.textContent = message;
  error.classList.add("show");
  weatherDisplay.classList.remove("show");
};


const saveLastSearchedCity = (city) => {
  localStorage.setItem("lastSearchedCity", city);
};

const loadLastSearchedCity = () => {
  const lastCity = localStorage.getItem("lastSearchedCity");
  if (lastCity) {
    cityInput.value = lastCity;
  }
};


document.addEventListener("DOMContentLoaded", initApp);