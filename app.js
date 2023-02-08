const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

const apiKey = "d56b760b57258461022fbf33b9142b42";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputVal = input.value;

  //revisa si ya pinto una ciudad
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter((el) => {
      let content = "";

      if (inputVal.includes(",")) {
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `Ya se esta mostrando la ciudad ${
        filteredArray[0].querySelector(".city-name span").textContent
      } `;
      form.reset();
      input.focus();
      return;
    }
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric&lang=es`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const { main, name, sys, weather , wind} = data;
      const icon = ` http://openweathermap.org/img/wn/${weather[0].icon}.png`;
      const li = document.createElement("li");

      li.classList.add("city");
      const card = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
        <div class="city-humidity"><b>Sensación térmica</b> ${Math.round(main.feels_like)}<sup>°C</sup></div>
        <div class = "city-humidity"><b>Humedad</b> ${main.humidity}%</div>
        <div class = "city-humidity"><b>Velocidad viento </b>${wind.speed} m/s</div>
      `;
      li.innerHTML = card;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Busque una ciudad válida";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});
