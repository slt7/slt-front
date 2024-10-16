document.cookie.split(";").forEach(c => document.cookie = c.split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");

document.addEventListener('DOMContentLoaded', function () {
    const APPEAL_TO_USERS = "Уважаемый клиент, к сожалению, при расчете ставки по вашему запросу возникла ошибка. <br>" +
        "Пожалуйста, свяжитесь с нашей поддержкой в Telegram по адресу" +
        " <a href='https://t.me/SLTSupport' target='_blank'>@SLTSupport</a>. <br>" +
        "Для более быстрого и эффективного решения вашей проблемы, пожалуйста, прикрепите скриншот вашего запроса.";
    const APPEAL_TO_USERS_HUGE_WEIGHT = "Уважаемый клиент, Вы ввели слишком большое значение в поле вес. " + "Вес должен быть заполнен в тоннах. Пожалуйста, проверьте введенное значение. Пожалуйста, при обращении прикрепите скриншот вашего запроса."
    const APPEAL_TO_USERS_EXCEED_PRIME = "Уважаемый клиент, время простоя Ваше ТС должно быть в диапазоне от 1ч до 9999ч. ";

    const DOMAIN_NAME = "http://127.0.0.1:8000";
    const FILL_IN_THE_FIELDS = 'Уважаемый клиент,пожалуйста, заполните все поля.'
    const transportSelect = document.getElementById('transport');
    const typeContainer = document.getElementById('batchConSelect');
    const loadingAddressInput = document.getElementById('loading_address');
    const unloadingAddressInput = document.getElementById('unloading_address');
    const additionalAddresses = document.getElementById('additional_addresses');
    const addAddressBtn = document.getElementById('add_address');
    const calculateBtn = document.getElementById('calculate');
    const weightInput = document.getElementById('weight');
    const volume = document.getElementById('volume');
    const volumeInput = document.getElementById('volume_input')
    const resultParagraph = document.getElementById('result');
    const distanceParagraph = document.getElementById('distance');
    const needGenerator = document.getElementById('generator_select');
    const needOwnGenerator = document.getElementById('own_generator_select');
    const selectEmptyContainer = document.getElementById('select_empty_container')
    const emptyContainerDiv = document.getElementById('empty_container')
    const requestBtn = document.getElementById('requestBtn');
    const popupForm = document.getElementById("popup-form");
    const nameClientBid = document.getElementById('name_client_bid')
    const phoneInputBid = document.getElementById('tel_client_bid')
    const emailClientBid = document.getElementById('email_client_bid')
    const successMessage = document.getElementById('message-success')
    const class_of_danger = document.getElementById('class_of_danger')

    const requestDiscount = document.getElementById('findCheaperBtn');
    const discount = document.getElementById("form-request_discount");
    const nameClientDis = document.getElementById('name_client_discount')
    const phoneInputDis = document.getElementById('tel_client_discount')
    const emailClientDis = document.getElementById('email_client_discount')
    const costTransit = document.getElementById('cost_transit ')
    const successMessageDis = document.getElementById('message-success-discount')
    const commentDis = document.getElementById('comment_client_discount')

    const cntAmPerMonth = document.getElementById('cnt_am')
    const cntAmPerPart = document.getElementById('cnt_am_batch')
    const excessPrime = document.getElementById('excess prime')
    const excessPriveValueDiv = document.getElementById('excess prime value div')
    const excessPrimeValueInput = document.getElementById('excess prime value input')
    const comment = document.getElementById('comment_client_bid')

    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
    document.head.appendChild(leafletScript);

    const machineScript = document.createElement('script');
    machineScript.src = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js';
    document.head.appendChild(machineScript);

    const searchScript = document.createElement('script');
    searchScript.src = 'https://unpkg.com/@geoapify/leaflet-address-search-plugin@^1/dist/L.Control.GeoapifyAddressSearch.min.js';
    document.head.appendChild(searchScript);

    const jQuery = document.createElement('script');
    searchScript.src = "https://code.jquery.com/jquery-3.4.1.min.js";
    document.head.appendChild(jQuery);

    const jQueryUi = document.createElement('script');
    searchScript.src = "https://code.jquery.com/ui/1.13.1/jquery-ui.min.js";
    document.head.appendChild(jQueryUi);

    const containerTypesDiv = document.getElementById('containerTypes');
    containerTypesDiv.style.display = 'block';

    function autoCloseModal(modal, delay) {
        setTimeout(function () {
            modal.classList.remove("active");
        }, delay);
    }

    transportSelect.addEventListener("change", function () {
        const selectedType = this.value;

        if (selectedType.toLowerCase() === "Фура (Любой закрытый полуприцеп)".toLowerCase()) {
            volume.classList.add("visible");
            addAddressBtn.disabled = true;
            emptyContainerDiv.style.display = "none";
            class_of_danger.style.display = "none";

        } else {
            volume.classList.remove("visible");
            addAddressBtn.disabled = false;
            emptyContainerDiv.style.display = "block";
            class_of_danger.style.display = "block";
        }
    })

    selectEmptyContainer.addEventListener('change', function () {
        if (this.value === 'Да') {
            weightInput.disabled = true;
            weightInput.value = 1;

            classDanger.disabled = true;
            classDanger.value = 'Нет';
        } else {
            weightInput.disabled = false;
            classDanger.disabled = false;
        }
    });


    excessPrime.addEventListener('change', function () {
        if (excessPrime.value === "Да") {
            excessPriveValueDiv.style.display = 'block';
        } else {
            excessPriveValueDiv.style.display = 'none'
        }
    })

    transportSelect.addEventListener('change', function () {
        const selectedTransport = transportSelect.value;
        if (selectedTransport === 'Контейнеровоз') {
            containerTypesDiv.style.display = 'block';
        } else {
            containerTypesDiv.style.display = 'none';
            document.getElementById('generator').style.display = 'none';
            document.getElementById('own_generator').style.display = 'none';
        }
    });

    typeContainer.addEventListener('change', function () {
        const containerType = typeContainer.value;
        if (containerType === "40' HC REF CONTAINER") {
            document.getElementById('generator').style.display = 'block';
        } else {
            document.getElementById('generator').style.display = 'none';
        }
    });


    needGenerator.addEventListener('change', function () {
        const ownGen = needGenerator.value === "Да";
        document.getElementById('own_generator').style.display = ownGen ? 'block' : 'none';
    });

    //Запрос к апи для вывода типа транспорта
    const getTypeTransp = async () => {
        const response = await fetch(`${DOMAIN_NAME}/api/v1/logics/type_transport/`);
        const data = await response.json();
        data.pop();
        return data;
    };

    const displayTypeTransportOption = async () => {
        const options = await getTypeTransp();

        options.sort((a, b) => a.name.localeCompare(b.name));

        const containerIndex = options.findIndex(option => option.name === "Контейнеровоз");
        if (containerIndex !== -1) {
            const [containerOption] = options.splice(containerIndex, 1);
            options.unshift(containerOption);
        }

        for (option of options) {
            const newOption = document.createElement("option");
            newOption.value = option.name;
            newOption.text = option.name;
            transport.appendChild(newOption);
        }
    };

    displayTypeTransportOption();

    //Запрос к апи для вывода типа контейнеров
    const getCont = async () => {
        const response = await fetch(`${DOMAIN_NAME}/api/v1/logics/containers/`);
        const data = await response.json();
        return data;
    };

    const displayConOption = async () => {
        const options = await getCont();


        for (option of options) {
            const newOption = document.createElement("option");
            newOption.value = option.name_en;
            newOption.text = option.name_en;
            batchConSelect.appendChild(newOption);
        }
    };

    displayConOption();

    //Запрос к апи для получения классов опасности
    const classDanger = document.getElementById("batchSelect");
    const getPost = async () => {
        const response = await fetch(`${DOMAIN_NAME}/api/v1/logics/cargo_classes/`);
        const data = await response.json();
        return data;
    };

    const displayOption = async () => {
        const options = await getPost();

        const defaultOption = document.createElement("option");
        defaultOption.value = '';
        defaultOption.text = "Нет";
        classDanger.appendChild(defaultOption);

        for (option of options) {
            const newOption = document.createElement("option");
            newOption.value = option.classification;
            newOption.text = option.classification;
            classDanger.appendChild(newOption);
        }
    };
    displayOption();

    //Вызов функции инициализация карты
    leafletScript.addEventListener('load', () => {
        initMap();
    });

    let map;
    let router;

    //Функция для инициализации карты
    function initMap() {
        map = L.map('map', {attributionControl: false}).setView([59.9343, 30.3351], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }

    //Функция для построения маршрута
    async function createRoute(coords) {
        let waypoints = [];
        for (let i = 0; i < coords.length; i++) {
            const coord = coords[i];
            const latLng = L.latLng(coord.lat, coord.lng);
            waypoints.push(latLng);
        }

        if (router) {
            map.removeControl(router);
        }

        router = L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: true,
            show: false,
            addWaypoints: true,
            language: 'ru',
            lineOptions: {
                styles: [{color: '#008fcc', weight: 3}],
            },
        }).addTo(map);

        const bounds = L.latLngBounds(waypoints);
        map.fitBounds(bounds);
    }

    let idCounter = 0


    addAddressBtn.addEventListener('click', function () {
        const newAddressInput = document.createElement('input');
        newAddressInput.type = 'text';
        newAddressInput.placeholder = 'Введите дополнительный адрес';
        additionalAddresses.appendChild(newAddressInput);

        // Создание уникального идентификатора для нового поля ввода
        const newInputId = 'address_input_' + idCounter++;
        newAddressInput.id = newInputId;

        // Добавление обработчика событий для отслеживания удаления адреса
        newAddressInput.addEventListener('input', function () {
            if (!newAddressInput.value) {
                country_dict[newInputId] = '';
            }
        });

        addSuggestions(newInputId);
    });


    let country_dict = {}

    addSuggestions(loadingAddressInput.id); //Подсказки при вводе адреса выгрузки
    addSuggestions(unloadingAddressInput.id); //Подсказки при вводе адреса загрузки

    //Функция для ввода подсказок при вводе адреса
    function addSuggestions(inputId) {

        let autocomplete = new google.maps.places.Autocomplete(document.getElementById(inputId));

        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            let place = autocomplete.getPlace();
            console.log(place.address_components);
            country_dict[inputId] = place.address_components
        });
    }

    requestBtn.addEventListener("click", function () {
        popupForm.classList.add("active");
    });

    mask.addEventListener("click", function () {
        popupForm.classList.remove("active");
    });

    requestDiscount.addEventListener("click", function () {
        discount.classList.add("active");
    });

    maskDiscount.addEventListener("click", function () {
        discount.classList.remove("active");
    });


    calculateBtn.addEventListener('click', async function () {
        document.querySelector('.spinner').classList.remove('d-none');
        this.classList.add('disabled');

        if (router) {
            map.removeControl(router);
        }
        resultParagraph.innerHTML = "";
        distanceParagraph.innerHTML = "";
        this.setAttribute('disabled', 'disabled');
        const loadingAddress = loadingAddressInput.value;
        const unloadingAddress = unloadingAddressInput.value;
        const weight = parseFloat(weightInput.value);
        const waypoints = [loadingAddress];


        if (!loadingAddress || !unloadingAddress || !weight) {
            Swal.fire({
                title: 'Информация',
                text: FILL_IN_THE_FIELDS,
                icon: 'info',
                confirmButtonText: 'ОК',
                footer: 'С уважением, команда Систем Лоджистикс'
            }).then(() => {
                document.querySelector('.spinner').classList.add('d-none');
                calculateBtn.classList.remove('disabled');
                calculateBtn.removeAttribute('disabled');
            });
            return;
        }

        if (weight > 500) {
            Swal.fire({
                title: 'Информация',
                text: APPEAL_TO_USERS_HUGE_WEIGHT,
                icon: 'info',
                confirmButtonText: 'ОК',
                footer: 'С уважением, команда Систем Лоджистикс'
            }).then(() => {
                document.querySelector('.spinner').classList.add('d-none');
                calculateBtn.classList.remove('disabled');
                calculateBtn.removeAttribute('disabled');
            });
            return;
        }

        const excessPrimeValue = parseFloat(excessPrimeValueInput.value)
        if  ((excessPriveValueDiv.style.display === 'block') && (!(excessPrimeValue > 0 && excessPrimeValue < 9999))) {
            Swal.fire({
                title: 'Информация',
                text: APPEAL_TO_USERS_EXCEED_PRIME,
                icon: 'info',
                confirmButtonText: 'ОК',
                footer: 'С уважением, команда Систем Лоджистикс'
            }).then(() => {
                document.querySelector('.spinner').classList.add('d-none');
                calculateBtn.classList.remove('disabled');
                calculateBtn.removeAttribute('disabled');
            });
            return;
        }

        const additionalAddressInputs = additionalAddresses.getElementsByTagName('input');

        for (let input of additionalAddressInputs) {
            const address = input.value;
            if (address) {
                waypoints.push(address);
            }
        }

        //массив координат от точки старата до точки выгрузки с учетом промежуточных точек
        waypoints.push(unloadingAddress);

        //массив координат от точки выгрузки до точки старта обратно
        const backpoints = [unloadingAddress, loadingAddress]

        const getGoogleDirectionsData = (points) => new Promise((resolve, reject) => {
            let directionsService = new google.maps.DirectionsService();

            directionsService.route({
                origin: points[0],
                destination: points[points.length - 1],
                waypoints: points.slice(1, -1).map(function (address) {
                    return {location: address};
                }),
                travelMode: 'DRIVING',
                optimizeWaypoints: true,
                provideRouteAlternatives: true,
            }, async function (response, status) {
                if (status === 'OK') {
                    resolve(processDirectionsResponse(response));
                } else if (status === 'ZERO_RESULTS') {
                    try {
                        const distance = await getDistanceFromMyAPI(points);
                        resolve({total_distance: distance, coordinates: []});
                    } catch (error) {
                        reject('Custom API request failed: ' + error);
                    }
                } else {
                    reject('Directions request failed due to ' + status);
                }
            });
        });

        function get_text_empty_container(arg) {
            if (arg) {
                let description_empty_cont = "(ставка рассчитана за одну АМ (1*20, 1*40, 2*20))"
                return description_empty_cont
            } else {
                return ''
            }
        }


        try {
            const type_transport = transportSelect.value

            const direct_trip = await getGoogleDirectionsData(waypoints);

            const total_distance = direct_trip.total_distance
            const coordinates = direct_trip.coordinates

            const return_trip = await getGoogleDirectionsData(backpoints);

            const countries = country_dict
            const return_distance = return_trip.total_distance
            const cargo_class_old = classDanger.value
            const cargo_class = Boolean(cargo_class_old)
            const container = typeContainer.value
            const generator = needGenerator.value === "Да";
            const generator_own = needOwnGenerator.value === "Да";
            const empty_container = selectEmptyContainer.value === "Да";
            const volume_tent = volumeInput.value
            const excess_prime = excessPrime.value === "Да"


            const body = {
                type_transport: type_transport,
                coordinates: coordinates,
                total_distance: (total_distance / 1000),
                return_distance: (return_distance / 1000),
                weight: weight,
                volume: volume_tent === "" ? 1 : volume_tent,
                container: container,
                generator: generator,
                generator_own: generator_own,
                empty_container: empty_container,
                countries: countries,
                waypoints: JSON.stringify(waypoints),
                ...(cargo_class === false ? {} : {cargo_class: cargo_class_old}),
                excess_prime: excess_prime,
                ...(excess_prime === false ? {} : {value_excess_prime: excessPrimeValueInput.value})
            };
            const serverUrl = `${DOMAIN_NAME}/api/v1/logics/calc_price/`;
            const response = await fetch(serverUrl, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorText = await response.text();
                Swal.fire({
                    title: 'Информация',
                    text: APPEAL_TO_USERS,
                    icon: 'info',
                    confirmButtonText: 'ОК',
                    footer: 'С уважением, команда Систем Лоджистикс'
                }).then(() => {
                    document.querySelector('.spinner').classList.add('d-none');
                    calculateBtn.classList.remove('disabled');
                    calculateBtn.removeAttribute('disabled');
                });
                console.log(`Ошибка:${errorText}
                            Статус ошибки:${response.status}`);
            }

            const data = await response.json();
            const coord = coordinates;

            createRoute(coord);

            resultParagraph.textContent = `Итоговая цена: ${roundToNearestHundred(
                parseFloat(data.total_price)).toLocaleString('ru-RU')} руб.`;
            distanceParagraph.textContent = `Итоговое расстояние: ${Math.round(total_distance / 1000
            ).toLocaleString('ru-RU')} км ${get_text_empty_container(empty_container)}`;

            document.querySelector('.spinner').classList.add('d-none');
            requestBtn.classList.remove('d-none');
            requestBtn.removeAttribute('disabled');
            requestDiscount.classList.remove('d-none');
            requestDiscount.removeAttribute('disabled');
        } catch (error) {
            Swal.fire({
                title: 'Ошибка!',
                html: APPEAL_TO_USERS,
                icon: 'error',
                confirmButtonText: 'ОК',
                footer: 'С уважением, команда Систем Лоджистикс'
            });

            document.querySelector('.spinner').classList.add('d-none');

            console.error(`Ошибка:${error}\n
                            Статус ошибки:${error.status}`);
        } finally {
            this.removeAttribute('disabled');
        }
        this.classList.remove('disabled');
    });

    const phoneMaskBid = new IMask(phoneInputBid, {
        mask: "+{7}(000)000-00-00",
    });

    const phoneMaskDis = new IMask(phoneInputDis, {
        mask: "+{7}(000)000-00-00",
    });

    function extractAdditionalWaypoints() {
        const additionalWaypoints = [];
        const additionalAddressInputs = additionalAddresses.getElementsByTagName('input');

        for (let input of additionalAddressInputs) {
            const address = input.value;
            if (address) {
                additionalWaypoints.push(address);
            }
        }

        return additionalWaypoints
    }

    function getCalculatorData() {
        let type_transport = transportSelect.value;
        let container = typeContainer.value;
        let cargo_class_calc = classDanger.value;
        let cargo_class = Boolean(cargo_class_calc);
        let weight = weightInput.value;
        let volume_tent = volumeInput.value
        let generator = needGenerator.value === "Да";
        let generator_own = needOwnGenerator.value === "Да";
        let empty_container = selectEmptyContainer.value === "Да";
        let waypoint_start = loadingAddressInput.value;
        let waypoint_end = unloadingAddressInput.value;
        let excess_prime = excessPrime.value === "Да";
        let price = resultParagraph.textContent;
        let distance = distanceParagraph.textContent;

        return {
            type_transport: type_transport,
            container: container,
            ...(cargo_class === false ? {} : {cargo_class: cargo_class_calc}),
            weight: weight,
            volume: volume_tent === "" ? "" : volume_tent,
            generator: generator,
            generator_own: generator_own,
            empty_container: empty_container,
            waypoint_start: waypoint_start,
            waypoint_end: waypoint_end,
            waypoints_add: extractAdditionalWaypoints(),
            excess_prime: excess_prime,
            ...(excess_prime === false ? {} : {value_excess_prime: excessPrimeValueInput.value}),
            price: price.substring(14),
            distance: distance.substring(21)
        }
    }


    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // const bidUrl = `${DOMAIN_NAME}/api/v1/logics/submit_bid/`
        const bidUrl = "http://77.222.53.122:8000/api/main/sendNotification"
        const body = {
            name_client: nameClientBid.value,
            phone_number: phoneInputBid.value,
            email: emailClientBid.value,
            comment: comment.value,
            calculator_data: getCalculatorData()
        }
        await sendBid(form, bidUrl, body)
    })


    formDis.addEventListener('submit', async function (e) {
        e.preventDefault();

        // const disUrl = `${DOMAIN_NAME}/api/v1/logics/claime_low_price/`
        const disUrl = "http://77.222.53.122:8000/api/main/sendNotification"


        const body = {
            name_client: nameClientDis.value,
            phone_number: phoneInputDis.value,
            email: emailClientDis.value,
            cost_travel: costTransit.value,
            cnt_am_per_month: cntAmPerMonth.value,
            cnt_am_per_part: cntAmPerPart.value,
            comment: commentDis.value,
            calculator_data: getCalculatorData()
        }
        await sendBid(formDis, disUrl, body)
    })

    async function sendBid(form, url, body) {
        await fetch(url, {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw err
                    });
                }
                return response.json();
            })
            .then(data => {
                successMessageDis.style.display = "block";
                form.reset();

                setTimeout(() => {
                    successMessageDis.style.display = "none";
                    autoCloseModal(form.parentElement, 12);
                }, 2000);

            })
            .catch(error => {
                if (typeof error.text !== "undefined") {
                    Swal.fire({
                        title: 'Информация',
                        html: APPEAL_TO_USERS,
                        icon: 'info',
                        confirmButtonText: 'ОК',
                        footer: 'С уважением, команда Систем Лоджистикс'
                    }).then(() => {
                        document.querySelector('.spinner').classList.add('d-none');
                        calculateBtn.classList.remove('disabled');
                        calculateBtn.removeAttribute('disabled');
                    });
                    console.error(`Ошибка:${typeof error}\n
                            Статус ошибки:${typeof error.text}`);
                }
            }).then(data => {
                successMessageDis.style.display = "block";
                form.reset();

                setTimeout(() => {
                    successMessageDis.style.display = "none";
                    autoCloseModal(form.parentElement, 12);
                }, 3000);

            });
    }
});

function processDirectionsResponse(response) {
    let route = response.routes[0].legs;
    let coordinates = [];
    let total_distance = 0;

    for (let i = 0; i < route.length; i++) {
        total_distance += route[i].distance.value;
        coordinates.push({
            lat: route[i].start_location.lat(), lng: route[i].start_location.lng()
        });
        if (i === route.length - 1) {
            coordinates.push({
                lat: route[i].end_location.lat(), lng: route[i].end_location.lng()
            });
        }
    }

    return {total_distance, coordinates};
}

function roundToNearestHundred(num) {
    return Math.round(num / 1000) * 1000
}

const DOMAIN_NAME = "http://127.0.0.1:8000";
async function getDistanceFromMyAPI(points) {
    const serverUrl = `${DOMAIN_NAME}/api/v1/logics/get_distance/`;
    const body = {points: points};

    try {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        return data.distance;
    } catch (error) {
        throw error;
    }
}