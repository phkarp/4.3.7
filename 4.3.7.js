/*Испробуем на практике взаимодействие с DOM и применим fetch для получения настоящих данных о репозиториях GitHub.

Описание функционала
Ссылка на эскизный макет приложения
https://www.figma.com/file/kmqrvsBfrpWa1Pu3v3rgMz/%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F-%D0%B7%D0%B0%D0%B4%D0%B0%D1%87%D0%B0-4.3.7?node-id=0%3A1&t=neyMzgc9olhZAiXr-1

Реализуйте приложение на чистом JavaScript без использования сторонних библиотек, которое будет работать с
общедоступным API GitHub и представлять собой список репозиториев.
Итоговое решение должно состоять из двух элементов, расположенных на странице - поля ввода с автодополнением
(автокомплита) и списка репозиториев:

Автокомплит должен запрашивать данные о репозиториях через API GitHub, каждый раз, когда пользователь обновляет
значение поля ввода и выводить их в выпадающем меню прямо под собой. В выпадающем меню должно быть перечислено
5 названий первых репозиториев, полученных с помощью запроса поиска репозиториев по ключевым словам API GitHub (https://developer.github.com/v3/search/#search-repositories)
с введенным пользователем в поле ввода поисковым запросом. При клике на любой из репозиториев соответствующий
репозиторий должен быть представлен в списке добавленных репозиториев, расположенном ниже.

Список репозиториев отображает добавленные с помощью автокомплита репозитории. Для каждого добавленного в список
репозитория должно быть отображено его название, его владелец и количество звезд на этом репозитории. Кроме того,
возле каждого пункта списка добавленных репозиториев должна быть кнопка удаления, которая, соответственно, удаляет репозиторий из списка.

Чтобы обеспечить хороший опыт работы с приложением для пользователей, необходимо сделать следующие улучшения для автокомплита:

Если поля ввода пустое, то список автодополнений не отображается
При вводе символов в поле ввода запросы не должны отправляться сразу в целях избежания лишних запросов на сервер.
Используйте знания, полученные при решении задачи debounce, для решения этой проблемы
Когда пользователь добавляет репозиторий путем клика на его название в списке автокомплита, поле ввода должно очищаться.


Результат должен быть представлен в виде ссылки на git репозиторий.*/

//создать элементы для: поля ввода, выпадающего меню, списка репозиториев и всего контейнера
const inputField = document.createElement('input');
const dropDownMenu = document.createElement('div');
const listRepository = document.createElement('div');
const container = document.createElement('div');

inputField.style.width = '220px';
inputField.placeholder = 'Введите имя репозитория';

listRepository.style.background = 'black';
listRepository.style.marginTop = '20px';

container.style.background = '#E6D8CC';
container.style.padding = '20px';
container.style.width = '230px';

dropDownMenu.style.display = 'none';

container.append(inputField, dropDownMenu, listRepository);

//функция для создания элемента списка репозиториев
function createElemOfList(elem) {
    const elemOfListRepository = document.createElement('div');
    elemOfListRepository.style.background = '#EFE5C8';
    elemOfListRepository.style.border = '1px solid #7A7A7A';
    elemOfListRepository.style.display = 'flex';
    elemOfListRepository.style.justifyContent = 'space-between';

    const elemForText = document.createElement('div');
    elemForText.style.overflow = 'hidden';
    elemForText.style.marginRight = '5px';
    elemForText.style.overflowWrap = 'break-word';

    const name = document.createElement('p');
    const owner = document.createElement('p');
    const stars = document.createElement('p');

    name.style.margin = '0';
    name.style.width = '180px';

    owner.style.margin = '0';
    owner.style.width = '180px';

    stars.style.margin = '0';
    stars.style.width = '180px';

    name.textContent = `Name: ${elem.dataset.name}`;
    owner.textContent = `Owner: ${elem.dataset.owner}`;
    stars.textContent = `Stars: ${elem.dataset.stars}`;

    const btn = document.createElement('button');
    btn.style.width = '40px';
    btn.style.width = '40px';
    btn.style.color = 'red';
    btn.style.background = 'rgba(0, 0, 0, 0)';
    btn.style.fontSize = '15px';
    btn.style.margin = '0';
    btn.style.padding = '0';
    btn.style.border = 'none';

    btn.textContent = 'DEL';
    btn.dataset.btn = 'true';

    elemForText.append(name, owner, stars);
    elemOfListRepository.append(elemForText, btn);

    return elemOfListRepository;
}

//функция для создания элемента выпадающего меню
function createItemMenu(name) {
    const itemMenu = document.createElement('div');

    itemMenu.style.width = '205px';
    itemMenu.style.height = '20px';
    itemMenu.style.background = '#E6E6E5';
    itemMenu.style.border = '1px solid black';
    itemMenu.style.borderTop = '';
    itemMenu.style.overflow = 'hidden';

    itemMenu.textContent = name;

    return itemMenu;
}

//функция для задержки запроса
function debounce(fn, ms) {
    let timeout = null;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), ms);
    }
}

//функция запроса на сервер по имени репозитория
function requestRepository(value) {
    return fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
        .then(response => response.json())
        .then(repositories => {
            const arr = [...repositories.items];
            addMenu(arr);
            return repositories.items;
        })
        .catch(err => console.error(err));
}

//функция добавления данных запроса в выпадающее меню
function addMenu(arr) {
    dropDownMenu.innerHTML = '';

    if (arr.length === 0) {
        const elem = createItemMenu('Не найдено репозиториев');
        dropDownMenu.append(elem);
        dropDownMenu.style.display = 'block';
        return;
    }

    arr.forEach((repository) => {
        const elem = createItemMenu(repository.name);
        elem.setAttribute('data-item-menu', 'true');

        elem.setAttribute('data-name', `${repository.name}`);
        elem.setAttribute('data-owner', `${repository['owner']['login']}`);
        elem.setAttribute('data-stars', `${repository['stargazers_count']}`);

        dropDownMenu.append(elem);
        dropDownMenu.style.display = 'block';
    })
}

//функция запроса с установленной задержкой
const requestRepositoryDebounce = debounce(requestRepository, 300);

//слушатель события введения букв в поле ввода
inputField.addEventListener('input', () => {
    if (inputField.value !== '') {
        requestRepositoryDebounce(inputField.value);
    } else {
        dropDownMenu.innerHTML = '';
    }
})

//слушатель события click на всем документе с использованием делегирования
document.addEventListener('click', (event) => {
    let target = event.target;

    if (target.dataset.itemMenu) {
        const newElemOfList = createElemOfList(event.target);

        listRepository.append(newElemOfList);

        inputField.value = '';
        dropDownMenu.innerHTML = '';
    }

    if (target.dataset.btn) {
        target.parentElement.remove();
    }
})

document.body.append(container);
