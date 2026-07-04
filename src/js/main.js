import '../styles/main.css'

const api = {
  endpoint: 'https://api.openweathermap.org/data/2.5/',
  key: '77fc3821b7e37a09204b855f9791e47e',
}

const pexels = {
  endpoint: 'https://api.pexels.com/v1/search',
  key: 'nlfQf76saScQoXG0xOMSNn9eyXVAmXFvDNB30NwLa5czTY9g4dFbCxCb',
}

const weatherGradients = {
  Clear: 'var(--grad-clear)',
  Clouds: 'var(--grad-clouds)',
  Rain: 'var(--grad-rain)',
  Drizzle: 'var(--grad-drizzle)',
  Thunderstorm: 'var(--grad-thunderstorm)',
  Snow: 'var(--grad-snow)',
  Mist: 'var(--grad-mist)',
  Fog: 'var(--grad-mist)',
  Haze: 'var(--grad-haze)',
  Dust: 'var(--grad-haze)',
  Sand: 'var(--grad-haze)',
  Ash: 'linear-gradient(135deg, #555 0%, #888 100%)',
  Squall: 'var(--grad-clouds)',
  Tornado: 'var(--grad-thunderstorm)',
}

const searchBar = document.querySelector('.search-bar')
const searchBtn = document.querySelector('.search-btn')
const errorMsg = document.querySelector('.error-msg')
const cardOne = document.querySelector('.card-one')

searchBar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') getInfo(searchBar.value)
})

searchBtn.addEventListener('click', () => {
  getInfo(searchBar.value)
})

async function getInfo(data) {
  data = data.trim()
  if (!data) return

  const res = await fetch(
    `${api.endpoint}weather?q=${encodeURIComponent(data)}&units=metric&appid=${api.key}`,
  )

  if (res.status === 404) {
    errorMsg.style.display = 'block'
    cardOne.style.display = 'none'
  } else {
    const result = await res.json()
    displayResult(result)
    await setCityBackground(result.name)
  }
}

async function setCityBackground(cityName) {
  try {
    const res = await fetch(
      `${pexels.endpoint}?query=${encodeURIComponent(cityName + ' city')}&per_page=15&orientation=landscape`,
      { headers: { Authorization: pexels.key } },
    )

    if (!res.ok) throw new Error('Pexels error')

    const data = await res.json()

    if (data.photos && data.photos.length > 0) {
      const random = data.photos[Math.floor(Math.random() * data.photos.length)]
      document.body.style.background = `url('${random.src.landscape}') center/cover no-repeat`
    } else {
      fallbackGradient()
    }
  } catch (e) {
    fallbackGradient()
  }
}

function fallbackGradient() {
  document.body.style.background = 'var(--grad-default)'
}

function displayResult(result) {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const today = new Date()

  document.querySelector('.city').textContent =
    `${result.name}, ${result.sys.country}`
  document.querySelector('.current-date').textContent =
    `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`

  document.querySelector('.icon').src =
    `https://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`
  document.querySelector('.icon').alt = result.weather[0].description

  document.querySelector('.temp').innerHTML =
    `${Math.round(result.main.temp)}<span>°C</span>`
  document.querySelector('#description').textContent = result.weather[0].main
  document.querySelector('.feelsLike').textContent =
    `Feels like ${Math.round(result.main.feels_like)}°C`

  document.querySelector('#min-max').innerHTML =
    `${Math.round(result.main.temp_min)}<span>° / ${Math.round(result.main.temp_max)}°C</span>`
  document.querySelector('#wind').innerHTML =
    `${Math.round(result.wind.speed)}<span> m/s</span>`
  document.querySelector('#humidity').innerHTML =
    `${result.main.humidity}<span>%</span>`

  errorMsg.style.display = 'none'
  cardOne.style.display = 'flex'
}
