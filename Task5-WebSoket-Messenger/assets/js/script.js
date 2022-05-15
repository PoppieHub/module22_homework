const btnSendMessage = document.querySelector('.messenger__send-btn');
const btnSendGeo = document.querySelector('.messenger__send-geo-btn');
const message = document.querySelector('.messenger__input');
const messageList = document.querySelector('.messenger__main');

/* Указатель, для отрисовки/не отрисовки сообщений */
let flag = true;

/* Дефолтный объект, для отрисовки сообщений  */
const messageObj = {
    selectorName: 'div',
    parentElement: messageList
}

/* Api возвращающее, то что отправил на сервер  */
const wsURL = 'wss://ws.ifelse.io';

let websocket;

/* Функция создающая dom-элементы  */
const addElement = (obj) => {
    if (obj.value || obj.childElement) {
        let element = document.createElement(obj.selectorName);
        (obj.classListName.length > 0)? element.classList.add(...obj.classListName): false;
        element.innerHTML = obj.value;
        (obj.childElement)? element.appendChild(obj.childElement): false;
        (obj.parentElement)? obj.parentElement.appendChild(element): false;

        return element;
    }
}

/* Функция обработки ошибки гео-локации */
const geoError = () => {
    let messageBodyObj = messageObj;
    messageBodyObj.classListName = ['messenger__main-msg', 'right'];
    messageBodyObj.value = `<span style='color: red;'>Error:</span> Невозможно получить ваше местоположение`;

    addElement(messageBodyObj);
}

/* Функция обработки успешной гео-локации */
const geoSuccess = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const url = `https://www.openstreetmap.org/#map=15/${latitude}/${longitude}`;

    /* отправляем на сервер */
    websocket.send(`${latitude}, ${longitude}`);

    /* Создаем dom-элемент (ссылка) */
    let geoLink = addElement({
        selectorName: 'a',
        classListName: [],
        value: 'Гео-локация'
    });
    geoLink.href = url;

    /* Создаем dom-элемент (сообщение и помещаем туда ссылку) */
    addElement({
        selectorName: 'div',
        parentElement: messageList,
        childElement: geoLink,
        value: '',
        classListName: ['messenger__main-msg', 'right'],
    });

}

btnSendMessage.addEventListener('click', () => {
    let messageBodyObj = messageObj;
    messageBodyObj.value = message.value;
    messageBodyObj.classListName = ['messenger__main-msg', 'right'];

    addElement(messageBodyObj);

    /* Разрешаем вывод сообщения */
    flag = true;
    websocket.send(message.value);
    message.value = null;
});

btnSendGeo.addEventListener('click', () => {
    if (!navigator.geolocation) {
        let messageBodyObj = messageObj;
        messageBodyObj.classListName = ['messenger__main-msg', 'right'];
        messageBodyObj.value = `<span style='color: red;'>Error:</span> Геолокация не поддерживается вашим браузером`;

        addElement(messageBodyObj);
    } else {
        /* Запрещаем вывод сообщения */
        flag = false;
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    }
});

/* Инициализируем WebSocket и описываем события */
websocket = new WebSocket(wsURL);
websocket.onopen = (event) => {
    let messageBodyObj = messageObj;
    messageBodyObj.classListName = ['messenger__main-msg', 'left'];
    messageBodyObj.value = `<span style='color: green;'>Connected</span>`;

    addElement(messageBodyObj);
};
websocket.onerror = (event) => {
    let messageBodyObj = messageObj;
    messageBodyObj.classListName = ['messenger__main-msg', 'left'];
    messageBodyObj.value = `<span style='color: red;'>Error:</span> ${event.data}`;

    addElement(messageBodyObj);
};
websocket.onmessage = (event) => {
    let messageBodyObj = messageObj;
    messageBodyObj.classListName = ['messenger__main-msg', 'left'];
    messageBodyObj.value = event.data;

    /* Проверяем разрешение на вывод сообщения */
    if (flag) {
        addElement(messageBodyObj);
    }
};
