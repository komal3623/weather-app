const API_KEY = "57f4f93a22d0448c980123252261901"; // Replace with your own key if needed
const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");

form.addEventListener("submit", getData);

// On page load, fetch default city weather (Madrid)
window.addEventListener("DOMContentLoaded", () => {
  fetchWeather("Hyderabad");
});

async function getData(e) {
  e.preventDefault();

  const city = cityInput.value.trim();
  if (!city) {
    alert("Please enter a city name");
    return;
  }
  fetchWeather(city);
}

async function fetchWeather(city) {
  try {
    // Show loading state
    updateLoadingState(true);

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
      city
    )}&days=3&aqi=no&alerts=no`;

    const response = await axios.get(url);
    renderDashboard(response.data);
  } catch (error) {
    alert(
      error.response?.data?.error?.message ||
        "Failed to fetch weather data. Please try again."
    );
  } finally {
    updateLoadingState(false);
  }
}

function updateLoadingState(isLoading) {
  cityInput.disabled = isLoading;
  cityInput.placeholder = isLoading ? "Loading..." : "Enter city name";
}

function renderDashboard(data) {
  // Left panel
  document.getElementById("city").innerText = `${data.location.name}, ${data.location.country}`;
  document.getElementById("temp").innerText = Math.round(data.current.temp_c) + "°";
  document.getElementById("condition").innerText = data.current.condition.text;
  document.getElementById("wind").innerText = data.current.wind_kph + " km/h";
  document.getElementById("humidity").innerText = data.current.humidity + "%";
  document.getElementById("pressure").innerText = data.current.pressure_mb + " hPa";

  // Right panel (weekly forecast)
  const forecastEl = document.querySelector(".forecast");
  forecastEl.innerHTML = "";

  data.forecast.forecastday.forEach((day) => {
    const dayName = new Date(day.date).toLocaleDateString("en-US", { weekday: "short" });
    const icon = day.day.condition.icon;
    const maxTemp = Math.round(day.day.maxtemp_c);

    const dayHtml = `
      <div class="day">
        <span>${dayName}</span>
        <img src="${icon}" alt="weather icon" />
        <strong>${maxTemp}°</strong>
      </div>
    `;

    forecastEl.insertAdjacentHTML("beforeend", dayHtml);
  });
}

