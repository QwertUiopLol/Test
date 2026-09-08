// New key prevents legacy progress from completing unrelated quests after the line redesign.
const QUEST_PROGRESS_KEY = 'ir-quest-progress-v2';
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
      "radius": 22,
      "shape": "6",
      "iconUrl": "",
      "x": 130,
      "y": 110,
      "contentId": "IR-workbench",
      "title": "Первый верстак",
      "subtitle": "Основа мастерской",
      "description": "Соберите верстак — с него начинается осмысленное производство.",
      "tasks": [
        {
          "text": "Изготовить: Верстак",
          "optional": false,
          "type": "item",
          "itemId": "IR-workbench",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 2,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 350,
      "y": 110,
      "contentId": "IR-mixer",
      "title": "Мельница-смеситель",
      "subtitle": "Подготовка материалов",
      "description": "Поставьте мельницу-смеситель: она соединяет ручной сбор ресурсов с первичной обработкой.",
      "tasks": [
        {
          "text": "Изготовить: Мельница-смеситель",
          "optional": false,
          "type": "item",
          "itemId": "IR-mixer",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 3,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 570,
      "y": 110,
      "contentId": "IR-apebble",
      "title": "Первые минералы",
      "subtitle": "Просеивание земли",
      "description": "Добудьте андезитовый камешек просеиванием открытой земли. Это первый материал для технологической цепочки.",
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
      "id": 4,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 790,
      "y": 110,
      "contentId": "IR-limepowder",
      "title": "Известковый порошок",
      "subtitle": "Минеральная основа",
      "description": "Подготовьте известковый порошок для стекла, огнеупоров и дальнейшей металлургии.",
      "tasks": [
        {
          "text": "Изготовить: Известковый порошок",
          "optional": false,
          "type": "item",
          "itemId": "IR-limepowder",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 5,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 790,
      "y": 255,
      "contentId": "IR-kiln",
      "title": "Печь обжига",
      "subtitle": "Первая температура",
      "description": "Соберите печь обжига. Она открывает термическую обработку материалов.",
      "tasks": [
        {
          "text": "Изготовить: Печь обжига",
          "optional": false,
          "type": "item",
          "itemId": "IR-kiln",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 6,
      "radius": 22,
      "shape": "6",
      "iconUrl": "",
      "x": 570,
      "y": 255,
      "contentId": "IR-capsule-1000",
      "title": "Стеклянная капсула",
      "subtitle": "Хранение жидкости",
      "description": "Получите пустую стеклянную капсулу — безопасную тару для жидких реагентов.",
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
      "id": 7,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 350,
      "y": 255,
      "contentId": "IR-capsule-1000-water",
      "title": "Капсула воды",
      "subtitle": "Первый реагент",
      "description": "Наполните капсулу водой. Жидкости будут нужны для промывки и биотехнологической ветки.",
      "tasks": [
        {
          "text": "Изготовить: Капсула воды",
          "optional": false,
          "type": "item",
          "itemId": "IR-capsule-1000-water",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 8,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 130,
      "y": 255,
      "contentId": "IR-fluid-extractor",
      "title": "Экстрактор жидкости",
      "subtitle": "Работа с жидкостями",
      "description": "Соберите экстрактор, чтобы наладить контролируемое получение жидкостей.",
      "tasks": [
        {
          "text": "Изготовить: Экстрактор жидкости",
          "optional": false,
          "type": "item",
          "itemId": "IR-fluid-extractor",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 9,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 130,
      "y": 400,
      "contentId": "IR-ashlye",
      "title": "Зольный щёлок",
      "subtitle": "Щёлочной реагент",
      "description": "Приготовьте зольный щёлок — базовый реагент для следующей химической стадии.",
      "tasks": [
        {
          "text": "Изготовить: Зольный щёлок",
          "optional": false,
          "type": "item",
          "itemId": "IR-ashlye",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 10,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 350,
      "y": 400,
      "contentId": "IR-autoclave",
      "title": "Автоклав",
      "subtitle": "Стерильная обработка",
      "description": "Соберите автоклав для чистой и повторяемой обработки материалов.",
      "tasks": [
        {
          "text": "Изготовить: Автоклав",
          "optional": false,
          "type": "item",
          "itemId": "IR-autoclave",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 11,
      "radius": 22,
      "shape": "6",
      "iconUrl": "",
      "x": 570,
      "y": 400,
      "contentId": "IR-bioreactor",
      "title": "Биореактор",
      "subtitle": "Выращивание основы",
      "description": "Постройте биореактор: он превращает подготовленные реагенты в биологические материалы.",
      "tasks": [
        {
          "text": "Изготовить: Биореактор",
          "optional": false,
          "type": "item",
          "itemId": "IR-bioreactor",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 12,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 790,
      "y": 400,
      "contentId": "IR-sapling",
      "title": "Синтетический саженец",
      "subtitle": "Возобновляемая древесина",
      "description": "Создайте синтетический саженец дуба — источник древесины и будущего топлива.",
      "tasks": [
        {
          "text": "Изготовить: Синтетический саженец дуба",
          "optional": false,
          "type": "item",
          "itemId": "IR-sapling",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 13,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 790,
      "y": 545,
      "contentId": "IR-quernstone",
      "title": "Жернов",
      "subtitle": "Дробление руды",
      "description": "Соберите жернов для подготовки сырой руды к промывке.",
      "tasks": [
        {
          "text": "Изготовить: Жернов",
          "optional": false,
          "type": "item",
          "itemId": "IR-quernstone",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 14,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 570,
      "y": 545,
      "contentId": "IR-bogironore",
      "title": "Железная руда",
      "subtitle": "Поиск железа",
      "description": "Добудьте болотную железную руду. Другие виды руды — альтернативные источники, а не отдельные обязательные квесты.",
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
      "id": 15,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 350,
      "y": 545,
      "contentId": "IR-crushedbogiron",
      "title": "Дроблёная руда",
      "subtitle": "Подготовка сырья",
      "description": "Раздробите руду на жернове: мелкая фракция лучше поддаётся обогащению.",
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
      "id": 16,
      "radius": 22,
      "shape": "6",
      "iconUrl": "",
      "x": 130,
      "y": 545,
      "contentId": "IR-sluicebox",
      "title": "Промывочный лоток",
      "subtitle": "Обогащение",
      "description": "Соберите промывочный лоток для отделения полезной части руды.",
      "tasks": [
        {
          "text": "Изготовить: Промывочный лоток",
          "optional": false,
          "type": "item",
          "itemId": "IR-sluicebox",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 17,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 130,
      "y": 690,
      "contentId": "IR-concentratebogiron",
      "title": "Железный концентрат",
      "subtitle": "Чистое сырьё",
      "description": "Получите концентрат болотной руды — готовое сырьё для домницы.",
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
      "id": 18,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 350,
      "y": 690,
      "contentId": "IR-charcoalpit",
      "title": "Угольная яма",
      "subtitle": "Собственное топливо",
      "description": "Постройте угольную яму и подготовьте производство древесного угля.",
      "tasks": [
        {
          "text": "Изготовить: Угольная яма",
          "optional": false,
          "type": "item",
          "itemId": "IR-charcoalpit",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 19,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 570,
      "y": 690,
      "contentId": "IR-charcoal",
      "title": "Древесный уголь",
      "subtitle": "Топливо для домницы",
      "description": "Получите древесный уголь: он даёт нужную температуру для восстановления железа.",
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
      "id": 20,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 790,
      "y": 690,
      "contentId": "IR-claybrick",
      "title": "Глиняный кирпич",
      "subtitle": "Строительство печи",
      "description": "Сформуйте глиняные кирпичи для жаростойкой конструкции.",
      "tasks": [
        {
          "text": "Изготовить: Глиняный кирпич",
          "optional": false,
          "type": "item",
          "itemId": "IR-claybrick",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 21,
      "radius": 22,
      "shape": "6",
      "iconUrl": "",
      "x": 790,
      "y": 835,
      "contentId": "IR-refractorybrick",
      "title": "Огнеупорный кирпич",
      "subtitle": "Защита от жара",
      "description": "Сделайте огнеупорные кирпичи — без них домница не выдержит рабочую температуру.",
      "tasks": [
        {
          "text": "Изготовить: Огнеупорный кирпич",
          "optional": false,
          "type": "item",
          "itemId": "IR-refractorybrick",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 22,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 570,
      "y": 835,
      "contentId": "IR-bloomeryfurnace",
      "title": "Домница",
      "subtitle": "Первая плавка",
      "description": "Постройте домницу. В ней концентрат и уголь превращаются в железную заготовку.",
      "tasks": [
        {
          "text": "Изготовить: Домница",
          "optional": false,
          "type": "item",
          "itemId": "IR-bloomeryfurnace",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 23,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 350,
      "y": 835,
      "contentId": "IR-bloom",
      "title": "Крица",
      "subtitle": "Результат восстановления",
      "description": "Получите крицу — пористую железную заготовку после домницы.",
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
      "id": 24,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 130,
      "y": 835,
      "contentId": "IR-anvil",
      "title": "Тяжёлая наковальня",
      "subtitle": "Ковка",
      "description": "Соберите тяжёлую наковальню для уплотнения и формовки железа.",
      "tasks": [
        {
          "text": "Изготовить: Тяжёлая наковальня",
          "optional": false,
          "type": "item",
          "itemId": "IR-anvil",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 25,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 130,
      "y": 980,
      "contentId": "IR-wroughtironingot",
      "title": "Кричное железо",
      "subtitle": "Чистый металл",
      "description": "Прокуйте крицу в кричное железо — материал для деталей и инструментов.",
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
      "id": 26,
      "radius": 22,
      "shape": "6",
      "iconUrl": "",
      "x": 350,
      "y": 980,
      "contentId": "IR-ironplate",
      "title": "Железная пластина",
      "subtitle": "Первые детали",
      "description": "Изготовьте железную пластину. Она станет основой механических узлов.",
      "tasks": [
        {
          "text": "Изготовить: Железная пластина",
          "optional": false,
          "type": "item",
          "itemId": "IR-ironplate",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 27,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 570,
      "y": 980,
      "contentId": "IR-bellows",
      "title": "Меха",
      "subtitle": "Подача воздуха",
      "description": "Соберите меха, чтобы управлять подачей воздуха в высокотемпературные печи.",
      "tasks": [
        {
          "text": "Изготовить: Меха",
          "optional": false,
          "type": "item",
          "itemId": "IR-bellows",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 28,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 790,
      "y": 980,
      "contentId": "IR-pyrometer",
      "title": "Пирометр",
      "subtitle": "Контроль температуры",
      "description": "Соберите пирометр: перед сложной плавкой температура должна быть измеримой.",
      "tasks": [
        {
          "text": "Изготовить: Пирометр",
          "optional": false,
          "type": "item",
          "itemId": "IR-pyrometer",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 29,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 790,
      "y": 1125,
      "contentId": "IR-cokeoven",
      "title": "Коксовая печь",
      "subtitle": "Горячее топливо",
      "description": "Постройте коксовую печь для получения более мощного и стабильного топлива.",
      "tasks": [
        {
          "text": "Изготовить: Коксовая печь",
          "optional": false,
          "type": "item",
          "itemId": "IR-cokeoven",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 30,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 570,
      "y": 1125,
      "contentId": "IR-fineryforge",
      "title": "Передельный горн",
      "subtitle": "Очистка железа",
      "description": "Соберите передельный горн для очистки и подготовки железа к сталеварению.",
      "tasks": [
        {
          "text": "Изготовить: Передельный горн",
          "optional": false,
          "type": "item",
          "itemId": "IR-fineryforge",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 31,
      "radius": 22,
      "shape": "6",
      "iconUrl": "",
      "x": 350,
      "y": 1125,
      "contentId": "IR-cruciblefurnace",
      "title": "Тигельная печь",
      "subtitle": "Сталь",
      "description": "Постройте тигельную печь — контролируемую среду для выплавки стали.",
      "tasks": [
        {
          "text": "Изготовить: Тигельная печь",
          "optional": false,
          "type": "item",
          "itemId": "IR-cruciblefurnace",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 32,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 130,
      "y": 1125,
      "contentId": "IR-cruciblegraphite",
      "title": "Графитовый тигель",
      "subtitle": "Точная плавка",
      "description": "Сделайте графитовый тигель: он выдерживает температуру сталеварения.",
      "tasks": [
        {
          "text": "Изготовить: Графитовый тигель",
          "optional": false,
          "type": "item",
          "itemId": "IR-cruciblegraphite",
          "itemCount": 1
        }
      ]
    },
    {
      "id": 33,
      "radius": 22,
      "shape": "circle",
      "iconUrl": "",
      "x": 130,
      "y": 1270,
      "contentId": "IR-mildsteelingot",
      "title": "Мягкая сталь",
      "subtitle": "Первая сталь",
      "description": "Получите мягкую сталь. Это итог технологической цепочки от земли до металла.",
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
      "id": 34,
      "radius": 27,
      "shape": "star",
      "iconUrl": "",
      "x": 350,
      "y": 1270,
      "contentId": "IR-steelframe",
      "title": "Стальная рама",
      "subtitle": "Промышленный старт",
      "description": "Соберите стальную раму — первый крупный результат, на котором строится дальнейшая автоматизация.",
      "tasks": [
        {
          "text": "Изготовить: Стальная рама",
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
    }
  ],
  "cameraX": 460,
  "cameraY": 680,
  "nextNodeId": 35
};

// Quest map expansion: positions are deliberately a 2D map, not a single
// recipe chain. Copper, steam, tooling and chemistry can progress in
// parallel; the age transitions are explicit bottlenecks with 3-4 inputs.
(() => {
    const oldCategory = id => id <= 12 ? 'Beginning' : (id <= 34 ? 'Steam' : 'LV');
    EMBEDDED_QUEST_DATA.nodes.forEach(n => { n.category = oldCategory(n.id); });
    const add = (id, category, x, y, contentId, title, subtitle, description, requirements, extraId) => {
        EMBEDDED_QUEST_DATA.nodes.push({ id, category, x, y, radius: 22, shape: 'circle', iconUrl: '', contentId, title, subtitle, description,
            tasks: [
                { text: `Получить: ${title}`, optional: false, type: 'item', itemId: contentId, itemCount: 1 },
                { text: 'Подготовить сопутствующий компонент', optional: false, type: 'item', itemId: extraId || contentId, itemCount: 1 }
            ]
        });
        requirements.forEach(from => EMBEDDED_QUEST_DATA.edges.push({ from, to: id }));
    };
    add(35, 'Steam', 1080, 500, 'IR-flint-pickaxe', 'Кремниевая кирка', 'Первый инструмент', 'Соберите инструмент с ресурсом прочности: камень больше не ломается голыми руками эффективно.', [13, 14], 'IR-dpebble');
    add(36, 'Steam', 1080, 680, 'IR-steel-axe', 'Стальной топор', 'Лесное хозяйство', 'Топор ускоряет рубку выросших деревьев; выращивайте древесину вместо бесконечных стартовых запасов.', [12, 34], 'IR-oaklog');
    add(37, 'Steam', 1300, 500, 'IR-wrench', 'Инженерный ключ', 'Настройка портов', 'Ключ поворачивает трубы, кабели и машины. Направление порта — часть проектирования, а не косметика.', [26, 34], 'IR-ironrod');
    add(38, 'Steam', 1300, 680, 'IR-small-steam-pipe', 'Паровая магистраль', 'Пар как сеть', 'Соберите малую паровую трубу. Соединяйте источники и потребители, следя за пропускной способностью.', [37, 34], 'IR-steam-pipe');
    add(39, 'Steam', 1520, 500, 'IR-bronze-boiler', 'Бронзовый котёл', 'Источник пара', 'Котёл превращает воду и топливо в пар. Это общий ресурс для нескольких независимых станков.', [38, 7, 28], 'IR-pressure-valve');
    add(40, 'Steam', 1520, 680, 'IR-steam-bender', 'Паровой гибочный станок', 'Механическая ветвь', 'Запустите bender от паровой линии: листовой металл и точная геометрия больше не ручная работа.', [38, 37], 'IR-ironplate');
    add(41, 'Steam', 1740, 680, 'IR-steam-alloy-smelter', 'Паровая плавильня сплавов', 'Химическая ветвь', 'Запустите alloy smelter. Он идёт параллельно гибочному станку и сводит медь с цинком в латунь.', [38, 37], 'IR-brass-ingot');
    add(42, 'LV', 1740, 440, 'IR-dynamo', 'Динамо-машина', 'Бутылочное горлышко LV', 'Динамо требует одновременно паровой механики, латуни и изоляции — критический узел входа в электричество.', [39, 40, 41, 34], 'IR-copper-coil');
    add(43, 'LV', 1960, 350, 'IR-lv-cable', 'LV сеть 32 EU/t', 'Амперы и потери', 'Проложите LV кабель: одна линия несёт 32 EU/t на ампер и теряет энергию по длине.', [42, 37], 'IR-insulated-wire');
    add(44, 'LV', 1960, 530, 'IR-energy-hatch-lv', 'LV Energy Hatch', 'Тирированный ввод', 'Соберите входной hatch. Мультиблок принимает энергию только через hatch своего тира.', [43, 42], 'IR-terminal-block');
    add(45, 'LV', 1960, 710, 'IR-input-bus-lv', 'LV Input Bus', 'Автоматизация предметов', 'Соберите input bus и подготовьте деталь для подачи в мультиблок.', [40, 43], 'IR-ironplate');
    add(46, 'LV', 2180, 440, 'IR-first-circuit', 'Первая микросхема', 'Вход в LV', 'Соберите первую схему: это блокировка, объединяющая энергетику, проводку, химию и точную механику.', [42, 43, 44, 45], 'IR-circuit-board');
    add(47, 'LV', 2400, 300, 'IR-lv-assembler', 'LV Assembler', 'Сборочная линия', 'LV assembly открывает рецепты из нескольких компонентов и заменяемые конфигурации машин.', [46, 45], 'IR-first-circuit');
    add(48, 'LV', 2400, 500, 'IR-lv-chemical-reactor', 'LV Chemical Reactor', 'Реакторная ветвь', 'Химический реактор ведёт к кислотам, пластикам и качественным изоляторам параллельно сборке.', [46, 41], 'IR-first-circuit');
    add(49, 'LV', 2400, 700, 'IR-lv-centrifuge', 'LV Centrifuge', 'Обогащение', 'Центрифуга создаёт альтернативный путь к чистым материалам и побочным продуктам.', [46, 35], 'IR-first-circuit');
    add(50, 'MV', 2660, 440, 'IR-mv-transformer', 'MV Transformer', 'Бутылочное горлышко MV', 'Переход в MV требует LV производства, химии и обогащения; нельзя пройти его одной прямой цепочкой.', [47, 48, 49], 'IR-first-circuit');
    add(51, 'MV', 2880, 300, 'IR-mv-cable', 'MV сеть 128 EU/t', 'Высокая мощность', 'Постройте MV кабель: 128 EU/t, больше ампер и более строгая изоляция.', [50], 'IR-rubber');
    add(52, 'MV', 2880, 500, 'IR-electric-blast-furnace', 'Electric Blast Furnace', 'Горячая ветвь', 'Печь требует maintenance hatch, energy hatch и muffler hatch в валидной мультиблочной структуре.', [50, 44], 'IR-maintenance-hatch');
    add(53, 'MV', 2880, 700, 'IR-distillation-tower', 'Distillation Tower', 'Жидкости и газы', 'Колонна разделяет жидкости и газы по трубам; выбирайте диаметры по требуемому потоку.', [50, 48], 'IR-gas-pipe');
    add(54, 'HV', 3140, 440, 'IR-hv-transformer', 'HV Transformer', 'Вход в HV', 'HV — блокировка из энергетики, жаропрочного производства и химической инфраструктуры.', [51, 52, 53], 'IR-mv-cable');
    add(55, 'HV', 3360, 300, 'IR-cleanroom-controller', 'Cleanroom Controller', 'Чистые помещения', 'Чистая комната требует герметичной структуры, maintenance hatch и стабильного HV питания.', [54, 52], 'IR-maintenance-hatch');
    add(56, 'HV', 3360, 520, 'IR-precision-circuit', 'Прецизионная схема', 'Чистое производство', 'Изготовьте схему в cleanroom: она открывает высокоточные компоненты, не заменяя ранние ветви.', [55, 54], 'IR-first-circuit');
    add(57, 'HV', 3580, 440, 'IR-observatory-telescope', 'Промышленный телескоп', 'Начало космоса', 'Телескоп — первая космическая веха HV: изучение неба до ракет и межпланетной логистики.', [55, 56], 'IR-precision-circuit');
    EMBEDDED_QUEST_DATA.nextNodeId = 58;
})();

const QuestBook = {
    isOpen: false,
    loadError: false,
    nodes: [],
    edges: [],
    progress: {},
    openNodeId: null,
    viewMode: 'graph',
    showHidden: false,
    category: 'all',

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
        titleEl.textContent = 'Линия развития';
        if (detailView) detailView.style.display = 'none';
        if (graphView) graphView.style.display = 'flex';
        renderGraphView();
    }
}

function questVisibleForBrowsing(nodeId) {
    // What the player is allowed to see right now: either the quest is
    // actually visible (its chain has been opened up), or the eye toggle
    // is on and we show everything (greyed out) for reference.
    const node = QuestBook.getNode(nodeId);
    const inCategory = QuestBook.category === 'all' || (node && node.category === QuestBook.category);
    return inCategory && (QuestBook.isVisible(nodeId) || QuestBook.showHidden);
}

function renderGraphView() {
    const emptyEl = document.getElementById('quest-graph-empty');
    const wrapEl = document.getElementById('quest-graph-canvas-wrap');
    const listWrap = document.getElementById('quest-list-wrap');
    const listBtn = document.getElementById('quest-list-toggle');
    const eyeBtn = document.getElementById('quest-eye-toggle');
    const searchEl = document.getElementById('quest-list-search');
    const categoryEl = document.getElementById('quest-category-select');
    if (categoryEl) categoryEl.value = QuestBook.category;
    const summaryEl = document.querySelector('.quest-line-summary');
    if (summaryEl) {
        const count = QuestBook.nodes.filter(n => QuestBook.category === 'all' || n.category === QuestBook.category).length;
        summaryEl.textContent = `${count} этапов · карта развития`;
    }

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

    const statusLabel = status === 'locked' ? 'Нужно выполнить предыдущий этап' : status === 'completed' ? 'Выполнено' : 'Готово к выполнению';
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
            sec.innerHTML = '<h4>Необходимо завершить</h4>';
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
        sec.innerHTML = '<h4>Зачем это нужно</h4>';
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
        sec.innerHTML = '<h4>Цель</h4>';
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
            checkBtn.textContent = 'Проверить';
            checkBtn.addEventListener('click', () => {
                const changed = QuestBook.checkAutoTasks();
                if (!changed) {
                    checkBtn.textContent = 'Not yet\u2026';
                    checkBtn.classList.add('quest-check-btn-fail');
                    setTimeout(() => {
                        checkBtn.textContent = 'Проверить';
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
        btn.textContent = 'Отметить выполненным';
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

    const categoryEl = document.getElementById('quest-category-select');
    if (categoryEl) categoryEl.addEventListener('change', () => {
        QuestBook.category = categoryEl.value;
        renderQuestBook();
    });

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
