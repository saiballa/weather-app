
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const apiKey = "3a84b4c64bd25162b0dcbc63834d8ab8";
const mainConatiner = document.getElementById('wheatherInfo');
const modal = document.getElementById('detailsModal');
const closeModal = document.getElementById('closeModal');

async function getWeatherData(city){
     try{
        let response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        let data = await response.json();
        getForcastData(city);
        updateUI(data);
    }
    catch(err){
        console.log(err);
    }
}

async function getForcastData(city){
    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        let data = await response.json();
        timeList(data);
    }
    catch(err){
        console.log(err);
    }
}

async function getSearchData(){
    const city = document.getElementById('inputVal').value.trim();
    if(!city){
        alert('type something in input box');
        return;
    }
    document.getElementById('inputVal').value="";
    try{
        let response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if(response.status == 404){
            throw new Error('error');
        }
        let data = await response.json();
        getForcastData(city);
        updateUI(data);
    }
    catch(err){
        console.log(err);
       modal.style.display="block";
    }
}


function timeList(data){
    const times ="18:00:00";
    const result = [];

    for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    result.push(`${formattedDate} ${times}`);
    };
    let filterData = data.list.filter(item =>
        result.includes(item.dt_txt)
    );
    setForeCastData(filterData);
}

getWeatherData('kolkata');

function updateUI(data){
    
    const place = document.querySelector('#placeTime > .place');
    const timeToShow = document.querySelector('#placeTime > .date');
    const img = document.querySelector('#imgTmp >.img-container > img');
    const temp = document.querySelector('#imgTmp > p');
    const type = document.querySelector('#imgTmp > span');
    const humidityText = document.querySelector('#humidity > span');
    const pressureText = document.querySelector('#pressure > span');
    const windText = document.querySelector('#wind > span');
    const visibilityText = document.querySelector('#visibility > span');
    const maxTempText = document.querySelector('#maxTemp > span');
    let source = data.weather[0].main.toLowerCase();
    const d = new Date();

    place.textContent=data.name;
    timeToShow.textContent=d.toDateString();
    img.src=`./images/${source}.png`;
    temp.textContent=`${Math.floor(data.main.temp)} \u00B0C`;
    type.textContent=data.weather[0].main;
    humidityText.textContent=`${data.main.humidity}%`;
    pressureText.textContent=`${data.main.pressure} hpa`;
    windText.textContent=`${data.wind.speed} km/h`;
    visibilityText.textContent=`${Math.floor(data.visibility/100)} kms`
    maxTempText.textContent=`${data.main.temp_max} \u00B0C`
}

function setForeCastData(data){
    const container = document.getElementById('forcast');
    container.innerHTML="";
    data.forEach((item)=>{
        let card = eachDayTemplate(item);
        container.appendChild(card);
   })
    
}

function eachDayTemplate(details){
    let card = document.createElement('div');
    let currentDate = document.createElement('p');
    let imgCon = document.createElement('div');
    let img = document.createElement('img');
    let temp = document.createElement('p');
    let source = details.weather[0].main.toLowerCase();

    const d = new Date(details.dt * 1000);
    const day = d.getDate(); // date
    const month = d.toLocaleString("en-IN", { month: "short" }); // Dec

    card.classList.add('forecast-card');
    currentDate.textContent=`${day} ${month}`
    img.src=`./images/${source}.png`;
    img.alt='image';
    imgCon.classList.add('img-container');
    imgCon.appendChild(img);
    temp.textContent=`${Math.floor(details.main.temp)} \u00B0C`;

    card.appendChild(currentDate);
    card.appendChild(imgCon);
    card.appendChild(temp);

    return card;
}

closeModal.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target == modal) {
            modal.style.display = "none";
    }
};