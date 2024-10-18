const urlBase = `https://api.openweathermap.org/data/2.5/weather`
let API_KEY = '346955e27d8ad9b7ea5d001c8eb2ff43'
//Diferencia kelvin  (para convertir de k a °C)
const diffKelvin = 273.15

document.getElementById('searchButton').addEventListener('click', ()=> {
    const city = document.getElementById('cityInput').value
    const divResponseData = document.getElementById('responseData')
    const errorMessageDiv = document.getElementById('errorMessage')

    divResponseData.classList.remove('visible'); // Ocultar el contenido previo
    divResponseData.innerHTML = '';

    // Limpiar el mensaje de error antes de hacer una nueva búsqueda
    errorMessageDiv.style.display = 'none'

    if (city) {
        // Si ya hay contenido visible, primero ocultamos el contenido actual
        if (divResponseData.classList.contains('visible')) {
            divResponseData.classList.remove('visible');
            
            // Esperamos que la animación de desvanecimiento termine antes de actualizar el contenido
            setTimeout(() => {
                divResponseData.innerHTML = ''; // Limpiamos el contenido existente
                fetchWeather(city); // Llamamos a la API para obtener la nueva información
            }, 1000); // Duración de la transición de desvanecimiento
        } else {
            // Si no hay contenido visible, hacemos la solicitud
            fetchWeather(city);
        }
    } else {
        errorMessageDiv.textContent = 'Por favor, ingresa una ciudad.'
        errorMessageDiv.style.display = 'block'
    }
})

function fetchWeather(city) {
    fetch (`${urlBase}?q=${city}&appid=${API_KEY}&lang=es`) //&lang=es-para traducir a español la descripcón del clima
    .then(response => {
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Ciudad no encontrada'); // Lanza un error si la ciudad no es válida
        }
        return response.json();
    })
    .then(data => {
        showWeatherData(data); // Muestra los datos del clima
    })
    .catch(error => {
        const errorMessageDiv = document.getElementById('errorMessage');
        errorMessageDiv.textContent = 'Por favor, ingresa una ciudad válida.';
        errorMessageDiv.style.display = 'block'; // Muestra el mensaje de error
    });
}

function showWeatherData(data) {
    const divResponseData = document.getElementById('responseData')

    //crear y añadir el nuevo contenido al div "responseData"
    const cityName = data.name
    const countryName = data.sys.country
    const temp = data.main.temp
    const humidity = data.main.humidity
    const description = data.weather[0].description
    const icon = data.weather[0].icon

    const cityInfo = document.createElement('h3')
    cityInfo.textContent = `${cityName}, ${countryName}`

    const tempInfo = document.createElement('p')
    tempInfo.textContent = `Temperatura actual: ${Math.floor(temp - diffKelvin)}°C`

    const humidityInfo = document.createElement('p')
    humidityInfo.textContent = `Humedad: ${humidity}%`

    const iconInfo = document.createElement('img')
    iconInfo.src = ` https://openweathermap.org/img/wn/${icon}@2x.png`

    const descriptionInfo = document.createElement('p')
    descriptionInfo.textContent = `Clima: ${description}`


    divResponseData.appendChild(cityInfo)
    divResponseData.appendChild(tempInfo)
    divResponseData.appendChild(humidityInfo)
    divResponseData.appendChild(iconInfo)
    divResponseData.appendChild(descriptionInfo)

    setTimeout(() => {
        divResponseData.classList.add('visible');
    }, 500)
}