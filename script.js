const API_KEY = "ee4596ec30de2dfcd65f46f503cd00eb";

const inputCity = document.getElementById("inputCity");
const btnSearch = document.getElementById("btnSearch");
const loaderBox = document.getElementById("loaderBox");
const errorBox = document.getElementById("errorBox");
const weatherCard = document.getElementById("weatherCard");

const cityLabel = document.getElementById("cityLabel");
const tempLabel = document.getElementById("tempLabel");
const weatherLabel = document.getElementById("weatherLabel");

const wearText = document.getElementById("wearText");
const umbrellaText = document.getElementById("umbrellaText");

const themeSwitcher = document.getElementById("themeSwitcher");

const historyContainer = document.getElementById("historyContainer");
const avgTempText = document.getElementById("avgTempText");

let weatherHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];

themeSwitcher.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeSwitcher.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("darkMode", isDark);
});

btnSearch.addEventListener("click", () => {
  const city = inputCity.value.trim();
  if (city) fetchWeather(city);
});

inputCity.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = inputCity.value.trim();
    if (city) fetchWeather(city);
  }
});

async function fetchWeather(city) {
  loaderBox.classList.remove("hidden");
  weatherCard.classList.add("hidden");
  errorBox.classList.add("hidden");

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("City not found ❌");
    }

    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  } finally {
    loaderBox.classList.add("hidden");
  }
}

function displayWeather(data) {
  const temp = Math.round(data.main.temp);
  const desc = data.weather[0].description;
  const main = data.weather[0].main.toLowerCase();

  cityLabel.textContent = data.name;
  tempLabel.textContent = `🌡 ${temp}°C`;
  weatherLabel.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);

  wearText.textContent = getWearAdvice(temp);
  umbrellaText.textContent = getUmbrellaAdvice(main);

  weatherCard.classList.remove("hidden");

  addToHistory(data, temp, desc);
}

function getWearAdvice(temp) {
  if (temp < 10) return "🧥 Wear a jacket, it's cold!";
  if (temp > 30) return "🥵 Light clothes recommended!";
  return "🙂 Comfortable weather.";
}

function getUmbrellaAdvice(main) {
  if (main.includes("rain")) return "☔ Carry an umbrella!";
  return "";
}

function saveHistory() {
  localStorage.setItem("weatherHistory", JSON.stringify(weatherHistory));
}

function addToHistory(data, temp, condition) {
  const existing = weatherHistory.find(
    (item) => item.name.toLowerCase() === data.name.toLowerCase()
  );

  if (existing) {
    existing.temp = temp;
    existing.condition = condition;
  } else {
    weatherHistory.push({
      id: Date.now(),
      name: data.name,
      temp: temp,
      condition: condition,
    });
  }

  saveHistory();
  renderHistory();
}

function renderHistory() {
  historyContainer.innerHTML = weatherHistory
    .map(
      (item) => `
      <div class="history-item">
        <div>
          <strong>${item.name}</strong>
          <p>${item.temp}°C - ${item.condition}</p>
        </div>
        <button onclick="deleteCity(${item.id})">🗑</button>
      </div>
    `
    )
    .join("");

  if (weatherHistory.length > 0) {
    const avg =
      weatherHistory.reduce((sum, i) => sum + i.temp, 0) /
      weatherHistory.length;

    avgTempText.textContent = `Average Temperature: ${avg.toFixed(1)}°C`;
  } else {
    avgTempText.textContent = "";
  }
}

window.deleteCity = function (id) {
  weatherHistory = weatherHistory.filter((item) => item.id !== id);
  saveHistory();
  renderHistory();
};

(function init() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  if (darkMode) {
    document.body.classList.add("dark");
    themeSwitcher.textContent = "☀️ Light Mode";
  }
  renderHistory();
})();