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
