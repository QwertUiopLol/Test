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
      "y": 60,
      "title": "Путеводитель по миру",
      "subtitle": "Весь контент — без лишних барьеров",
      "description": "Квестник полностью переработан. Каждая карточка посвящена конкретному предмету, блоку или процессу. Открывайте JEI клавишей J: там показаны рецепты, применения и источники добычи.",
      "tasks": [
        {
          "text": "Открыть JEI и ознакомиться с вкладками «Рецепт» и «Использование»",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 2,
      "radius": 25,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 180,
      "title": "Первые материалы",
      "subtitle": "Земля, камень и рабочее место",
      "description": "Начните с доступных ресурсов. Эти задания не образуют обязательную цепочку: выполняйте их в удобном порядке.",
      "tasks": [
        {
          "text": "Открыть главу и выбрать удобный следующий шаг",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 3,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 280,
      "contentId": "IR-dirt",
      "title": "Земля",
      "subtitle": "Базовый блок мира",
      "description": "Земля — базовый блок текущего мира. В JEI можно посмотреть, что он отдаёт при разрушении и где применяется дальше.",
      "tasks": [
        {
          "text": "Прочитать карточку блока",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 4,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 280,
      "contentId": "IR-cobblestone",
      "title": "Булыжник",
      "subtitle": "Базовый блок мира",
      "description": "Булыжник — базовый блок текущего мира. В JEI можно посмотреть, что он отдаёт при разрушении и где применяется дальше.",
      "tasks": [
        {
          "text": "Прочитать карточку блока",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 5,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 280,
      "contentId": "IR-workbench",
      "title": "Верстак",
      "subtitle": "Сборка: блок",
      "description": "Верстак собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Верстак",
          "optional": false,
          "type": "item",
          "itemId": "IR-workbench",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 6,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 280,
      "contentId": "IR-mixer",
      "title": "Мельница-смеситель",
      "subtitle": "Сборка: блок",
      "description": "Мельница-смеситель собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Мельница-смеситель",
          "optional": false,
          "type": "item",
          "itemId": "IR-mixer",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 7,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 280,
      "contentId": "IR-apebble",
      "title": "Андезитовый камешек",
      "subtitle": "Добыча: просеивание",
      "description": "Андезитовый камешек находится при просеивании открытой земли. Зажмите Alt и используйте действие разрушения по земле без блока сверху. В JEI этот источник показан на вкладке «Рецепт».",
      "tasks": [
        {
          "text": "Получить: Андезитовый камешек",
          "optional": false,
          "type": "item",
          "itemId": "IR-apebble",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 8,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 395,
      "contentId": "IR-cpebble",
      "title": "Кальцитовый камешек",
      "subtitle": "Добыча: просеивание",
      "description": "Кальцитовый камешек находится при просеивании открытой земли. Зажмите Alt и используйте действие разрушения по земле без блока сверху. В JEI этот источник показан на вкладке «Рецепт».",
      "tasks": [
        {
          "text": "Получить: Кальцитовый камешек",
          "optional": false,
          "type": "item",
          "itemId": "IR-cpebble",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 9,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 395,
      "contentId": "IR-bpebble",
      "title": "Базальтовый камешек",
      "subtitle": "Добыча: просеивание",
      "description": "Базальтовый камешек находится при просеивании открытой земли. Зажмите Alt и используйте действие разрушения по земле без блока сверху. В JEI этот источник показан на вкладке «Рецепт».",
      "tasks": [
        {
          "text": "Получить: Базальтовый камешек",
          "optional": false,
          "type": "item",
          "itemId": "IR-bpebble",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 10,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 395,
      "contentId": "IR-blpebble",
      "title": "Чернокаменный камешек",
      "subtitle": "Добыча: просеивание",
      "description": "Чернокаменный камешек находится при просеивании открытой земли. Зажмите Alt и используйте действие разрушения по земле без блока сверху. В JEI этот источник показан на вкладке «Рецепт».",
      "tasks": [
        {
          "text": "Получить: Чернокаменный камешек",
          "optional": false,
          "type": "item",
          "itemId": "IR-blpebble",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 11,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 395,
      "contentId": "IR-dpebble",
      "title": "Глубинный камешек",
      "subtitle": "Добыча: просеивание",
      "description": "Глубинный камешек находится при просеивании открытой земли. Зажмите Alt и используйте действие разрушения по земле без блока сверху. В JEI этот источник показан на вкладке «Рецепт».",
      "tasks": [
        {
          "text": "Получить: Глубинный камешек",
          "optional": false,
          "type": "item",
          "itemId": "IR-dpebble",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 12,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 395,
      "contentId": "IR-humus",
      "title": "Гумус",
      "subtitle": "Добыча: просеивание",
      "description": "Гумус находится при просеивании открытой земли. Зажмите Alt и используйте действие разрушения по земле без блока сверху. В JEI этот источник показан на вкладке «Рецепт».",
      "tasks": [
        {
          "text": "Получить: Гумус",
          "optional": false,
          "type": "item",
          "itemId": "IR-humus",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 13,
      "radius": 25,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 880,
      "title": "Стекло и жизнь",
      "subtitle": "От минералов к первому дереву",
      "description": "Эта глава охватывает полный путь синтетического саженца: порошки, стекло, стерилизация и культура тканей.",
      "tasks": [
        {
          "text": "Открыть главу и выбрать удобный следующий шаг",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 14,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 980,
      "contentId": "IR-limestone",
      "title": "Известняк",
      "subtitle": "Добыча: просеивание",
      "description": "Известняк находится при просеивании открытой земли. Зажмите Alt и используйте действие разрушения по земле без блока сверху. В JEI этот источник показан на вкладке «Рецепт».",
      "tasks": [
        {
          "text": "Получить: Известняк",
          "optional": false,
          "type": "item",
          "itemId": "IR-limestone",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 15,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 980,
      "contentId": "IR-clay",
      "title": "Глина",
      "subtitle": "Добыча: просеивание",
      "description": "Глина находится при просеивании открытой земли. Зажмите Alt и используйте действие разрушения по земле без блока сверху. В JEI этот источник показан на вкладке «Рецепт».",
      "tasks": [
        {
          "text": "Получить: Глина",
          "optional": false,
          "type": "item",
          "itemId": "IR-clay",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 16,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 980,
      "contentId": "IR-limepowder",
      "title": "Известковый порошок",
      "subtitle": "Сборка: предмет",
      "description": "Известковый порошок собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Известковый порошок",
          "optional": false,
          "type": "item",
          "itemId": "IR-limepowder",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 17,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 980,
      "contentId": "IR-mineralpowder",
      "title": "Минеральная мука",
      "subtitle": "Обработка: Мельница-смеситель",
      "description": "Минеральная мука получается на станции «Мельница-смеситель». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Минеральная мука",
          "optional": false,
          "type": "item",
          "itemId": "IR-mineralpowder",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 18,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 980,
      "contentId": "IR-silicapowder",
      "title": "Кремнезёмный порошок",
      "subtitle": "Обработка: Мельница-смеситель",
      "description": "Кремнезёмный порошок получается на станции «Мельница-смеситель». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Кремнезёмный порошок",
          "optional": false,
          "type": "item",
          "itemId": "IR-silicapowder",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 19,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 1095,
      "contentId": "IR-kiln",
      "title": "Печь обжига",
      "subtitle": "Сборка: блок",
      "description": "Печь обжига собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Печь обжига",
          "optional": false,
          "type": "item",
          "itemId": "IR-kiln",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 20,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 1095,
      "contentId": "IR-capsule-1000",
      "title": "Пустая стеклянная капсула",
      "subtitle": "Обработка: Печь обжига",
      "description": "Пустая стеклянная капсула получается на станции «Печь обжига». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Пустая стеклянная капсула",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 21,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1095,
      "contentId": "IR-capsule-1000-water",
      "title": "Капсула воды",
      "subtitle": "Сборка: предмет",
      "description": "Капсула воды собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Капсула воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 22,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 1095,
      "contentId": "IR-fluid-extractor",
      "title": "Экстрактор жидкости",
      "subtitle": "Сборка: блок",
      "description": "Экстрактор жидкости собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Экстрактор жидкости",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-extractor",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 23,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 1095,
      "contentId": "IR-nutrientgel",
      "title": "Питательный гель",
      "subtitle": "Справочная карточка",
      "description": "Питательный гель учтён в текущем наборе предметов как материал, промежуточный продукт или побочный результат. Проверьте JEI, чтобы увидеть все уже реализованные применения и не потерять его из вида.",
      "tasks": [
        {
          "text": "Открыть Питательный гель в JEI",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 24,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 1210,
      "contentId": "IR-plantash",
      "title": "Растительная зола",
      "subtitle": "Обработка: Печь обжига",
      "description": "Растительная зола получается на станции «Печь обжига». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
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
      "id": 25,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 1210,
      "contentId": "IR-ashlye",
      "title": "Зольный щёлок",
      "subtitle": "Сборка: предмет",
      "description": "Зольный щёлок собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Зольный щёлок",
          "optional": false,
          "type": "item",
          "itemId": "IR-ashlye",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 26,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1210,
      "contentId": "IR-sodaash",
      "title": "Кальцинированная сода",
      "subtitle": "Обработка: Печь обжига",
      "description": "Кальцинированная сода получается на станции «Печь обжига». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Кальцинированная сода",
          "optional": false,
          "type": "item",
          "itemId": "IR-sodaash",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 27,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 1210,
      "contentId": "IR-autoclave",
      "title": "Автоклав",
      "subtitle": "Сборка: блок",
      "description": "Автоклав собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Автоклав",
          "optional": false,
          "type": "item",
          "itemId": "IR-autoclave",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 28,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 1210,
      "contentId": "IR-capsule-sterile",
      "title": "Стерильная капсула",
      "subtitle": "Обработка: Автоклав",
      "description": "Стерильная капсула получается на станции «Автоклав». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Стерильная капсула",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-sterile",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 29,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 1325,
      "contentId": "IR-nutrientgel-sterile",
      "title": "Стерильный питательный гель",
      "subtitle": "Обработка: Автоклав",
      "description": "Стерильный питательный гель получается на станции «Автоклав». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Стерильный питательный гель",
          "optional": false,
          "type": "item",
          "itemId": "IR-nutrientgel-sterile",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 30,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 1325,
      "contentId": "IR-bioreactor",
      "title": "Биореактор",
      "subtitle": "Сборка: блок",
      "description": "Биореактор собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Биореактор",
          "optional": false,
          "type": "item",
          "itemId": "IR-bioreactor",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 31,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1325,
      "contentId": "IR-callusculture",
      "title": "Культура каллуса",
      "subtitle": "Обработка: Мельница-смеситель",
      "description": "Культура каллуса получается на станции «Мельница-смеситель». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Культура каллуса",
          "optional": false,
          "type": "item",
          "itemId": "IR-callusculture",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 32,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 1325,
      "contentId": "IR-hormonesolution",
      "title": "Раствор регуляторов роста",
      "subtitle": "Обработка: Мельница-смеситель",
      "description": "Раствор регуляторов роста получается на станции «Мельница-смеситель». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Раствор регуляторов роста",
          "optional": false,
          "type": "item",
          "itemId": "IR-hormonesolution",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 33,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 1325,
      "contentId": "IR-embryogeniccallus",
      "title": "Эмбриогенный каллус",
      "subtitle": "Обработка: Биореактор",
      "description": "Эмбриогенный каллус получается на станции «Биореактор». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
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
      "id": 34,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 1440,
      "contentId": "IR-sapling",
      "title": "Синтетический саженец дуба",
      "subtitle": "Сборка: предмет",
      "description": "Синтетический саженец дуба собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Синтетический саженец дуба",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 35,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 1440,
      "contentId": "IR-oaklog",
      "title": "Дубовое бревно",
      "subtitle": "Базовый блок мира",
      "description": "Дубовое бревно — базовый блок текущего мира. В JEI можно посмотреть, что он отдаёт при разрушении и где применяется дальше.",
      "tasks": [
        {
          "text": "Прочитать карточку блока",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 36,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1440,
      "contentId": "IR-plank",
      "title": "Доски",
      "subtitle": "Сборка: предмет",
      "description": "Доски собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Доски",
          "optional": false,
          "type": "item",
          "itemId": "IR-plank",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 37,
      "radius": 25,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 1580,
      "title": "Руда и обогащение",
      "subtitle": "Подготовьте чистую шихту",
      "description": "Все варианты железной руды собраны в одной главе. Любой доступный концентрат — это рабочий путь, а не скрытая «правильная» руда.",
      "tasks": [
        {
          "text": "Открыть главу и выбрать удобный следующий шаг",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 38,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 1680,
      "contentId": "IR-quernstone",
      "title": "Жернов",
      "subtitle": "Сборка: блок",
      "description": "Жернов собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Жернов",
          "optional": false,
          "type": "item",
          "itemId": "IR-quernstone",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 39,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 1680,
      "contentId": "IR-grindingstone",
      "title": "Точильный камень",
      "subtitle": "Сборка: предмет",
      "description": "Точильный камень собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Точильный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 40,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1680,
      "contentId": "IR-bogironore",
      "title": "Болотная железная руда",
      "subtitle": "Добыча: просеивание",
      "description": "Болотная железная руда находится при просеивании открытой земли. Зажмите Alt и используйте действие разрушения по земле без блока сверху. В JEI этот источник показан на вкладке «Рецепт».",
      "tasks": [
        {
          "text": "Получить: Болотная железная руда",
          "optional": false,
          "type": "item",
          "itemId": "IR-bogironore",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 41,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 1680,
      "contentId": "IR-hematite",
      "title": "Гематит",
      "subtitle": "Добыча: просеивание",
      "description": "Гематит находится при просеивании открытой земли. Зажмите Alt и используйте действие разрушения по земле без блока сверху. В JEI этот источник показан на вкладке «Рецепт».",
      "tasks": [
        {
          "text": "Получить: Гематит",
          "optional": false,
          "type": "item",
          "itemId": "IR-hematite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 42,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 1680,
      "contentId": "IR-magnetite",
      "title": "Магнетит",
      "subtitle": "Добыча: просеивание",
      "description": "Магнетит находится при просеивании открытой земли. Зажмите Alt и используйте действие разрушения по земле без блока сверху. В JEI этот источник показан на вкладке «Рецепт».",
      "tasks": [
        {
          "text": "Получить: Магнетит",
          "optional": false,
          "type": "item",
          "itemId": "IR-magnetite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 43,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 1795,
      "contentId": "IR-limonite",
      "title": "Лимонит",
      "subtitle": "Добыча: просеивание",
      "description": "Лимонит находится при просеивании открытой земли. Зажмите Alt и используйте действие разрушения по земле без блока сверху. В JEI этот источник показан на вкладке «Рецепт».",
      "tasks": [
        {
          "text": "Получить: Лимонит",
          "optional": false,
          "type": "item",
          "itemId": "IR-limonite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 44,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 1795,
      "contentId": "IR-ironore",
      "title": "Железная руда",
      "subtitle": "Добыча: просеивание",
      "description": "Железная руда находится при просеивании открытой земли. Зажмите Alt и используйте действие разрушения по земле без блока сверху. В JEI этот источник показан на вкладке «Рецепт».",
      "tasks": [
        {
          "text": "Получить: Железная руда",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironore",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 45,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1795,
      "contentId": "IR-crushedbogiron",
      "title": "Дроблёная болотная руда",
      "subtitle": "Обработка: Жернов",
      "description": "Дроблёная болотная руда получается на станции «Жернов». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Дроблёная болотная руда",
          "optional": false,
          "type": "item",
          "itemId": "IR-crushedbogiron",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 46,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 1795,
      "contentId": "IR-crushedhematite",
      "title": "Дроблёный гематит",
      "subtitle": "Обработка: Жернов",
      "description": "Дроблёный гематит получается на станции «Жернов». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Дроблёный гематит",
          "optional": false,
          "type": "item",
          "itemId": "IR-crushedhematite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 47,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 1795,
      "contentId": "IR-crushedmagnetite",
      "title": "Дроблёный магнетит",
      "subtitle": "Обработка: Жернов",
      "description": "Дроблёный магнетит получается на станции «Жернов». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Дроблёный магнетит",
          "optional": false,
          "type": "item",
          "itemId": "IR-crushedmagnetite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 48,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 1910,
      "contentId": "IR-crushedlimonite",
      "title": "Дроблёный лимонит",
      "subtitle": "Обработка: Жернов",
      "description": "Дроблёный лимонит получается на станции «Жернов». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Дроблёный лимонит",
          "optional": false,
          "type": "item",
          "itemId": "IR-crushedlimonite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 49,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 1910,
      "contentId": "IR-crushedironore",
      "title": "Дроблёная железная руда",
      "subtitle": "Обработка: Жернов",
      "description": "Дроблёная железная руда получается на станции «Жернов». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Дроблёная железная руда",
          "optional": false,
          "type": "item",
          "itemId": "IR-crushedironore",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 50,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 1910,
      "contentId": "IR-crushedlimestone",
      "title": "Crushed Limestone",
      "subtitle": "Обработка: Жернов",
      "description": "Crushed Limestone получается на станции «Жернов». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Crushed Limestone",
          "optional": false,
          "type": "item",
          "itemId": "IR-crushedlimestone",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 51,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 1910,
      "contentId": "IR-sluicebox",
      "title": "Промывочный лоток",
      "subtitle": "Сборка: блок",
      "description": "Промывочный лоток собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Промывочный лоток",
          "optional": false,
          "type": "item",
          "itemId": "IR-sluicebox",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 52,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 1910,
      "contentId": "IR-woodenriffle",
      "title": "Деревянные рифли",
      "subtitle": "Сборка: предмет",
      "description": "Деревянные рифли собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Деревянные рифли",
          "optional": false,
          "type": "item",
          "itemId": "IR-woodenriffle",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 53,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 2025,
      "contentId": "IR-concentratebogiron",
      "title": "Концентрат болотной руды",
      "subtitle": "Обработка: Промывочный лоток",
      "description": "Концентрат болотной руды получается на станции «Промывочный лоток». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Концентрат болотной руды",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentratebogiron",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 54,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 2025,
      "contentId": "IR-concentratehematite",
      "title": "Концентрат гематита",
      "subtitle": "Обработка: Промывочный лоток",
      "description": "Концентрат гематита получается на станции «Промывочный лоток». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Концентрат гематита",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentratehematite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 55,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 2025,
      "contentId": "IR-concentratemagnetite",
      "title": "Концентрат магнетита",
      "subtitle": "Обработка: Промывочный лоток",
      "description": "Концентрат магнетита получается на станции «Промывочный лоток». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Концентрат магнетита",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentratemagnetite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 56,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 2025,
      "contentId": "IR-concentratelimonite",
      "title": "Концентрат лимонита",
      "subtitle": "Обработка: Промывочный лоток",
      "description": "Концентрат лимонита получается на станции «Промывочный лоток». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Концентрат лимонита",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentratelimonite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 57,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 2025,
      "contentId": "IR-concentrateironore",
      "title": "Концентрат железной руды",
      "subtitle": "Обработка: Промывочный лоток",
      "description": "Концентрат железной руды получается на станции «Промывочный лоток». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Концентрат железной руды",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 58,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 2140,
      "contentId": "IR-charcoalpit",
      "title": "Угольная яма",
      "subtitle": "Сборка: блок",
      "description": "Угольная яма собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Угольная яма",
          "optional": false,
          "type": "item",
          "itemId": "IR-charcoalpit",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 59,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 2140,
      "contentId": "IR-charcoal",
      "title": "Древесный уголь",
      "subtitle": "Обработка: Угольная яма",
      "description": "Древесный уголь получается на станции «Угольная яма». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Древесный уголь",
          "optional": false,
          "type": "item",
          "itemId": "IR-charcoal",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 60,
      "radius": 25,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 2280,
      "title": "Домница и заготовки",
      "subtitle": "Первое железо и механические детали",
      "description": "Домница превращает концентрат в крицу. Далее кованое железо становится деталями для станков; шлак здесь является нормальным побочным продуктом.",
      "tasks": [
        {
          "text": "Открыть главу и выбрать удобный следующий шаг",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 61,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 2380,
      "contentId": "IR-claybrick",
      "title": "Глиняный кирпич",
      "subtitle": "Сборка: предмет",
      "description": "Глиняный кирпич собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Глиняный кирпич",
          "optional": false,
          "type": "item",
          "itemId": "IR-claybrick",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 62,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 2380,
      "contentId": "IR-brick",
      "title": "Обожжённый кирпич",
      "subtitle": "Справочная карточка",
      "description": "Обожжённый кирпич учтён в текущем наборе предметов как материал, промежуточный продукт или побочный результат. Проверьте JEI, чтобы увидеть все уже реализованные применения и не потерять его из вида.",
      "tasks": [
        {
          "text": "Открыть Обожжённый кирпич в JEI",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 63,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 2380,
      "contentId": "IR-quicklime",
      "title": "Негашёная известь",
      "subtitle": "Обработка: Печь обжига",
      "description": "Негашёная известь получается на станции «Печь обжига». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Негашёная известь",
          "optional": false,
          "type": "item",
          "itemId": "IR-quicklime",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 64,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 2380,
      "contentId": "IR-refractorybrick",
      "title": "Огнеупорный кирпич",
      "subtitle": "Сборка: предмет",
      "description": "Огнеупорный кирпич собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Огнеупорный кирпич",
          "optional": false,
          "type": "item",
          "itemId": "IR-refractorybrick",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 65,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 2380,
      "contentId": "IR-bloomeryfurnace",
      "title": "Домница",
      "subtitle": "Сборка: блок",
      "description": "Домница собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Домница",
          "optional": false,
          "type": "item",
          "itemId": "IR-bloomeryfurnace",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 66,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 2495,
      "contentId": "IR-bloom",
      "title": "Крица",
      "subtitle": "Обработка: Домница",
      "description": "Крица получается на станции «Домница». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
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
      "id": 67,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 2495,
      "contentId": "IR-slag",
      "title": "Шлак",
      "subtitle": "Обработка: Домница",
      "description": "Шлак получается на станции «Домница». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Шлак",
          "optional": false,
          "type": "item",
          "itemId": "IR-slag",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 68,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 2495,
      "contentId": "IR-richslag",
      "title": "Железистый шлак",
      "subtitle": "Обработка: Домница",
      "description": "Железистый шлак получается на станции «Домница». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Железистый шлак",
          "optional": false,
          "type": "item",
          "itemId": "IR-richslag",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 69,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 2495,
      "contentId": "IR-anvil",
      "title": "Тяжёлая наковальня",
      "subtitle": "Сборка: блок",
      "description": "Тяжёлая наковальня собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Тяжёлая наковальня",
          "optional": false,
          "type": "item",
          "itemId": "IR-anvil",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 70,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 2495,
      "contentId": "IR-wroughtironingot",
      "title": "Кричное железо",
      "subtitle": "Обработка: Передельный горн",
      "description": "Кричное железо получается на станции «Передельный горн». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Кричное железо",
          "optional": false,
          "type": "item",
          "itemId": "IR-wroughtironingot",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 71,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 2610,
      "contentId": "IR-ironplate",
      "title": "Железная пластина",
      "subtitle": "Сборка: предмет",
      "description": "Железная пластина собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Железная пластина",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 72,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 2610,
      "contentId": "IR-ironrod",
      "title": "Железный пруток",
      "subtitle": "Сборка: предмет",
      "description": "Железный пруток собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Железный пруток",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironrod",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 73,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 2610,
      "contentId": "IR-ironband",
      "title": "Железный обруч",
      "subtitle": "Сборка: предмет",
      "description": "Железный обруч собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Железный обруч",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironband",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 74,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 2610,
      "contentId": "IR-gear",
      "title": "Железная шестерня",
      "subtitle": "Сборка: предмет",
      "description": "Железная шестерня собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Железная шестерня",
          "optional": false,
          "type": "item",
          "itemId": "IR-gear",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 75,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 2610,
      "contentId": "IR-bellows",
      "title": "Меха",
      "subtitle": "Сборка: блок",
      "description": "Меха собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Меха",
          "optional": false,
          "type": "item",
          "itemId": "IR-bellows",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 76,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 2725,
      "contentId": "IR-pyrometer",
      "title": "Пирометр",
      "subtitle": "Сборка: блок",
      "description": "Пирометр собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Пирометр",
          "optional": false,
          "type": "item",
          "itemId": "IR-pyrometer",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 77,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 2725,
      "contentId": "IR-glass",
      "title": "Стекло",
      "subtitle": "Справочная карточка",
      "description": "Стекло учтён в текущем наборе предметов как материал, промежуточный продукт или побочный результат. Проверьте JEI, чтобы увидеть все уже реализованные применения и не потерять его из вида.",
      "tasks": [
        {
          "text": "Открыть Стекло в JEI",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 78,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 2725,
      "contentId": "IR-ceramictube",
      "title": "Керамическая трубка",
      "subtitle": "Сборка: предмет",
      "description": "Керамическая трубка собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Керамическая трубка",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramictube",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 79,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 2725,
      "contentId": "IR-metalwire",
      "title": "Металлическая проволока",
      "subtitle": "Сборка: предмет",
      "description": "Металлическая проволока собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Металлическая проволока",
          "optional": false,
          "type": "item",
          "itemId": "IR-metalwire",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 80,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 2725,
      "contentId": "IR-stoneblock",
      "title": "Каменный блок",
      "subtitle": "Справочная карточка",
      "description": "Каменный блок учтён в текущем наборе предметов как материал, промежуточный продукт или побочный результат. Проверьте JEI, чтобы увидеть все уже реализованные применения и не потерять его из вида.",
      "tasks": [
        {
          "text": "Открыть Каменный блок в JEI",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 81,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 2840,
      "contentId": "IR-leather",
      "title": "Кожа",
      "subtitle": "Справочная карточка",
      "description": "Кожа учтён в текущем наборе предметов как материал, промежуточный продукт или побочный результат. Проверьте JEI, чтобы увидеть все уже реализованные применения и не потерять его из вида.",
      "tasks": [
        {
          "text": "Открыть Кожа в JEI",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 82,
      "radius": 25,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 2980,
      "title": "Сталь и промышленность",
      "subtitle": "Коксование, передел и тигель",
      "description": "Финальная глава объединяет топливо, передел железа и три класса стали. Она раскрывает весь текущий металлургический контент, но не добавляет обязательных ворот к уже доступным заданиям.",
      "tasks": [
        {
          "text": "Открыть главу и выбрать удобный следующий шаг",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 83,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 3080,
      "contentId": "IR-coal",
      "title": "Каменный уголь",
      "subtitle": "Добыча: просеивание",
      "description": "Каменный уголь находится при просеивании открытой земли. Зажмите Alt и используйте действие разрушения по земле без блока сверху. В JEI этот источник показан на вкладке «Рецепт».",
      "tasks": [
        {
          "text": "Получить: Каменный уголь",
          "optional": false,
          "type": "item",
          "itemId": "IR-coal",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 84,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 3080,
      "contentId": "IR-bituminouscoal",
      "title": "Богатый каменный уголь",
      "subtitle": "Справочная карточка",
      "description": "Богатый каменный уголь учтён в текущем наборе предметов как материал, промежуточный продукт или побочный результат. Проверьте JEI, чтобы увидеть все уже реализованные применения и не потерять его из вида.",
      "tasks": [
        {
          "text": "Открыть Богатый каменный уголь в JEI",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 85,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3080,
      "contentId": "IR-coke",
      "title": "Кокс",
      "subtitle": "Обработка: Коксовая печь",
      "description": "Кокс получается на станции «Коксовая печь». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 86,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 3080,
      "contentId": "IR-coaltar",
      "title": "Каменноугольная смола",
      "subtitle": "Обработка: Коксовая печь",
      "description": "Каменноугольная смола получается на станции «Коксовая печь». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Каменноугольная смола",
          "optional": false,
          "type": "item",
          "itemId": "IR-coaltar",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 87,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 3080,
      "contentId": "IR-cokeoven",
      "title": "Коксовая печь",
      "subtitle": "Сборка: блок",
      "description": "Коксовая печь собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Коксовая печь",
          "optional": false,
          "type": "item",
          "itemId": "IR-cokeoven",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 88,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 3195,
      "contentId": "IR-fineryforge",
      "title": "Передельный горн",
      "subtitle": "Сборка: блок",
      "description": "Передельный горн собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Передельный горн",
          "optional": false,
          "type": "item",
          "itemId": "IR-fineryforge",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 89,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 3195,
      "contentId": "IR-cruciblefurnace",
      "title": "Тигельная печь",
      "subtitle": "Сборка: блок",
      "description": "Тигельная печь собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Тигельная печь",
          "optional": false,
          "type": "item",
          "itemId": "IR-cruciblefurnace",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 90,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3195,
      "contentId": "IR-graphite",
      "title": "Графит",
      "subtitle": "Справочная карточка",
      "description": "Графит учтён в текущем наборе предметов как материал, промежуточный продукт или побочный результат. Проверьте JEI, чтобы увидеть все уже реализованные применения и не потерять его из вида.",
      "tasks": [
        {
          "text": "Открыть Графит в JEI",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 91,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 3195,
      "contentId": "IR-cruciblegraphite",
      "title": "Графитовый тигель",
      "subtitle": "Сборка: предмет",
      "description": "Графитовый тигель собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Графитовый тигель",
          "optional": false,
          "type": "item",
          "itemId": "IR-cruciblegraphite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 92,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 3195,
      "contentId": "IR-pigiron",
      "title": "Передельный чугун",
      "subtitle": "Справочная карточка",
      "description": "Передельный чугун учтён в текущем наборе предметов как материал, промежуточный продукт или побочный результат. Проверьте JEI, чтобы увидеть все уже реализованные применения и не потерять его из вида.",
      "tasks": [
        {
          "text": "Открыть Передельный чугун в JEI",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 93,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 3310,
      "contentId": "IR-spongeiron",
      "title": "Губчатое железо",
      "subtitle": "Справочная карточка",
      "description": "Губчатое железо учтён в текущем наборе предметов как материал, промежуточный продукт или побочный результат. Проверьте JEI, чтобы увидеть все уже реализованные применения и не потерять его из вида.",
      "tasks": [
        {
          "text": "Открыть Губчатое железо в JEI",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 94,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 3310,
      "contentId": "IR-steelbloom",
      "title": "Стальная крица",
      "subtitle": "Справочная карточка",
      "description": "Стальная крица учтён в текущем наборе предметов как материал, промежуточный продукт или побочный результат. Проверьте JEI, чтобы увидеть все уже реализованные применения и не потерять его из вида.",
      "tasks": [
        {
          "text": "Открыть Стальная крица в JEI",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 95,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3310,
      "contentId": "IR-mildsteelingot",
      "title": "Мягкая сталь",
      "subtitle": "Обработка: Тигельная печь",
      "description": "Мягкая сталь получается на станции «Тигельная печь». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
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
      "id": 96,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 3310,
      "contentId": "IR-mediumsteelingot",
      "title": "Среднеуглеродистая сталь",
      "subtitle": "Обработка: Тигельная печь",
      "description": "Среднеуглеродистая сталь получается на станции «Тигельная печь». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Среднеуглеродистая сталь",
          "optional": false,
          "type": "item",
          "itemId": "IR-mediumsteelingot",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 97,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 3310,
      "contentId": "IR-highcarbonsteelingot",
      "title": "Высокоуглеродистая сталь",
      "subtitle": "Обработка: Тигельная печь",
      "description": "Высокоуглеродистая сталь получается на станции «Тигельная печь». Откройте предмет в JEI, чтобы увидеть точные входы, количество и порядок обработки. Не обязательно выполнять эту карточку для открытия соседних.",
      "tasks": [
        {
          "text": "Получить: Высокоуглеродистая сталь",
          "optional": false,
          "type": "item",
          "itemId": "IR-highcarbonsteelingot",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 98,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 3425,
      "contentId": "IR-castironingot",
      "title": "Литейный чугун",
      "subtitle": "Справочная карточка",
      "description": "Литейный чугун учтён в текущем наборе предметов как материал, промежуточный продукт или побочный результат. Проверьте JEI, чтобы увидеть все уже реализованные применения и не потерять его из вида.",
      "tasks": [
        {
          "text": "Открыть Литейный чугун в JEI",
          "optional": false,
          "type": "manual"
        }
      ]
    },
    {
      "id": 99,
      "radius": 19,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 3425,
      "contentId": "IR-steelframe",
      "title": "Стальная рама",
      "subtitle": "Сборка: предмет",
      "description": "Стальная рама собирается в сетке крафта. Откройте его в JEI: контур shaped-рецепта показывает расположение деталей, а shapeless-рецепт можно разложить в любом порядке.",
      "tasks": [
        {
          "text": "Создать: Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 100,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 3560,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Рамы задают геометрию машины: перед сборкой исключите концентраторы напряжений в отверстиях и сварных швах. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 1 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 1 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 101,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3622,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Рамы задают геометрию машины: перед сборкой исключите концентраторы напряжений в отверстиях и сварных швах. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 2 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 2 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 102,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3684,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Рамы задают геометрию машины: перед сборкой исключите концентраторы напряжений в отверстиях и сварных швах. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 3 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 3 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 3
        }
      ]
    },
    {
      "id": 103,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3746,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Рамы задают геометрию машины: перед сборкой исключите концентраторы напряжений в отверстиях и сварных швах. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 4 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 104,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3808,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Рамы задают геометрию машины: перед сборкой исключите концентраторы напряжений в отверстиях и сварных швах. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 5 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 5 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 5
        }
      ]
    },
    {
      "id": 105,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3870,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Рамы задают геометрию машины: перед сборкой исключите концентраторы напряжений в отверстиях и сварных швах. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 6 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 106,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3932,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Рамы задают геометрию машины: перед сборкой исключите концентраторы напряжений в отверстиях и сварных швах. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 7 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 7 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 7
        }
      ]
    },
    {
      "id": 107,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3994,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Рамы задают геометрию машины: перед сборкой исключите концентраторы напряжений в отверстиях и сварных швах. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 8 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 108,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 4056,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Рамы задают геометрию машины: перед сборкой исключите концентраторы напряжений в отверстиях и сварных швах. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 9 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 9 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 9
        }
      ]
    },
    {
      "id": 109,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 4118,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Рамы задают геометрию машины: перед сборкой исключите концентраторы напряжений в отверстиях и сварных швах. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 10 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 10 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 10
        }
      ]
    },
    {
      "id": 110,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 4280,
      "contentId": "IR-ironplate",
      "title": "Инструментальная оснастка: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Пластина работает как листовой полуфабрикат; её толщина определяет жёсткость, теплопроводность и запас на коррозию. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 2 × железную пластину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 2 × железную пластину",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 111,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4342,
      "contentId": "IR-ironplate",
      "title": "Инструментальная оснастка: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Пластина работает как листовой полуфабрикат; её толщина определяет жёсткость, теплопроводность и запас на коррозию. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 4 × железную пластину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × железную пластину",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 112,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4404,
      "contentId": "IR-ironplate",
      "title": "Инструментальная оснастка: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Пластина работает как листовой полуфабрикат; её толщина определяет жёсткость, теплопроводность и запас на коррозию. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 6 × железную пластину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × железную пластину",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 113,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4466,
      "contentId": "IR-ironplate",
      "title": "Инструментальная оснастка: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Пластина работает как листовой полуфабрикат; её толщина определяет жёсткость, теплопроводность и запас на коррозию. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 8 × железную пластину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × железную пластину",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 114,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4528,
      "contentId": "IR-ironplate",
      "title": "Инструментальная оснастка: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Пластина работает как листовой полуфабрикат; её толщина определяет жёсткость, теплопроводность и запас на коррозию. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 10 × железную пластину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 10 × железную пластину",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 10
        }
      ]
    },
    {
      "id": 115,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4590,
      "contentId": "IR-ironplate",
      "title": "Инструментальная оснастка: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Пластина работает как листовой полуфабрикат; её толщина определяет жёсткость, теплопроводность и запас на коррозию. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 12 × железную пластину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × железную пластину",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 116,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4652,
      "contentId": "IR-ironplate",
      "title": "Инструментальная оснастка: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Пластина работает как листовой полуфабрикат; её толщина определяет жёсткость, теплопроводность и запас на коррозию. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 14 × железную пластину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 14 × железную пластину",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 14
        }
      ]
    },
    {
      "id": 117,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4714,
      "contentId": "IR-ironplate",
      "title": "Инструментальная оснастка: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Пластина работает как листовой полуфабрикат; её толщина определяет жёсткость, теплопроводность и запас на коррозию. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 16 × железную пластину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 16 × железную пластину",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 118,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 4776,
      "contentId": "IR-ironplate",
      "title": "Инструментальная оснастка: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Пластина работает как листовой полуфабрикат; её толщина определяет жёсткость, теплопроводность и запас на коррозию. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 18 × железную пластину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 18 × железную пластину",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 18
        }
      ]
    },
    {
      "id": 119,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 4838,
      "contentId": "IR-ironplate",
      "title": "Инструментальная оснастка: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Пластина работает как листовой полуфабрикат; её толщина определяет жёсткость, теплопроводность и запас на коррозию. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 20 × железную пластину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 20 × железную пластину",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 120,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 5000,
      "contentId": "IR-sapling",
      "title": "Биотехнологический лес: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Синтетический саженец — капсулированный эмбриоид: стерильная оболочка отделяет живую ткань от случайной микрофлоры. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 3 × синтетический саженец; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 3 × синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 3
        }
      ]
    },
    {
      "id": 121,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5062,
      "contentId": "IR-sapling",
      "title": "Биотехнологический лес: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Синтетический саженец — капсулированный эмбриоид: стерильная оболочка отделяет живую ткань от случайной микрофлоры. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 6 × синтетический саженец; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 122,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5124,
      "contentId": "IR-sapling",
      "title": "Биотехнологический лес: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Синтетический саженец — капсулированный эмбриоид: стерильная оболочка отделяет живую ткань от случайной микрофлоры. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 9 × синтетический саженец; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 9 × синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 9
        }
      ]
    },
    {
      "id": 123,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5186,
      "contentId": "IR-sapling",
      "title": "Биотехнологический лес: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Синтетический саженец — капсулированный эмбриоид: стерильная оболочка отделяет живую ткань от случайной микрофлоры. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 12 × синтетический саженец; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 124,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5248,
      "contentId": "IR-sapling",
      "title": "Биотехнологический лес: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Синтетический саженец — капсулированный эмбриоид: стерильная оболочка отделяет живую ткань от случайной микрофлоры. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 15 × синтетический саженец; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 15 × синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 15
        }
      ]
    },
    {
      "id": 125,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5310,
      "contentId": "IR-sapling",
      "title": "Биотехнологический лес: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Синтетический саженец — капсулированный эмбриоид: стерильная оболочка отделяет живую ткань от случайной микрофлоры. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 18 × синтетический саженец; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 18 × синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 18
        }
      ]
    },
    {
      "id": 126,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5372,
      "contentId": "IR-sapling",
      "title": "Биотехнологический лес: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Синтетический саженец — капсулированный эмбриоид: стерильная оболочка отделяет живую ткань от случайной микрофлоры. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 21 × синтетический саженец; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 21 × синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 21
        }
      ]
    },
    {
      "id": 127,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5434,
      "contentId": "IR-sapling",
      "title": "Биотехнологический лес: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Синтетический саженец — капсулированный эмбриоид: стерильная оболочка отделяет живую ткань от случайной микрофлоры. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 24 × синтетический саженец; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 24 × синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 128,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 5496,
      "contentId": "IR-sapling",
      "title": "Биотехнологический лес: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Синтетический саженец — капсулированный эмбриоид: стерильная оболочка отделяет живую ткань от случайной микрофлоры. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 27 × синтетический саженец; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 27 × синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 27
        }
      ]
    },
    {
      "id": 129,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 5558,
      "contentId": "IR-sapling",
      "title": "Биотехнологический лес: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Синтетический саженец — капсулированный эмбриоид: стерильная оболочка отделяет живую ткань от случайной микрофлоры. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 30 × синтетический саженец; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 30 × синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 30
        }
      ]
    },
    {
      "id": 130,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 5720,
      "contentId": "IR-capsule-1000-water",
      "title": "Водный контур: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Вода — рабочее тело контура. Контролируйте её запас: в паровой системе дефицит массы быстро оголяет нагреваемую поверхность. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 4 × капсулу воды; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × капсулу воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 131,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5782,
      "contentId": "IR-capsule-1000-water",
      "title": "Водный контур: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Вода — рабочее тело контура. Контролируйте её запас: в паровой системе дефицит массы быстро оголяет нагреваемую поверхность. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 8 × капсулу воды; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × капсулу воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 132,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5844,
      "contentId": "IR-capsule-1000-water",
      "title": "Водный контур: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Вода — рабочее тело контура. Контролируйте её запас: в паровой системе дефицит массы быстро оголяет нагреваемую поверхность. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 12 × капсулу воды; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × капсулу воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 133,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5906,
      "contentId": "IR-capsule-1000-water",
      "title": "Водный контур: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Вода — рабочее тело контура. Контролируйте её запас: в паровой системе дефицит массы быстро оголяет нагреваемую поверхность. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 16 × капсулу воды; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 16 × капсулу воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 134,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5968,
      "contentId": "IR-capsule-1000-water",
      "title": "Водный контур: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Вода — рабочее тело контура. Контролируйте её запас: в паровой системе дефицит массы быстро оголяет нагреваемую поверхность. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 20 × капсулу воды; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 20 × капсулу воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 135,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6030,
      "contentId": "IR-capsule-1000-water",
      "title": "Водный контур: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Вода — рабочее тело контура. Контролируйте её запас: в паровой системе дефицит массы быстро оголяет нагреваемую поверхность. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 24 × капсулу воды; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 24 × капсулу воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 136,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6092,
      "contentId": "IR-capsule-1000-water",
      "title": "Водный контур: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Вода — рабочее тело контура. Контролируйте её запас: в паровой системе дефицит массы быстро оголяет нагреваемую поверхность. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 28 × капсулу воды; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 28 × капсулу воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 28
        }
      ]
    },
    {
      "id": 137,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6154,
      "contentId": "IR-capsule-1000-water",
      "title": "Водный контур: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Вода — рабочее тело контура. Контролируйте её запас: в паровой системе дефицит массы быстро оголяет нагреваемую поверхность. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 32 × капсулу воды; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 32 × капсулу воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 138,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 6216,
      "contentId": "IR-capsule-1000-water",
      "title": "Водный контур: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Вода — рабочее тело контура. Контролируйте её запас: в паровой системе дефицит массы быстро оголяет нагреваемую поверхность. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 36 × капсулу воды; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 36 × капсулу воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 36
        }
      ]
    },
    {
      "id": 139,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 6278,
      "contentId": "IR-capsule-1000-water",
      "title": "Водный контур: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Вода — рабочее тело контура. Контролируйте её запас: в паровой системе дефицит массы быстро оголяет нагреваемую поверхность. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 40 × капсулу воды; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 40 × капсулу воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 140,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 6440,
      "contentId": "IR-steelframe",
      "title": "Корпус котла: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Котельный каркас воспринимает вес водяного объёма и вибрации; симметрия связей снижает локальные напряжения. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 1 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 1 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 141,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6502,
      "contentId": "IR-steelframe",
      "title": "Корпус котла: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Котельный каркас воспринимает вес водяного объёма и вибрации; симметрия связей снижает локальные напряжения. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 2 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 2 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 142,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6564,
      "contentId": "IR-steelframe",
      "title": "Корпус котла: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Котельный каркас воспринимает вес водяного объёма и вибрации; симметрия связей снижает локальные напряжения. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 3 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 3 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 3
        }
      ]
    },
    {
      "id": 143,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6626,
      "contentId": "IR-steelframe",
      "title": "Корпус котла: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Котельный каркас воспринимает вес водяного объёма и вибрации; симметрия связей снижает локальные напряжения. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 4 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 144,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6688,
      "contentId": "IR-steelframe",
      "title": "Корпус котла: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Котельный каркас воспринимает вес водяного объёма и вибрации; симметрия связей снижает локальные напряжения. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 5 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 5 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 5
        }
      ]
    },
    {
      "id": 145,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6750,
      "contentId": "IR-steelframe",
      "title": "Корпус котла: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Котельный каркас воспринимает вес водяного объёма и вибрации; симметрия связей снижает локальные напряжения. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 6 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 146,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6812,
      "contentId": "IR-steelframe",
      "title": "Корпус котла: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Котельный каркас воспринимает вес водяного объёма и вибрации; симметрия связей снижает локальные напряжения. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 7 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 7 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 7
        }
      ]
    },
    {
      "id": 147,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6874,
      "contentId": "IR-steelframe",
      "title": "Корпус котла: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Котельный каркас воспринимает вес водяного объёма и вибрации; симметрия связей снижает локальные напряжения. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 8 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 148,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 6936,
      "contentId": "IR-steelframe",
      "title": "Корпус котла: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Котельный каркас воспринимает вес водяного объёма и вибрации; симметрия связей снижает локальные напряжения. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 9 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 9 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 9
        }
      ]
    },
    {
      "id": 149,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 6998,
      "contentId": "IR-steelframe",
      "title": "Корпус котла: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Котельный каркас воспринимает вес водяного объёма и вибрации; симметрия связей снижает локальные напряжения. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 10 × стальную раму; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 10 × стальную раму",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 10
        }
      ]
    },
    {
      "id": 150,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 7160,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Паропровод должен иметь непрерывную стенку и температурный зазор: горячая сталь удлиняется, а конденсат вызывает гидроудар. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 2 × стальную паровую трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 2 × стальную паровую трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 151,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7222,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Паропровод должен иметь непрерывную стенку и температурный зазор: горячая сталь удлиняется, а конденсат вызывает гидроудар. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 4 × стальную паровую трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × стальную паровую трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 152,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7284,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Паропровод должен иметь непрерывную стенку и температурный зазор: горячая сталь удлиняется, а конденсат вызывает гидроудар. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 6 × стальную паровую трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × стальную паровую трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 153,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7346,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Паропровод должен иметь непрерывную стенку и температурный зазор: горячая сталь удлиняется, а конденсат вызывает гидроудар. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 8 × стальную паровую трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × стальную паровую трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 154,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7408,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Паропровод должен иметь непрерывную стенку и температурный зазор: горячая сталь удлиняется, а конденсат вызывает гидроудар. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 10 × стальную паровую трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 10 × стальную паровую трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 10
        }
      ]
    },
    {
      "id": 155,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7470,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Паропровод должен иметь непрерывную стенку и температурный зазор: горячая сталь удлиняется, а конденсат вызывает гидроудар. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 12 × стальную паровую трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × стальную паровую трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 156,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7532,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Паропровод должен иметь непрерывную стенку и температурный зазор: горячая сталь удлиняется, а конденсат вызывает гидроудар. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 14 × стальную паровую трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 14 × стальную паровую трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 14
        }
      ]
    },
    {
      "id": 157,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7594,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Паропровод должен иметь непрерывную стенку и температурный зазор: горячая сталь удлиняется, а конденсат вызывает гидроудар. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 16 × стальную паровую трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 16 × стальную паровую трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 158,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 7656,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Паропровод должен иметь непрерывную стенку и температурный зазор: горячая сталь удлиняется, а конденсат вызывает гидроудар. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 18 × стальную паровую трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 18 × стальную паровую трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 18
        }
      ]
    },
    {
      "id": 159,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 7718,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Паропровод должен иметь непрерывную стенку и температурный зазор: горячая сталь удлиняется, а конденсат вызывает гидроудар. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 20 × стальную паровую трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 20 × стальную паровую трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 160,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 7880,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая группа: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Поршень превращает перепад давления в линейную работу; зазор и соосность определяют утечки и трение. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 3 × поршневую сборку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 3 × поршневую сборку",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 3
        }
      ]
    },
    {
      "id": 161,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7942,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая группа: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Поршень превращает перепад давления в линейную работу; зазор и соосность определяют утечки и трение. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 6 × поршневую сборку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × поршневую сборку",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 162,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 8004,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая группа: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Поршень превращает перепад давления в линейную работу; зазор и соосность определяют утечки и трение. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 9 × поршневую сборку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 9 × поршневую сборку",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 9
        }
      ]
    },
    {
      "id": 163,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 8066,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая группа: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Поршень превращает перепад давления в линейную работу; зазор и соосность определяют утечки и трение. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 12 × поршневую сборку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × поршневую сборку",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 164,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 8128,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая группа: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Поршень превращает перепад давления в линейную работу; зазор и соосность определяют утечки и трение. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 15 × поршневую сборку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 15 × поршневую сборку",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 15
        }
      ]
    },
    {
      "id": 165,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 8190,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая группа: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Поршень превращает перепад давления в линейную работу; зазор и соосность определяют утечки и трение. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 18 × поршневую сборку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 18 × поршневую сборку",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 18
        }
      ]
    },
    {
      "id": 166,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 8252,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая группа: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Поршень превращает перепад давления в линейную работу; зазор и соосность определяют утечки и трение. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 21 × поршневую сборку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 21 × поршневую сборку",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 21
        }
      ]
    },
    {
      "id": 167,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 8314,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая группа: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Поршень превращает перепад давления в линейную работу; зазор и соосность определяют утечки и трение. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 24 × поршневую сборку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 24 × поршневую сборку",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 168,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 8376,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая группа: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Поршень превращает перепад давления в линейную работу; зазор и соосность определяют утечки и трение. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 27 × поршневую сборку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 27 × поршневую сборку",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 27
        }
      ]
    },
    {
      "id": 169,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 8438,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая группа: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Поршень превращает перепад давления в линейную работу; зазор и соосность определяют утечки и трение. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 30 × поршневую сборку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 30 × поршневую сборку",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 30
        }
      ]
    },
    {
      "id": 170,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 8600,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсатный контур: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Возврат конденсата замыкает массовый баланс воды и уменьшает теплоту, которую приходится вновь сообщать котлу. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 4 × жидкостную трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × жидкостную трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 171,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 8662,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсатный контур: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Возврат конденсата замыкает массовый баланс воды и уменьшает теплоту, которую приходится вновь сообщать котлу. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 8 × жидкостную трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × жидкостную трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 172,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 8724,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсатный контур: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Возврат конденсата замыкает массовый баланс воды и уменьшает теплоту, которую приходится вновь сообщать котлу. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 12 × жидкостную трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × жидкостную трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 173,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 8786,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсатный контур: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Возврат конденсата замыкает массовый баланс воды и уменьшает теплоту, которую приходится вновь сообщать котлу. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 16 × жидкостную трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 16 × жидкостную трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 174,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 8848,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсатный контур: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Возврат конденсата замыкает массовый баланс воды и уменьшает теплоту, которую приходится вновь сообщать котлу. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 20 × жидкостную трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 20 × жидкостную трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 175,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 8910,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсатный контур: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Возврат конденсата замыкает массовый баланс воды и уменьшает теплоту, которую приходится вновь сообщать котлу. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 24 × жидкостную трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 24 × жидкостную трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 176,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 8972,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсатный контур: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Возврат конденсата замыкает массовый баланс воды и уменьшает теплоту, которую приходится вновь сообщать котлу. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 28 × жидкостную трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 28 × жидкостную трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 28
        }
      ]
    },
    {
      "id": 177,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 9034,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсатный контур: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Возврат конденсата замыкает массовый баланс воды и уменьшает теплоту, которую приходится вновь сообщать котлу. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 32 × жидкостную трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 32 × жидкостную трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 178,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 9096,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсатный контур: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Возврат конденсата замыкает массовый баланс воды и уменьшает теплоту, которую приходится вновь сообщать котлу. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 36 × жидкостную трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 36 × жидкостную трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 36
        }
      ]
    },
    {
      "id": 179,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 9158,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсатный контур: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Возврат конденсата замыкает массовый баланс воды и уменьшает теплоту, которую приходится вновь сообщать котлу. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 40 × жидкостную трубу; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 40 × жидкостную трубу",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 180,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 9320,
      "contentId": "IR-steam-engine",
      "title": "Паровая машина: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Паровая машина связывает котёл с валом: полезная работа ограничена температурой источника и холодильника по циклу Карно. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 1 × поршневую паровую машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 1 × поршневую паровую машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 181,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 9382,
      "contentId": "IR-steam-engine",
      "title": "Паровая машина: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Паровая машина связывает котёл с валом: полезная работа ограничена температурой источника и холодильника по циклу Карно. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 2 × поршневую паровую машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 2 × поршневую паровую машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 182,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 9444,
      "contentId": "IR-steam-engine",
      "title": "Паровая машина: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Паровая машина связывает котёл с валом: полезная работа ограничена температурой источника и холодильника по циклу Карно. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 3 × поршневую паровую машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 3 × поршневую паровую машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 3
        }
      ]
    },
    {
      "id": 183,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 9506,
      "contentId": "IR-steam-engine",
      "title": "Паровая машина: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Паровая машина связывает котёл с валом: полезная работа ограничена температурой источника и холодильника по циклу Карно. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 4 × поршневую паровую машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × поршневую паровую машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 184,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 9568,
      "contentId": "IR-steam-engine",
      "title": "Паровая машина: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Паровая машина связывает котёл с валом: полезная работа ограничена температурой источника и холодильника по циклу Карно. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 5 × поршневую паровую машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 5 × поршневую паровую машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 5
        }
      ]
    },
    {
      "id": 185,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 9630,
      "contentId": "IR-steam-engine",
      "title": "Паровая машина: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Паровая машина связывает котёл с валом: полезная работа ограничена температурой источника и холодильника по циклу Карно. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 6 × поршневую паровую машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × поршневую паровую машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 186,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 9692,
      "contentId": "IR-steam-engine",
      "title": "Паровая машина: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Паровая машина связывает котёл с валом: полезная работа ограничена температурой источника и холодильника по циклу Карно. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 7 × поршневую паровую машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 7 × поршневую паровую машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 7
        }
      ]
    },
    {
      "id": 187,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 9754,
      "contentId": "IR-steam-engine",
      "title": "Паровая машина: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Паровая машина связывает котёл с валом: полезная работа ограничена температурой источника и холодильника по циклу Карно. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 8 × поршневую паровую машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × поршневую паровую машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 188,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 9816,
      "contentId": "IR-steam-engine",
      "title": "Паровая машина: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Паровая машина связывает котёл с валом: полезная работа ограничена температурой источника и холодильника по циклу Карно. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 9 × поршневую паровую машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 9 × поршневую паровую машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 9
        }
      ]
    },
    {
      "id": 189,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 9878,
      "contentId": "IR-steam-engine",
      "title": "Паровая машина: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Паровая машина связывает котёл с валом: полезная работа ограничена температурой источника и холодильника по циклу Карно. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 10 × поршневую паровую машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 10 × поршневую паровую машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 10
        }
      ]
    },
    {
      "id": 190,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 10040,
      "contentId": "IR-grindingstone",
      "title": "Механическая обработка: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Шлифование снимает материал абразивом; чистота поверхности определяет износ подшипников и герметичных посадок. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 2 × шлифовальный камень; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 2 × шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 191,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 10102,
      "contentId": "IR-grindingstone",
      "title": "Механическая обработка: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Шлифование снимает материал абразивом; чистота поверхности определяет износ подшипников и герметичных посадок. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 4 × шлифовальный камень; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 192,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 10164,
      "contentId": "IR-grindingstone",
      "title": "Механическая обработка: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Шлифование снимает материал абразивом; чистота поверхности определяет износ подшипников и герметичных посадок. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 6 × шлифовальный камень; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 193,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 10226,
      "contentId": "IR-grindingstone",
      "title": "Механическая обработка: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Шлифование снимает материал абразивом; чистота поверхности определяет износ подшипников и герметичных посадок. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 8 × шлифовальный камень; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 194,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 10288,
      "contentId": "IR-grindingstone",
      "title": "Механическая обработка: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Шлифование снимает материал абразивом; чистота поверхности определяет износ подшипников и герметичных посадок. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 10 × шлифовальный камень; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 10 × шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 10
        }
      ]
    },
    {
      "id": 195,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 10350,
      "contentId": "IR-grindingstone",
      "title": "Механическая обработка: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Шлифование снимает материал абразивом; чистота поверхности определяет износ подшипников и герметичных посадок. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 12 × шлифовальный камень; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 196,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 10412,
      "contentId": "IR-grindingstone",
      "title": "Механическая обработка: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Шлифование снимает материал абразивом; чистота поверхности определяет износ подшипников и герметичных посадок. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 14 × шлифовальный камень; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 14 × шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 14
        }
      ]
    },
    {
      "id": 197,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 10474,
      "contentId": "IR-grindingstone",
      "title": "Механическая обработка: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Шлифование снимает материал абразивом; чистота поверхности определяет износ подшипников и герметичных посадок. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 16 × шлифовальный камень; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 16 × шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 198,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 10536,
      "contentId": "IR-grindingstone",
      "title": "Механическая обработка: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Шлифование снимает материал абразивом; чистота поверхности определяет износ подшипников и герметичных посадок. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 18 × шлифовальный камень; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 18 × шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 18
        }
      ]
    },
    {
      "id": 199,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 10598,
      "contentId": "IR-grindingstone",
      "title": "Механическая обработка: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Шлифование снимает материал абразивом; чистота поверхности определяет износ подшипников и герметичных посадок. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 20 × шлифовальный камень; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 20 × шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 200,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 10760,
      "contentId": "IR-concentrateironore",
      "title": "Обогащение руды: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Концентрат повышает долю полезного минерала до плавки: пустая порода иначе забирает тепло и образует лишний шлак. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 3 × железный концентрат; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 3 × железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 3
        }
      ]
    },
    {
      "id": 201,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 10822,
      "contentId": "IR-concentrateironore",
      "title": "Обогащение руды: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Концентрат повышает долю полезного минерала до плавки: пустая порода иначе забирает тепло и образует лишний шлак. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 6 × железный концентрат; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 202,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 10884,
      "contentId": "IR-concentrateironore",
      "title": "Обогащение руды: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Концентрат повышает долю полезного минерала до плавки: пустая порода иначе забирает тепло и образует лишний шлак. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 9 × железный концентрат; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 9 × железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 9
        }
      ]
    },
    {
      "id": 203,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 10946,
      "contentId": "IR-concentrateironore",
      "title": "Обогащение руды: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Концентрат повышает долю полезного минерала до плавки: пустая порода иначе забирает тепло и образует лишний шлак. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 12 × железный концентрат; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 204,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 11008,
      "contentId": "IR-concentrateironore",
      "title": "Обогащение руды: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Концентрат повышает долю полезного минерала до плавки: пустая порода иначе забирает тепло и образует лишний шлак. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 15 × железный концентрат; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 15 × железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 15
        }
      ]
    },
    {
      "id": 205,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 11070,
      "contentId": "IR-concentrateironore",
      "title": "Обогащение руды: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Концентрат повышает долю полезного минерала до плавки: пустая порода иначе забирает тепло и образует лишний шлак. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 18 × железный концентрат; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 18 × железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 18
        }
      ]
    },
    {
      "id": 206,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 11132,
      "contentId": "IR-concentrateironore",
      "title": "Обогащение руды: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Концентрат повышает долю полезного минерала до плавки: пустая порода иначе забирает тепло и образует лишний шлак. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 21 × железный концентрат; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 21 × железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 21
        }
      ]
    },
    {
      "id": 207,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 11194,
      "contentId": "IR-concentrateironore",
      "title": "Обогащение руды: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Концентрат повышает долю полезного минерала до плавки: пустая порода иначе забирает тепло и образует лишний шлак. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 24 × железный концентрат; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 24 × железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 208,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 11256,
      "contentId": "IR-concentrateironore",
      "title": "Обогащение руды: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Концентрат повышает долю полезного минерала до плавки: пустая порода иначе забирает тепло и образует лишний шлак. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 27 × железный концентрат; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 27 × железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 27
        }
      ]
    },
    {
      "id": 209,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 11318,
      "contentId": "IR-concentrateironore",
      "title": "Обогащение руды: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Концентрат повышает долю полезного минерала до плавки: пустая порода иначе забирает тепло и образует лишний шлак. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 30 × железный концентрат; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 30 × железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 30
        }
      ]
    },
    {
      "id": 210,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 11480,
      "contentId": "IR-copper-ingot",
      "title": "Цветная металлургия: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Медь выбирают за низкое удельное сопротивление; чистота металла важнее блеска, потому что примеси рассеивают электроны. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 4 × медный слиток; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 211,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 11542,
      "contentId": "IR-copper-ingot",
      "title": "Цветная металлургия: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Медь выбирают за низкое удельное сопротивление; чистота металла важнее блеска, потому что примеси рассеивают электроны. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 8 × медный слиток; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 212,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 11604,
      "contentId": "IR-copper-ingot",
      "title": "Цветная металлургия: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Медь выбирают за низкое удельное сопротивление; чистота металла важнее блеска, потому что примеси рассеивают электроны. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 12 × медный слиток; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 213,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 11666,
      "contentId": "IR-copper-ingot",
      "title": "Цветная металлургия: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Медь выбирают за низкое удельное сопротивление; чистота металла важнее блеска, потому что примеси рассеивают электроны. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 16 × медный слиток; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 16 × медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 214,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 11728,
      "contentId": "IR-copper-ingot",
      "title": "Цветная металлургия: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Медь выбирают за низкое удельное сопротивление; чистота металла важнее блеска, потому что примеси рассеивают электроны. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 20 × медный слиток; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 20 × медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 215,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 11790,
      "contentId": "IR-copper-ingot",
      "title": "Цветная металлургия: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Медь выбирают за низкое удельное сопротивление; чистота металла важнее блеска, потому что примеси рассеивают электроны. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 24 × медный слиток; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 24 × медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 216,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 11852,
      "contentId": "IR-copper-ingot",
      "title": "Цветная металлургия: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Медь выбирают за низкое удельное сопротивление; чистота металла важнее блеска, потому что примеси рассеивают электроны. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 28 × медный слиток; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 28 × медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 28
        }
      ]
    },
    {
      "id": 217,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 11914,
      "contentId": "IR-copper-ingot",
      "title": "Цветная металлургия: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Медь выбирают за низкое удельное сопротивление; чистота металла важнее блеска, потому что примеси рассеивают электроны. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 32 × медный слиток; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 32 × медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 218,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 11976,
      "contentId": "IR-copper-ingot",
      "title": "Цветная металлургия: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Медь выбирают за низкое удельное сопротивление; чистота металла важнее блеска, потому что примеси рассеивают электроны. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 36 × медный слиток; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 36 × медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 36
        }
      ]
    },
    {
      "id": 219,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 12038,
      "contentId": "IR-copper-ingot",
      "title": "Цветная металлургия: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Медь выбирают за низкое удельное сопротивление; чистота металла важнее блеска, потому что примеси рассеивают электроны. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 40 × медный слиток; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 40 × медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 220,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 12200,
      "contentId": "IR-insulated-wire",
      "title": "Проводник и изоляция: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Изоляция отделяет проводник от корпуса и соседних линий, ограничивая ток утечки и риск короткого замыкания. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 1 × изолированный провод; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 1 × изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 221,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 12262,
      "contentId": "IR-insulated-wire",
      "title": "Проводник и изоляция: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Изоляция отделяет проводник от корпуса и соседних линий, ограничивая ток утечки и риск короткого замыкания. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 2 × изолированный провод; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 2 × изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 222,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 12324,
      "contentId": "IR-insulated-wire",
      "title": "Проводник и изоляция: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Изоляция отделяет проводник от корпуса и соседних линий, ограничивая ток утечки и риск короткого замыкания. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 3 × изолированный провод; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 3 × изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 3
        }
      ]
    },
    {
      "id": 223,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 12386,
      "contentId": "IR-insulated-wire",
      "title": "Проводник и изоляция: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Изоляция отделяет проводник от корпуса и соседних линий, ограничивая ток утечки и риск короткого замыкания. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 4 × изолированный провод; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 224,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 12448,
      "contentId": "IR-insulated-wire",
      "title": "Проводник и изоляция: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Изоляция отделяет проводник от корпуса и соседних линий, ограничивая ток утечки и риск короткого замыкания. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 5 × изолированный провод; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 5 × изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 5
        }
      ]
    },
    {
      "id": 225,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 12510,
      "contentId": "IR-insulated-wire",
      "title": "Проводник и изоляция: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Изоляция отделяет проводник от корпуса и соседних линий, ограничивая ток утечки и риск короткого замыкания. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 6 × изолированный провод; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 226,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 12572,
      "contentId": "IR-insulated-wire",
      "title": "Проводник и изоляция: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Изоляция отделяет проводник от корпуса и соседних линий, ограничивая ток утечки и риск короткого замыкания. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 7 × изолированный провод; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 7 × изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 7
        }
      ]
    },
    {
      "id": 227,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 12634,
      "contentId": "IR-insulated-wire",
      "title": "Проводник и изоляция: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Изоляция отделяет проводник от корпуса и соседних линий, ограничивая ток утечки и риск короткого замыкания. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 8 × изолированный провод; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 228,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 12696,
      "contentId": "IR-insulated-wire",
      "title": "Проводник и изоляция: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Изоляция отделяет проводник от корпуса и соседних линий, ограничивая ток утечки и риск короткого замыкания. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 9 × изолированный провод; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 9 × изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 9
        }
      ]
    },
    {
      "id": 229,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 12758,
      "contentId": "IR-insulated-wire",
      "title": "Проводник и изоляция: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Изоляция отделяет проводник от корпуса и соседних линий, ограничивая ток утечки и риск короткого замыкания. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 10 × изолированный провод; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 10 × изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 10
        }
      ]
    },
    {
      "id": 230,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 12920,
      "contentId": "IR-copper-coil",
      "title": "Магнитная машина: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Катушка создаёт магнитное поле пропорционально току и числу витков; плотная намотка повышает поток, но ухудшает охлаждение. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 2 × медную катушку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 2 × медную катушку",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 231,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 12982,
      "contentId": "IR-copper-coil",
      "title": "Магнитная машина: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Катушка создаёт магнитное поле пропорционально току и числу витков; плотная намотка повышает поток, но ухудшает охлаждение. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 4 × медную катушку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × медную катушку",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 232,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 13044,
      "contentId": "IR-copper-coil",
      "title": "Магнитная машина: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Катушка создаёт магнитное поле пропорционально току и числу витков; плотная намотка повышает поток, но ухудшает охлаждение. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 6 × медную катушку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × медную катушку",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 233,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 13106,
      "contentId": "IR-copper-coil",
      "title": "Магнитная машина: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Катушка создаёт магнитное поле пропорционально току и числу витков; плотная намотка повышает поток, но ухудшает охлаждение. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 8 × медную катушку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × медную катушку",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 234,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 13168,
      "contentId": "IR-copper-coil",
      "title": "Магнитная машина: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Катушка создаёт магнитное поле пропорционально току и числу витков; плотная намотка повышает поток, но ухудшает охлаждение. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 10 × медную катушку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 10 × медную катушку",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 10
        }
      ]
    },
    {
      "id": 235,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 13230,
      "contentId": "IR-copper-coil",
      "title": "Магнитная машина: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Катушка создаёт магнитное поле пропорционально току и числу витков; плотная намотка повышает поток, но ухудшает охлаждение. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 12 × медную катушку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × медную катушку",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 236,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 13292,
      "contentId": "IR-copper-coil",
      "title": "Магнитная машина: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Катушка создаёт магнитное поле пропорционально току и числу витков; плотная намотка повышает поток, но ухудшает охлаждение. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 14 × медную катушку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 14 × медную катушку",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 14
        }
      ]
    },
    {
      "id": 237,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 13354,
      "contentId": "IR-copper-coil",
      "title": "Магнитная машина: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Катушка создаёт магнитное поле пропорционально току и числу витков; плотная намотка повышает поток, но ухудшает охлаждение. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 16 × медную катушку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 16 × медную катушку",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 238,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 13416,
      "contentId": "IR-copper-coil",
      "title": "Магнитная машина: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Катушка создаёт магнитное поле пропорционально току и числу витков; плотная намотка повышает поток, но ухудшает охлаждение. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 18 × медную катушку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 18 × медную катушку",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 18
        }
      ]
    },
    {
      "id": 239,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 13478,
      "contentId": "IR-copper-coil",
      "title": "Магнитная машина: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Катушка создаёт магнитное поле пропорционально току и числу витков; плотная намотка повышает поток, но ухудшает охлаждение. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 20 × медную катушку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 20 × медную катушку",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 240,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 13640,
      "contentId": "IR-dynamo",
      "title": "Динамо: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Динамо преобразует механическую работу в электрическую через электромагнитную индукцию; потери идут в нагрев обмоток и щёток. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 3 × динамо-машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 3 × динамо-машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 3
        }
      ]
    },
    {
      "id": 241,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 13702,
      "contentId": "IR-dynamo",
      "title": "Динамо: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Динамо преобразует механическую работу в электрическую через электромагнитную индукцию; потери идут в нагрев обмоток и щёток. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 6 × динамо-машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × динамо-машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 242,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 13764,
      "contentId": "IR-dynamo",
      "title": "Динамо: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Динамо преобразует механическую работу в электрическую через электромагнитную индукцию; потери идут в нагрев обмоток и щёток. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 9 × динамо-машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 9 × динамо-машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 9
        }
      ]
    },
    {
      "id": 243,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 13826,
      "contentId": "IR-dynamo",
      "title": "Динамо: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Динамо преобразует механическую работу в электрическую через электромагнитную индукцию; потери идут в нагрев обмоток и щёток. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 12 × динамо-машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × динамо-машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 244,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 13888,
      "contentId": "IR-dynamo",
      "title": "Динамо: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Динамо преобразует механическую работу в электрическую через электромагнитную индукцию; потери идут в нагрев обмоток и щёток. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 15 × динамо-машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 15 × динамо-машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 15
        }
      ]
    },
    {
      "id": 245,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 13950,
      "contentId": "IR-dynamo",
      "title": "Динамо: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Динамо преобразует механическую работу в электрическую через электромагнитную индукцию; потери идут в нагрев обмоток и щёток. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 18 × динамо-машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 18 × динамо-машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 18
        }
      ]
    },
    {
      "id": 246,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 14012,
      "contentId": "IR-dynamo",
      "title": "Динамо: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Динамо преобразует механическую работу в электрическую через электромагнитную индукцию; потери идут в нагрев обмоток и щёток. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 21 × динамо-машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 21 × динамо-машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 21
        }
      ]
    },
    {
      "id": 247,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 14074,
      "contentId": "IR-dynamo",
      "title": "Динамо: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Динамо преобразует механическую работу в электрическую через электромагнитную индукцию; потери идут в нагрев обмоток и щёток. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 24 × динамо-машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 24 × динамо-машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 248,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 14136,
      "contentId": "IR-dynamo",
      "title": "Динамо: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Динамо преобразует механическую работу в электрическую через электромагнитную индукцию; потери идут в нагрев обмоток и щёток. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 27 × динамо-машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 27 × динамо-машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 27
        }
      ]
    },
    {
      "id": 249,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 14198,
      "contentId": "IR-dynamo",
      "title": "Динамо: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Динамо преобразует механическую работу в электрическую через электромагнитную индукцию; потери идут в нагрев обмоток и щёток. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 30 × динамо-машину; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 30 × динамо-машину",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 30
        }
      ]
    },
    {
      "id": 250,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 14360,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимический элемент: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Гальванический элемент превращает разность химических потенциалов в напряжение; вода служит электролитической средой. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 4 × гальванический элемент; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 251,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 14422,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимический элемент: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Гальванический элемент превращает разность химических потенциалов в напряжение; вода служит электролитической средой. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 8 × гальванический элемент; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 252,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 14484,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимический элемент: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Гальванический элемент превращает разность химических потенциалов в напряжение; вода служит электролитической средой. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 12 × гальванический элемент; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 253,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 14546,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимический элемент: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Гальванический элемент превращает разность химических потенциалов в напряжение; вода служит электролитической средой. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 16 × гальванический элемент; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 16 × гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 254,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 14608,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимический элемент: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Гальванический элемент превращает разность химических потенциалов в напряжение; вода служит электролитической средой. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 20 × гальванический элемент; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 20 × гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 255,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 14670,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимический элемент: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Гальванический элемент превращает разность химических потенциалов в напряжение; вода служит электролитической средой. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 24 × гальванический элемент; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 24 × гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 256,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 14732,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимический элемент: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Гальванический элемент превращает разность химических потенциалов в напряжение; вода служит электролитической средой. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 28 × гальванический элемент; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 28 × гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 28
        }
      ]
    },
    {
      "id": 257,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 14794,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимический элемент: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Гальванический элемент превращает разность химических потенциалов в напряжение; вода служит электролитической средой. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 32 × гальванический элемент; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 32 × гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 258,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 14856,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимический элемент: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Гальванический элемент превращает разность химических потенциалов в напряжение; вода служит электролитической средой. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 36 × гальванический элемент; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 36 × гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 36
        }
      ]
    },
    {
      "id": 259,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 14918,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимический элемент: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Гальванический элемент превращает разность химических потенциалов в напряжение; вода служит электролитической средой. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 40 × гальванический элемент; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 40 × гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 260,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 15080,
      "contentId": "IR-coke",
      "title": "Топливо и восстановление: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Кокс — пористый углеродный восстановитель: он даёт высокую температуру и меньше летучих примесей, чем сырой уголь. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 1 × кокс; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 1 × кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 261,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 15142,
      "contentId": "IR-coke",
      "title": "Топливо и восстановление: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Кокс — пористый углеродный восстановитель: он даёт высокую температуру и меньше летучих примесей, чем сырой уголь. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 2 × кокс; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 2 × кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 262,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 15204,
      "contentId": "IR-coke",
      "title": "Топливо и восстановление: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Кокс — пористый углеродный восстановитель: он даёт высокую температуру и меньше летучих примесей, чем сырой уголь. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 3 × кокс; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 3 × кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 3
        }
      ]
    },
    {
      "id": 263,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 15266,
      "contentId": "IR-coke",
      "title": "Топливо и восстановление: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Кокс — пористый углеродный восстановитель: он даёт высокую температуру и меньше летучих примесей, чем сырой уголь. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 4 × кокс; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 264,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 15328,
      "contentId": "IR-coke",
      "title": "Топливо и восстановление: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Кокс — пористый углеродный восстановитель: он даёт высокую температуру и меньше летучих примесей, чем сырой уголь. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 5 × кокс; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 5 × кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 5
        }
      ]
    },
    {
      "id": 265,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 15390,
      "contentId": "IR-coke",
      "title": "Топливо и восстановление: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Кокс — пористый углеродный восстановитель: он даёт высокую температуру и меньше летучих примесей, чем сырой уголь. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 6 × кокс; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 266,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 15452,
      "contentId": "IR-coke",
      "title": "Топливо и восстановление: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Кокс — пористый углеродный восстановитель: он даёт высокую температуру и меньше летучих примесей, чем сырой уголь. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 7 × кокс; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 7 × кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 7
        }
      ]
    },
    {
      "id": 267,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 15514,
      "contentId": "IR-coke",
      "title": "Топливо и восстановление: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Кокс — пористый углеродный восстановитель: он даёт высокую температуру и меньше летучих примесей, чем сырой уголь. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 8 × кокс; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 268,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 15576,
      "contentId": "IR-coke",
      "title": "Топливо и восстановление: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Кокс — пористый углеродный восстановитель: он даёт высокую температуру и меньше летучих примесей, чем сырой уголь. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 9 × кокс; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 9 × кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 9
        }
      ]
    },
    {
      "id": 269,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 15638,
      "contentId": "IR-coke",
      "title": "Топливо и восстановление: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Кокс — пористый углеродный восстановитель: он даёт высокую температуру и меньше летучих примесей, чем сырой уголь. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 10 × кокс; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 10 × кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 10
        }
      ]
    },
    {
      "id": 270,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 15800,
      "contentId": "IR-ceramic-insulator",
      "title": "Керамическая изоляция: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Керамика сохраняет высокое сопротивление при нагреве и механически удерживает провод без размягчения. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 2 × керамический изолятор; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 2 × керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 271,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 15862,
      "contentId": "IR-ceramic-insulator",
      "title": "Керамическая изоляция: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Керамика сохраняет высокое сопротивление при нагреве и механически удерживает провод без размягчения. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 4 × керамический изолятор; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 272,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 15924,
      "contentId": "IR-ceramic-insulator",
      "title": "Керамическая изоляция: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Керамика сохраняет высокое сопротивление при нагреве и механически удерживает провод без размягчения. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 6 × керамический изолятор; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 273,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 15986,
      "contentId": "IR-ceramic-insulator",
      "title": "Керамическая изоляция: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Керамика сохраняет высокое сопротивление при нагреве и механически удерживает провод без размягчения. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 8 × керамический изолятор; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 274,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 16048,
      "contentId": "IR-ceramic-insulator",
      "title": "Керамическая изоляция: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Керамика сохраняет высокое сопротивление при нагреве и механически удерживает провод без размягчения. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 10 × керамический изолятор; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 10 × керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 10
        }
      ]
    },
    {
      "id": 275,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 16110,
      "contentId": "IR-ceramic-insulator",
      "title": "Керамическая изоляция: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Керамика сохраняет высокое сопротивление при нагреве и механически удерживает провод без размягчения. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 12 × керамический изолятор; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 276,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 16172,
      "contentId": "IR-ceramic-insulator",
      "title": "Керамическая изоляция: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Керамика сохраняет высокое сопротивление при нагреве и механически удерживает провод без размягчения. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 14 × керамический изолятор; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 14 × керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 14
        }
      ]
    },
    {
      "id": 277,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 16234,
      "contentId": "IR-ceramic-insulator",
      "title": "Керамическая изоляция: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Керамика сохраняет высокое сопротивление при нагреве и механически удерживает провод без размягчения. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 16 × керамический изолятор; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 16 × керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 278,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 16296,
      "contentId": "IR-ceramic-insulator",
      "title": "Керамическая изоляция: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Керамика сохраняет высокое сопротивление при нагреве и механически удерживает провод без размягчения. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 18 × керамический изолятор; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 18 × керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 18
        }
      ]
    },
    {
      "id": 279,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 16358,
      "contentId": "IR-ceramic-insulator",
      "title": "Керамическая изоляция: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Керамика сохраняет высокое сопротивление при нагреве и механически удерживает провод без размягчения. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 20 × керамический изолятор; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 20 × керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 280,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 16520,
      "contentId": "IR-terminal-block",
      "title": "Клеммная коммутация: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Клемма создаёт разборное соединение: площадь контакта и сила прижима уменьшают переходное сопротивление. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 3 × клеммную колодку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 3 × клеммную колодку",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 3
        }
      ]
    },
    {
      "id": 281,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 16582,
      "contentId": "IR-terminal-block",
      "title": "Клеммная коммутация: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Клемма создаёт разборное соединение: площадь контакта и сила прижима уменьшают переходное сопротивление. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 6 × клеммную колодку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × клеммную колодку",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 282,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 16644,
      "contentId": "IR-terminal-block",
      "title": "Клеммная коммутация: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Клемма создаёт разборное соединение: площадь контакта и сила прижима уменьшают переходное сопротивление. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 9 × клеммную колодку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 9 × клеммную колодку",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 9
        }
      ]
    },
    {
      "id": 283,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 16706,
      "contentId": "IR-terminal-block",
      "title": "Клеммная коммутация: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Клемма создаёт разборное соединение: площадь контакта и сила прижима уменьшают переходное сопротивление. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 12 × клеммную колодку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × клеммную колодку",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 284,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 16768,
      "contentId": "IR-terminal-block",
      "title": "Клеммная коммутация: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Клемма создаёт разборное соединение: площадь контакта и сила прижима уменьшают переходное сопротивление. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 15 × клеммную колодку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 15 × клеммную колодку",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 15
        }
      ]
    },
    {
      "id": 285,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 16830,
      "contentId": "IR-terminal-block",
      "title": "Клеммная коммутация: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Клемма создаёт разборное соединение: площадь контакта и сила прижима уменьшают переходное сопротивление. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 18 × клеммную колодку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 18 × клеммную колодку",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 18
        }
      ]
    },
    {
      "id": 286,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 16892,
      "contentId": "IR-terminal-block",
      "title": "Клеммная коммутация: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Клемма создаёт разборное соединение: площадь контакта и сила прижима уменьшают переходное сопротивление. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 21 × клеммную колодку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 21 × клеммную колодку",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 21
        }
      ]
    },
    {
      "id": 287,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 16954,
      "contentId": "IR-terminal-block",
      "title": "Клеммная коммутация: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Клемма создаёт разборное соединение: площадь контакта и сила прижима уменьшают переходное сопротивление. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 24 × клеммную колодку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 24 × клеммную колодку",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 288,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 17016,
      "contentId": "IR-terminal-block",
      "title": "Клеммная коммутация: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Клемма создаёт разборное соединение: площадь контакта и сила прижима уменьшают переходное сопротивление. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 27 × клеммную колодку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 27 × клеммную колодку",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 27
        }
      ]
    },
    {
      "id": 289,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 17078,
      "contentId": "IR-terminal-block",
      "title": "Клеммная коммутация: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Клемма создаёт разборное соединение: площадь контакта и сила прижима уменьшают переходное сопротивление. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 30 × клеммную колодку; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 30 × клеммную колодку",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 30
        }
      ]
    },
    {
      "id": 290,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 17240,
      "contentId": "IR-circuit-board",
      "title": "Подложка схемы: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Подложка фиксирует геометрию проводников и изолирует узлы; стабильность размеров нужна для повторяемой сборки. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 4 × подложку схемы; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × подложку схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 291,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 17302,
      "contentId": "IR-circuit-board",
      "title": "Подложка схемы: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Подложка фиксирует геометрию проводников и изолирует узлы; стабильность размеров нужна для повторяемой сборки. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 8 × подложку схемы; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × подложку схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 292,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 17364,
      "contentId": "IR-circuit-board",
      "title": "Подложка схемы: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Подложка фиксирует геометрию проводников и изолирует узлы; стабильность размеров нужна для повторяемой сборки. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 12 × подложку схемы; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 12 × подложку схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 293,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 17426,
      "contentId": "IR-circuit-board",
      "title": "Подложка схемы: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Подложка фиксирует геометрию проводников и изолирует узлы; стабильность размеров нужна для повторяемой сборки. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 16 × подложку схемы; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 16 × подложку схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 294,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 17488,
      "contentId": "IR-circuit-board",
      "title": "Подложка схемы: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Подложка фиксирует геометрию проводников и изолирует узлы; стабильность размеров нужна для повторяемой сборки. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 20 × подложку схемы; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 20 × подложку схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 295,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 17550,
      "contentId": "IR-circuit-board",
      "title": "Подложка схемы: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Подложка фиксирует геометрию проводников и изолирует узлы; стабильность размеров нужна для повторяемой сборки. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 24 × подложку схемы; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 24 × подложку схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 296,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 17612,
      "contentId": "IR-circuit-board",
      "title": "Подложка схемы: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Подложка фиксирует геометрию проводников и изолирует узлы; стабильность размеров нужна для повторяемой сборки. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 28 × подложку схемы; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 28 × подложку схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 28
        }
      ]
    },
    {
      "id": 297,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 17674,
      "contentId": "IR-circuit-board",
      "title": "Подложка схемы: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Подложка фиксирует геометрию проводников и изолирует узлы; стабильность размеров нужна для повторяемой сборки. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 32 × подложку схемы; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 32 × подложку схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 298,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 17736,
      "contentId": "IR-circuit-board",
      "title": "Подложка схемы: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Подложка фиксирует геометрию проводников и изолирует узлы; стабильность размеров нужна для повторяемой сборки. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 36 × подложку схемы; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 36 × подложку схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 36
        }
      ]
    },
    {
      "id": 299,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 17798,
      "contentId": "IR-circuit-board",
      "title": "Подложка схемы: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Подложка фиксирует геометрию проводников и изолирует узлы; стабильность размеров нужна для повторяемой сборки. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 40 × подложку схемы; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 40 × подложку схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 300,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 17960,
      "contentId": "IR-first-circuit",
      "title": "Первая электросхема: Проектная спецификация",
      "subtitle": "Основная технологическая ветка",
      "description": "Схема объединяет источник, проводники и нагрузку в замкнутый контур — минимальную электрическую систему, которую можно измерять и расширять. Соберите эталонный образец и проверьте, что материал отвечает входной спецификации. Цель этапа — изготовить 1 × первую электросхему; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 1 × первую электросхему",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 301,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 18022,
      "contentId": "IR-first-circuit",
      "title": "Первая электросхема: Материальный баланс",
      "subtitle": "Основная технологическая ветка",
      "description": "Схема объединяет источник, проводники и нагрузку в замкнутый контур — минимальную электрическую систему, которую можно измерять и расширять. Накопите производственный запас: выход каждого передела должен покрывать отходы и последующую сборку. Цель этапа — изготовить 2 × первую электросхему; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 2 × первую электросхему",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 302,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 18084,
      "contentId": "IR-first-circuit",
      "title": "Первая электросхема: Контроль качества",
      "subtitle": "Основная технологическая ветка",
      "description": "Схема объединяет источник, проводники и нагрузку в замкнутый контур — минимальную электрическую систему, которую можно измерять и расширять. Сделайте контрольную партию; повторяемость важнее единичного удачного экземпляра. Цель этапа — изготовить 3 × первую электросхему; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 3 × первую электросхему",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 3
        }
      ]
    },
    {
      "id": 303,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 18146,
      "contentId": "IR-first-circuit",
      "title": "Первая электросхема: Тепловой режим",
      "subtitle": "Основная технологическая ветка",
      "description": "Схема объединяет источник, проводники и нагрузку в замкнутый контур — минимальную электрическую систему, которую можно измерять и расширять. Подготовьте запас для теплового испытания, учитывая расширение, теплопотери и деградацию материалов. Цель этапа — изготовить 4 × первую электросхему; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 4 × первую электросхему",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 304,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 18208,
      "contentId": "IR-first-circuit",
      "title": "Первая электросхема: Силовая проверка",
      "subtitle": "Основная технологическая ветка",
      "description": "Схема объединяет источник, проводники и нагрузку в замкнутый контур — минимальную электрическую систему, которую можно измерять и расширять. Изготовьте детали для нагрузки: оцените предел прочности, усталость и допустимый коэффициент запаса. Цель этапа — изготовить 5 × первую электросхему; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 5 × первую электросхему",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 5
        }
      ]
    },
    {
      "id": 305,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 18270,
      "contentId": "IR-first-circuit",
      "title": "Первая электросхема: Серийный выпуск",
      "subtitle": "Основная технологическая ветка",
      "description": "Схема объединяет источник, проводники и нагрузку в замкнутый контур — минимальную электрическую систему, которую можно измерять и расширять. Соберите серию, достаточную для следующего передела, а не только для демонстрационного образца. Цель этапа — изготовить 6 × первую электросхему; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 6 × первую электросхему",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 306,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 18332,
      "contentId": "IR-first-circuit",
      "title": "Первая электросхема: Резерв и ремонт",
      "subtitle": "Основная технологическая ветка",
      "description": "Схема объединяет источник, проводники и нагрузку в замкнутый контур — минимальную электрическую систему, которую можно измерять и расширять. Отложите ремонтный комплект: промышленная система должна переживать отказ отдельного узла. Цель этапа — изготовить 7 × первую электросхему; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 7 × первую электросхему",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 7
        }
      ]
    },
    {
      "id": 307,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 18394,
      "contentId": "IR-first-circuit",
      "title": "Первая электросхема: Приёмочный образец",
      "subtitle": "Основная технологическая ветка",
      "description": "Схема объединяет источник, проводники и нагрузку в замкнутый контур — минимальную электрическую систему, которую можно измерять и расширять. Соберите приёмочную деталь и убедитесь, что она совместима с сопрягаемыми компонентами. Цель этапа — изготовить 8 × первую электросхему; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 8 × первую электросхему",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 308,
      "radius": 18,
      "shape": "circle",
      "iconUrl": "",
      "x": 690,
      "y": 18456,
      "contentId": "IR-first-circuit",
      "title": "Первая электросхема: Побочная лаборатория",
      "subtitle": "Дополнительное исследование",
      "description": "Схема объединяет источник, проводники и нагрузку в замкнутый контур — минимальную электрическую систему, которую можно измерять и расширять. Проведите независимую побочную серию для сравнения параметров; она не блокирует магистральную линию. Цель этапа — изготовить 9 × первую электросхему; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 9 × первую электросхему",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 9
        }
      ]
    },
    {
      "id": 309,
      "radius": 23,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 18518,
      "contentId": "IR-first-circuit",
      "title": "Первая электросхема: Закрытие главы",
      "subtitle": "Основная технологическая ветка",
      "description": "Схема объединяет источник, проводники и нагрузку в замкнутый контур — минимальную электрическую систему, которую можно измерять и расширять. Создайте финальный запас главы: он открывает следующий физически связанный передел. Цель этапа — изготовить 10 × первую электросхему; задача проверяется по фактическому запасу в инвентаре.",
      "tasks": [
        {
          "text": "Изготовить 10 × первую электросхему",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 10
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
      "from": 2,
      "to": 4
    },
    {
      "from": 2,
      "to": 5
    },
    {
      "from": 2,
      "to": 6
    },
    {
      "from": 2,
      "to": 7
    },
    {
      "from": 2,
      "to": 8
    },
    {
      "from": 2,
      "to": 9
    },
    {
      "from": 2,
      "to": 10
    },
    {
      "from": 2,
      "to": 11
    },
    {
      "from": 2,
      "to": 12
    },
    {
      "from": 1,
      "to": 13
    },
    {
      "from": 13,
      "to": 14
    },
    {
      "from": 13,
      "to": 15
    },
    {
      "from": 13,
      "to": 16
    },
    {
      "from": 13,
      "to": 17
    },
    {
      "from": 13,
      "to": 18
    },
    {
      "from": 13,
      "to": 19
    },
    {
      "from": 13,
      "to": 20
    },
    {
      "from": 13,
      "to": 21
    },
    {
      "from": 13,
      "to": 22
    },
    {
      "from": 13,
      "to": 23
    },
    {
      "from": 13,
      "to": 24
    },
    {
      "from": 13,
      "to": 25
    },
    {
      "from": 13,
      "to": 26
    },
    {
      "from": 13,
      "to": 27
    },
    {
      "from": 13,
      "to": 28
    },
    {
      "from": 13,
      "to": 29
    },
    {
      "from": 13,
      "to": 30
    },
    {
      "from": 13,
      "to": 31
    },
    {
      "from": 13,
      "to": 32
    },
    {
      "from": 13,
      "to": 33
    },
    {
      "from": 13,
      "to": 34
    },
    {
      "from": 13,
      "to": 35
    },
    {
      "from": 13,
      "to": 36
    },
    {
      "from": 1,
      "to": 37
    },
    {
      "from": 37,
      "to": 38
    },
    {
      "from": 37,
      "to": 39
    },
    {
      "from": 37,
      "to": 40
    },
    {
      "from": 37,
      "to": 41
    },
    {
      "from": 37,
      "to": 42
    },
    {
      "from": 37,
      "to": 43
    },
    {
      "from": 37,
      "to": 44
    },
    {
      "from": 37,
      "to": 45
    },
    {
      "from": 37,
      "to": 46
    },
    {
      "from": 37,
      "to": 47
    },
    {
      "from": 37,
      "to": 48
    },
    {
      "from": 37,
      "to": 49
    },
    {
      "from": 37,
      "to": 50
    },
    {
      "from": 37,
      "to": 51
    },
    {
      "from": 37,
      "to": 52
    },
    {
      "from": 37,
      "to": 53
    },
    {
      "from": 37,
      "to": 54
    },
    {
      "from": 37,
      "to": 55
    },
    {
      "from": 37,
      "to": 56
    },
    {
      "from": 37,
      "to": 57
    },
    {
      "from": 37,
      "to": 58
    },
    {
      "from": 37,
      "to": 59
    },
    {
      "from": 1,
      "to": 60
    },
    {
      "from": 60,
      "to": 61
    },
    {
      "from": 60,
      "to": 62
    },
    {
      "from": 60,
      "to": 63
    },
    {
      "from": 60,
      "to": 64
    },
    {
      "from": 60,
      "to": 65
    },
    {
      "from": 60,
      "to": 66
    },
    {
      "from": 60,
      "to": 67
    },
    {
      "from": 60,
      "to": 68
    },
    {
      "from": 60,
      "to": 69
    },
    {
      "from": 60,
      "to": 70
    },
    {
      "from": 60,
      "to": 71
    },
    {
      "from": 60,
      "to": 72
    },
    {
      "from": 60,
      "to": 73
    },
    {
      "from": 60,
      "to": 74
    },
    {
      "from": 60,
      "to": 75
    },
    {
      "from": 60,
      "to": 76
    },
    {
      "from": 60,
      "to": 77
    },
    {
      "from": 60,
      "to": 78
    },
    {
      "from": 60,
      "to": 79
    },
    {
      "from": 60,
      "to": 80
    },
    {
      "from": 60,
      "to": 81
    },
    {
      "from": 1,
      "to": 82
    },
    {
      "from": 82,
      "to": 83
    },
    {
      "from": 82,
      "to": 84
    },
    {
      "from": 82,
      "to": 85
    },
    {
      "from": 82,
      "to": 86
    },
    {
      "from": 82,
      "to": 87
    },
    {
      "from": 82,
      "to": 88
    },
    {
      "from": 82,
      "to": 89
    },
    {
      "from": 82,
      "to": 90
    },
    {
      "from": 82,
      "to": 91
    },
    {
      "from": 82,
      "to": 92
    },
    {
      "from": 82,
      "to": 93
    },
    {
      "from": 82,
      "to": 94
    },
    {
      "from": 82,
      "to": 95
    },
    {
      "from": 82,
      "to": 96
    },
    {
      "from": 82,
      "to": 97
    },
    {
      "from": 82,
      "to": 98
    },
    {
      "from": 82,
      "to": 99
    },
    {
      "from": 99,
      "to": 100
    },
    {
      "from": 100,
      "to": 101
    },
    {
      "from": 101,
      "to": 102
    },
    {
      "from": 102,
      "to": 103
    },
    {
      "from": 103,
      "to": 104
    },
    {
      "from": 104,
      "to": 105
    },
    {
      "from": 105,
      "to": 106
    },
    {
      "from": 106,
      "to": 107
    },
    {
      "from": 107,
      "to": 109
    },
    {
      "from": 104,
      "to": 108
    },
    {
      "from": 109,
      "to": 110
    },
    {
      "from": 110,
      "to": 111
    },
    {
      "from": 111,
      "to": 112
    },
    {
      "from": 112,
      "to": 113
    },
    {
      "from": 113,
      "to": 114
    },
    {
      "from": 114,
      "to": 115
    },
    {
      "from": 115,
      "to": 116
    },
    {
      "from": 116,
      "to": 117
    },
    {
      "from": 117,
      "to": 119
    },
    {
      "from": 114,
      "to": 118
    },
    {
      "from": 119,
      "to": 120
    },
    {
      "from": 120,
      "to": 121
    },
    {
      "from": 121,
      "to": 122
    },
    {
      "from": 122,
      "to": 123
    },
    {
      "from": 123,
      "to": 124
    },
    {
      "from": 124,
      "to": 125
    },
    {
      "from": 125,
      "to": 126
    },
    {
      "from": 126,
      "to": 127
    },
    {
      "from": 127,
      "to": 129
    },
    {
      "from": 124,
      "to": 128
    },
    {
      "from": 129,
      "to": 130
    },
    {
      "from": 130,
      "to": 131
    },
    {
      "from": 131,
      "to": 132
    },
    {
      "from": 132,
      "to": 133
    },
    {
      "from": 133,
      "to": 134
    },
    {
      "from": 134,
      "to": 135
    },
    {
      "from": 135,
      "to": 136
    },
    {
      "from": 136,
      "to": 137
    },
    {
      "from": 137,
      "to": 139
    },
    {
      "from": 134,
      "to": 138
    },
    {
      "from": 139,
      "to": 140
    },
    {
      "from": 140,
      "to": 141
    },
    {
      "from": 141,
      "to": 142
    },
    {
      "from": 142,
      "to": 143
    },
    {
      "from": 143,
      "to": 144
    },
    {
      "from": 144,
      "to": 145
    },
    {
      "from": 145,
      "to": 146
    },
    {
      "from": 146,
      "to": 147
    },
    {
      "from": 147,
      "to": 149
    },
    {
      "from": 144,
      "to": 148
    },
    {
      "from": 149,
      "to": 150
    },
    {
      "from": 150,
      "to": 151
    },
    {
      "from": 151,
      "to": 152
    },
    {
      "from": 152,
      "to": 153
    },
    {
      "from": 153,
      "to": 154
    },
    {
      "from": 154,
      "to": 155
    },
    {
      "from": 155,
      "to": 156
    },
    {
      "from": 156,
      "to": 157
    },
    {
      "from": 157,
      "to": 159
    },
    {
      "from": 154,
      "to": 158
    },
    {
      "from": 159,
      "to": 160
    },
    {
      "from": 160,
      "to": 161
    },
    {
      "from": 161,
      "to": 162
    },
    {
      "from": 162,
      "to": 163
    },
    {
      "from": 163,
      "to": 164
    },
    {
      "from": 164,
      "to": 165
    },
    {
      "from": 165,
      "to": 166
    },
    {
      "from": 166,
      "to": 167
    },
    {
      "from": 167,
      "to": 169
    },
    {
      "from": 164,
      "to": 168
    },
    {
      "from": 169,
      "to": 170
    },
    {
      "from": 170,
      "to": 171
    },
    {
      "from": 171,
      "to": 172
    },
    {
      "from": 172,
      "to": 173
    },
    {
      "from": 173,
      "to": 174
    },
    {
      "from": 174,
      "to": 175
    },
    {
      "from": 175,
      "to": 176
    },
    {
      "from": 176,
      "to": 177
    },
    {
      "from": 177,
      "to": 179
    },
    {
      "from": 174,
      "to": 178
    },
    {
      "from": 179,
      "to": 180
    },
    {
      "from": 180,
      "to": 181
    },
    {
      "from": 181,
      "to": 182
    },
    {
      "from": 182,
      "to": 183
    },
    {
      "from": 183,
      "to": 184
    },
    {
      "from": 184,
      "to": 185
    },
    {
      "from": 185,
      "to": 186
    },
    {
      "from": 186,
      "to": 187
    },
    {
      "from": 187,
      "to": 189
    },
    {
      "from": 184,
      "to": 188
    },
    {
      "from": 189,
      "to": 190
    },
    {
      "from": 190,
      "to": 191
    },
    {
      "from": 191,
      "to": 192
    },
    {
      "from": 192,
      "to": 193
    },
    {
      "from": 193,
      "to": 194
    },
    {
      "from": 194,
      "to": 195
    },
    {
      "from": 195,
      "to": 196
    },
    {
      "from": 196,
      "to": 197
    },
    {
      "from": 197,
      "to": 199
    },
    {
      "from": 194,
      "to": 198
    },
    {
      "from": 199,
      "to": 200
    },
    {
      "from": 200,
      "to": 201
    },
    {
      "from": 201,
      "to": 202
    },
    {
      "from": 202,
      "to": 203
    },
    {
      "from": 203,
      "to": 204
    },
    {
      "from": 204,
      "to": 205
    },
    {
      "from": 205,
      "to": 206
    },
    {
      "from": 206,
      "to": 207
    },
    {
      "from": 207,
      "to": 209
    },
    {
      "from": 204,
      "to": 208
    },
    {
      "from": 209,
      "to": 210
    },
    {
      "from": 210,
      "to": 211
    },
    {
      "from": 211,
      "to": 212
    },
    {
      "from": 212,
      "to": 213
    },
    {
      "from": 213,
      "to": 214
    },
    {
      "from": 214,
      "to": 215
    },
    {
      "from": 215,
      "to": 216
    },
    {
      "from": 216,
      "to": 217
    },
    {
      "from": 217,
      "to": 219
    },
    {
      "from": 214,
      "to": 218
    },
    {
      "from": 219,
      "to": 220
    },
    {
      "from": 220,
      "to": 221
    },
    {
      "from": 221,
      "to": 222
    },
    {
      "from": 222,
      "to": 223
    },
    {
      "from": 223,
      "to": 224
    },
    {
      "from": 224,
      "to": 225
    },
    {
      "from": 225,
      "to": 226
    },
    {
      "from": 226,
      "to": 227
    },
    {
      "from": 227,
      "to": 229
    },
    {
      "from": 224,
      "to": 228
    },
    {
      "from": 229,
      "to": 230
    },
    {
      "from": 230,
      "to": 231
    },
    {
      "from": 231,
      "to": 232
    },
    {
      "from": 232,
      "to": 233
    },
    {
      "from": 233,
      "to": 234
    },
    {
      "from": 234,
      "to": 235
    },
    {
      "from": 235,
      "to": 236
    },
    {
      "from": 236,
      "to": 237
    },
    {
      "from": 237,
      "to": 239
    },
    {
      "from": 234,
      "to": 238
    },
    {
      "from": 239,
      "to": 240
    },
    {
      "from": 240,
      "to": 241
    },
    {
      "from": 241,
      "to": 242
    },
    {
      "from": 242,
      "to": 243
    },
    {
      "from": 243,
      "to": 244
    },
    {
      "from": 244,
      "to": 245
    },
    {
      "from": 245,
      "to": 246
    },
    {
      "from": 246,
      "to": 247
    },
    {
      "from": 247,
      "to": 249
    },
    {
      "from": 244,
      "to": 248
    },
    {
      "from": 249,
      "to": 250
    },
    {
      "from": 250,
      "to": 251
    },
    {
      "from": 251,
      "to": 252
    },
    {
      "from": 252,
      "to": 253
    },
    {
      "from": 253,
      "to": 254
    },
    {
      "from": 254,
      "to": 255
    },
    {
      "from": 255,
      "to": 256
    },
    {
      "from": 256,
      "to": 257
    },
    {
      "from": 257,
      "to": 259
    },
    {
      "from": 254,
      "to": 258
    },
    {
      "from": 259,
      "to": 260
    },
    {
      "from": 260,
      "to": 261
    },
    {
      "from": 261,
      "to": 262
    },
    {
      "from": 262,
      "to": 263
    },
    {
      "from": 263,
      "to": 264
    },
    {
      "from": 264,
      "to": 265
    },
    {
      "from": 265,
      "to": 266
    },
    {
      "from": 266,
      "to": 267
    },
    {
      "from": 267,
      "to": 269
    },
    {
      "from": 264,
      "to": 268
    },
    {
      "from": 269,
      "to": 270
    },
    {
      "from": 270,
      "to": 271
    },
    {
      "from": 271,
      "to": 272
    },
    {
      "from": 272,
      "to": 273
    },
    {
      "from": 273,
      "to": 274
    },
    {
      "from": 274,
      "to": 275
    },
    {
      "from": 275,
      "to": 276
    },
    {
      "from": 276,
      "to": 277
    },
    {
      "from": 277,
      "to": 279
    },
    {
      "from": 274,
      "to": 278
    },
    {
      "from": 279,
      "to": 280
    },
    {
      "from": 280,
      "to": 281
    },
    {
      "from": 281,
      "to": 282
    },
    {
      "from": 282,
      "to": 283
    },
    {
      "from": 283,
      "to": 284
    },
    {
      "from": 284,
      "to": 285
    },
    {
      "from": 285,
      "to": 286
    },
    {
      "from": 286,
      "to": 287
    },
    {
      "from": 287,
      "to": 289
    },
    {
      "from": 284,
      "to": 288
    },
    {
      "from": 289,
      "to": 290
    },
    {
      "from": 290,
      "to": 291
    },
    {
      "from": 291,
      "to": 292
    },
    {
      "from": 292,
      "to": 293
    },
    {
      "from": 293,
      "to": 294
    },
    {
      "from": 294,
      "to": 295
    },
    {
      "from": 295,
      "to": 296
    },
    {
      "from": 296,
      "to": 297
    },
    {
      "from": 297,
      "to": 299
    },
    {
      "from": 294,
      "to": 298
    },
    {
      "from": 299,
      "to": 300
    },
    {
      "from": 300,
      "to": 301
    },
    {
      "from": 301,
      "to": 302
    },
    {
      "from": 302,
      "to": 303
    },
    {
      "from": 303,
      "to": 304
    },
    {
      "from": 304,
      "to": 305
    },
    {
      "from": 305,
      "to": 306
    },
    {
      "from": 306,
      "to": 307
    },
    {
      "from": 307,
      "to": 309
    },
    {
      "from": 304,
      "to": 308
    }
  ],
  "cameraX": 0,
  "cameraY": 0,
  "nextNodeId": 310
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
    zoom: 1,
    minZoom: 0.04,
    maxZoom: 2.5,
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
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
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
        const nodes = QuestBook.nodes.filter(node => questVisibleForBrowsing(node.id));
        if (!this.canvas || nodes.length === 0) return;
        const minX = Math.min(...nodes.map(node => node.x));
        const maxX = Math.max(...nodes.map(node => node.x));
        const minY = Math.min(...nodes.map(node => node.y));
        const maxY = Math.max(...nodes.map(node => node.y));
        const width = Math.max(1, maxX - minX + 100);
        const height = Math.max(1, maxY - minY + 100);
        this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom,
            Math.min((this.cssWidth || 1) / width, (this.cssHeight || 1) / height)));
        this.cameraX = (minX + maxX) / 2;
        this.cameraY = (minY + maxY) / 2;
    },

    screenToWorld(sx, sy) {
        return {
            x: this.cameraX + (sx - (this.cssWidth || 0) / 2) / this.zoom,
            y: this.cameraY + (sy - (this.cssHeight || 0) / 2) / this.zoom
        };
    },

    worldToScreen(wx, wy) {
        return {
            x: (this.cssWidth || 0) / 2 + (wx - this.cameraX) * this.zoom,
            y: (this.cssHeight || 0) / 2 + (wy - this.cameraY) * this.zoom
        };
    },

    setZoom(nextZoom, anchorX, anchorY) {
        const oldWorld = this.screenToWorld(anchorX, anchorY);
        this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, nextZoom));
        this.cameraX = oldWorld.x - (anchorX - (this.cssWidth || 0) / 2) / this.zoom;
        this.cameraY = oldWorld.y - (anchorY - (this.cssHeight || 0) / 2) / this.zoom;
        this.draw();
    },

    zoomBy(factor) {
        this.setZoom(this.zoom * factor, (this.cssWidth || 0) / 2, (this.cssHeight || 0) / 2);
    },

    getEventPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },

    hitTestNode(mx, my) {
        for (const node of QuestBook.nodes) {
            if (!questVisibleForBrowsing(node.id)) continue;
            const s = this.worldToScreen(node.x, node.y);
            const dx = mx - s.x, dy = my - s.y;
            const r = (node.radius || 18) * this.zoom + 6;
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
        this.cameraX = this.dragCameraStart.x - dx / this.zoom;
        this.cameraY = this.dragCameraStart.y - dy / this.zoom;
        this.draw();
    },

    onWheel(e) {
        e.preventDefault();
        const p = this.getEventPos(e);
        this.setZoom(this.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15), p.x, p.y);
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
        const spacing = 56 * this.zoom;
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        const centerX = W / 2, centerY = H / 2;
        const startX = centerX - ((((this.cameraX * this.zoom) % spacing) + spacing) % spacing);
        const startY = centerY - ((((this.cameraY * this.zoom) % spacing) + spacing) % spacing);
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
            const r = (node.radius || 18) * this.zoom;
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

    const zoomInBtn = document.getElementById('quest-zoom-in');
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => QuestGraph.zoomBy(1.2));
    const zoomOutBtn = document.getElementById('quest-zoom-out');
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => QuestGraph.zoomBy(1 / 1.2));
    const zoomFitBtn = document.getElementById('quest-zoom-fit');
    if (zoomFitBtn) zoomFitBtn.addEventListener('click', () => { QuestGraph.fitToNodes(); QuestGraph.draw(); });

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
