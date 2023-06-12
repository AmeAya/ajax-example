function createRequest() {
    var Request = false; // Создаем переменную Request со значением false

    if (window.XMLHttpRequest) { // Проверяем поддерживает ли браузер Gecko
        // Для совеременных браузеров по типу chrome, safari, mozilla и т.д.
        Request = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        // Для старых браузеров без Gecko, например, Internet Explorer
        try {
            Request = new ActiveXObject('Microsoft.XMLHTTP');
        }
        catch (exception) {
            Request = new ActiveXObject('Msxml2.XMLHTTP');
        }
    }

    if (Request == false) {
        alert('Can`t create Request for this Browser!!!');
    }

    return Request;
}

function sendRequest(r_method, r_url, r_args, r_handler) {
    // r_method - Метод запроса, рассматриваем либо get, либо post;
    // r_url - Юрл адресс куда должен быть отправлен запрос;
    // r_args - Дополнительные аргументы (Например, id=5, name='Banana' и т.д.);
    // r_handler - Обработчик ответа от сервера
    // (Raw data - Сырые данные нужно правильно обработать/сериализировать).

    var Request = createRequest(); // Создаем запрос

    if (Request == false) { // На случай, если запрос не был корректно создан
        return;
    }

    var image = document.getElementById('loading_image'); // Достаем картинку загрузки

    // onreadystatechange - event, событие.
    // Срабатывает тогда, когда у запроса меняется статус.
    // 0 - Запрос не инициализирован(Запрос не создан);
    // 1 - Запрос загружает свои данные
    // 2 - Запрос закончил загрузку своих данных
    // 3 - Запрос загружает данные с сервера(Получает ответ)
    // 4 - Запрос получил данные от сервера(Ответ получен полностью)
    Request.onreadystatechange = function() {
        if (Request.readyState == 4) { // Проверяем статус запроса
            // Если статус 4, то полученные данные передает в обработчик
            r_handler(Request);
            image.hidden = true; // Скрываем картинку загрузки когда ответ получен
        }
    }

    if (r_method.toLowerCase() == 'get') {
        // Если это get запрос, то мы формируем ссылку таким образом,
        // чтобы аргументы были в url запроса через символ '?'
        // Например, если r_url = 'https://jsonplaceholder.typicode.com/users',
        // а r_args = 'id=1'
        // То после, получится r_url = 'https://jsonplaceholder.typicode.com/users?id=1'
        r_url = r_url + '?' + r_args;
    }

    // Для post метода мы не меняем url

    Request.open(r_method, r_url, true)
    // Request.open(method, url, async, user, password)
    // method - метод запроса;
    // url - юрл адресс куда идет запрос;
    // async - булевый параметр, если true то запрос асинхронный;
    // user - логин пользователя на сервере;
    // password - пароль от пользователя на сервере.

    if (r_method.toLowerCase() == 'post') { // Если метод post
        // Устанавливаем заголовки
        Request.setRequestHeader('Content-Type', 'application x-www-form-urlencoded; charset=utf-8');

        // Отправляем post запросом наши аргументы
        Request.send(r_args);
    } else { // Если это get запрос
        // Отправляем пустой запрос, так как все аргументы уже есть в юрл адресе
        Request.send(null);
    }

    image.hidden = false; // Показываем картинку загрузки пока ответ не получен
}

function Handler(Request) { // Обработчик полученный информации
    var div = document.getElementById('div-id-1'); // Достаем наш div контейнер
    div.innerHTML = Request.responseText; // Засовываем текст ответа в innerHTML контейнера
}

function GetData() {
    // Получаем юрл из инпута с id='input-url'
    var input_url = document.getElementById('input-url').value;

    // Получаем аргументы из инпута с id='input-args'
    var input_args = document.getElementById('input-args').value;

    // Вызываем функцию для отправки запроса
    sendRequest('GET', input_url, input_args, Handler);
}
