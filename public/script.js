const searchInput = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const cards = document.querySelectorAll(".card");
const forecast = document.querySelector(".forecast");
const error = document.querySelector(".error-message");
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toggleButton = document.querySelector(".slider");
const body = document.querySelector("body");
const locationName = document.querySelector(".city-name");

// Add EventListener to button
searchBtn.addEventListener("click", () => {
    getWeatherData();
    searchInput.value = '';
})

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        getWeatherData();
        searchInput.value = '';
    }
})

function getWeatherData() {
    const textPattern = /\d/;
    const location = searchInput.value;

    // Check if user input is valid
    if (textPattern.test(location)) {
        searchInput.classList.add("invalid-input")
    } else {
        searchInput.classList.remove("invalid-input")
        // Fetch data from endpoint
        fetch(`/getWeatherData?userInput=${location}`)  
        .then(response => {
            if (!response.ok) {
                error.style.display = "block";
                forecast.style.display = "none";
                for(let i = 0; i < 5; i++) {
                    const card = cards[i];
                    card.style.display = "none";
                }
                throw new Error('Response returned an error.');
            }
            // Extract and parse the JSON data
            return response.json();
        })
        .then(data => {
            error.style.display = "none";
            forecast.style.display = "block";
            const city = data["city"][0].name;
            locationName.innerHTML = ` for ${city}`;

            //forecast.innerHTML = `5 day forecast for ${city}`;
            const currentDate = new Date();

            for(let i = 0; i < 5; i++) {
                const card = cards[i];
                const item = data["weather"]["daily"][i];
                const weather = item.weather[0].main;
                const nextDate = new Date();
                nextDate.setDate(currentDate.getDate() + i)
                const nextDay = nextDate.getDay();
                const weatherIcon = card.querySelector(".weather-icon");

                card.querySelector(".day").innerHTML = daysOfWeek[nextDay];
                card.querySelector(".city").innerHTML = city;
                card.querySelector(".temp").innerHTML = Math.round(item.temp.day) + "°C";
                card.querySelector(".humidity").innerHTML = Math.round(item.humidity) + "%";
                card.querySelector(".wind").innerHTML = item.wind_speed.toFixed(1) + "m/s";

                if (weather === 'Rain') {
                    weatherIcon.src = "/static/rain.png";
                } else if (weather === 'Clear') {
                    weatherIcon.src = "/static/sun.png";
                } else if (weather === 'Clouds') {
                    weatherIcon.src = "/static/cloud.png";
                } else if (weather === 'Snow') {
                    weatherIcon.src = "/static/snow.png";
                } else {
                    weatherIcon.src = "/static/cloud-sun.png";
                }
                card.style.display = "block";
            }
        })
        .catch(error => console.error(error));
    }
}

function capitalizeInput(input) {
    const words = input.split(" ");

    const capitalizedWords = words.map(word => {
        if (word.length > 0) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word;
    })

    return capitalizedWords.join(" ");
}

// Remove the invalid-input class once the user clicks inside the input field
searchInput.addEventListener("click", () => {
    searchInput.classList.remove("invalid-input")
})

// Add dark mode
toggleButton.addEventListener("click", () => {
    body.classList.toggle("body-dark");
    forecast.classList.toggle("forecast-dark");
    searchInput.classList.toggle("search-dark");
    searchBtn.classList.toggle("search-dark");

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        card.classList.toggle("card-dark");
    }
})

// Add hover effect
searchBtn.addEventListener("mouseover", (e) => {
    if (body.classList.contains("body-dark")) {
        searchBtn.setAttribute("id", "hover-effect-dark")
    } else {
        searchBtn.setAttribute("id", "hover-effect-light");
    }
})

// Remove hover effect
searchBtn.addEventListener("mouseout", (e) => {
    if (body.classList.contains("body-dark")) {
        searchBtn.removeAttribute("id", "hover-effect-dark")
    } else {
        searchBtn.removeAttribute("id", "hover-effect-light");
    }
})