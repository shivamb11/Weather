const form = document.querySelector('form');
const loc = document.querySelector('.location-input');
const time1 = document.querySelector('.time1');
const time2 = document.querySelector('.time2');
const timezone = document.querySelector('.timezone');
const tempSwitch = document.querySelector('.switch');
const tempBtn = document.querySelector('.temp-btn');
const dailyBtn = document.querySelector('.daily-btn');
const hourlyBtn = document.querySelector('.hourly-btn');
const dailyContainer = document.querySelector('.daily-container');
const hourlyContainer = document.querySelector('.hourly-container');
const day1 = document.querySelector('#day1');
const day2 = document.querySelector('#day2');
const day3 = document.querySelector('#day3');
const days = [day1, day2, day3];
const hour1 = document.querySelector('#hour1');
const hour2 = document.querySelector('#hour2');
const hour3 = document.querySelector('#hour3');
const hours = [hour1, hour2, hour3];
const monthsName = [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const daysName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let temp_unit = 'C';
let duration = 'daily';

class DailyWeather {
    constructor(date, max, min, remark) {
        this.date = date;
        this.max = max;
        this.min = min;
        this.remark = remark;
    }
}

class HourlyWeather {
    constructor(hour, temp, wind, remark) {
        this.hour = hour;
        this.temp = temp;
        this.wind = wind;
        this.remark = remark;
    }
}

const dailyWeatherArr = [];
const hourlyWeatherArr = [];

const setTime = function() {
    const currDate = new Date();
    let hrs = currDate.getHours().toString();
    let min = currDate.getMinutes().toString();
    let day = currDate.getDay().toString();
    let date = currDate.getDate().toString();
    let month = currDate.getMonth().toString();
    
    if(hrs.length == 1) hrs = `0${hrs}`;
    if(min.length == 1) min = `0${min}`;

    time1.innerHTML = `${hrs}:${min}`;
    time2.innerHTML = `${daysName[day]}, ${date} ${monthsName[parseInt(month)+1]}`;
}

setTime();
setInterval(setTime, 30000);

const setDate = function(date) {
    return `${parseInt(date[8]+date[9])} ${monthsName[parseInt(date[5]+date[6])]}`;
}

const setTempVal = function(temperature) {
    if(temperature.Unit === 'F') {
        return {'F' : temperature.Value, 'C' : Math.round(((temperature.Value-32)*5/9)*100)/100};
    }
    else {
        return {'C' : temperature.Value, 'F' : Math.round(((temperature.Value*9)/5+32)*100)/100}
    }
}

const setRemark = function(daily) {
    return {'day' : daily.Day.IconPhrase, 'night' : daily.Night.IconPhrase};
}

const setDailyWeather = function(daily) {
    const date = setDate(daily.Date);
    const max = setTempVal(daily.Temperature.Maximum);
    const min = setTempVal(daily.Temperature.Minimum);
    const remark = setRemark(daily);

    const dailyWeatherObj = new DailyWeather(date, max, min, remark);
    return dailyWeatherObj;
}

const setHour = function(dateTime) {
    const time = parseInt(dateTime[11]+dateTime[12]);
    if(time == 0) {
        return `12 AM`;
    }
    else if(time < 12) {
        return `${time} AM`;
    }
    else if(time == 12) {
        return `12 PM`;
    }
    else {
        return `${time-12} PM`;
    }    
}

const setWind = function(wind) {
    return `${wind.Value} ${wind.Unit}`;
}

const setHourlyWeather = function(hourly) {
    const date = setHour(hourly.DateTime);
    const temp = setTempVal(hourly.Temperature);
    const wind = setWind(hourly.Wind.Speed);
    const remark = hourly.IconPhrase;

    const hourlyWeatherObj = new HourlyWeather(date, temp, wind, remark);
    return hourlyWeatherObj;
}

const changeTempUnit = function () {
  for (let i = 0; i < dailyWeatherArr.length; i++) {
    days[i].children[1].innerHTML = `<i class="fa-solid fa-temperature-high fa-lg" style="color: #ffffff;"></i> : ${dailyWeatherArr[i].max[temp_unit]}°${temp_unit}`;
    days[i].children[2].innerHTML = `<i class="fa-solid fa-temperature-empty fa-lg" style="color: #ffffff;"></i> : ${dailyWeatherArr[i].min[temp_unit]}°${temp_unit}`;
  }
}

const changeTempUnit2 = function() {
    for(let i=0; i<hourlyWeatherArr.length; i++) {
        hours[i].children[1].innerHTML = `<i class="fa-solid fa-temperature-half fa-lg" style="color: #ffffff;"></i> : ${hourlyWeatherArr[i].temp[temp_unit]}°${temp_unit}`;
    }
}

const displayTempVal = function() {
    for(let i=0; i<days.length; i++) {
        let children = Array.from(days[i].children);
        children[0].innerHTML = dailyWeatherArr[i].date;
        children[1].innerHTML = `<i class="fa-solid fa-temperature-high fa-lg" style="color: #ffffff;"></i> : ${dailyWeatherArr[i].max[temp_unit]}°${temp_unit}`;
        children[2].innerHTML = `<i class="fa-solid fa-temperature-empty fa-lg" style="color: #ffffff;"></i> : ${dailyWeatherArr[i].min[temp_unit]}°${temp_unit}`;
        children[3].innerHTML = `<i class="fa-regular fa-sun fa-lg" style="color: #ffffff;"></i> : ${dailyWeatherArr[i].remark.day}`;
        children[4].innerHTML = `<i class="fa-regular fa-moon fa-lg" style="color: #ffffff;"></i> : ${dailyWeatherArr[i].remark.night}`;
    }
}

const displayTempVal2 = function() {
    for(let i=0; i<hours.length; i++) {
        let children = Array.from(hours[i].children);
        children[0].innerHTML = hourlyWeatherArr[i].hour;
        children[1].innerHTML = `<i class="fa-solid fa-temperature-half fa-lg" style="color: #ffffff;"></i> : ${hourlyWeatherArr[i].temp[temp_unit]}°${temp_unit}`;
        children[2].innerHTML = `<i class="fa-solid fa-wind fa-lg" style="color: #ffffff;"></i> : ${hourlyWeatherArr[i].wind}`;
        children[3].innerHTML = `<i class="fa-solid fa-water fa-lg" style="color: #ffffff;"></i> : ${hourlyWeatherArr[i].remark}`;
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    timezone.classList.remove('hide');
    tempSwitch.classList.remove('hide');
    dailyBtn.classList.remove('hide');
    hourlyBtn.classList.remove('hide');
    if(!dailyBtn.classList.contains('active')) dailyBtn.classList.add('active');
    if(hourlyBtn.classList.contains('active')) hourlyBtn.classList.remove('active');
    dailyContainer.classList.remove('hide');
    if(!hourlyContainer.classList.contains('hide')) hourlyContainer.classList.add('hide');
    tempBtn.checked = false;

    temp_unit = 'C';
    duration='daily';

    dailyWeatherArr.length = 0;
    hourlyWeatherArr.length = 0;

    for(let day of days) {
        let children = Array.from(day.children);
        for(let child of children) {
            child.remove();
        }
    }

    for(let hour of hours) {
        let children = Array.from(hour.children);
        for(let child of children) {
            child.remove();
        }
    }

    try {
        const locValue = loc.value;

        const url1 = `/.netlify/functions/weather1?locValue=${locValue}`;
        const res1 =  await fetch(url1);
        const data1 = await res1.json();

        const locKey = data1[0].Key;
        timezone.innerHTML = 'Timezone : ' + data1[0].TimeZone.Name;

        const url2 = `/.netlify/functions/weather2?locKey=${locKey}`;
        const res2 =  await fetch(url2);
        const data2 = await res2.json();

        for(let i=0; i<=2; i++) {
            const daily = data2.DailyForecasts[i];

            const dailyWeatherObj = setDailyWeather(daily);
            dailyWeatherArr.push(dailyWeatherObj);

            const h2 = document.createElement('h2');
            const h4a = document.createElement('h4');
            const h4b = document.createElement('h4');
            const h4c = document.createElement('h4');
            const h4d = document.createElement('h4');
            days[i].append(h2, h4a, h4b, h4c, h4d);
        }
        displayTempVal();

        const url3 = `/.netlify/functions/weather3?locKey=${locKey}`;
        const res3 = await fetch(url3);
        const data3 = await res3.json();

        for(let i=0; i<=2; i++) {
            const hourly = data3[i];

            const hourlyWeatherObj = setHourlyWeather(hourly);
            hourlyWeatherArr.push(hourlyWeatherObj);

            const h2 = document.createElement('h2');
            const h4a = document.createElement('h4');
            const h4b = document.createElement('h4');
            const h4c = document.createElement('h4');
            hours[i].append(h2, h4a, h4b, h4c);
        }
        displayTempVal2();
    }   
    catch(e) {
        console.log(e);
    }
})

tempBtn.addEventListener('click', () => {    
    if(temp_unit === 'C') {
        temp_unit = 'F';
    }
    else {
        temp_unit = 'C';
    }
    if(duration === 'daily') {
        changeTempUnit();
    }
    else {
        changeTempUnit2();
    }    
})

dailyBtn.addEventListener('click', () => {
    if(duration === 'daily') return;
    duration = 'daily';
    if(!hourlyContainer.classList.contains('hide')) hourlyContainer.classList.add('hide');
    dailyContainer.classList.remove('hide');
    dailyBtn.classList.add('active');
    hourlyBtn.classList.remove('active');
    displayTempVal();
})

hourlyBtn.addEventListener('click', () => {
    if(duration === 'hourly') return;
    duration = 'hourly';
    if(!dailyContainer.classList.contains('hide')) dailyContainer.classList.add('hide');
    hourlyContainer.classList.remove('hide');
    hourlyBtn.classList.add('active');
    dailyBtn.classList.remove('active');
    displayTempVal2();
})
