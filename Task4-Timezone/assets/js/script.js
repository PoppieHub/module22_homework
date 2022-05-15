const btn = document.querySelector('.main__button');
const timezoneContent = document.querySelector('.main_timezone-content');
const localTimeContent = document.querySelector('.main_localTime-content');

// Функция, выводящая текст об ошибке
const geoError = () => {
    console.log('Невозможно получить ваше местоположение');
}

// Функция, срабатывающая при успешном получении геолокации
const geoSuccess = (position) => {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    const url = `https://api.ipgeolocation.io/timezone?apiKey=32bcd4a6e4b548968e7afcdb682ac679&lat=${latitude}&long=${longitude}`;

    //отправка запроса
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            timezoneContent.textContent = `${data.timezone}`;
            localTimeContent.textContent = `${data.date_time_txt}`;
        })
        .catch(() => {
            timezoneContent.textContent = 'Ошибка загрузки данных';
            localTimeContent.textContent = 'Ошибка загрузки данных';
        });
}

btn.addEventListener('click', () => {

    if (!navigator.geolocation) {
        console.log('Geolocation не поддерживается вашим браузером');
    } else {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    }
});

