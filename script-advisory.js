/**************** AUTH CHECK ****************/
(function checkAuth() {
  if (localStorage.getItem("isAuthenticated") !== "true") {
    window.location.replace("login-signup.html");
    return;
  }
})();

/**************** WEATHER FROM BACKEND ****************/
async function fetchWeatherByCity(city) {
  const res = await fetch("http://localhost:5000/api/weather", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ city })
  });

  if (!res.ok) throw new Error("Weather fetch failed");
  return await res.json();
}

/**************** CROP DATA ****************/
const cropRecommendations = [
  { name: "Wheat", tempRange: [7, 25], humidityRange: [30, 80], season: "Rabi" },
  { name: "Rice", tempRange: [20, 35], humidityRange: [65, 95], season: "Kharif" },
  { name: "Maize", tempRange: [18, 32], humidityRange: [40, 75], season: "Kharif/Rabi" },
  { name: "Barley", tempRange: [10, 20], humidityRange: [40, 70], season: "Rabi" },
  { name: "Sorghum", tempRange: [22, 38], humidityRange: [20, 60], season: "Kharif" },
  { name: "Cotton", tempRange: [20, 38], humidityRange: [40, 80], season: "Kharif" },
  { name: "Sugarcane", tempRange: [21, 35], humidityRange: [60, 85], season: "All Seasons" },
  { name: "Potato", tempRange: [10, 25], humidityRange: [50, 80], season: "Rabi" },
  { name: "Tomato", tempRange: [18, 30], humidityRange: [40, 80], season: "All Seasons" },
  { name: "Onion", tempRange: [15, 30], humidityRange: [40, 75], season: "Rabi/Zaid" }
];

/**************** HELPERS ****************/
function showMessage(message, isError = false) {
  const el = document.getElementById("messageBox");
  el.innerText = message;
  el.style.display = "block";
  el.style.backgroundColor = isError ? "#ef4444" : "#10b981";
  setTimeout(() => (el.style.display = "none"), 3500);
}

function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}

function chooseCrops(temp, humidity, maxCount = 3) {
  const scored = cropRecommendations.map(crop => {
    const tScore =
      temp < crop.tempRange[0]
        ? crop.tempRange[0] - temp
        : temp > crop.tempRange[1]
        ? temp - crop.tempRange[1]
        : 0;

    const hScore =
      humidity < crop.humidityRange[0]
        ? crop.humidityRange[0] - humidity
        : humidity > crop.humidityRange[1]
        ? humidity - crop.humidityRange[1]
        : 0;

    return { crop, score: tScore * 1.2 + hScore };
  });

  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, maxCount).map(s => s.crop);
}

/**************** MAIN ADVISORY ****************/
async function getAdvisory() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    showMessage("Please enter a city name", true);
    return;
  }

  try {
    const data = await fetchWeatherByCity(city);

    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const condition = data.weather[0].description;
    const wind = data.wind.speed;

    document.getElementById("temp").innerText = `${temp.toFixed(1)}°C`;
    document.getElementById("condition").innerText = capitalize(condition);
    document.getElementById("humidity").innerText = `${humidity}%`;
    document.getElementById("wind").innerText = `${wind.toFixed(1)} m/s`;
    document.getElementById("advisoryTitle").innerText =
      `Crop Advisory for ${city}`;

    const crops = chooseCrops(temp, humidity);
    document.getElementById("cropNameDisplay").innerText =
      "Recommended Crops: " + crops.map(c => c.name).join(", ");

    document.getElementById("cropImage").src =
      `https://placehold.co/600x400/16a34a/ffffff?text=${encodeURIComponent(crops[0].name)}`;

    document.getElementById("primaryAdvice").innerText =
      temp >= 40
        ? "Extreme heat detected. Increase irrigation."
        : temp <= 5
        ? "Cold conditions. Protect crops from frost."
        : "Weather conditions are suitable for farming.";

    document.getElementById("resultsSection").classList.remove("hidden");
  } catch (err) {
    console.error(err);
    showMessage("Failed to fetch advisory. Check backend.", true);
  }
}

/**************** EVENTS ****************/
window.addEventListener("load", () => {
  document
    .getElementById("advisoryButton")
    .addEventListener("click", getAdvisory);

  document
    .getElementById("detectLocationBtn")
    .addEventListener("click", () => {
      showMessage("Please enter city manually", true);
    });
});
