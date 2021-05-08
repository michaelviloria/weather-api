const inputUser = document.getElementById("input-user");
const btnSearch = document.getElementById("btn-search");
const apiKey = "2646082b73cef256b7b90f7312326a66";
const language = "es";
const units = "metric";
const baseUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lang=${language}&units=${units}`
const baseUrlDaily = `https://api.openweathermap.org/data/2.5/onecall?&appid=${apiKey}&lang=${language}&units=${units}`
const containerInfoPrincipal = document.getElementById("info-principal");
const containerInfoSecondary = document.getElementById("info-secondary");
const imgHome = document.getElementById("img-home");
const popUpContainer = document.getElementById("popup");
const btnClosePopUp = document.getElementById("btn-close");
const errorPopUp = document.getElementById("error-popup");
const btnCloseError = document.getElementById("btn-close-error");

btnSearch.addEventListener("click", () => {
  if (inputUser.value != "") {
    searchCity();
  }
});
inputUser.addEventListener("keyup", e => {
  if (e.key === "Enter" && inputUser.value != "") {
    searchCity();
  }
});

function searchCity() {
  animationOut();
  containerInfoPrincipal.style.display = "flex";
  imgHome.style.display = "none";
  let cityName = inputUser.value;
  let url = `${baseUrl}&q=${cityName}`;
  fetchData(url);
}

function fetchData(url) {
  fetch(url)
  .then(response => response.json())
  .then(data => weatherData(data))
  .catch(error => errorFetch(error));
}

function weatherData(data) {
  closeErrorFecth();
  const { lat, lon} = data.coord;
  const infoData = {
    temperature: data.main.temp,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    city: data.name,
    country: data.sys.country,
    date: getDate(),
  }
  
  Object.keys(infoData).forEach(key => {
    if (key == "temperature") {
      document.getElementById(key).textContent = `${infoData[key]}°C`;
    }
    else if(key == "humidity") {
      document.getElementById(key).textContent = `Humedad: ${infoData[key]}%`;
    }
    else {
      document.getElementById(key).textContent = `${infoData[key]}`;
    } 
  });
  
  let cityName = data.name;
  let countryName = data.sys.country;
  fetchDataDaily(lat, lon, cityName, countryName);
}

function getDate() {
  let date = new Date();
  return `${( '0' + date.getDate()).slice(-2)} - ${( '0' + (date.getMonth() + 1)).slice(-2)} - ${date.getFullYear()}`
}

function fetchDataDaily(lat,lon,cityName,countryName) {
  let dias = "7";
  let exclude = "current,minutely,hourly,alerts"
  let url = `${baseUrlDaily}&lat=${lat}&lon=${lon}&ctn=${dias}&exclude=${exclude}`;
  fetch(url)
    .then(response => response.json())
    .then(data => weatherDataDaily(data,cityName,countryName));
}

function weatherDataDaily(data,cityName,countryName) {
  containerInfoSecondary.style.display = "grid";
  let itemCard = document.querySelectorAll(".item--card");
  let itemsArr = [...itemCard];
  let i = 0;
  itemsArr.forEach((e) => {
    let infoDataDaily = {
      date: getDateDaily(1 + i),
      temperature: data.daily[i].temp.day,
      description: data.daily[i].weather[0].description,
      humidity: data.daily[i].humidity,
      city: cityName,
      country: countryName
    }

    Object.keys(infoDataDaily).forEach(key => {
      if(key === "temperature") {
        e.querySelector(`.${key}`).textContent = `${infoDataDaily[key]}°C`;
      }
      else if(key === "humidity") {
        e.querySelector(`.${key}`).textContent = `Humedad: ${infoDataDaily[key]}%`;
      }
      else {
        e.querySelector(`.${key}`).textContent = infoDataDaily[key];
      }
    });
    i++;
  })
}

function getDateDaily(days) {
  let current = new Date();
  current.setDate(current.getDate() + days);
  return `${( '0' + current.getDate()).slice(-2)} - ${( '0' + (current.getMonth() + 1)).slice(-2)} - ${current.getFullYear()}`;
}

function onLoad() {
  setTimeout(animationEntry,1500);
}

function animationEntry() {
  popUpContainer.style.top = "calc(60% - 150px)";
  setTimeout(animationOut,15000);
}

btnClosePopUp.addEventListener("click", animationOut);

function animationOut() {
  popUpContainer.style.top = "-100%";
}

function errorFetch(error) {
  containerInfoPrincipal.style.display = "none";
  imgHome.style.display = "flex";
  errorPopUp.style.right = "calc(10vw - 100px)";
  containerInfoSecondary.style.display = "none";
  console.error(error);
}

btnCloseError.addEventListener("click", closeErrorFecth);

function closeErrorFecth() {
  errorPopUp.style.right = "-100%";
}