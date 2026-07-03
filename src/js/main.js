import "../styles/main.css";

const api = {
    endpoint: "https://api.openweathermap.org/data/2.5/",
    key: "77fc3821b7e37a09204b855f9791e47e",
    unsplashEndpoint: "https://api.unsplash.com/search/photos",
    unsplashKey: "7DxzC-huXT5vktGEKS4epvvK-K0CHvmZCte7EuuYXAM"
}

const searchBar = document.querySelector(".search-bar");

searchBar.addEventListener("keypress", enter);

const errorMsg = document.querySelector(".error-msg");
const cardOne = document.querySelector(".card-one");

function enter(e) {
    if (e.keyCode === 13) {
        getInfo(searchBar.value);
    }
}

async function getInfo(data) {
    const res = await fetch(`${api.endpoint}weather?q=${data}&units=metric&appid=${api.key}`); 
    
    if(res.status == 404) {
        errorMsg.style.display = "block";
        cardOne.style.display = "none";
    } else {
        const result = await res.json();
        displayResult(result);
        getUnsplashImage(result.name);
    }
}

async function getUnsplashImage(cityName) {
                document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?landscape')";

    const res = await fetch(`${api.unsplashEndpoint}?query=${cityName} downtown&client_id=${api.unsplashKey}&per_page=50`);

    if (res.ok) {
        const data = await res.json();
       
        if (data.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.results.length);
            const imageUrl = data.results[randomIndex].urls.regular;
            document.body.style.backgroundImage = `url('${imageUrl}')`;
        } else {
            console.error("No images found for the city on Unsplash");
        }
    } else {
        console.error("Error fetching image from Unsplash");
    }
}

function displayResult(result) {
    let city = document.querySelector(".city");
    city.textContent = `${result.name}, ${result.sys.country}`;

    let icon = document.querySelector(".icon");
    icon.src = `https://openweathermap.org/img/wn/${result.weather[0].icon}.png`;

    let temperature = document.querySelector(".temp"); 
    temperature.innerHTML = `${Math.round(result.main.temp)}<span>°C</span>`;

    let feelsLike = document.querySelector(".feelsLike");
    feelsLike.innerHTML = `Feels like ${Math.round(result.main.feels_like)}<span>°C</span>`;
    
    let conditions = document.querySelector("#description");
    conditions.textContent = `${result.weather[0].main}`;

    let variation = document.querySelector("#min-max");
    variation.innerHTML = `${Math.round(result.main.temp_min)}<span>°C</span> | ${Math.round(result.main.temp_max)}<span>°C</span>`;

    let wind = document.querySelector("#wind");
    wind.innerHTML = `${Math.round(result.wind.speed)}<span>ms</span>`;

    let humidity = document.querySelector("#humidity");
    humidity.innerHTML = `${result.main.humidity}<span>%</span>`;

    cardOne.style.display = "block";
    errorMsg.style.display = "none";
}

function getDate() {
    const today = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let weekday = document.querySelector(".weekday");
    let showDate = document.querySelector(".current-date");
    
    let currentWeekday = days[today.getDay()];
    weekday.innerHTML = currentWeekday;
    
    let currentDate = today.getDate() + " " + months[today.getMonth()] + " " + today.getFullYear();
    showDate.innerHTML = currentDate;
}

getDate();
