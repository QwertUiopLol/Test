const QUEST_PROGRESS_KEY = 'ir-quest-progress';
const QUEST_UI_KEY = 'ir-quest-ui';

function escapeHtml(str) {
    return String(str === undefined || str === null ? '' : str).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
}

// Embedded quest data - no network required, works on file:// protocol
const EMBEDDED_QUEST_DATA = {
  "nodes": [
    {
      "id": 1,
      "radius": 28,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 50,
      "title": "Путь от земли к стали",
      "subtitle": "Основная линия и дополнительные ветви",
      "description": "Основная линия идёт сверху вниз: каждое следующее задание открывается только после предыдущего и проверяет предмет в инвентаре. Боковые задания не блокируют прогресс, но раскрывают альтернативные руды, топливо, детали и побочные продукты.",
      "tasks": [
        {
          "text": "Открыть квестник и начать путь",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 2,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 150,
      "contentId": "IR-dirt",
      "title": "Первые шаги",
      "subtitle": "Подними землю",
      "description": "Начальная площадка — твой единственный безопасный ресурс. Земля нужна и для просеивания, и для воды.",
      "tasks": [
        {
          "text": "Получить: Первые шаги",
          "optional": false,
          "type": "item",
          "itemId": "IR-dirt",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 3,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 268,
      "contentId": "IR-cobblestone",
      "title": "Каменный край",
      "subtitle": "Добыть булыжник",
      "description": "Сломай край стартовой платформы и сохрани первый камень для верстака.",
      "tasks": [
        {
          "text": "Получить: Каменный край ×8",
          "optional": false,
          "type": "item",
          "itemId": "IR-cobblestone",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 4,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 386,
      "contentId": "IR-apebble",
      "title": "Ручное просеивание",
      "subtitle": "Андезит",
      "description": "Зажми Alt и ломай открытую землю: камешки появляются без разрушения блока.",
      "tasks": [
        {
          "text": "Получить: Ручное просеивание",
          "optional": false,
          "type": "item",
          "itemId": "IR-apebble",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 5,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 504,
      "contentId": "IR-workbench",
      "title": "Каменный верстак",
      "subtitle": "Собрать верстак",
      "description": "Четыре булыжника квадратом открывают 3×3 рецепты.",
      "tasks": [
        {
          "text": "Получить: Каменный верстак",
          "optional": false,
          "type": "item",
          "itemId": "IR-workbench",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 6,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 622,
      "contentId": "IR-dpebble",
      "title": "Твёрдый камень",
      "subtitle": "Глубинный камешек",
      "description": "Просеивай землю, пока не найдёшь плотный глубинный камешек для мельницы.",
      "tasks": [
        {
          "text": "Получить: Твёрдый камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-dpebble",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 7,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 740,
      "contentId": "IR-mixer",
      "title": "Мельница",
      "subtitle": "Собрать мельницу",
      "description": "Мельница превращает камешки в нужные для жизни порошки.",
      "tasks": [
        {
          "text": "Получить: Мельница",
          "optional": false,
          "type": "item",
          "itemId": "IR-mixer",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 8,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 858,
      "contentId": "IR-bpebble",
      "title": "Вулканическая мука",
      "subtitle": "Базальтовый камешек",
      "description": "Базальт вместе с андезитом даёт минеральную муку.",
      "tasks": [
        {
          "text": "Получить: Вулканическая мука",
          "optional": false,
          "type": "item",
          "itemId": "IR-bpebble",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 9,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 976,
      "contentId": "IR-mineralpowder",
      "title": "Минеральное питание",
      "subtitle": "Сделать минеральную муку",
      "description": "Помести базальт и андезит в мельницу; освободи ячейку результата.",
      "tasks": [
        {
          "text": "Получить: Минеральное питание ×2",
          "optional": false,
          "type": "item",
          "itemId": "IR-mineralpowder",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 10,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1094,
      "contentId": "IR-cpebble",
      "title": "Мягкий минерал",
      "subtitle": "Кальцитовый камешек",
      "description": "Кальцит можно размолоть вручную — это самый простой путь к извести.",
      "tasks": [
        {
          "text": "Получить: Мягкий минерал",
          "optional": false,
          "type": "item",
          "itemId": "IR-cpebble",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 11,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1212,
      "contentId": "IR-blpebble",
      "title": "Стекольный песок",
      "subtitle": "Чернокаменный камешек",
      "description": "Два чернокаменных камешка мельница превращает в кремнезёмный порошок.",
      "tasks": [
        {
          "text": "Получить: Стекольный песок",
          "optional": false,
          "type": "item",
          "itemId": "IR-blpebble",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 12,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1330,
      "contentId": "IR-limepowder",
      "title": "Известь",
      "subtitle": "Сделать известковый порошок",
      "description": "Измельчи кальцит в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Известь",
          "optional": false,
          "type": "item",
          "itemId": "IR-limepowder",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 13,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1448,
      "contentId": "IR-silicapowder",
      "title": "Кремнезём",
      "subtitle": "Сделать кремнезёмный порошок",
      "description": "Это основа стекла; проверь рецепт в JEI, если забыл количество.",
      "tasks": [
        {
          "text": "Получить: Кремнезём",
          "optional": false,
          "type": "item",
          "itemId": "IR-silicapowder",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 14,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1566,
      "contentId": "IR-kiln",
      "title": "Печь обжига",
      "subtitle": "Собрать печь",
      "description": "Кольцо из булыжника собирается только на верстаке 3×3.",
      "tasks": [
        {
          "text": "Получить: Печь обжига",
          "optional": false,
          "type": "item",
          "itemId": "IR-kiln",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 15,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1684,
      "contentId": "IR-humus",
      "title": "Органика в почве",
      "subtitle": "Найти гумус",
      "description": "Гумус выпадает редко, поэтому просеивай запас земли, не разрушая площадку.",
      "tasks": [
        {
          "text": "Получить: Органика в почве ×2",
          "optional": false,
          "type": "item",
          "itemId": "IR-humus",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 16,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1802,
      "contentId": "IR-plantash",
      "title": "Растительная зола",
      "subtitle": "Обжечь гумус",
      "description": "Зола нужна для щёлока и не является мусором.",
      "tasks": [
        {
          "text": "Получить: Растительная зола",
          "optional": false,
          "type": "item",
          "itemId": "IR-plantash",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 17,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1920,
      "contentId": "IR-ashlye",
      "title": "Щёлок",
      "subtitle": "Выщелочить золу",
      "description": "Соедини золу с землёй: вода в почве растворяет щелочные соли.",
      "tasks": [
        {
          "text": "Получить: Щёлок",
          "optional": false,
          "type": "item",
          "itemId": "IR-ashlye",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 18,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 2038,
      "contentId": "IR-sodaash",
      "title": "Сода",
      "subtitle": "Обжечь щёлок",
      "description": "Сода снижает температуру плавления стекла.",
      "tasks": [
        {
          "text": "Получить: Сода",
          "optional": false,
          "type": "item",
          "itemId": "IR-sodaash",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 19,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 2156,
      "contentId": "IR-capsule-1000",
      "title": "Первая капсула",
      "subtitle": "Сварить стекло",
      "description": "Соедини кремнезём, известь и соду в печи.",
      "tasks": [
        {
          "text": "Получить: Первая капсула ×4",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 20,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 2274,
      "contentId": "IR-capsule-1000-water",
      "title": "Вода в таре",
      "subtitle": "Наполнить капсулу",
      "description": "Капсула и земля дают запас воды для обработки.",
      "tasks": [
        {
          "text": "Получить: Вода в таре",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 21,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 2392,
      "contentId": "IR-fluid-extractor",
      "title": "Экстрактор",
      "subtitle": "Собрать экстрактор",
      "description": "Экстрактор использует жидкость отдельно от предметного слота.",
      "tasks": [
        {
          "text": "Получить: Экстрактор",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-extractor",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 22,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 2510,
      "contentId": "IR-nutrientgel",
      "title": "Питательный гель",
      "subtitle": "Растворить минеральную муку",
      "description": "Подай воду в жидкостный слот и минеральную муку в предметный. JEI показывает объём воды.",
      "tasks": [
        {
          "text": "Получить: Питательный гель",
          "optional": false,
          "type": "item",
          "itemId": "IR-nutrientgel",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 23,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 2628,
      "contentId": "IR-callusculture",
      "title": "Культура клеток",
      "subtitle": "Вырастить каллус",
      "description": "Соедини гумус и питательный гель в мельнице.",
      "tasks": [
        {
          "text": "Получить: Культура клеток",
          "optional": false,
          "type": "item",
          "itemId": "IR-callusculture",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 24,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 2746,
      "contentId": "IR-autoclave",
      "title": "Автоклав",
      "subtitle": "Собрать автоклав",
      "description": "Стерильность нужна до работы с живой культурой.",
      "tasks": [
        {
          "text": "Получить: Автоклав",
          "optional": false,
          "type": "item",
          "itemId": "IR-autoclave",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 25,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 2864,
      "contentId": "IR-capsule-sterile",
      "title": "Стерильная тара",
      "subtitle": "Стерилизовать капсулу",
      "description": "Сначала обработай сам сосуд.",
      "tasks": [
        {
          "text": "Получить: Стерильная тара",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-sterile",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 26,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 2982,
      "contentId": "IR-nutrientgel-sterile",
      "title": "Стерильная среда",
      "subtitle": "Стерилизовать гель",
      "description": "Среду стерилизуют отдельно от капсулы.",
      "tasks": [
        {
          "text": "Получить: Стерильная среда",
          "optional": false,
          "type": "item",
          "itemId": "IR-nutrientgel-sterile",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 27,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3100,
      "contentId": "IR-hormonesolution",
      "title": "Регуляторы роста",
      "subtitle": "Сделать раствор",
      "description": "Щёлок и минеральная мука дают раствор для дифференциации клеток.",
      "tasks": [
        {
          "text": "Получить: Регуляторы роста",
          "optional": false,
          "type": "item",
          "itemId": "IR-hormonesolution",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 28,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3218,
      "contentId": "IR-bioreactor",
      "title": "Биореактор",
      "subtitle": "Собрать биореактор",
      "description": "Это последняя станция биотехнологической ветви.",
      "tasks": [
        {
          "text": "Получить: Биореактор",
          "optional": false,
          "type": "item",
          "itemId": "IR-bioreactor",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 29,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3336,
      "contentId": "IR-embryogeniccallus",
      "title": "Эмбриогенный каллус",
      "subtitle": "Подготовить эмбрион",
      "description": "Биореактор объединяет каллус с регуляторами роста.",
      "tasks": [
        {
          "text": "Получить: Эмбриогенный каллус",
          "optional": false,
          "type": "item",
          "itemId": "IR-embryogeniccallus",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 30,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3454,
      "contentId": "IR-sapling",
      "title": "Синтетическое семя",
      "subtitle": "Собрать саженец",
      "description": "На верстаке объедини стерильную капсулу, гель и эмбриогенный каллус.",
      "tasks": [
        {
          "text": "Получить: Синтетическое семя",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 31,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3572,
      "contentId": "IR-oaklog",
      "title": "Первое дерево",
      "subtitle": "Вырастить бревно",
      "description": "В этой версии саженец превращается в бревно через рецепт роста — это игровой шаг посадки.",
      "tasks": [
        {
          "text": "Получить: Первое дерево",
          "optional": false,
          "type": "item",
          "itemId": "IR-oaklog",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 32,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3690,
      "contentId": "IR-plank",
      "title": "Древесина",
      "subtitle": "Распустить бревно",
      "description": "Доски открывают угольную яму и механические детали.",
      "tasks": [
        {
          "text": "Получить: Древесина",
          "optional": false,
          "type": "item",
          "itemId": "IR-plank",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 33,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3808,
      "contentId": "IR-clay",
      "title": "Глина",
      "subtitle": "Найти глину",
      "description": "Просеивание даёт и глину: подготовь её для домницы.",
      "tasks": [
        {
          "text": "Получить: Глина ×8",
          "optional": false,
          "type": "item",
          "itemId": "IR-clay",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 34,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3926,
      "contentId": "IR-claybrick",
      "title": "Сырой кирпич",
      "subtitle": "Сформовать глиняный кирпич",
      "description": "Четыре порции глины формируют партию сырца.",
      "tasks": [
        {
          "text": "Получить: Сырой кирпич ×8",
          "optional": false,
          "type": "item",
          "itemId": "IR-claybrick",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 35,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4044,
      "contentId": "IR-brick",
      "title": "Обожжённый кирпич",
      "subtitle": "Обжечь кирпич",
      "description": "Печь делает из сырца прочный строительный материал.",
      "tasks": [
        {
          "text": "Получить: Обожжённый кирпич",
          "optional": false,
          "type": "item",
          "itemId": "IR-brick",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 36,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4162,
      "contentId": "IR-charcoalpit",
      "title": "Угольная яма",
      "subtitle": "Собрать угольную яму",
      "description": "Угольная яма превращает доски в металлургическое топливо.",
      "tasks": [
        {
          "text": "Получить: Угольная яма",
          "optional": false,
          "type": "item",
          "itemId": "IR-charcoalpit",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 37,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4280,
      "contentId": "IR-charcoal",
      "title": "Древесный уголь",
      "subtitle": "Получить уголь",
      "description": "Уголь нужен домнице, а не только следующему крафту.",
      "tasks": [
        {
          "text": "Получить: Древесный уголь ×6",
          "optional": false,
          "type": "item",
          "itemId": "IR-charcoal",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 38,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4398,
      "contentId": "IR-grindingstone",
      "title": "Точильный камень",
      "subtitle": "Сделать точильный камень",
      "description": "Четыре булыжника дают пару камней для жернова.",
      "tasks": [
        {
          "text": "Получить: Точильный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 39,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4516,
      "contentId": "IR-quernstone",
      "title": "Жернов",
      "subtitle": "Собрать жернов",
      "description": "Жернов дробит руду и известняк перед плавкой.",
      "tasks": [
        {
          "text": "Получить: Жернов",
          "optional": false,
          "type": "item",
          "itemId": "IR-quernstone",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 40,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4634,
      "contentId": "IR-ironore",
      "title": "Железная руда",
      "subtitle": "Найти железную руду",
      "description": "Руда добывается просеиванием; JEI показывает этот источник.",
      "tasks": [
        {
          "text": "Получить: Железная руда ×4",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironore",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 41,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4752,
      "contentId": "IR-crushedironore",
      "title": "Дроблёная руда",
      "subtitle": "Раздробить железную руду",
      "description": "Увеличь поверхность руды в жернове.",
      "tasks": [
        {
          "text": "Получить: Дроблёная руда ×8",
          "optional": false,
          "type": "item",
          "itemId": "IR-crushedironore",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 42,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4870,
      "contentId": "IR-woodenriffle",
      "title": "Деревянные рифли",
      "subtitle": "Сделать рифли",
      "description": "Рифли удерживают тяжёлые зёрна в промывочном лотке.",
      "tasks": [
        {
          "text": "Получить: Деревянные рифли",
          "optional": false,
          "type": "item",
          "itemId": "IR-woodenriffle",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 43,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4988,
      "contentId": "IR-sluicebox",
      "title": "Промывочный лоток",
      "subtitle": "Собрать лоток",
      "description": "Промывка требует воды и дроблёной руды.",
      "tasks": [
        {
          "text": "Получить: Промывочный лоток",
          "optional": false,
          "type": "item",
          "itemId": "IR-sluicebox",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 44,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5106,
      "contentId": "IR-concentrateironore",
      "title": "Железный концентрат",
      "subtitle": "Промыть руду",
      "description": "Концентрат — правильная шихта для домницы.",
      "tasks": [
        {
          "text": "Получить: Железный концентрат ×4",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 45,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5224,
      "contentId": "IR-crushedlimestone",
      "title": "Флюс",
      "subtitle": "Раздробить известняк",
      "description": "Флюс связывает примеси в шлак.",
      "tasks": [
        {
          "text": "Получить: Флюс ×2",
          "optional": false,
          "type": "item",
          "itemId": "IR-crushedlimestone",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 46,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5342,
      "contentId": "IR-bloomeryfurnace",
      "title": "Домница",
      "subtitle": "Собрать домницу",
      "description": "Домница больше не требует железных деталей до первой плавки.",
      "tasks": [
        {
          "text": "Получить: Домница",
          "optional": false,
          "type": "item",
          "itemId": "IR-bloomeryfurnace",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 47,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5460,
      "contentId": "IR-bloom",
      "title": "Крица",
      "subtitle": "Выплавить крицу",
      "description": "Загрузи концентрат, флюс и древесный уголь; забери результат и шлак.",
      "tasks": [
        {
          "text": "Получить: Крица",
          "optional": false,
          "type": "item",
          "itemId": "IR-bloom",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 48,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5578,
      "contentId": "IR-spongeiron",
      "title": "Губчатое железо",
      "subtitle": "Проковать крицу",
      "description": "Первичная заготовка ещё пористая и содержит примеси.",
      "tasks": [
        {
          "text": "Получить: Губчатое железо ×2",
          "optional": false,
          "type": "item",
          "itemId": "IR-spongeiron",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 49,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5696,
      "contentId": "IR-wroughtironingot",
      "title": "Кричное железо",
      "subtitle": "Уплотнить железо",
      "description": "Кованое железо открывает пластины, прутки и следующие машины.",
      "tasks": [
        {
          "text": "Получить: Кричное железо ×4",
          "optional": false,
          "type": "item",
          "itemId": "IR-wroughtironingot",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 50,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5814,
      "contentId": "IR-ironplate",
      "title": "Железная пластина",
      "subtitle": "Проковать пластину",
      "description": "Пластины нужны для печей и станин.",
      "tasks": [
        {
          "text": "Получить: Железная пластина ×2",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 51,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5932,
      "contentId": "IR-ironrod",
      "title": "Железный пруток",
      "subtitle": "Вытянуть пруток",
      "description": "Прутки становятся шестернями, проволокой и мехами.",
      "tasks": [
        {
          "text": "Получить: Железный пруток ×4",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironrod",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 52,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6050,
      "contentId": "IR-bellows",
      "title": "Меха",
      "subtitle": "Собрать меха",
      "description": "Меха дают нужный поток воздуха для горячих процессов.",
      "tasks": [
        {
          "text": "Получить: Меха",
          "optional": false,
          "type": "item",
          "itemId": "IR-bellows",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 53,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6168,
      "contentId": "IR-graphite",
      "title": "Графит",
      "subtitle": "Найти графит",
      "description": "Редкий графит находится при просеивании и нужен для тигля.",
      "tasks": [
        {
          "text": "Получить: Графит ×8",
          "optional": false,
          "type": "item",
          "itemId": "IR-graphite",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 54,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6286,
      "contentId": "IR-cruciblegraphite",
      "title": "Графитовый тигель",
      "subtitle": "Собрать тигель",
      "description": "Собери кольцо из графита, оставив центр пустым.",
      "tasks": [
        {
          "text": "Получить: Графитовый тигель",
          "optional": false,
          "type": "item",
          "itemId": "IR-cruciblegraphite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 55,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6404,
      "contentId": "IR-refractorybrick",
      "title": "Огнеупор",
      "subtitle": "Сделать огнеупорный кирпич",
      "description": "Глиняный кирпич и известь создают кладку для высоких температур.",
      "tasks": [
        {
          "text": "Получить: Огнеупор ×4",
          "optional": false,
          "type": "item",
          "itemId": "IR-refractorybrick",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 56,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6522,
      "contentId": "IR-cruciblefurnace",
      "title": "Тигельная печь",
      "subtitle": "Собрать тигельную печь",
      "description": "Тигель, меха, огнеупор и пластина открывают производство стали.",
      "tasks": [
        {
          "text": "Получить: Тигельная печь",
          "optional": false,
          "type": "item",
          "itemId": "IR-cruciblefurnace",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 57,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6640,
      "contentId": "IR-mildsteelingot",
      "title": "Мягкая сталь",
      "subtitle": "Выплавить мягкую сталь",
      "description": "Первый контролируемый стальной сплав.",
      "tasks": [
        {
          "text": "Получить: Мягкая сталь",
          "optional": false,
          "type": "item",
          "itemId": "IR-mildsteelingot",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 58,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6758,
      "contentId": "IR-mediumsteelingot",
      "title": "Средняя сталь",
      "subtitle": "Выплавить среднюю сталь",
      "description": "Этот сорт стали нужен для стальной рамы.",
      "tasks": [
        {
          "text": "Получить: Средняя сталь",
          "optional": false,
          "type": "item",
          "itemId": "IR-mediumsteelingot",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 59,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6876,
      "contentId": "IR-steelframe",
      "title": "Стальная рама",
      "subtitle": "Собрать раму",
      "description": "Основная прогрессия завершена: теперь доступны улучшенные металлургические машины.",
      "tasks": [
        {
          "text": "Получить: Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 60,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 120,
      "y": 386,
      "title": "Дополнительно: другие камешки",
      "subtitle": "Необязательная ветка",
      "description": "Эти задания открываются после соответствующей точки основной линии. Они требуют реальные предметы, но не задерживают основной прогресс.",
      "tasks": [
        {
          "text": "Открыть дополнительную ветку",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 61,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 120,
      "y": 1566,
      "title": "Дополнительно: стекольная мастерская",
      "subtitle": "Необязательная ветка",
      "description": "Эти задания открываются после соответствующей точки основной линии. Они требуют реальные предметы, но не задерживают основной прогресс.",
      "tasks": [
        {
          "text": "Открыть дополнительную ветку",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 62,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 120,
      "y": 4516,
      "title": "Дополнительно: другие руды",
      "subtitle": "Необязательная ветка",
      "description": "Эти задания открываются после соответствующей точки основной линии. Они требуют реальные предметы, но не задерживают основной прогресс.",
      "tasks": [
        {
          "text": "Открыть дополнительную ветку",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 63,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 4606,
      "contentId": "IR-limestone",
      "title": "Limestone",
      "subtitle": "Дополнительный материал",
      "description": "Limestone — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Limestone",
          "optional": false,
          "type": "item",
          "itemId": "IR-limestone",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 64,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 4606,
      "contentId": "IR-bogironore",
      "title": "Bog Iron Ore",
      "subtitle": "Дополнительный материал",
      "description": "Bog Iron Ore — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Bog Iron Ore",
          "optional": false,
          "type": "item",
          "itemId": "IR-bogironore",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 65,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 4714,
      "contentId": "IR-hematite",
      "title": "Hematite",
      "subtitle": "Дополнительный материал",
      "description": "Hematite — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Hematite",
          "optional": false,
          "type": "item",
          "itemId": "IR-hematite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 66,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 4714,
      "contentId": "IR-magnetite",
      "title": "Magnetite",
      "subtitle": "Дополнительный материал",
      "description": "Magnetite — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Magnetite",
          "optional": false,
          "type": "item",
          "itemId": "IR-magnetite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 67,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 4822,
      "contentId": "IR-limonite",
      "title": "Limonite",
      "subtitle": "Дополнительный материал",
      "description": "Limonite — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Limonite",
          "optional": false,
          "type": "item",
          "itemId": "IR-limonite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 68,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 4822,
      "contentId": "IR-crushedbogiron",
      "title": "Crushed Bog Iron",
      "subtitle": "Дополнительный материал",
      "description": "Crushed Bog Iron — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Crushed Bog Iron",
          "optional": false,
          "type": "item",
          "itemId": "IR-crushedbogiron",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 69,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 4930,
      "contentId": "IR-crushedhematite",
      "title": "Crushed Hematite",
      "subtitle": "Дополнительный материал",
      "description": "Crushed Hematite — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Crushed Hematite",
          "optional": false,
          "type": "item",
          "itemId": "IR-crushedhematite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 70,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 4930,
      "contentId": "IR-crushedmagnetite",
      "title": "Crushed Magnetite",
      "subtitle": "Дополнительный материал",
      "description": "Crushed Magnetite — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Crushed Magnetite",
          "optional": false,
          "type": "item",
          "itemId": "IR-crushedmagnetite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 71,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 5038,
      "contentId": "IR-crushedlimonite",
      "title": "Crushed Limonite",
      "subtitle": "Дополнительный материал",
      "description": "Crushed Limonite — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Crushed Limonite",
          "optional": false,
          "type": "item",
          "itemId": "IR-crushedlimonite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 72,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 5038,
      "contentId": "IR-concentratebogiron",
      "title": "Bog Iron Concentrate",
      "subtitle": "Дополнительный материал",
      "description": "Bog Iron Concentrate — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Bog Iron Concentrate",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentratebogiron",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 73,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 5146,
      "contentId": "IR-concentratehematite",
      "title": "Hematite Concentrate",
      "subtitle": "Дополнительный материал",
      "description": "Hematite Concentrate — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Hematite Concentrate",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentratehematite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 74,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 5146,
      "contentId": "IR-concentratemagnetite",
      "title": "Magnetite Concentrate",
      "subtitle": "Дополнительный материал",
      "description": "Magnetite Concentrate — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Magnetite Concentrate",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentratemagnetite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 75,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 5254,
      "contentId": "IR-concentratelimonite",
      "title": "Limonite Concentrate",
      "subtitle": "Дополнительный материал",
      "description": "Limonite Concentrate — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Limonite Concentrate",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentratelimonite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 76,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 120,
      "y": 5696,
      "title": "Дополнительно: железные детали",
      "subtitle": "Необязательная ветка",
      "description": "Эти задания открываются после соответствующей точки основной линии. Они требуют реальные предметы, но не задерживают основной прогресс.",
      "tasks": [
        {
          "text": "Открыть дополнительную ветку",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 77,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 5786,
      "contentId": "IR-quicklime",
      "title": "Quicklime",
      "subtitle": "Дополнительный материал",
      "description": "Quicklime — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Quicklime",
          "optional": false,
          "type": "item",
          "itemId": "IR-quicklime",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 78,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 5786,
      "contentId": "IR-ironband",
      "title": "Iron Band",
      "subtitle": "Дополнительный материал",
      "description": "Iron Band — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Iron Band",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironband",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 79,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 5894,
      "contentId": "IR-gear",
      "title": "Iron Gear",
      "subtitle": "Дополнительный материал",
      "description": "Iron Gear — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Iron Gear",
          "optional": false,
          "type": "item",
          "itemId": "IR-gear",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 80,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 5894,
      "contentId": "IR-metalwire",
      "title": "Metal Wire",
      "subtitle": "Дополнительный материал",
      "description": "Metal Wire — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Metal Wire",
          "optional": false,
          "type": "item",
          "itemId": "IR-metalwire",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 81,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 6002,
      "contentId": "IR-ceramictube",
      "title": "Ceramic Tube",
      "subtitle": "Дополнительный материал",
      "description": "Ceramic Tube — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Ceramic Tube",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramictube",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 82,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 6002,
      "contentId": "IR-glass",
      "title": "Glass",
      "subtitle": "Дополнительный материал",
      "description": "Glass — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Glass",
          "optional": false,
          "type": "item",
          "itemId": "IR-glass",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 83,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 6110,
      "contentId": "IR-stoneblock",
      "title": "Stone Block",
      "subtitle": "Дополнительный материал",
      "description": "Stone Block — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Stone Block",
          "optional": false,
          "type": "item",
          "itemId": "IR-stoneblock",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 84,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 6110,
      "contentId": "IR-pyrometer",
      "title": "Pyrometer Prototype",
      "subtitle": "Дополнительный материал",
      "description": "Pyrometer Prototype — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Pyrometer Prototype",
          "optional": false,
          "type": "item",
          "itemId": "IR-pyrometer",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 85,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 6218,
      "contentId": "IR-anvil",
      "title": "Heavy Anvil",
      "subtitle": "Дополнительный материал",
      "description": "Heavy Anvil — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Heavy Anvil",
          "optional": false,
          "type": "item",
          "itemId": "IR-anvil",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 86,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 6218,
      "contentId": "IR-leather",
      "title": "Leather",
      "subtitle": "Дополнительный материал",
      "description": "Leather — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Leather",
          "optional": false,
          "type": "item",
          "itemId": "IR-leather",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 87,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 120,
      "y": 6994,
      "title": "Дополнительно: кокс и передел",
      "subtitle": "Необязательная ветка",
      "description": "Эти задания открываются после соответствующей точки основной линии. Они требуют реальные предметы, но не задерживают основной прогресс.",
      "tasks": [
        {
          "text": "Открыть дополнительную ветку",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 88,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 7084,
      "contentId": "IR-coal",
      "title": "Bituminous Coal",
      "subtitle": "Дополнительный материал",
      "description": "Bituminous Coal — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Bituminous Coal",
          "optional": false,
          "type": "item",
          "itemId": "IR-coal",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 89,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7084,
      "contentId": "IR-bituminouscoal",
      "title": "Rich Bituminous Coal",
      "subtitle": "Дополнительный материал",
      "description": "Rich Bituminous Coal — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Rich Bituminous Coal",
          "optional": false,
          "type": "item",
          "itemId": "IR-bituminouscoal",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 90,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 7192,
      "contentId": "IR-cokeoven",
      "title": "Coke Oven",
      "subtitle": "Дополнительный материал",
      "description": "Coke Oven — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Coke Oven",
          "optional": false,
          "type": "item",
          "itemId": "IR-cokeoven",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 91,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7192,
      "contentId": "IR-coke",
      "title": "Coke",
      "subtitle": "Дополнительный материал",
      "description": "Coke — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Coke",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 92,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 7300,
      "contentId": "IR-coaltar",
      "title": "Coal Tar",
      "subtitle": "Дополнительный материал",
      "description": "Coal Tar — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Coal Tar",
          "optional": false,
          "type": "item",
          "itemId": "IR-coaltar",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 93,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7300,
      "contentId": "IR-pigiron",
      "title": "Pig Iron",
      "subtitle": "Дополнительный материал",
      "description": "Pig Iron — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Pig Iron",
          "optional": false,
          "type": "item",
          "itemId": "IR-pigiron",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 94,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 7408,
      "contentId": "IR-castironingot",
      "title": "Cast Iron Ingot",
      "subtitle": "Дополнительный материал",
      "description": "Cast Iron Ingot — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Cast Iron Ingot",
          "optional": false,
          "type": "item",
          "itemId": "IR-castironingot",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 95,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7408,
      "contentId": "IR-fineryforge",
      "title": "Finery Forge",
      "subtitle": "Дополнительный материал",
      "description": "Finery Forge — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Finery Forge",
          "optional": false,
          "type": "item",
          "itemId": "IR-fineryforge",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 96,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 7516,
      "contentId": "IR-highcarbonsteelingot",
      "title": "High Carbon Steel Ingot",
      "subtitle": "Дополнительный материал",
      "description": "High Carbon Steel Ingot — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: High Carbon Steel Ingot",
          "optional": false,
          "type": "item",
          "itemId": "IR-highcarbonsteelingot",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 97,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7516,
      "contentId": "IR-steelbloom",
      "title": "Steel Bloom",
      "subtitle": "Дополнительный материал",
      "description": "Steel Bloom — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Steel Bloom",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelbloom",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 98,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 7624,
      "contentId": "IR-slag",
      "title": "Slag",
      "subtitle": "Дополнительный материал",
      "description": "Slag — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Slag",
          "optional": false,
          "type": "item",
          "itemId": "IR-slag",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 99,
      "radius": 20,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7624,
      "contentId": "IR-richslag",
      "title": "Iron-Rich Slag",
      "subtitle": "Дополнительный материал",
      "description": "Iron-Rich Slag — часть дополнительной ветви. Открой JEI, чтобы посмотреть все рецепты, станки и добычу; выполнение этой карточки проверяет предмет в инвентаре.",
      "tasks": [
        {
          "text": "Получить: Iron-Rich Slag",
          "optional": false,
          "type": "item",
          "itemId": "IR-richslag",
          "itemCount": 1
        }
      ]
    }
  ],
  "edges": [
    {
      "from": 1,
      "to": 2
    },
    {
      "from": 2,
      "to": 3
    },
    {
      "from": 3,
      "to": 4
    },
    {
      "from": 4,
      "to": 5
    },
    {
      "from": 5,
      "to": 6
    },
    {
      "from": 6,
      "to": 7
    },
    {
      "from": 7,
      "to": 8
    },
    {
      "from": 8,
      "to": 9
    },
    {
      "from": 9,
      "to": 10
    },
    {
      "from": 10,
      "to": 11
    },
    {
      "from": 11,
      "to": 12
    },
    {
      "from": 12,
      "to": 13
    },
    {
      "from": 13,
      "to": 14
    },
    {
      "from": 14,
      "to": 15
    },
    {
      "from": 15,
      "to": 16
    },
    {
      "from": 16,
      "to": 17
    },
    {
      "from": 17,
      "to": 18
    },
    {
      "from": 18,
      "to": 19
    },
    {
      "from": 19,
      "to": 20
    },
    {
      "from": 20,
      "to": 21
    },
    {
      "from": 21,
      "to": 22
    },
    {
      "from": 22,
      "to": 23
    },
    {
      "from": 23,
      "to": 24
    },
    {
      "from": 24,
      "to": 25
    },
    {
      "from": 25,
      "to": 26
    },
    {
      "from": 26,
      "to": 27
    },
    {
      "from": 27,
      "to": 28
    },
    {
      "from": 28,
      "to": 29
    },
    {
      "from": 29,
      "to": 30
    },
    {
      "from": 30,
      "to": 31
    },
    {
      "from": 31,
      "to": 32
    },
    {
      "from": 32,
      "to": 33
    },
    {
      "from": 33,
      "to": 34
    },
    {
      "from": 34,
      "to": 35
    },
    {
      "from": 35,
      "to": 36
    },
    {
      "from": 36,
      "to": 37
    },
    {
      "from": 37,
      "to": 38
    },
    {
      "from": 38,
      "to": 39
    },
    {
      "from": 39,
      "to": 40
    },
    {
      "from": 40,
      "to": 41
    },
    {
      "from": 41,
      "to": 42
    },
    {
      "from": 42,
      "to": 43
    },
    {
      "from": 43,
      "to": 44
    },
    {
      "from": 44,
      "to": 45
    },
    {
      "from": 45,
      "to": 46
    },
    {
      "from": 46,
      "to": 47
    },
    {
      "from": 47,
      "to": 48
    },
    {
      "from": 48,
      "to": 49
    },
    {
      "from": 49,
      "to": 50
    },
    {
      "from": 50,
      "to": 51
    },
    {
      "from": 51,
      "to": 52
    },
    {
      "from": 52,
      "to": 53
    },
    {
      "from": 53,
      "to": 54
    },
    {
      "from": 54,
      "to": 55
    },
    {
      "from": 55,
      "to": 56
    },
    {
      "from": 56,
      "to": 57
    },
    {
      "from": 57,
      "to": 58
    },
    {
      "from": 58,
      "to": 59
    },
    {
      "from": 4,
      "to": 60
    },
    {
      "from": 14,
      "to": 61
    },
    {
      "from": 39,
      "to": 62
    },
    {
      "from": 62,
      "to": 63
    },
    {
      "from": 63,
      "to": 64
    },
    {
      "from": 64,
      "to": 65
    },
    {
      "from": 65,
      "to": 66
    },
    {
      "from": 66,
      "to": 67
    },
    {
      "from": 67,
      "to": 68
    },
    {
      "from": 68,
      "to": 69
    },
    {
      "from": 69,
      "to": 70
    },
    {
      "from": 70,
      "to": 71
    },
    {
      "from": 71,
      "to": 72
    },
    {
      "from": 72,
      "to": 73
    },
    {
      "from": 73,
      "to": 74
    },
    {
      "from": 74,
      "to": 75
    },
    {
      "from": 49,
      "to": 76
    },
    {
      "from": 76,
      "to": 77
    },
    {
      "from": 77,
      "to": 78
    },
    {
      "from": 78,
      "to": 79
    },
    {
      "from": 79,
      "to": 80
    },
    {
      "from": 80,
      "to": 81
    },
    {
      "from": 81,
      "to": 82
    },
    {
      "from": 82,
      "to": 83
    },
    {
      "from": 83,
      "to": 84
    },
    {
      "from": 84,
      "to": 85
    },
    {
      "from": 85,
      "to": 86
    },
    {
      "from": 60,
      "to": 87
    },
    {
      "from": 87,
      "to": 88
    },
    {
      "from": 88,
      "to": 89
    },
    {
      "from": 89,
      "to": 90
    },
    {
      "from": 90,
      "to": 91
    },
    {
      "from": 91,
      "to": 92
    },
    {
      "from": 92,
      "to": 93
    },
    {
      "from": 93,
      "to": 94
    },
    {
      "from": 94,
      "to": 95
    },
    {
      "from": 95,
      "to": 96
    },
    {
      "from": 96,
      "to": 97
    },
    {
      "from": 97,
      "to": 98
    },
    {
      "from": 98,
      "to": 99
    }
  ],
  "cameraX": 0,
  "cameraY": 0,
  "nextNodeId": 100
};

const QuestBook = {
    isOpen: false,
    loadError: false,
    nodes: [],
    edges: [],
    progress: {},
    openNodeId: null,
    viewMode: 'graph',
    showHidden: false,

    async init() {
        this.progress = this.loadProgress();
        try {
            this.nodes = Array.isArray(EMBEDDED_QUEST_DATA.nodes) ? EMBEDDED_QUEST_DATA.nodes : [];
            this.edges = Array.isArray(EMBEDDED_QUEST_DATA.edges) ? EMBEDDED_QUEST_DATA.edges : [];
        } catch (err) {
            console.warn('Quest Book: could not load embedded quest data', err);
            this.loadError = true;
            this.nodes = [];
            this.edges = [];
        }
        this.syncCompletion();
        this.checkAutoTasks({ silent: true });
        this.loadUiState();
    },

    loadUiState() {
        try {
            const raw = localStorage.getItem(QUEST_UI_KEY);
            const ui = raw ? JSON.parse(raw) : {};
            this.showHidden = !!ui.showHidden;
        } catch (e) { /* ignore */ }
    },

    saveUiState() {
        try { localStorage.setItem(QUEST_UI_KEY, JSON.stringify({ showHidden: this.showHidden })); }
        catch (e) { /* ignore */ }
    },

    loadProgress() {
        try {
            const raw = localStorage.getItem(QUEST_PROGRESS_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) { return {}; }
    },

    saveProgress() {
        try { localStorage.setItem(QUEST_PROGRESS_KEY, JSON.stringify(this.progress)); }
        catch (e) { /* storage unavailable, ignore */ }
    },

    // Wipes all quest progress (every node's completed tasks + completed
    // flag) back to a blank slate and persists that immediately. Used by
    // the "Reset Progress" button - a full restart of the quest line, not
    // a per-quest undo.
    resetProgress() {
        this.progress = {};
        this.saveProgress();
        this.openNodeId = null;
        renderQuestBook();
    },

    getNodeProgress(nodeId) {
        if (!this.progress[nodeId]) this.progress[nodeId] = { completedTasks: [], completed: false };
        return this.progress[nodeId];
    },

    getNode(id) { return this.nodes.find(n => n.id === id); },

    // The prerequisite graph, read straight off `edges`: requirementsFor
    // answers "what must be done before I can start this quest", and
    // unlocksFrom answers the reverse - "what does completing this quest
    // open up". Both are recomputed on demand (not cached), which is fine
    // at this project's scale (a handful of quests).
    requirementsFor(nodeId) { return this.edges.filter(e => e.to === nodeId).map(e => e.from); },
    unlocksFrom(nodeId) { return this.edges.filter(e => e.from === nodeId).map(e => e.to); },

    isCompleted(nodeId) { return !!this.getNodeProgress(nodeId).completed; },

    // Locked = at least one requirement isn't completed yet. Note this is
    // different from isVisible() below - a quest can be "unlocked" (its
    // requirements are done) but still not "visible" if the player hasn't
    // opened up that part of the chain. status() combines both ideas into
    // the three states the UI actually shows.
    isUnlocked(nodeId) {
        return this.requirementsFor(nodeId).every(r => this.isCompleted(r));
    },

    // The three states every quest can be in, used throughout the UI
    // (status badges, whether a quest can be opened, node coloring on the
    // graph, etc).
    status(nodeId) {
        if (this.isCompleted(nodeId)) return 'completed';
        if (!this.isUnlocked(nodeId)) return 'locked';
        return 'available';
    },

    // A quest is "visible" once its chain has actually been opened up:
    // quests with no requirements are always visible (starting points).
    // A quest with requirements only becomes visible once at least one of
    // its direct requirements is completed - i.e. quest 3/4 stay hidden
    // until quest 2 (their requirement) is done, even though quest 2 itself
    // was reachable earlier.
    isVisible(nodeId) {
        const reqs = this.requirementsFor(nodeId);
        if (reqs.length === 0) return true;
        return reqs.some(r => this.isCompleted(r));
    },

    // Player-driven: only used for "manual" tasks.
    toggleTask(nodeId, taskIndex) {
        if (this.status(nodeId) === 'locked') return;
        const node = this.getNode(nodeId);
        const task = node && node.tasks && node.tasks[taskIndex];
        if (task && task.type === 'item') return; // code-verified, not player-togglable
        const prog = this.getNodeProgress(nodeId);
        const i = prog.completedTasks.indexOf(taskIndex);
        if (i === -1) prog.completedTasks.push(taskIndex);
        else prog.completedTasks.splice(i, 1);
        this.syncCompletionForNode(nodeId);
        this.saveProgress();
        renderQuestBook();
    },

    markComplete(nodeId) {
        if (this.status(nodeId) === 'locked') return;
        this.getNodeProgress(nodeId).completed = true;
        this.saveProgress();
        renderQuestBook();
    },

    // Code-driven, but NOT automatic: re-checks every "item" task against
    // the current inventory. Previously this ran on every single inventory
    // change (pickup, craft, move between slots...), which was noisy and
    // meant quests could silently complete themselves in the background.
    // Now it only runs when the player explicitly presses the quest's
    // "Check" button (see renderQuestDetail's check button) or once at
    // startup, to catch progress made in a previous session.
    checkAutoTasks(opts) {
        const silent = opts && opts.silent;
        let changed = false;
        this.nodes.forEach(node => {
            // Do not pre-complete future nodes just because the player is
            // already carrying their item.  Item conditions are meant to
            // validate the current point in the progression graph; checking
            // a quest must not silently skip a chain of locked quests.
            if (!this.isUnlocked(node.id)) return;
            const tasks = node.tasks || [];
            if (!tasks.some(t => t.type === 'item')) return;
            const prog = this.getNodeProgress(node.id);
            tasks.forEach((task, idx) => {
                if (task.type !== 'item') return;
                if (prog.completedTasks.includes(idx)) return; // already locked in
                const have = (typeof Inventory !== 'undefined' && Inventory.countItem) ? Inventory.countItem(task.itemId) : 0;
                const need = task.itemCount || 1;
                if (have >= need) {
                    prog.completedTasks.push(idx);
                    changed = true;
                }
            });
            const wasCompleted = prog.completed;
            this.syncCompletionForNode(node.id);
            if (prog.completed !== wasCompleted) changed = true;
        });
        if (changed) {
            this.saveProgress();
            if (!silent) renderQuestBook();
        }
        return changed;
    },

    // Live progress for a single "item" task, for display purposes.
    itemTaskProgress(task) {
        const have = (typeof Inventory !== 'undefined' && Inventory.countItem) ? Inventory.countItem(task.itemId) : 0;
        const need = task.itemCount || 1;
        return { have, need, met: have >= need };
    },

    syncCompletionForNode(nodeId) {
        const node = this.getNode(nodeId);
        if (!node) return;
        const prog = this.getNodeProgress(nodeId);
        const tasks = node.tasks || [];
        const required = tasks.filter(t => !t.optional);
        if (required.length > 0) {
            prog.completed = required.every(t => prog.completedTasks.includes(tasks.indexOf(t)));
        }
    },

    syncCompletion() {
        this.nodes.forEach(n => this.syncCompletionForNode(n.id));
    },

    toggleOverlay() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.openNodeId = null;
            const searchEl = document.getElementById('quest-list-search');
            if (searchEl) searchEl.value = '';
        }
        renderQuestBook();
        if (this.isOpen && typeof QuestGraph !== 'undefined') {
            QuestGraph.onOpen();
        }
    },
    closeOverlay() { this.isOpen = false; renderQuestBook(); },

    // Opens a quest immediately - no camera animation, no delay.
    // A closed quest - either not-yet-reached, or reached but still locked
    // on its own requirements - can only be opened while the eye
    // (showHidden) toggle is on; otherwise this is a no-op.
    openQuest(id) {
        const openableNow = this.isVisible(id) && this.status(id) !== 'locked';
        if (!openableNow && !this.showHidden) return;
        this.openNodeId = id;
        renderQuestBook();
    },
    backToList() { this.openNodeId = null; renderQuestBook(); },

    setViewMode(mode) {
        this.viewMode = mode;
        renderQuestBook();
    },

    toggleShowHidden() {
        this.showHidden = !this.showHidden;
        this.saveUiState();
        renderQuestBook();
    }
};

function questIconMarkup(node) {
    const letter = escapeHtml((node.title || '?').charAt(0).toUpperCase());
    if (node.iconUrl) {
        const src = escapeHtml(node.iconUrl);
        return `<img src="${src}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` +
               `<span class="quest-icon-letter" style="display:none;">${letter}</span>`;
    }
    return `<span class="quest-icon-letter">${letter}</span>`;
}

function renderQuestBook() {
    const overlay = document.getElementById('quest-overlay');
    if (!overlay) return;

    if (!QuestBook.isOpen) {
        overlay.classList.remove('visible');
        return;
    }
    overlay.classList.add('visible');

    const titleEl = document.getElementById('quest-panel-title');
    const backBtn = document.getElementById('quest-back-btn');
    const graphView = document.getElementById('quest-graph-view');
    const detailView = document.getElementById('quest-detail-view');

    if (QuestBook.openNodeId !== null) {
        backBtn.classList.add('flex-visible');
        if (graphView) graphView.style.display = 'none';
        if (detailView) detailView.style.display = 'block';
        renderQuestDetail(QuestBook.openNodeId, titleEl, detailView);
    } else {
        backBtn.classList.remove('flex-visible');
        titleEl.textContent = 'Quest Book';
        if (detailView) detailView.style.display = 'none';
        if (graphView) graphView.style.display = 'flex';
        renderGraphView();
    }
}

function questVisibleForBrowsing(nodeId) {
    // What the player is allowed to see right now: either the quest is
    // actually visible (its chain has been opened up), or the eye toggle
    // is on and we show everything (greyed out) for reference.
    return QuestBook.isVisible(nodeId) || QuestBook.showHidden;
}

function renderGraphView() {
    const emptyEl = document.getElementById('quest-graph-empty');
    const wrapEl = document.getElementById('quest-graph-canvas-wrap');
    const listWrap = document.getElementById('quest-list-wrap');
    const listBtn = document.getElementById('quest-list-toggle');
    const eyeBtn = document.getElementById('quest-eye-toggle');
    const searchEl = document.getElementById('quest-list-search');

    if (listBtn) listBtn.classList.toggle('active', QuestBook.viewMode === 'list');
    if (eyeBtn) eyeBtn.classList.toggle('active', QuestBook.showHidden);
    // Search only makes sense (and is only shown) in list view - the graph
    // is a free-form pannable map, not something search results narrow down.
    if (searchEl) searchEl.style.display = QuestBook.viewMode === 'list' ? 'block' : 'none';

    if (QuestBook.nodes.length === 0) {
        if (wrapEl) wrapEl.style.display = 'none';
        if (listWrap) listWrap.style.display = 'none';
        if (emptyEl) {
            emptyEl.style.display = 'block';
            emptyEl.innerHTML = QuestBook.loadError
                ? `No quests found.<br>
                   Export a quest file from the Quest Editor and save it as<br>
                   <code>assets/quests.json</code> in the game folder.
                   <span class="quest-empty-hint">If you opened index.html directly as a file, quest data needs a local web server to load (e.g. "python -m http.server" or VSCode's Live Server).</span>`
                : `No quests yet.`;
        }
        return;
    }
    if (emptyEl) emptyEl.style.display = 'none';

    if (QuestBook.viewMode === 'list') {
        if (wrapEl) wrapEl.style.display = 'none';
        if (listWrap) { listWrap.style.display = 'block'; renderQuestListView(listWrap); }
    } else {
        if (listWrap) listWrap.style.display = 'none';
        if (wrapEl) wrapEl.style.display = 'block';
        if (typeof QuestGraph !== 'undefined') {
            QuestGraph.init();
            QuestGraph.draw();
        }
    }
}

// Search input lives in the toolbar (only visible in list view) and is
// wired up once at load time - independent of QuestGraph's canvas
// initialization, which only happens when the graph view is first shown.
// Previously the search listener was attached inside QuestGraph.init(),
// which meant it silently never fired if the Quest Book opened directly
// into list view (e.g. after a saved "last view" state) - the input looked
// interactive but typing into it did nothing.
function setupQuestSearch() {
    const searchEl = document.getElementById('quest-list-search');
    if (!searchEl) return;
    searchEl.addEventListener('input', () => {
        const listWrap = document.getElementById('quest-list-wrap');
        if (listWrap) renderQuestListView(listWrap);
    });
}

function renderQuestListView(listWrap) {
    const term = (document.getElementById('quest-list-search') || {}).value || '';
    const q = term.trim().toLowerCase();

    // With the eye toggle off, only quests whose chain has actually been
    // opened up are listed. With it on, every quest is listed - locked /
    // not-yet-reached ones just appear greyed out and can't be opened
    // except through eye mode itself.
    const visible = QuestBook.nodes.filter(n => questVisibleForBrowsing(n.id));
    const filtered = q
        ? visible.filter(n => (n.title || '').toLowerCase().includes(q) || (n.subtitle || '').toLowerCase().includes(q))
        : visible;

    if (filtered.length === 0) {
        listWrap.innerHTML = `<div class="quest-list-empty">${q ? 'No quests match your search.' : 'No quests to show yet.'}</div>`;
        return;
    }

    listWrap.innerHTML = '';
    filtered.forEach(node => {
        const status = QuestBook.status(node.id);
        const actuallyVisible = QuestBook.isVisible(node.id);
        // A quest is openable normally only once it's actually reached and
        // unlocked. Anything else (locked, or only shown via the eye
        // toggle) is greyed out and can only be opened while eye mode is on.
        const openableNow = actuallyVisible && status !== 'locked';
        const closed = !openableNow;
        const row = document.createElement('div');
        row.className = 'quest-list-item' + (closed ? ' locked' : '') + (!actuallyVisible ? ' hidden-quest' : '');
        const badge = status === 'completed' ? '✔' : (closed ? '🔒' : '');
        row.innerHTML = `
            <div class="quest-list-icon">${questIconMarkup(node)}</div>
            <div class="quest-list-info">
                <div class="quest-list-title">${escapeHtml(node.title || 'Untitled')}</div>
                <div class="quest-list-subtitle">${escapeHtml(node.subtitle || '')}</div>
            </div>
            <div class="quest-list-status">${badge}</div>
        `;
        if (openableNow || QuestBook.showHidden) {
            row.addEventListener('click', () => QuestBook.openQuest(node.id));
        }
        listWrap.appendChild(row);
    });
}

function renderQuestDetail(nodeId, titleEl, bodyEl) {
    const node = QuestBook.getNode(nodeId);
    if (!node) { QuestBook.backToList(); return; }
    const status = QuestBook.status(nodeId);
    titleEl.textContent = node.title || 'Untitled';
    bodyEl.innerHTML = '';

    const statusLabel = status === 'locked' ? 'Locked' : status === 'completed' ? 'Completed' : 'Available';
    const header = document.createElement('div');
    header.className = 'quest-detail-header';
    header.innerHTML = `
        <div class="quest-detail-icon">${questIconMarkup(node)}</div>
        <div>
            <div class="quest-detail-subtitle">${escapeHtml(node.subtitle || '')}</div>
            <div class="quest-detail-status quest-status-${status}">${statusLabel}</div>
        </div>
    `;
    bodyEl.appendChild(header);

    if (status === 'locked') {
        const reqs = QuestBook.requirementsFor(nodeId);
        if (reqs.length > 0) {
            const sec = document.createElement('div');
            sec.className = 'quest-section';
            sec.innerHTML = '<h4>Requires</h4>';
            reqs.forEach(reqId => {
                const reqNode = QuestBook.getNode(reqId);
                const tag = document.createElement('span');
                tag.className = 'quest-dep-tag' + (QuestBook.isCompleted(reqId) ? ' quest-dep-done' : '');
                tag.textContent = reqNode ? (reqNode.title || 'Quest ' + reqId) : ('Quest ' + reqId);
                if (reqNode) tag.addEventListener('click', () => QuestBook.openQuest(reqId));
                sec.appendChild(tag);
            });
            bodyEl.appendChild(sec);
        }
    }

    if (node.description) {
        const sec = document.createElement('div');
        sec.className = 'quest-section';
        sec.innerHTML = '<h4>Description</h4>';
        const desc = document.createElement('div');
        desc.className = 'quest-desc';
        desc.innerHTML = node.description; // authored via the Quest Editor, supports HTML/images
        sec.appendChild(desc);
        bodyEl.appendChild(sec);
    }

    const tasks = node.tasks || [];
    let hasUncheckedItemTask = false;
    if (tasks.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'quest-section';
        sec.innerHTML = '<h4>Tasks</h4>';
        const prog = QuestBook.getNodeProgress(nodeId);
        tasks.forEach((task, idx) => {
            const checked = prog.completedTasks.includes(idx);
            if (task.type === 'item') {
                // Code-verified, but only ON DEMAND: the player presses the
                // "Check" button below (not auto-checked as the inventory
                // changes). The live count is still shown so they can see
                // whether they actually have enough before checking.
                if (!checked) hasUncheckedItemTask = true;
                const live = QuestBook.itemTaskProgress(task);
                const row = document.createElement('div');
                row.className = 'quest-task-row auto' + (task.optional ? ' optional' : '');
                row.innerHTML = `
                    <span class="quest-task-check">${checked ? '✔' : '•'}</span>
                    <span>${escapeHtml(task.text)}${task.optional ? ' <em>(optional)</em>' : ''}
                        <em class="quest-task-progress">${checked ? live.need : Math.min(live.have, live.need)}/${live.need} ${escapeHtml(task.itemId || '')}</em>
                    </span>
                `;
                sec.appendChild(row);
            } else {
                const row = document.createElement('label');
                row.className = 'quest-task-row' + (task.optional ? ' optional' : '');
                const disabled = status === 'locked';
                row.innerHTML = `
                    <input type="checkbox" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
                    <span>${escapeHtml(task.text)}${task.optional ? ' <em>(optional)</em>' : ''}</span>
                `;
                row.querySelector('input').addEventListener('change', () => QuestBook.toggleTask(nodeId, idx));
                sec.appendChild(row);
            }
        });
        bodyEl.appendChild(sec);

        // "Check" button: verifies every item-type task against the
        // player's current inventory right now, on demand. Only shown
        // while at least one item task is still unverified and the quest
        // isn't locked - once everything's checked off there's nothing
        // left to (re-)verify.
        if (hasUncheckedItemTask && status !== 'locked') {
            const checkBtn = document.createElement('button');
            checkBtn.className = 'quest-check-btn';
            checkBtn.textContent = 'Check';
            checkBtn.addEventListener('click', () => {
                const changed = QuestBook.checkAutoTasks();
                if (!changed) {
                    checkBtn.textContent = 'Not yet\u2026';
                    checkBtn.classList.add('quest-check-btn-fail');
                    setTimeout(() => {
                        checkBtn.textContent = 'Check';
                        checkBtn.classList.remove('quest-check-btn-fail');
                    }, 900);
                } else {
                    renderQuestDetail(nodeId, titleEl, bodyEl);
                }
            });
            bodyEl.appendChild(checkBtn);
        }
    } else if (status !== 'completed') {
        const btn = document.createElement('button');
        btn.className = 'quest-complete-btn';
        btn.textContent = 'Mark as complete';
        btn.disabled = status === 'locked';
        btn.addEventListener('click', () => QuestBook.markComplete(nodeId));
        bodyEl.appendChild(btn);
    }


    // Only list quests this opens up if they're actually reachable now
    // (or the eye toggle is on) - otherwise "Leads to" would spoil titles
    // for quests the player hasn't unlocked the chain for yet.
    const unlocks = QuestBook.unlocksFrom(nodeId).filter(uId => questVisibleForBrowsing(uId));
    if (unlocks.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'quest-section';
        sec.innerHTML = '<h4>Leads to</h4>';
        unlocks.forEach(uId => {
            const uNode = QuestBook.getNode(uId);
            const revealed = QuestBook.isVisible(uId);
            const tag = document.createElement('span');
            tag.className = 'quest-dep-tag';
            tag.textContent = revealed ? (uNode ? (uNode.title || 'Quest ' + uId) : ('Quest ' + uId)) : '???';
            if (revealed) tag.addEventListener('click', () => QuestBook.openQuest(uId));
            else tag.style.cursor = 'default';
            sec.appendChild(tag);
        });
        bodyEl.appendChild(sec);
    }
}

// ============================================
// Quest Graph (canvas view)
// ============================================
// Read-only, pannable view of the same node graph the Quest Editor builds:
// same positions, shapes, icons and connections, just styled for the game
// and with search + click-to-view instead of editing.
const QuestGraph = {
    canvas: null,
    ctx: null,
    cameraX: 0,
    cameraY: 0,
    dpr: 1,
    initialized: false,
    isDragging: false,
    dragMoved: false,
    dragStart: { x: 0, y: 0 },
    dragCameraStart: { x: 0, y: 0 },
    _iconCache: {},

    init() {
        if (this.initialized) return;
        this.canvas = document.getElementById('quest-graph-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
        this.canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
        this.canvas.addEventListener('pointerup', (e) => this.onPointerUp(e));
        this.canvas.addEventListener('pointerleave', (e) => this.onPointerUp(e));
        window.addEventListener('resize', () => { this.resize(); this.draw(); });

        // Note: there is no search in the graph view by design - search is
        // list-view only (see setupQuestSearch()). The graph is a free-form
        // map you pan/click around; searching it would just jump the camera
        // around, which isn't useful here.

        this.initialized = true;
        this.resize();
    },

    // Called each time the Quest Book overlay is opened.
    onOpen() {
        this.init();
        this.resize();
        this.fitToNodes();
        this.draw();
    },

    resize() {
        if (!this.canvas) return;
        const wrap = this.canvas.parentElement;
        if (!wrap) return;
        const w = wrap.clientWidth, h = wrap.clientHeight;
        if (w > 0 && h > 0) {
            // Render at devicePixelRatio so the graph is crisp on retina /
            // high-DPI screens instead of looking pixelated. CSS keeps the
            // element's on-screen size at w x h; we just back it with more
            // pixels and scale the drawing context to match.
            const dpr = Math.min(window.devicePixelRatio || 1, 3);
            this.dpr = dpr;
            this.canvas.width = Math.round(w * dpr);
            this.canvas.height = Math.round(h * dpr);
            this.canvas.style.width = w + 'px';
            this.canvas.style.height = h + 'px';
            this.cssWidth = w;
            this.cssHeight = h;
            if (this.ctx) this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
    },

    fitToNodes() {
        const nodes = QuestBook.nodes;
        if (!this.canvas || nodes.length === 0) return;
        const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
        const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
        this.cameraX = cx - (this.cssWidth || this.canvas.width) / 2;
        this.cameraY = cy - (this.cssHeight || this.canvas.height) / 2;
    },

    screenToWorld(sx, sy) { return { x: sx + this.cameraX, y: sy + this.cameraY }; },
    worldToScreen(wx, wy) { return { x: wx - this.cameraX, y: wy - this.cameraY }; },

    getEventPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },

    hitTestNode(mx, my) {
        for (const node of QuestBook.nodes) {
            if (!questVisibleForBrowsing(node.id)) continue;
            const s = this.worldToScreen(node.x, node.y);
            const dx = mx - s.x, dy = my - s.y;
            const r = (node.radius || 18) + 6;
            if (dx * dx + dy * dy <= r * r) return node.id;
        }
        return null;
    },

    onPointerDown(e) {
        this.isDragging = true;
        this.dragMoved = false;
        this.dragStart = this.getEventPos(e);
        this.dragCameraStart = { x: this.cameraX, y: this.cameraY };
        try { this.canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    },

    onPointerMove(e) {
        if (!this.isDragging) return;
        const p = this.getEventPos(e);
        const dx = p.x - this.dragStart.x, dy = p.y - this.dragStart.y;
        if (Math.hypot(dx, dy) > 4) this.dragMoved = true;
        this.cameraX = this.dragCameraStart.x - dx;
        this.cameraY = this.dragCameraStart.y - dy;
        this.draw();
    },

    onPointerUp(e) {
        if (!this.isDragging) return;
        this.isDragging = false;
        if (!this.dragMoved) {
            const p = this.getEventPos(e);
            const hit = this.hitTestNode(p.x, p.y);
            // openQuest() itself enforces the rule: reachable quests open
            // normally, everything else only opens while eye mode is on.
            if (hit !== null) QuestBook.openQuest(hit);
        }
        try { this.canvas.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    },

    nodeColors(status) {
        if (status === 'completed') return { fill: '#1a3a2a', stroke: '#4caf7d' };
        if (status === 'locked') return { fill: '#232640', stroke: '#45456a' };
        return { fill: '#1a3a4a', stroke: '#4fc3f7' };
    },

    drawShape(x, y, radius, shape) {
        const ctx = this.ctx;
        ctx.beginPath();
        if (shape === 'circle' || !shape) { ctx.arc(x, y, radius, 0, Math.PI * 2); return; }
        if (shape === 'star') {
            const spikes = 5, outerR = radius, innerR = radius * 0.45;
            const rot = -Math.PI / 2;
            for (let i = 0; i < spikes * 2; i++) {
                const r = i % 2 === 0 ? outerR : innerR;
                const angle = rot + (i * Math.PI) / spikes;
                const px = x + r * Math.cos(angle), py = y + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.closePath();
            return;
        }
        const sides = parseInt(shape, 10);
        if (isNaN(sides) || sides < 3) { ctx.arc(x, y, radius, 0, Math.PI * 2); return; }
        const step = (Math.PI * 2) / sides, start = -Math.PI / 2;
        for (let i = 0; i < sides; i++) {
            const angle = start + i * step;
            const px = x + radius * Math.cos(angle), py = y + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
    },

    drawArrowhead(fromX, fromY, toX, toY, radius) {
        const ctx = this.ctx;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const len = 9, w = 4.5;
        const tipX = toX - radius * Math.cos(angle);
        const tipY = toY - radius * Math.sin(angle);
        ctx.save();
        ctx.translate(tipX, tipY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-len, -w);
        ctx.lineTo(-len, w);
        ctx.closePath();
        ctx.fillStyle = 'rgba(130,160,210,0.55)';
        ctx.fill();
        ctx.restore();
    },

    drawLetter(x, y, node) {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = 'bold 13px "Segoe UI", Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((node.title || '?').charAt(0).toUpperCase(), x, y);
    },

    draw() {
        if (!this.ctx || !this.canvas || this.canvas.width === 0) return;
        const ctx = this.ctx;
        const W = this.cssWidth || this.canvas.width;
        const H = this.cssHeight || this.canvas.height;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#12121f';
        ctx.fillRect(0, 0, W, H);

        // subtle dotted grid, matches the site's dark palette
        const spacing = 56;
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        const startX = -(((this.cameraX % spacing) + spacing) % spacing);
        const startY = -(((this.cameraY % spacing) + spacing) % spacing);
        for (let x = startX; x < W; x += spacing) {
            for (let y = startY; y < H; y += spacing) {
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // A node is drawable if it's actually visible (its chain has been
        // opened up), or the eye toggle is on (show everything, greyed out).
        const drawable = id => questVisibleForBrowsing(id);

        // edges - only between two drawable nodes
        QuestBook.edges.forEach(edge => {
            const from = QuestBook.getNode(edge.from), to = QuestBook.getNode(edge.to);
            if (!from || !to) return;
            if (!drawable(from.id) || !drawable(to.id)) return;
            const revealed = QuestBook.isVisible(to.id);
            const p1 = this.worldToScreen(from.x, from.y), p2 = this.worldToScreen(to.x, to.y);
            ctx.save();
            ctx.globalAlpha = revealed ? 1 : 0.35;
            ctx.strokeStyle = 'rgba(130,160,210,0.35)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            this.drawArrowhead(p1.x, p1.y, p2.x, p2.y, to.radius || 18);
            ctx.restore();
        });

        // nodes
        QuestBook.nodes.forEach(node => {
            if (!drawable(node.id)) return;
            const revealed = QuestBook.isVisible(node.id);
            const s = this.worldToScreen(node.x, node.y);
            const r = node.radius || 18;
            if (s.x < -r - 60 || s.x > W + r + 60 ||
                s.y < -r - 60 || s.y > H + r + 60) return;

            const status = QuestBook.status(node.id);
            const colors = revealed ? this.nodeColors(status) : { fill: '#20222f', stroke: '#3a3c50' };

            ctx.save();
            ctx.globalAlpha = (status === 'locked' ? 0.6 : 1) * (revealed ? 1 : 0.55);
            ctx.beginPath();
            this.drawShape(s.x, s.y, r, node.shape);
            ctx.fillStyle = colors.fill;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = colors.stroke;
            ctx.stroke();

            if (revealed && node.iconUrl) {
                if (!this._iconCache[node.iconUrl]) {
                    const im = new Image();
                    im.src = node.iconUrl;
                    im.onload = () => this.draw();
                    this._iconCache[node.iconUrl] = im;
                }
                const im = this._iconCache[node.iconUrl];
                if (im.complete && im.naturalWidth > 0) {
                    ctx.save();
                    ctx.beginPath();
                    this.drawShape(s.x, s.y, r, node.shape);
                    ctx.clip();
                    const size = r * 1.6;
                    ctx.drawImage(im, s.x - size / 2, s.y - size / 2, size, size);
                    ctx.restore();
                } else {
                    this.drawLetter(s.x, s.y, node);
                }
            } else if (revealed) {
                this.drawLetter(s.x, s.y, node);
            } else {
                // not-yet-reached quest shown via the eye toggle: render as
                // a plain "?" silhouette, no title/icon spoilers.
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.font = 'bold 13px "Segoe UI", Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('?', s.x, s.y);
            }
            ctx.restore();

            // status badge (locked / completed)
            if (revealed && status !== 'available') {
                ctx.save();
                ctx.globalAlpha = 1;
                const bx = s.x + r * 0.72, by = s.y - r * 0.72;
                ctx.beginPath();
                ctx.arc(bx, by, Math.max(7, r * 0.32), 0, Math.PI * 2);
                ctx.fillStyle = '#12121f';
                ctx.fill();
                ctx.font = Math.max(9, r * 0.42) + 'px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = status === 'completed' ? '#4caf7d' : '#aab';
                ctx.fillText(status === 'completed' ? '\u2714' : '\ud83d\udd12', bx, by);
                ctx.restore();
            }

            // title label under the node
            ctx.save();
            ctx.globalAlpha = revealed ? 1 : 0.4;
            ctx.fillStyle = '#c8d4e4';
            ctx.font = '11px "Segoe UI", Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(revealed ? (node.title || 'Untitled') : '???', s.x, s.y + r + 4, 92);
            ctx.restore();
        });

    }
};

function setupQuestControls() {
    const toggleBtn = document.getElementById('quest-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', () => QuestBook.toggleOverlay());

    const closeBtn = document.getElementById('quest-close');
    if (closeBtn) closeBtn.addEventListener('click', () => QuestBook.closeOverlay());

    const backBtn = document.getElementById('quest-back-btn');
    if (backBtn) backBtn.addEventListener('click', () => QuestBook.backToList());

    const overlayEl = document.getElementById('quest-overlay');
    if (overlayEl) {
        overlayEl.addEventListener('click', (e) => { if (e.target === overlayEl) QuestBook.closeOverlay(); });
    }

    const listBtn = document.getElementById('quest-list-toggle');
    if (listBtn) listBtn.addEventListener('click', () => {
        QuestBook.setViewMode(QuestBook.viewMode === 'list' ? 'graph' : 'list');
    });

    const eyeBtn = document.getElementById('quest-eye-toggle');
    if (eyeBtn) eyeBtn.addEventListener('click', () => QuestBook.toggleShowHidden());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'b' || e.key === 'B') {
            e.preventDefault();
            QuestBook.toggleOverlay();
        }
        if (e.key === 'Escape' && QuestBook.isOpen) {
            if (QuestBook.openNodeId !== null) QuestBook.backToList();
            else QuestBook.closeOverlay();
        }
    });
}

QuestBook.init().then(renderQuestBook);
setupQuestControls();
setupQuestSearch();
