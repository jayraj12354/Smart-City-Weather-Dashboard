const API_KEY = "ee4596ec30de2dfcd65f46f503cd00eb";

let savedList = [];

let currentData = null;


const modeToggleBtn = document.getElementById("modeToggleBtn");
const fetchBtn = document.getElementById("fetchBtn");

const cityField = document.getElementById("cityField");


const bookmarkBtn = document.getElementById("bookmarkBtn");
const loaderText = document.getElementById("loaderText");
const savedGrid = document.getElementById("savedGrid");

const searchSaved = document.getElementById("searchSaved");


const sortFilter = document.getElementById("sortFilter");


const tempFilter = document.getElementById("tempFilter");


modeToggleBtn.onclick = () => {
  document.body.classList.toggle("dark");
  modeToggleBtn.innerText =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
};


async function getWeather(city) {
  try {
    loaderText.classList.remove("hidden");

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    // console.log(res);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    currentData = data;

    updateUI(data);
    bookmarkBtn.classList.remove("hidden");

  } catch (err) {
    alert(err.message);
  } finally {
    loaderText.classList.add("hidden");
  }
}


fetchBtn.onclick = () => {
  if (cityField.value) getWeather(cityField.value);
};

cityField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather(cityField.value);
});


function updateUI(data) {
  document.getElementById("locationText").innerText =
    `${data.name}, ${data.sys.country}`;

  document.getElementById("temperatureText").innerText =
    `${data.main.temp}°C`;

  document.getElementById("conditionText").innerText =
    data.weather[0].description;
}


bookmarkBtn.onclick = () => {
  const name = currentData.name;

  if (savedList.find((c) => c.name === name)) {
    alert("Already saved!");
    return;
  }

  savedList.push({
    name,
    temp: currentData.main.temp,
    desc: currentData.weather[0].description,
  });

  renderSaved();
};


function deleteCity(name) {

  savedList = savedList.filter((c) => c.name !== name);
  renderSaved();
}


function renderSaved() {
  const search = searchSaved.value.toLowerCase();


  const sort = sortFilter.value;
  const temp = tempFilter.value;

  let list = savedList.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search);
    // console.log(c.name.toLowerCase(), search, matchSearch);


    let matchTemp = true;
    if (temp === "hot") matchTemp = c.temp > 25;
    if (temp === "cold") matchTemp = c.temp < 10;

    return matchSearch && matchTemp;
  });



  list.sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    if (sort === "temp-asc") return a.temp - b.temp;
    if (sort === "temp-desc") return b.temp - a.temp;
    return 0;
  });

  savedGrid.innerHTML = list
    .map(
      (c) => `
    <div class="card">
      <button onclick="deleteCity('${c.name}')">✖</button>
      <h4>${c.name}</h4>
      <p>${c.temp}°C</p>
      <small>${c.desc}</small>
    </div>
  `
    )
    .join("");
}

searchSaved.oninput = renderSaved;


sortFilter.onchange = renderSaved;

tempFilter.onchange = renderSaved;