const btn = document.querySelector('.main__button');
const screenContent = document.querySelector('.main_screen-content');
const geoContent = document.querySelector('.main_geo-content');

const screenSize = () => {
    return {
        width: screen.width,
        height: screen.height
    };
}

// Функция, выводящая текст об ошибке
const geoError = () => {
    geoContent.textContent =  'Невозможно получить ваше местоположение';
}

// Функция, срабатывающая при успешном получении геолокации
const geoSuccess = (position) => {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;

    geoContent.textContent = `Широта: ${latitude} °, Долгота: ${longitude} °`;
}

btn.addEventListener('click', () => {
    screenContent.textContent = `${screenSize().width} on ${screenSize().height} px`;

    if (!navigator.geolocation) {
        geoContent.textContent = 'Geolocation не поддерживается вашим браузером';
    } else {
        geoContent.textContent = 'Определение местоположения…';
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    }
});

