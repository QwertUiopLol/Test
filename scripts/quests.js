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
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 3560,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Стальной фундамент — этап 1/10. Соберите 1 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 1 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 101,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 3655,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Стальной фундамент — этап 2/10. Соберите 2 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 2 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 102,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 3655,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Стальной фундамент — этап 3/10. Соберите 3 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 3 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 3
        }
      ]
    },
    {
      "id": 103,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3655,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Стальной фундамент — этап 4/10. Соберите 4 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 4 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 104,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 3655,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Стальной фундамент — этап 5/10. Соберите 5 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 5 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 5
        }
      ]
    },
    {
      "id": 105,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 3655,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Стальной фундамент — этап 6/10. Соберите 6 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 6 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 106,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 3715,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Стальной фундамент — этап 7/10. Соберите 7 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 7 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 7
        }
      ]
    },
    {
      "id": 107,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 3715,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Стальной фундамент — этап 8/10. Соберите 8 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 8 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 108,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3715,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Стальной фундамент — этап 9/10. Соберите 9 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 9 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 9
        }
      ]
    },
    {
      "id": 109,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 3715,
      "contentId": "IR-steelframe",
      "title": "Стальной фундамент: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Стальной фундамент — этап 10/10. Соберите 10 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 10 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 10
        }
      ]
    },
    {
      "id": 110,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 3780,
      "contentId": "IR-ironplate",
      "title": "Инструментальная мастерская: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Инструментальная мастерская — этап 1/10. Соберите 2 ед. «Железная пластина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 2 × Железная пластина",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 111,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 3875,
      "contentId": "IR-ironplate",
      "title": "Инструментальная мастерская: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Инструментальная мастерская — этап 2/10. Соберите 4 ед. «Железная пластина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 4 × Железная пластина",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 112,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 3875,
      "contentId": "IR-ironplate",
      "title": "Инструментальная мастерская: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Инструментальная мастерская — этап 3/10. Соберите 6 ед. «Железная пластина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 6 × Железная пластина",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 113,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3875,
      "contentId": "IR-ironplate",
      "title": "Инструментальная мастерская: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Инструментальная мастерская — этап 4/10. Соберите 8 ед. «Железная пластина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 8 × Железная пластина",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 114,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 3875,
      "contentId": "IR-ironplate",
      "title": "Инструментальная мастерская: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Инструментальная мастерская — этап 5/10. Соберите 10 ед. «Железная пластина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 10 × Железная пластина",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 10
        }
      ]
    },
    {
      "id": 115,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 3875,
      "contentId": "IR-ironplate",
      "title": "Инструментальная мастерская: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Инструментальная мастерская — этап 6/10. Соберите 12 ед. «Железная пластина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 12 × Железная пластина",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 116,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 3935,
      "contentId": "IR-ironplate",
      "title": "Инструментальная мастерская: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Инструментальная мастерская — этап 7/10. Соберите 14 ед. «Железная пластина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 14 × Железная пластина",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 14
        }
      ]
    },
    {
      "id": 117,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 3935,
      "contentId": "IR-ironplate",
      "title": "Инструментальная мастерская: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Инструментальная мастерская — этап 8/10. Соберите 16 ед. «Железная пластина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Железная пластина",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 118,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 3935,
      "contentId": "IR-ironplate",
      "title": "Инструментальная мастерская: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Инструментальная мастерская — этап 9/10. Соберите 18 ед. «Железная пластина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 18 × Железная пластина",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 18
        }
      ]
    },
    {
      "id": 119,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 3935,
      "contentId": "IR-ironplate",
      "title": "Инструментальная мастерская: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Инструментальная мастерская — этап 10/10. Соберите 20 ед. «Железная пластина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 20 × Железная пластина",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 120,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 4000,
      "contentId": "IR-sapling",
      "title": "Лесное хозяйство: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Лесное хозяйство — этап 1/10. Соберите 1 ед. «Синтетический саженец» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 1 × Синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 121,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 4095,
      "contentId": "IR-sapling",
      "title": "Лесное хозяйство: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лесное хозяйство — этап 2/10. Соберите 2 ед. «Синтетический саженец» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 2 × Синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 122,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 4095,
      "contentId": "IR-sapling",
      "title": "Лесное хозяйство: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лесное хозяйство — этап 3/10. Соберите 3 ед. «Синтетический саженец» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 3 × Синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 3
        }
      ]
    },
    {
      "id": 123,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4095,
      "contentId": "IR-sapling",
      "title": "Лесное хозяйство: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лесное хозяйство — этап 4/10. Соберите 4 ед. «Синтетический саженец» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 4 × Синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 124,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 4095,
      "contentId": "IR-sapling",
      "title": "Лесное хозяйство: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лесное хозяйство — этап 5/10. Соберите 5 ед. «Синтетический саженец» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 5 × Синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 5
        }
      ]
    },
    {
      "id": 125,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 4095,
      "contentId": "IR-sapling",
      "title": "Лесное хозяйство: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лесное хозяйство — этап 6/10. Соберите 6 ед. «Синтетический саженец» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 6 × Синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 126,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 4155,
      "contentId": "IR-sapling",
      "title": "Лесное хозяйство: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лесное хозяйство — этап 7/10. Соберите 7 ед. «Синтетический саженец» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 7 × Синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 7
        }
      ]
    },
    {
      "id": 127,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 4155,
      "contentId": "IR-sapling",
      "title": "Лесное хозяйство: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лесное хозяйство — этап 8/10. Соберите 8 ед. «Синтетический саженец» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 8 × Синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 128,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4155,
      "contentId": "IR-sapling",
      "title": "Лесное хозяйство: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лесное хозяйство — этап 9/10. Соберите 9 ед. «Синтетический саженец» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 9 × Синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 9
        }
      ]
    },
    {
      "id": 129,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 4155,
      "contentId": "IR-sapling",
      "title": "Лесное хозяйство: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лесное хозяйство — этап 10/10. Соберите 10 ед. «Синтетический саженец» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 10 × Синтетический саженец",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 10
        }
      ]
    },
    {
      "id": 130,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 4220,
      "contentId": "IR-capsule-1000-water",
      "title": "Гидрология: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Гидрология — этап 1/10. Соберите 4 ед. «Капсула воды» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 4 × Капсула воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 131,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 4315,
      "contentId": "IR-capsule-1000-water",
      "title": "Гидрология: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Гидрология — этап 2/10. Соберите 8 ед. «Капсула воды» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 8 × Капсула воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 132,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 4315,
      "contentId": "IR-capsule-1000-water",
      "title": "Гидрология: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Гидрология — этап 3/10. Соберите 12 ед. «Капсула воды» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 12 × Капсула воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 133,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4315,
      "contentId": "IR-capsule-1000-water",
      "title": "Гидрология: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Гидрология — этап 4/10. Соберите 16 ед. «Капсула воды» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Капсула воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 134,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 4315,
      "contentId": "IR-capsule-1000-water",
      "title": "Гидрология: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Гидрология — этап 5/10. Соберите 20 ед. «Капсула воды» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 20 × Капсула воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 135,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 4315,
      "contentId": "IR-capsule-1000-water",
      "title": "Гидрология: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Гидрология — этап 6/10. Соберите 24 ед. «Капсула воды» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 24 × Капсула воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 136,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 4375,
      "contentId": "IR-capsule-1000-water",
      "title": "Гидрология: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Гидрология — этап 7/10. Соберите 28 ед. «Капсула воды» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 28 × Капсула воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 28
        }
      ]
    },
    {
      "id": 137,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 4375,
      "contentId": "IR-capsule-1000-water",
      "title": "Гидрология: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Гидрология — этап 8/10. Соберите 32 ед. «Капсула воды» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 32 × Капсула воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 138,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4375,
      "contentId": "IR-capsule-1000-water",
      "title": "Гидрология: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Гидрология — этап 9/10. Соберите 36 ед. «Капсула воды» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 36 × Капсула воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 36
        }
      ]
    },
    {
      "id": 139,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 4375,
      "contentId": "IR-capsule-1000-water",
      "title": "Гидрология: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Гидрология — этап 10/10. Соберите 40 ед. «Капсула воды» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 40 × Капсула воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 140,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 4440,
      "contentId": "IR-steelframe",
      "title": "Паровой котёл: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Паровой котёл — этап 1/10. Соберите 4 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 4 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 141,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 4535,
      "contentId": "IR-steelframe",
      "title": "Паровой котёл: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паровой котёл — этап 2/10. Соберите 8 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 8 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 142,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 4535,
      "contentId": "IR-steelframe",
      "title": "Паровой котёл: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паровой котёл — этап 3/10. Соберите 12 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 12 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 143,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4535,
      "contentId": "IR-steelframe",
      "title": "Паровой котёл: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паровой котёл — этап 4/10. Соберите 16 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 144,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 4535,
      "contentId": "IR-steelframe",
      "title": "Паровой котёл: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паровой котёл — этап 5/10. Соберите 20 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 20 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 145,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 4535,
      "contentId": "IR-steelframe",
      "title": "Паровой котёл: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паровой котёл — этап 6/10. Соберите 24 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 24 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 146,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 4595,
      "contentId": "IR-steelframe",
      "title": "Паровой котёл: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паровой котёл — этап 7/10. Соберите 28 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 28 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 28
        }
      ]
    },
    {
      "id": 147,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 4595,
      "contentId": "IR-steelframe",
      "title": "Паровой котёл: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паровой котёл — этап 8/10. Соберите 32 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 32 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 148,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4595,
      "contentId": "IR-steelframe",
      "title": "Паровой котёл: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паровой котёл — этап 9/10. Соберите 36 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 36 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 36
        }
      ]
    },
    {
      "id": 149,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 4595,
      "contentId": "IR-steelframe",
      "title": "Паровой котёл: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паровой котёл — этап 10/10. Соберите 40 ед. «Стальная рама» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 40 × Стальная рама",
          "optional": false,
          "type": "item",
          "itemId": "IR-steelframe",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 150,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 4660,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Паропровод — этап 1/10. Соберите 12 ед. «Стальная паровая труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 12 × Стальная паровая труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 151,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 4755,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паропровод — этап 2/10. Соберите 24 ед. «Стальная паровая труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 24 × Стальная паровая труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 152,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 4755,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паропровод — этап 3/10. Соберите 36 ед. «Стальная паровая труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 36 × Стальная паровая труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 36
        }
      ]
    },
    {
      "id": 153,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4755,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паропровод — этап 4/10. Соберите 48 ед. «Стальная паровая труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 48 × Стальная паровая труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 48
        }
      ]
    },
    {
      "id": 154,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 4755,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паропровод — этап 5/10. Соберите 60 ед. «Стальная паровая труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 60 × Стальная паровая труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 60
        }
      ]
    },
    {
      "id": 155,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 4755,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паропровод — этап 6/10. Соберите 72 ед. «Стальная паровая труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 72 × Стальная паровая труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 72
        }
      ]
    },
    {
      "id": 156,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 4815,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паропровод — этап 7/10. Соберите 84 ед. «Стальная паровая труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 84 × Стальная паровая труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 84
        }
      ]
    },
    {
      "id": 157,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 4815,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паропровод — этап 8/10. Соберите 96 ед. «Стальная паровая труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 96 × Стальная паровая труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 96
        }
      ]
    },
    {
      "id": 158,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4815,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паропровод — этап 9/10. Соберите 108 ед. «Стальная паровая труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 108 × Стальная паровая труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 108
        }
      ]
    },
    {
      "id": 159,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 4815,
      "contentId": "IR-steam-pipe",
      "title": "Паропровод: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Паропровод — этап 10/10. Соберите 120 ед. «Стальная паровая труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 120 × Стальная паровая труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-pipe",
          "itemCount": 120
        }
      ]
    },
    {
      "id": 160,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 4880,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая механика: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Поршневая механика — этап 1/10. Соберите 4 ед. «Поршневая сборка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 4 × Поршневая сборка",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 161,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 4975,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая механика: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Поршневая механика — этап 2/10. Соберите 8 ед. «Поршневая сборка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 8 × Поршневая сборка",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 162,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 4975,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая механика: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Поршневая механика — этап 3/10. Соберите 12 ед. «Поршневая сборка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 12 × Поршневая сборка",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 163,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 4975,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая механика: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Поршневая механика — этап 4/10. Соберите 16 ед. «Поршневая сборка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Поршневая сборка",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 164,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 4975,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая механика: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Поршневая механика — этап 5/10. Соберите 20 ед. «Поршневая сборка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 20 × Поршневая сборка",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 165,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 4975,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая механика: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Поршневая механика — этап 6/10. Соберите 24 ед. «Поршневая сборка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 24 × Поршневая сборка",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 166,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 5035,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая механика: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Поршневая механика — этап 7/10. Соберите 28 ед. «Поршневая сборка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 28 × Поршневая сборка",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 28
        }
      ]
    },
    {
      "id": 167,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 5035,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая механика: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Поршневая механика — этап 8/10. Соберите 32 ед. «Поршневая сборка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 32 × Поршневая сборка",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 168,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5035,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая механика: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Поршневая механика — этап 9/10. Соберите 36 ед. «Поршневая сборка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 36 × Поршневая сборка",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 36
        }
      ]
    },
    {
      "id": 169,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 5035,
      "contentId": "IR-piston-assembly",
      "title": "Поршневая механика: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Поршневая механика — этап 10/10. Соберите 40 ед. «Поршневая сборка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 40 × Поршневая сборка",
          "optional": false,
          "type": "item",
          "itemId": "IR-piston-assembly",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 170,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 5100,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсация: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Конденсация — этап 1/10. Соберите 8 ед. «Жидкостная труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 8 × Жидкостная труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 171,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 5195,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсация: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Конденсация — этап 2/10. Соберите 16 ед. «Жидкостная труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Жидкостная труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 172,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 5195,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсация: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Конденсация — этап 3/10. Соберите 24 ед. «Жидкостная труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 24 × Жидкостная труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 173,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5195,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсация: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Конденсация — этап 4/10. Соберите 32 ед. «Жидкостная труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 32 × Жидкостная труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 174,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 5195,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсация: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Конденсация — этап 5/10. Соберите 40 ед. «Жидкостная труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 40 × Жидкостная труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 175,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 5195,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсация: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Конденсация — этап 6/10. Соберите 48 ед. «Жидкостная труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 48 × Жидкостная труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 48
        }
      ]
    },
    {
      "id": 176,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 5255,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсация: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Конденсация — этап 7/10. Соберите 56 ед. «Жидкостная труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 56 × Жидкостная труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 56
        }
      ]
    },
    {
      "id": 177,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 5255,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсация: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Конденсация — этап 8/10. Соберите 64 ед. «Жидкостная труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 64 × Жидкостная труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 64
        }
      ]
    },
    {
      "id": 178,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5255,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсация: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Конденсация — этап 9/10. Соберите 72 ед. «Жидкостная труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 72 × Жидкостная труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 72
        }
      ]
    },
    {
      "id": 179,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 5255,
      "contentId": "IR-fluid-pipe",
      "title": "Конденсация: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Конденсация — этап 10/10. Соберите 80 ед. «Жидкостная труба» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 80 × Жидкостная труба",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-pipe",
          "itemCount": 80
        }
      ]
    },
    {
      "id": 180,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 5320,
      "contentId": "IR-steam-engine",
      "title": "Насосная станция: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Насосная станция — этап 1/10. Соберите 8 ед. «Поршневая паровая машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 8 × Поршневая паровая машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 181,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 5415,
      "contentId": "IR-steam-engine",
      "title": "Насосная станция: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Насосная станция — этап 2/10. Соберите 16 ед. «Поршневая паровая машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Поршневая паровая машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 182,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 5415,
      "contentId": "IR-steam-engine",
      "title": "Насосная станция: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Насосная станция — этап 3/10. Соберите 24 ед. «Поршневая паровая машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 24 × Поршневая паровая машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 183,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5415,
      "contentId": "IR-steam-engine",
      "title": "Насосная станция: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Насосная станция — этап 4/10. Соберите 32 ед. «Поршневая паровая машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 32 × Поршневая паровая машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 184,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 5415,
      "contentId": "IR-steam-engine",
      "title": "Насосная станция: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Насосная станция — этап 5/10. Соберите 40 ед. «Поршневая паровая машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 40 × Поршневая паровая машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 185,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 5415,
      "contentId": "IR-steam-engine",
      "title": "Насосная станция: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Насосная станция — этап 6/10. Соберите 48 ед. «Поршневая паровая машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 48 × Поршневая паровая машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 48
        }
      ]
    },
    {
      "id": 186,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 5475,
      "contentId": "IR-steam-engine",
      "title": "Насосная станция: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Насосная станция — этап 7/10. Соберите 56 ед. «Поршневая паровая машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 56 × Поршневая паровая машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 56
        }
      ]
    },
    {
      "id": 187,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 5475,
      "contentId": "IR-steam-engine",
      "title": "Насосная станция: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Насосная станция — этап 8/10. Соберите 64 ед. «Поршневая паровая машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 64 × Поршневая паровая машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 64
        }
      ]
    },
    {
      "id": 188,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5475,
      "contentId": "IR-steam-engine",
      "title": "Насосная станция: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Насосная станция — этап 9/10. Соберите 72 ед. «Поршневая паровая машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 72 × Поршневая паровая машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 72
        }
      ]
    },
    {
      "id": 189,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 5475,
      "contentId": "IR-steam-engine",
      "title": "Насосная станция: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Насосная станция — этап 10/10. Соберите 80 ед. «Поршневая паровая машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 80 × Поршневая паровая машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-steam-engine",
          "itemCount": 80
        }
      ]
    },
    {
      "id": 190,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 5540,
      "contentId": "IR-grindingstone",
      "title": "Горное дело: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Горное дело — этап 1/10. Соберите 8 ед. «Шлифовальный камень» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 8 × Шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 191,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 5635,
      "contentId": "IR-grindingstone",
      "title": "Горное дело: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Горное дело — этап 2/10. Соберите 16 ед. «Шлифовальный камень» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 192,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 5635,
      "contentId": "IR-grindingstone",
      "title": "Горное дело: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Горное дело — этап 3/10. Соберите 24 ед. «Шлифовальный камень» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 24 × Шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 193,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5635,
      "contentId": "IR-grindingstone",
      "title": "Горное дело: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Горное дело — этап 4/10. Соберите 32 ед. «Шлифовальный камень» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 32 × Шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 194,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 5635,
      "contentId": "IR-grindingstone",
      "title": "Горное дело: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Горное дело — этап 5/10. Соберите 40 ед. «Шлифовальный камень» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 40 × Шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 195,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 5635,
      "contentId": "IR-grindingstone",
      "title": "Горное дело: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Горное дело — этап 6/10. Соберите 48 ед. «Шлифовальный камень» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 48 × Шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 48
        }
      ]
    },
    {
      "id": 196,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 5695,
      "contentId": "IR-grindingstone",
      "title": "Горное дело: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Горное дело — этап 7/10. Соберите 56 ед. «Шлифовальный камень» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 56 × Шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 56
        }
      ]
    },
    {
      "id": 197,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 5695,
      "contentId": "IR-grindingstone",
      "title": "Горное дело: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Горное дело — этап 8/10. Соберите 64 ед. «Шлифовальный камень» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 64 × Шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 64
        }
      ]
    },
    {
      "id": 198,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5695,
      "contentId": "IR-grindingstone",
      "title": "Горное дело: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Горное дело — этап 9/10. Соберите 72 ед. «Шлифовальный камень» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 72 × Шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 72
        }
      ]
    },
    {
      "id": 199,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 5695,
      "contentId": "IR-grindingstone",
      "title": "Горное дело: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Горное дело — этап 10/10. Соберите 80 ед. «Шлифовальный камень» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 80 × Шлифовальный камень",
          "optional": false,
          "type": "item",
          "itemId": "IR-grindingstone",
          "itemCount": 80
        }
      ]
    },
    {
      "id": 200,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 5760,
      "contentId": "IR-concentrateironore",
      "title": "Рудное обогащение: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Рудное обогащение — этап 1/10. Соберите 8 ед. «Железный концентрат» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 8 × Железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 201,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 5855,
      "contentId": "IR-concentrateironore",
      "title": "Рудное обогащение: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Рудное обогащение — этап 2/10. Соберите 16 ед. «Железный концентрат» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 202,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 5855,
      "contentId": "IR-concentrateironore",
      "title": "Рудное обогащение: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Рудное обогащение — этап 3/10. Соберите 24 ед. «Железный концентрат» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 24 × Железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 203,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5855,
      "contentId": "IR-concentrateironore",
      "title": "Рудное обогащение: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Рудное обогащение — этап 4/10. Соберите 32 ед. «Железный концентрат» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 32 × Железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 204,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 5855,
      "contentId": "IR-concentrateironore",
      "title": "Рудное обогащение: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Рудное обогащение — этап 5/10. Соберите 40 ед. «Железный концентрат» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 40 × Железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 205,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 5855,
      "contentId": "IR-concentrateironore",
      "title": "Рудное обогащение: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Рудное обогащение — этап 6/10. Соберите 48 ед. «Железный концентрат» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 48 × Железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 48
        }
      ]
    },
    {
      "id": 206,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 5915,
      "contentId": "IR-concentrateironore",
      "title": "Рудное обогащение: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Рудное обогащение — этап 7/10. Соберите 56 ед. «Железный концентрат» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 56 × Железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 56
        }
      ]
    },
    {
      "id": 207,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 5915,
      "contentId": "IR-concentrateironore",
      "title": "Рудное обогащение: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Рудное обогащение — этап 8/10. Соберите 64 ед. «Железный концентрат» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 64 × Железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 64
        }
      ]
    },
    {
      "id": 208,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 5915,
      "contentId": "IR-concentrateironore",
      "title": "Рудное обогащение: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Рудное обогащение — этап 9/10. Соберите 72 ед. «Железный концентрат» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 72 × Железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 72
        }
      ]
    },
    {
      "id": 209,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 5915,
      "contentId": "IR-concentrateironore",
      "title": "Рудное обогащение: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Рудное обогащение — этап 10/10. Соберите 80 ед. «Железный концентрат» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 80 × Железный концентрат",
          "optional": false,
          "type": "item",
          "itemId": "IR-concentrateironore",
          "itemCount": 80
        }
      ]
    },
    {
      "id": 210,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 5980,
      "contentId": "IR-copper-ingot",
      "title": "Медная металлургия: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Медная металлургия — этап 1/10. Соберите 8 ед. «Медный слиток» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 8 × Медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 211,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 6075,
      "contentId": "IR-copper-ingot",
      "title": "Медная металлургия: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Медная металлургия — этап 2/10. Соберите 16 ед. «Медный слиток» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 212,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 6075,
      "contentId": "IR-copper-ingot",
      "title": "Медная металлургия: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Медная металлургия — этап 3/10. Соберите 24 ед. «Медный слиток» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 24 × Медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 213,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6075,
      "contentId": "IR-copper-ingot",
      "title": "Медная металлургия: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Медная металлургия — этап 4/10. Соберите 32 ед. «Медный слиток» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 32 × Медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 214,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 6075,
      "contentId": "IR-copper-ingot",
      "title": "Медная металлургия: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Медная металлургия — этап 5/10. Соберите 40 ед. «Медный слиток» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 40 × Медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 215,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 6075,
      "contentId": "IR-copper-ingot",
      "title": "Медная металлургия: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Медная металлургия — этап 6/10. Соберите 48 ед. «Медный слиток» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 48 × Медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 48
        }
      ]
    },
    {
      "id": 216,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 6135,
      "contentId": "IR-copper-ingot",
      "title": "Медная металлургия: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Медная металлургия — этап 7/10. Соберите 56 ед. «Медный слиток» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 56 × Медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 56
        }
      ]
    },
    {
      "id": 217,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 6135,
      "contentId": "IR-copper-ingot",
      "title": "Медная металлургия: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Медная металлургия — этап 8/10. Соберите 64 ед. «Медный слиток» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 64 × Медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 64
        }
      ]
    },
    {
      "id": 218,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6135,
      "contentId": "IR-copper-ingot",
      "title": "Медная металлургия: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Медная металлургия — этап 9/10. Соберите 72 ед. «Медный слиток» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 72 × Медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 72
        }
      ]
    },
    {
      "id": 219,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 6135,
      "contentId": "IR-copper-ingot",
      "title": "Медная металлургия: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Медная металлургия — этап 10/10. Соберите 80 ед. «Медный слиток» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 80 × Медный слиток",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-ingot",
          "itemCount": 80
        }
      ]
    },
    {
      "id": 220,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 6200,
      "contentId": "IR-insulated-wire",
      "title": "Провода и изоляция: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Провода и изоляция — этап 1/10. Соберите 16 ед. «Изолированный провод» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 221,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 6295,
      "contentId": "IR-insulated-wire",
      "title": "Провода и изоляция: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Провода и изоляция — этап 2/10. Соберите 32 ед. «Изолированный провод» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 32 × Изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 222,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 6295,
      "contentId": "IR-insulated-wire",
      "title": "Провода и изоляция: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Провода и изоляция — этап 3/10. Соберите 48 ед. «Изолированный провод» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 48 × Изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 48
        }
      ]
    },
    {
      "id": 223,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6295,
      "contentId": "IR-insulated-wire",
      "title": "Провода и изоляция: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Провода и изоляция — этап 4/10. Соберите 64 ед. «Изолированный провод» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 64 × Изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 64
        }
      ]
    },
    {
      "id": 224,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 6295,
      "contentId": "IR-insulated-wire",
      "title": "Провода и изоляция: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Провода и изоляция — этап 5/10. Соберите 80 ед. «Изолированный провод» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 80 × Изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 80
        }
      ]
    },
    {
      "id": 225,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 6295,
      "contentId": "IR-insulated-wire",
      "title": "Провода и изоляция: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Провода и изоляция — этап 6/10. Соберите 96 ед. «Изолированный провод» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 96 × Изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 96
        }
      ]
    },
    {
      "id": 226,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 6355,
      "contentId": "IR-insulated-wire",
      "title": "Провода и изоляция: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Провода и изоляция — этап 7/10. Соберите 112 ед. «Изолированный провод» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 112 × Изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 112
        }
      ]
    },
    {
      "id": 227,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 6355,
      "contentId": "IR-insulated-wire",
      "title": "Провода и изоляция: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Провода и изоляция — этап 8/10. Соберите 128 ед. «Изолированный провод» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 128 × Изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 128
        }
      ]
    },
    {
      "id": 228,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6355,
      "contentId": "IR-insulated-wire",
      "title": "Провода и изоляция: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Провода и изоляция — этап 9/10. Соберите 144 ед. «Изолированный провод» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 144 × Изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 144
        }
      ]
    },
    {
      "id": 229,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 6355,
      "contentId": "IR-insulated-wire",
      "title": "Провода и изоляция: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Провода и изоляция — этап 10/10. Соберите 160 ед. «Изолированный провод» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 160 × Изолированный провод",
          "optional": false,
          "type": "item",
          "itemId": "IR-insulated-wire",
          "itemCount": 160
        }
      ]
    },
    {
      "id": 230,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 6420,
      "contentId": "IR-copper-coil",
      "title": "Магнитные материалы: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Магнитные материалы — этап 1/10. Соберите 16 ед. «Медная катушка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Медная катушка",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 231,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 6515,
      "contentId": "IR-copper-coil",
      "title": "Магнитные материалы: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Магнитные материалы — этап 2/10. Соберите 32 ед. «Медная катушка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 32 × Медная катушка",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 232,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 6515,
      "contentId": "IR-copper-coil",
      "title": "Магнитные материалы: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Магнитные материалы — этап 3/10. Соберите 48 ед. «Медная катушка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 48 × Медная катушка",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 48
        }
      ]
    },
    {
      "id": 233,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6515,
      "contentId": "IR-copper-coil",
      "title": "Магнитные материалы: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Магнитные материалы — этап 4/10. Соберите 64 ед. «Медная катушка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 64 × Медная катушка",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 64
        }
      ]
    },
    {
      "id": 234,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 6515,
      "contentId": "IR-copper-coil",
      "title": "Магнитные материалы: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Магнитные материалы — этап 5/10. Соберите 80 ед. «Медная катушка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 80 × Медная катушка",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 80
        }
      ]
    },
    {
      "id": 235,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 6515,
      "contentId": "IR-copper-coil",
      "title": "Магнитные материалы: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Магнитные материалы — этап 6/10. Соберите 96 ед. «Медная катушка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 96 × Медная катушка",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 96
        }
      ]
    },
    {
      "id": 236,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 6575,
      "contentId": "IR-copper-coil",
      "title": "Магнитные материалы: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Магнитные материалы — этап 7/10. Соберите 112 ед. «Медная катушка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 112 × Медная катушка",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 112
        }
      ]
    },
    {
      "id": 237,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 6575,
      "contentId": "IR-copper-coil",
      "title": "Магнитные материалы: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Магнитные материалы — этап 8/10. Соберите 128 ед. «Медная катушка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 128 × Медная катушка",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 128
        }
      ]
    },
    {
      "id": 238,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6575,
      "contentId": "IR-copper-coil",
      "title": "Магнитные материалы: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Магнитные материалы — этап 9/10. Соберите 144 ед. «Медная катушка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 144 × Медная катушка",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 144
        }
      ]
    },
    {
      "id": 239,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 6575,
      "contentId": "IR-copper-coil",
      "title": "Магнитные материалы: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Магнитные материалы — этап 10/10. Соберите 160 ед. «Медная катушка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 160 × Медная катушка",
          "optional": false,
          "type": "item",
          "itemId": "IR-copper-coil",
          "itemCount": 160
        }
      ]
    },
    {
      "id": 240,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 6640,
      "contentId": "IR-dynamo",
      "title": "Динамо-машина: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Динамо-машина — этап 1/10. Соберите 8 ед. «Динамо-машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 8 × Динамо-машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 241,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 6735,
      "contentId": "IR-dynamo",
      "title": "Динамо-машина: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Динамо-машина — этап 2/10. Соберите 16 ед. «Динамо-машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Динамо-машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 242,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 6735,
      "contentId": "IR-dynamo",
      "title": "Динамо-машина: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Динамо-машина — этап 3/10. Соберите 24 ед. «Динамо-машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 24 × Динамо-машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 243,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6735,
      "contentId": "IR-dynamo",
      "title": "Динамо-машина: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Динамо-машина — этап 4/10. Соберите 32 ед. «Динамо-машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 32 × Динамо-машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 244,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 6735,
      "contentId": "IR-dynamo",
      "title": "Динамо-машина: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Динамо-машина — этап 5/10. Соберите 40 ед. «Динамо-машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 40 × Динамо-машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 245,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 6735,
      "contentId": "IR-dynamo",
      "title": "Динамо-машина: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Динамо-машина — этап 6/10. Соберите 48 ед. «Динамо-машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 48 × Динамо-машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 48
        }
      ]
    },
    {
      "id": 246,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 6795,
      "contentId": "IR-dynamo",
      "title": "Динамо-машина: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Динамо-машина — этап 7/10. Соберите 56 ед. «Динамо-машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 56 × Динамо-машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 56
        }
      ]
    },
    {
      "id": 247,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 6795,
      "contentId": "IR-dynamo",
      "title": "Динамо-машина: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Динамо-машина — этап 8/10. Соберите 64 ед. «Динамо-машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 64 × Динамо-машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 64
        }
      ]
    },
    {
      "id": 248,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6795,
      "contentId": "IR-dynamo",
      "title": "Динамо-машина: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Динамо-машина — этап 9/10. Соберите 72 ед. «Динамо-машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 72 × Динамо-машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 72
        }
      ]
    },
    {
      "id": 249,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 6795,
      "contentId": "IR-dynamo",
      "title": "Динамо-машина: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Динамо-машина — этап 10/10. Соберите 80 ед. «Динамо-машина» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 80 × Динамо-машина",
          "optional": false,
          "type": "item",
          "itemId": "IR-dynamo",
          "itemCount": 80
        }
      ]
    },
    {
      "id": 250,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 6860,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимия: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Электрохимия — этап 1/10. Соберите 12 ед. «Гальванический элемент» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 12 × Гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 251,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 6955,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимия: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Электрохимия — этап 2/10. Соберите 24 ед. «Гальванический элемент» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 24 × Гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 252,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 6955,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимия: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Электрохимия — этап 3/10. Соберите 36 ед. «Гальванический элемент» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 36 × Гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 36
        }
      ]
    },
    {
      "id": 253,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 6955,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимия: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Электрохимия — этап 4/10. Соберите 48 ед. «Гальванический элемент» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 48 × Гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 48
        }
      ]
    },
    {
      "id": 254,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 6955,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимия: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Электрохимия — этап 5/10. Соберите 60 ед. «Гальванический элемент» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 60 × Гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 60
        }
      ]
    },
    {
      "id": 255,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 6955,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимия: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Электрохимия — этап 6/10. Соберите 72 ед. «Гальванический элемент» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 72 × Гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 72
        }
      ]
    },
    {
      "id": 256,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7015,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимия: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Электрохимия — этап 7/10. Соберите 84 ед. «Гальванический элемент» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 84 × Гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 84
        }
      ]
    },
    {
      "id": 257,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 7015,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимия: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Электрохимия — этап 8/10. Соберите 96 ед. «Гальванический элемент» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 96 × Гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 96
        }
      ]
    },
    {
      "id": 258,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7015,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимия: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Электрохимия — этап 9/10. Соберите 108 ед. «Гальванический элемент» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 108 × Гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 108
        }
      ]
    },
    {
      "id": 259,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 7015,
      "contentId": "IR-galvanic-cell",
      "title": "Электрохимия: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Электрохимия — этап 10/10. Соберите 120 ед. «Гальванический элемент» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 120 × Гальванический элемент",
          "optional": false,
          "type": "item",
          "itemId": "IR-galvanic-cell",
          "itemCount": 120
        }
      ]
    },
    {
      "id": 260,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 7080,
      "contentId": "IR-coke",
      "title": "Угольная химия: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Угольная химия — этап 1/10. Соберите 12 ед. «Кокс» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 12 × Кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 261,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7175,
      "contentId": "IR-coke",
      "title": "Угольная химия: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Угольная химия — этап 2/10. Соберите 24 ед. «Кокс» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 24 × Кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 262,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 7175,
      "contentId": "IR-coke",
      "title": "Угольная химия: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Угольная химия — этап 3/10. Соберите 36 ед. «Кокс» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 36 × Кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 36
        }
      ]
    },
    {
      "id": 263,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7175,
      "contentId": "IR-coke",
      "title": "Угольная химия: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Угольная химия — этап 4/10. Соберите 48 ед. «Кокс» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 48 × Кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 48
        }
      ]
    },
    {
      "id": 264,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 7175,
      "contentId": "IR-coke",
      "title": "Угольная химия: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Угольная химия — этап 5/10. Соберите 60 ед. «Кокс» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 60 × Кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 60
        }
      ]
    },
    {
      "id": 265,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 7175,
      "contentId": "IR-coke",
      "title": "Угольная химия: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Угольная химия — этап 6/10. Соберите 72 ед. «Кокс» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 72 × Кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 72
        }
      ]
    },
    {
      "id": 266,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7235,
      "contentId": "IR-coke",
      "title": "Угольная химия: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Угольная химия — этап 7/10. Соберите 84 ед. «Кокс» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 84 × Кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 84
        }
      ]
    },
    {
      "id": 267,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 7235,
      "contentId": "IR-coke",
      "title": "Угольная химия: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Угольная химия — этап 8/10. Соберите 96 ед. «Кокс» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 96 × Кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 96
        }
      ]
    },
    {
      "id": 268,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7235,
      "contentId": "IR-coke",
      "title": "Угольная химия: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Угольная химия — этап 9/10. Соберите 108 ед. «Кокс» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 108 × Кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 108
        }
      ]
    },
    {
      "id": 269,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 7235,
      "contentId": "IR-coke",
      "title": "Угольная химия: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Угольная химия — этап 10/10. Соберите 120 ед. «Кокс» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 120 × Кокс",
          "optional": false,
          "type": "item",
          "itemId": "IR-coke",
          "itemCount": 120
        }
      ]
    },
    {
      "id": 270,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 7300,
      "contentId": "IR-ceramic-insulator",
      "title": "Изоляционные материалы: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Изоляционные материалы — этап 1/10. Соберите 12 ед. «Керамический изолятор» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 12 × Керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 271,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7395,
      "contentId": "IR-ceramic-insulator",
      "title": "Изоляционные материалы: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Изоляционные материалы — этап 2/10. Соберите 24 ед. «Керамический изолятор» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 24 × Керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 272,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 7395,
      "contentId": "IR-ceramic-insulator",
      "title": "Изоляционные материалы: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Изоляционные материалы — этап 3/10. Соберите 36 ед. «Керамический изолятор» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 36 × Керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 36
        }
      ]
    },
    {
      "id": 273,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7395,
      "contentId": "IR-ceramic-insulator",
      "title": "Изоляционные материалы: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Изоляционные материалы — этап 4/10. Соберите 48 ед. «Керамический изолятор» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 48 × Керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 48
        }
      ]
    },
    {
      "id": 274,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 7395,
      "contentId": "IR-ceramic-insulator",
      "title": "Изоляционные материалы: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Изоляционные материалы — этап 5/10. Соберите 60 ед. «Керамический изолятор» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 60 × Керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 60
        }
      ]
    },
    {
      "id": 275,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 7395,
      "contentId": "IR-ceramic-insulator",
      "title": "Изоляционные материалы: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Изоляционные материалы — этап 6/10. Соберите 72 ед. «Керамический изолятор» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 72 × Керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 72
        }
      ]
    },
    {
      "id": 276,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7455,
      "contentId": "IR-ceramic-insulator",
      "title": "Изоляционные материалы: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Изоляционные материалы — этап 7/10. Соберите 84 ед. «Керамический изолятор» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 84 × Керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 84
        }
      ]
    },
    {
      "id": 277,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 7455,
      "contentId": "IR-ceramic-insulator",
      "title": "Изоляционные материалы: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Изоляционные материалы — этап 8/10. Соберите 96 ед. «Керамический изолятор» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 96 × Керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 96
        }
      ]
    },
    {
      "id": 278,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7455,
      "contentId": "IR-ceramic-insulator",
      "title": "Изоляционные материалы: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Изоляционные материалы — этап 9/10. Соберите 108 ед. «Керамический изолятор» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 108 × Керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 108
        }
      ]
    },
    {
      "id": 279,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 7455,
      "contentId": "IR-ceramic-insulator",
      "title": "Изоляционные материалы: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Изоляционные материалы — этап 10/10. Соберите 120 ед. «Керамический изолятор» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 120 × Керамический изолятор",
          "optional": false,
          "type": "item",
          "itemId": "IR-ceramic-insulator",
          "itemCount": 120
        }
      ]
    },
    {
      "id": 280,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 7520,
      "contentId": "IR-terminal-block",
      "title": "Точная механика: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Точная механика — этап 1/10. Соберите 8 ед. «Клеммная колодка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 8 × Клеммная колодка",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 281,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7615,
      "contentId": "IR-terminal-block",
      "title": "Точная механика: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Точная механика — этап 2/10. Соберите 16 ед. «Клеммная колодка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Клеммная колодка",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 282,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 7615,
      "contentId": "IR-terminal-block",
      "title": "Точная механика: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Точная механика — этап 3/10. Соберите 24 ед. «Клеммная колодка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 24 × Клеммная колодка",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 24
        }
      ]
    },
    {
      "id": 283,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7615,
      "contentId": "IR-terminal-block",
      "title": "Точная механика: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Точная механика — этап 4/10. Соберите 32 ед. «Клеммная колодка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 32 × Клеммная колодка",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 284,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 7615,
      "contentId": "IR-terminal-block",
      "title": "Точная механика: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Точная механика — этап 5/10. Соберите 40 ед. «Клеммная колодка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 40 × Клеммная колодка",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 40
        }
      ]
    },
    {
      "id": 285,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 7615,
      "contentId": "IR-terminal-block",
      "title": "Точная механика: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Точная механика — этап 6/10. Соберите 48 ед. «Клеммная колодка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 48 × Клеммная колодка",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 48
        }
      ]
    },
    {
      "id": 286,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7675,
      "contentId": "IR-terminal-block",
      "title": "Точная механика: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Точная механика — этап 7/10. Соберите 56 ед. «Клеммная колодка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 56 × Клеммная колодка",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 56
        }
      ]
    },
    {
      "id": 287,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 7675,
      "contentId": "IR-terminal-block",
      "title": "Точная механика: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Точная механика — этап 8/10. Соберите 64 ед. «Клеммная колодка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 64 × Клеммная колодка",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 64
        }
      ]
    },
    {
      "id": 288,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7675,
      "contentId": "IR-terminal-block",
      "title": "Точная механика: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Точная механика — этап 9/10. Соберите 72 ед. «Клеммная колодка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 72 × Клеммная колодка",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 72
        }
      ]
    },
    {
      "id": 289,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 7675,
      "contentId": "IR-terminal-block",
      "title": "Точная механика: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Точная механика — этап 10/10. Соберите 80 ед. «Клеммная колодка» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 80 × Клеммная колодка",
          "optional": false,
          "type": "item",
          "itemId": "IR-terminal-block",
          "itemCount": 80
        }
      ]
    },
    {
      "id": 290,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 7740,
      "contentId": "IR-circuit-board",
      "title": "Лаборатория измерений: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Лаборатория измерений — этап 1/10. Соберите 2 ед. «Плата схемы» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 2 × Плата схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 2
        }
      ]
    },
    {
      "id": 291,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7835,
      "contentId": "IR-circuit-board",
      "title": "Лаборатория измерений: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лаборатория измерений — этап 2/10. Соберите 4 ед. «Плата схемы» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 4 × Плата схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 4
        }
      ]
    },
    {
      "id": 292,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 7835,
      "contentId": "IR-circuit-board",
      "title": "Лаборатория измерений: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лаборатория измерений — этап 3/10. Соберите 6 ед. «Плата схемы» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 6 × Плата схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 6
        }
      ]
    },
    {
      "id": 293,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7835,
      "contentId": "IR-circuit-board",
      "title": "Лаборатория измерений: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лаборатория измерений — этап 4/10. Соберите 8 ед. «Плата схемы» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 8 × Плата схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 8
        }
      ]
    },
    {
      "id": 294,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 7835,
      "contentId": "IR-circuit-board",
      "title": "Лаборатория измерений: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лаборатория измерений — этап 5/10. Соберите 10 ед. «Плата схемы» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 10 × Плата схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 10
        }
      ]
    },
    {
      "id": 295,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 7835,
      "contentId": "IR-circuit-board",
      "title": "Лаборатория измерений: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лаборатория измерений — этап 6/10. Соберите 12 ед. «Плата схемы» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 12 × Плата схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 12
        }
      ]
    },
    {
      "id": 296,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 7895,
      "contentId": "IR-circuit-board",
      "title": "Лаборатория измерений: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лаборатория измерений — этап 7/10. Соберите 14 ед. «Плата схемы» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 14 × Плата схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 14
        }
      ]
    },
    {
      "id": 297,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 7895,
      "contentId": "IR-circuit-board",
      "title": "Лаборатория измерений: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лаборатория измерений — этап 8/10. Соберите 16 ед. «Плата схемы» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Плата схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 298,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 7895,
      "contentId": "IR-circuit-board",
      "title": "Лаборатория измерений: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лаборатория измерений — этап 9/10. Соберите 18 ед. «Плата схемы» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 18 × Плата схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 18
        }
      ]
    },
    {
      "id": 299,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 7895,
      "contentId": "IR-circuit-board",
      "title": "Лаборатория измерений: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Лаборатория измерений — этап 10/10. Соберите 20 ед. «Плата схемы» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 20 × Плата схемы",
          "optional": false,
          "type": "item",
          "itemId": "IR-circuit-board",
          "itemCount": 20
        }
      ]
    },
    {
      "id": 300,
      "radius": 24,
      "shape": "star",
      "iconUrl": "",
      "x": 440,
      "y": 7960,
      "contentId": "IR-first-circuit",
      "title": "Первые электросхемы: Материальный баланс",
      "subtitle": "Основной этап",
      "description": "Первые электросхемы — этап 1/10. Соберите 16 ед. «Первая электросхема» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 16 × Первая электросхема",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 16
        }
      ]
    },
    {
      "id": 301,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 8055,
      "contentId": "IR-first-circuit",
      "title": "Первые электросхемы: Подготовка оснастки",
      "subtitle": "Дополнительная производственная задача",
      "description": "Первые электросхемы — этап 2/10. Соберите 32 ед. «Первая электросхема» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 32 × Первая электросхема",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 32
        }
      ]
    },
    {
      "id": 302,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 8055,
      "contentId": "IR-first-circuit",
      "title": "Первые электросхемы: Контроль чистоты",
      "subtitle": "Дополнительная производственная задача",
      "description": "Первые электросхемы — этап 3/10. Соберите 48 ед. «Первая электросхема» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 48 × Первая электросхема",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 48
        }
      ]
    },
    {
      "id": 303,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 8055,
      "contentId": "IR-first-circuit",
      "title": "Первые электросхемы: Тепловой расчёт",
      "subtitle": "Дополнительная производственная задача",
      "description": "Первые электросхемы — этап 4/10. Соберите 64 ед. «Первая электросхема» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 64 × Первая электросхема",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 64
        }
      ]
    },
    {
      "id": 304,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 8055,
      "contentId": "IR-first-circuit",
      "title": "Первые электросхемы: Проверка давления",
      "subtitle": "Дополнительная производственная задача",
      "description": "Первые электросхемы — этап 5/10. Соберите 80 ед. «Первая электросхема» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 80 × Первая электросхема",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 80
        }
      ]
    },
    {
      "id": 305,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 760,
      "y": 8055,
      "contentId": "IR-first-circuit",
      "title": "Первые электросхемы: Серия деталей",
      "subtitle": "Дополнительная производственная задача",
      "description": "Первые электросхемы — этап 6/10. Соберите 96 ед. «Первая электросхема» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 96 × Первая электросхема",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 96
        }
      ]
    },
    {
      "id": 306,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 120,
      "y": 8115,
      "contentId": "IR-first-circuit",
      "title": "Первые электросхемы: Резервный комплект",
      "subtitle": "Дополнительная производственная задача",
      "description": "Первые электросхемы — этап 7/10. Соберите 112 ед. «Первая электросхема» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 112 × Первая электросхема",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 112
        }
      ]
    },
    {
      "id": 307,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 280,
      "y": 8115,
      "contentId": "IR-first-circuit",
      "title": "Первые электросхемы: Контроль допуска",
      "subtitle": "Дополнительная производственная задача",
      "description": "Первые электросхемы — этап 8/10. Соберите 128 ед. «Первая электросхема» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 128 × Первая электросхема",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 128
        }
      ]
    },
    {
      "id": 308,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 440,
      "y": 8115,
      "contentId": "IR-first-circuit",
      "title": "Первые электросхемы: Нагрузка стенда",
      "subtitle": "Дополнительная производственная задача",
      "description": "Первые электросхемы — этап 9/10. Соберите 144 ед. «Первая электросхема» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 144 × Первая электросхема",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 144
        }
      ]
    },
    {
      "id": 309,
      "radius": 17,
      "shape": "circle",
      "iconUrl": "",
      "x": 600,
      "y": 8115,
      "contentId": "IR-first-circuit",
      "title": "Первые электросхемы: Закрытие этапа",
      "subtitle": "Дополнительная производственная задача",
      "description": "Первые электросхемы — этап 10/10. Соберите 160 ед. «Первая электросхема» и подтвердите, что технологическая цепочка работает серийно. В расчёте учитывайте материальный баланс, тепловые потери и запас прочности; это обязательная проверяемая производственная задача, а не справочная карточка.",
      "tasks": [
        {
          "text": "Изготовить 160 × Первая электросхема",
          "optional": false,
          "type": "item",
          "itemId": "IR-first-circuit",
          "itemCount": 160
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
      "from": 100,
      "to": 101
    },
    {
      "from": 100,
      "to": 102
    },
    {
      "from": 100,
      "to": 103
    },
    {
      "from": 100,
      "to": 104
    },
    {
      "from": 100,
      "to": 105
    },
    {
      "from": 100,
      "to": 106
    },
    {
      "from": 100,
      "to": 107
    },
    {
      "from": 100,
      "to": 108
    },
    {
      "from": 100,
      "to": 109
    },
    {
      "from": 99,
      "to": 100
    },
    {
      "from": 110,
      "to": 111
    },
    {
      "from": 110,
      "to": 112
    },
    {
      "from": 110,
      "to": 113
    },
    {
      "from": 110,
      "to": 114
    },
    {
      "from": 110,
      "to": 115
    },
    {
      "from": 110,
      "to": 116
    },
    {
      "from": 110,
      "to": 117
    },
    {
      "from": 110,
      "to": 118
    },
    {
      "from": 110,
      "to": 119
    },
    {
      "from": 109,
      "to": 110
    },
    {
      "from": 120,
      "to": 121
    },
    {
      "from": 120,
      "to": 122
    },
    {
      "from": 120,
      "to": 123
    },
    {
      "from": 120,
      "to": 124
    },
    {
      "from": 120,
      "to": 125
    },
    {
      "from": 120,
      "to": 126
    },
    {
      "from": 120,
      "to": 127
    },
    {
      "from": 120,
      "to": 128
    },
    {
      "from": 120,
      "to": 129
    },
    {
      "from": 119,
      "to": 120
    },
    {
      "from": 130,
      "to": 131
    },
    {
      "from": 130,
      "to": 132
    },
    {
      "from": 130,
      "to": 133
    },
    {
      "from": 130,
      "to": 134
    },
    {
      "from": 130,
      "to": 135
    },
    {
      "from": 130,
      "to": 136
    },
    {
      "from": 130,
      "to": 137
    },
    {
      "from": 130,
      "to": 138
    },
    {
      "from": 130,
      "to": 139
    },
    {
      "from": 129,
      "to": 130
    },
    {
      "from": 140,
      "to": 141
    },
    {
      "from": 140,
      "to": 142
    },
    {
      "from": 140,
      "to": 143
    },
    {
      "from": 140,
      "to": 144
    },
    {
      "from": 140,
      "to": 145
    },
    {
      "from": 140,
      "to": 146
    },
    {
      "from": 140,
      "to": 147
    },
    {
      "from": 140,
      "to": 148
    },
    {
      "from": 140,
      "to": 149
    },
    {
      "from": 139,
      "to": 140
    },
    {
      "from": 150,
      "to": 151
    },
    {
      "from": 150,
      "to": 152
    },
    {
      "from": 150,
      "to": 153
    },
    {
      "from": 150,
      "to": 154
    },
    {
      "from": 150,
      "to": 155
    },
    {
      "from": 150,
      "to": 156
    },
    {
      "from": 150,
      "to": 157
    },
    {
      "from": 150,
      "to": 158
    },
    {
      "from": 150,
      "to": 159
    },
    {
      "from": 149,
      "to": 150
    },
    {
      "from": 160,
      "to": 161
    },
    {
      "from": 160,
      "to": 162
    },
    {
      "from": 160,
      "to": 163
    },
    {
      "from": 160,
      "to": 164
    },
    {
      "from": 160,
      "to": 165
    },
    {
      "from": 160,
      "to": 166
    },
    {
      "from": 160,
      "to": 167
    },
    {
      "from": 160,
      "to": 168
    },
    {
      "from": 160,
      "to": 169
    },
    {
      "from": 159,
      "to": 160
    },
    {
      "from": 170,
      "to": 171
    },
    {
      "from": 170,
      "to": 172
    },
    {
      "from": 170,
      "to": 173
    },
    {
      "from": 170,
      "to": 174
    },
    {
      "from": 170,
      "to": 175
    },
    {
      "from": 170,
      "to": 176
    },
    {
      "from": 170,
      "to": 177
    },
    {
      "from": 170,
      "to": 178
    },
    {
      "from": 170,
      "to": 179
    },
    {
      "from": 169,
      "to": 170
    },
    {
      "from": 180,
      "to": 181
    },
    {
      "from": 180,
      "to": 182
    },
    {
      "from": 180,
      "to": 183
    },
    {
      "from": 180,
      "to": 184
    },
    {
      "from": 180,
      "to": 185
    },
    {
      "from": 180,
      "to": 186
    },
    {
      "from": 180,
      "to": 187
    },
    {
      "from": 180,
      "to": 188
    },
    {
      "from": 180,
      "to": 189
    },
    {
      "from": 179,
      "to": 180
    },
    {
      "from": 190,
      "to": 191
    },
    {
      "from": 190,
      "to": 192
    },
    {
      "from": 190,
      "to": 193
    },
    {
      "from": 190,
      "to": 194
    },
    {
      "from": 190,
      "to": 195
    },
    {
      "from": 190,
      "to": 196
    },
    {
      "from": 190,
      "to": 197
    },
    {
      "from": 190,
      "to": 198
    },
    {
      "from": 190,
      "to": 199
    },
    {
      "from": 189,
      "to": 190
    },
    {
      "from": 200,
      "to": 201
    },
    {
      "from": 200,
      "to": 202
    },
    {
      "from": 200,
      "to": 203
    },
    {
      "from": 200,
      "to": 204
    },
    {
      "from": 200,
      "to": 205
    },
    {
      "from": 200,
      "to": 206
    },
    {
      "from": 200,
      "to": 207
    },
    {
      "from": 200,
      "to": 208
    },
    {
      "from": 200,
      "to": 209
    },
    {
      "from": 199,
      "to": 200
    },
    {
      "from": 210,
      "to": 211
    },
    {
      "from": 210,
      "to": 212
    },
    {
      "from": 210,
      "to": 213
    },
    {
      "from": 210,
      "to": 214
    },
    {
      "from": 210,
      "to": 215
    },
    {
      "from": 210,
      "to": 216
    },
    {
      "from": 210,
      "to": 217
    },
    {
      "from": 210,
      "to": 218
    },
    {
      "from": 210,
      "to": 219
    },
    {
      "from": 209,
      "to": 210
    },
    {
      "from": 220,
      "to": 221
    },
    {
      "from": 220,
      "to": 222
    },
    {
      "from": 220,
      "to": 223
    },
    {
      "from": 220,
      "to": 224
    },
    {
      "from": 220,
      "to": 225
    },
    {
      "from": 220,
      "to": 226
    },
    {
      "from": 220,
      "to": 227
    },
    {
      "from": 220,
      "to": 228
    },
    {
      "from": 220,
      "to": 229
    },
    {
      "from": 219,
      "to": 220
    },
    {
      "from": 230,
      "to": 231
    },
    {
      "from": 230,
      "to": 232
    },
    {
      "from": 230,
      "to": 233
    },
    {
      "from": 230,
      "to": 234
    },
    {
      "from": 230,
      "to": 235
    },
    {
      "from": 230,
      "to": 236
    },
    {
      "from": 230,
      "to": 237
    },
    {
      "from": 230,
      "to": 238
    },
    {
      "from": 230,
      "to": 239
    },
    {
      "from": 229,
      "to": 230
    },
    {
      "from": 240,
      "to": 241
    },
    {
      "from": 240,
      "to": 242
    },
    {
      "from": 240,
      "to": 243
    },
    {
      "from": 240,
      "to": 244
    },
    {
      "from": 240,
      "to": 245
    },
    {
      "from": 240,
      "to": 246
    },
    {
      "from": 240,
      "to": 247
    },
    {
      "from": 240,
      "to": 248
    },
    {
      "from": 240,
      "to": 249
    },
    {
      "from": 239,
      "to": 240
    },
    {
      "from": 250,
      "to": 251
    },
    {
      "from": 250,
      "to": 252
    },
    {
      "from": 250,
      "to": 253
    },
    {
      "from": 250,
      "to": 254
    },
    {
      "from": 250,
      "to": 255
    },
    {
      "from": 250,
      "to": 256
    },
    {
      "from": 250,
      "to": 257
    },
    {
      "from": 250,
      "to": 258
    },
    {
      "from": 250,
      "to": 259
    },
    {
      "from": 249,
      "to": 250
    },
    {
      "from": 260,
      "to": 261
    },
    {
      "from": 260,
      "to": 262
    },
    {
      "from": 260,
      "to": 263
    },
    {
      "from": 260,
      "to": 264
    },
    {
      "from": 260,
      "to": 265
    },
    {
      "from": 260,
      "to": 266
    },
    {
      "from": 260,
      "to": 267
    },
    {
      "from": 260,
      "to": 268
    },
    {
      "from": 260,
      "to": 269
    },
    {
      "from": 259,
      "to": 260
    },
    {
      "from": 270,
      "to": 271
    },
    {
      "from": 270,
      "to": 272
    },
    {
      "from": 270,
      "to": 273
    },
    {
      "from": 270,
      "to": 274
    },
    {
      "from": 270,
      "to": 275
    },
    {
      "from": 270,
      "to": 276
    },
    {
      "from": 270,
      "to": 277
    },
    {
      "from": 270,
      "to": 278
    },
    {
      "from": 270,
      "to": 279
    },
    {
      "from": 269,
      "to": 270
    },
    {
      "from": 280,
      "to": 281
    },
    {
      "from": 280,
      "to": 282
    },
    {
      "from": 280,
      "to": 283
    },
    {
      "from": 280,
      "to": 284
    },
    {
      "from": 280,
      "to": 285
    },
    {
      "from": 280,
      "to": 286
    },
    {
      "from": 280,
      "to": 287
    },
    {
      "from": 280,
      "to": 288
    },
    {
      "from": 280,
      "to": 289
    },
    {
      "from": 279,
      "to": 280
    },
    {
      "from": 290,
      "to": 291
    },
    {
      "from": 290,
      "to": 292
    },
    {
      "from": 290,
      "to": 293
    },
    {
      "from": 290,
      "to": 294
    },
    {
      "from": 290,
      "to": 295
    },
    {
      "from": 290,
      "to": 296
    },
    {
      "from": 290,
      "to": 297
    },
    {
      "from": 290,
      "to": 298
    },
    {
      "from": 290,
      "to": 299
    },
    {
      "from": 289,
      "to": 290
    },
    {
      "from": 300,
      "to": 301
    },
    {
      "from": 300,
      "to": 302
    },
    {
      "from": 300,
      "to": 303
    },
    {
      "from": 300,
      "to": 304
    },
    {
      "from": 300,
      "to": 305
    },
    {
      "from": 300,
      "to": 306
    },
    {
      "from": 300,
      "to": 307
    },
    {
      "from": 300,
      "to": 308
    },
    {
      "from": 300,
      "to": 309
    },
    {
      "from": 299,
      "to": 300
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
    minZoom: 0.45,
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
