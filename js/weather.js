

let map = L.map('map').setView([45.65610385541145, 25.615999265210124], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let latitude = 0;
let longitude = 0;
let fLatitude = 0;
let fLongitude = 0;

function exportLatLng(e) {
    coords = e.latlng;

    latitude = coords.lat;
    longitude = coords.lng;
    fetchWeather();
    fetchForecast();
    fLatitude = latitude.toFixed(4);
    fLongitude = longitude.toFixed(4);
}


map.on('click', exportLatLng);


// // Coordinates for each city
// const cityCoordinates = {
//     Bucharest: { lat: 44.4268, lon: 26.1025 },
//     Brasov: { lat: 45.6594, lon: 25.2812 },
//     Cluj: { lat: 46.7712, lon: 23.6236 },
//     Bacau: { lat: 46.5672, lon: 26.9112 }
// };

const apiKey = '72796a50d69bb46c55505689142925f9';

let newTemp = 0;
let mapLocation = 0;
// Function to fetch the weather based on selected city


async function fetchWeather() {
    //const { lat, lon } = cityCoordinates[city];
    //const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;


    await fetch(apiUrl)

        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        })
        .then(data => {
            newTemp = Math.floor(data.main.temp);
            mapLocation = `${data.name}, ${data.sys.country}`;

            localStorage.setItem("weatherData", JSON.stringify({
                temp: newTemp,
                location: mapLocation,
                latitude: fLatitude,
                longitude: fLongitude
            }));

            document.getElementById("testTemp").innerHTML = `Temperature: ${mapLocation}: ${newTemp}°C <br> Lat: ${fLatitude} - Lng: ${fLongitude}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });


}




let geoDataWeather;
let geoDataLib = [];
let testObj;
let fetchSaver;
async function fetchForecast() {
    const apiUrlforecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    await fetch(apiUrlforecast)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        })
        .then(data => {
            let dayHours = 0;
            let totalHours = 39;
            let forecastTemp;
            let timeStamp;
            let tempColor = 'white';
            let newTime;

            for (dayHours = 0; dayHours <= 39; dayHours += 8) {
                timeStamp = `${data.list[dayHours].dt_txt}`;
                newTime = timeStamp.slice(0, 10);
                forecastTemp = Math.floor(data.list[dayHours].main.temp);
                if (forecastTemp < 0)
                    tempColor = 'cyan';
                else if (forecastTemp >= 0 && forecastTemp < 13)
                    tempColor = 'yellow';
                else if (forecastTemp >= 13)
                    tempColor = 'orange';
                document.getElementById(`Day${dayHours}`).innerHTML = `<br><font color="cyan">${newTime}</font><br>`;
                document.getElementById(`Day${dayHours}`).innerHTML += `${mapLocation} &#10139 <font color="${tempColor}">${forecastTemp}°C</font>`;
                geoDataWeather = {
                    date: newTime,
                    location: mapLocation,
                    temperature: forecastTemp
                };

                geoDataLib.push(geoDataWeather);

                localStorage.setItem('forecastData', JSON.stringify(geoDataLib));



            }

            console.log("file written");


        })
        .catch(error => {
            console.error('Error:', error);
        });
}


window.onload = function () {
    const savedWeather = localStorage.getItem("weatherData");

    const weather = JSON.parse(savedWeather);
    const forecastSaver = localStorage.getItem("forecastData");
    const forecast = JSON.parse(forecastSaver);
    console.log(forecast);
    let tempColor;
    document.getElementById("testTemp").innerHTML = `Temperature: ${weather.location}: ${weather.temp}°C <br> Lat: ${weather.latitude} - Lng: ${weather.longitude}`;
    for (let dayHours = 0; dayHours <= 39; dayHours += 8) {
        if (forecast[dayHours / 8].temperature < 0)
            tempColor = 'cyan';
        else if (forecast[dayHours / 8].temperature >= 0 && forecast[dayHours / 8].temperature < 13)
            tempColor = 'yellow';
        else if (forecast[dayHours / 8].temperature >= 13)
            tempColor = 'orange';
        document.getElementById(`Day${dayHours}`).innerHTML = `<br><font color="cyan">${forecast[dayHours / 8].date}</font><br>`;
        document.getElementById(`Day${dayHours}`).innerHTML += `${forecast[dayHours / 8].location} &#10139 <font color="${tempColor}">${forecast[dayHours / 8].temperature}°C</font>`;
    }


};


// document.getElementById("getTemp").addEventListener("click", async (event) => {
//     const selectedCity = document.getElementById("city").value;
//     await fetchWeather(selectedCity);
// });

let savedCities = [];
let savedTemps = [];
document.getElementById("saveCity").addEventListener("click", (event) => {
    let forecastLocal = localStorage.getItem('forecastData');
    if(forecastLocal != null)
    {
        fetch('http://127.0.0.1:8080/forecastMap', {
            method: 'POST',
            body: JSON.stringify(JSON.parse(forecastLocal))
        })
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));

    };
});


document.getElementById("resetInfo").addEventListener("click", (event) => {
    geoDataLib.length = 0;
    localStorage.clear();
    window.location.reload();
    
    fetch('http://127.0.0.1:8080/forecastMap', {
            method: 'DELETE',
            body: JSON.stringify(geoDataLib)
        })
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
});


document.getElementById("printSavedData").addEventListener("click", (event) => {
    displayJson();
    

});

async function displayJson() {
    try {
        // Fetch the JSON file
        const response = await fetch('http://127.0.0.1:8080/forecastMap');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        // Read the response as text (raw content)
        const rawData = await response.text();

        // Attempt to parse the JSON
        let data;
        try {
            data = JSON.parse(rawData);
        } catch (parseError) {
            console.warn('Invalid JSON format, displaying raw content instead:', parseError);
            data = null; // If JSON is invalid, `data` will be null
        }

        // Get the pre element and set its text content to either formatted JSON or raw data
        const outputElement = document.getElementById('jsonOutput');

        if (data !== null) {
            // If the JSON is valid, pretty-print it
            outputElement.innerHTML = JSON.stringify(data, null, 2);
        } else if (rawData.length !== 0) {
                outputElement.innerHTML = `<pre>${rawData}</pre>`;
        } else { 
                outputElement.innerHTML = `<pre>You need to select a location and then hit 'SAVE' in order<br> to PRINT DATA</pre>`;
        }

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}


