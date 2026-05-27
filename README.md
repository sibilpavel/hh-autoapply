# 🚀 HH Auto Response Extension

Браузерное расширение для автоматизации откликов на вакансии на hh.ru с поддержкой кастомного сопроводительного письма.

---

# ✨ Возможности

* Автоматические отклики на вакансии
* Поддержка сопроводительного письма
* Сохранение текста между сессиями
* Автоматическая обработка popup/modal окон
* Пропуск вакансий с тестовыми заданиями
* Защита от повторных откликов
* Архитектура с разделением ответственности
* Модульная структура проекта
* Сборка через Vite + Esbuild

---

# 🏗 Архитектура проекта

Проект разделён по зонам ответственности.

```txt
src/
│
├── content/
│   ├── services/
│   ├── dom/
│   ├── observer/
│   └── ...
│
├── popup/
│
└── shared/
```

## Основные слои

### content/

Content script логика.

Отвечает за:

* работу с hh.ru
* обработку вакансий
* взаимодействие с DOM
* обработку modal окон
* orchestration процесса откликов

---

### popup/

UI расширения.

Отвечает за:

* интерфейс popup
* сохранение сопроводительного письма
* управление вкладками
* запуск automation flow

---

### services/

Бизнес-логика приложения.

Например:

* проверка вакансий
* обработка откликов
* работа со storage

---

### dom/

Изоляция DOM-логики.

Содержит:

* selectors
* кнопки
* modal handlers

Это позволяет не смешивать бизнес-логику и работу с document/querySelector.

---

### observer/

Reactive runtime logic.

Отвечает за:

* MutationObserver
* отслеживание появления popup/modal окон

---

### shared/

Общие контракты между popup и content script.

Например:

* message types
* constants
* shared enums

---

# ⚙️ Технологии

* JavaScript (ES Modules)
* Chrome Extension Manifest V3
* Chrome Extensions API
* Chrome Storage API
* Vite
* Esbuild
* Bootstrap 5

---

# 📦 Установка

## 1. Клонировать репозиторий

```bash
git clone https://github.com/your-username/hh-auto-response.git
cd hh-auto-response
```

---

## 2. Установить зависимости

```bash
npm install
```

---

## 3. Собрать проект

```bash
npm run build
```

После сборки появится папка:

```txt
dist/
```

Именно её нужно подключать в браузер.

---

# 🧩 Подключение расширения в Chrome / Edge

## 1. Открыть страницу расширений

```txt
chrome://extensions/
```

---

## 2. Включить Developer Mode

В правом верхнем углу включить:

```txt
Developer mode
```

---

## 3. Загрузить расширение

Нажать:

```txt
Load unpacked
```

---

## 4. Выбрать папку

Выбрать:

```txt
dist/
```

---

# 🔄 Обновление расширения

После изменений:

```bash
npm run build
```

Далее:

1. Открыть:

   ```txt
   chrome://extensions/
   ```

2. Нажать:

   ```txt
   Reload
   ```

3. Перезагрузить вкладку hh.ru

---

# 🧠 Как работает extension

## Flow работы

```txt
popup
↓
sendMessage
↓
content script
↓
process vacancies
↓
modal observer
↓
auto response
```

---

## Проверка вакансий

Перед откликом extension:

* получает vacancyId
* проверяет наличие тестового задания
* пропускает вакансии с тестами
* предотвращает повторную обработку

---

## Обработка modal окон

Extension автоматически:

* подтверждает relocation popup
* вставляет cover letter
* отправляет форму отклика

---

# 💾 Сопроводительное письмо

## Поведение

При первом запуске используется дефолтный текст:

```txt
Работал со всеми технологиями из вашей вакансии, когда удобно будет созвониться?
```

---

## Хранение

Текст сохраняется в:

```txt
chrome.storage.local
```

---

## Обновление

Любые изменения в popup автоматически сохраняются и используются content script во время откликов.

---

# ⚡ Build System

Проект использует:

* Vite — для popup/UI части
* Esbuild — для content script bundle

---

## Почему content script собирается отдельно

Chrome content scripts не поддерживают ES modules напрямую.

Поэтому:

```txt
src/content/index.js
```

собирается в единый bundle:

```txt
dist/content.js
```

без import/export.

---

# 📁 Итоговая структура сборки

```txt
dist/
│
├── manifest.json
├── popup.html
├── popup.js
├── content.js
│
├── chunks/
└── assets/
```

---

# 🚧 Возможности для расширения

Текущая архитектура позволяет легко добавить:

* AI cover letters
* pagination
* retries
* rate limiting
* queue system
* pause/resume
* analytics
* multiple response strategies
* TypeScript
* automated tests

---

# ⚠️ Disclaimer

Extension создан исключительно в образовательных целях.

Используйте automation responsibly и учитывайте правила платформы hh.ru.
