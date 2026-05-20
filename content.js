// =========================
// STATE
// =========================

let totalResponses = 0;

let isRunning = false;

const MAX_RESPONSES = 100;

const processedVacancies = new Set();

// список вакансий с тестами
const invalidVacancies = [];

const COVER_LETTER_TEXT =
    "Работал со всеми технологиями из вашей вакансии, когда удобно будет созвониться?";

// =========================
// UTILS
// =========================

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));
}


// =========================
// BUTTONS
// =========================

function getResponseButtons() {

    return Array.from(
        document.querySelectorAll(
            '[data-qa="vacancy-serp__vacancy_response"]'
        )
    );
}

// =========================
// COVER LETTER MODAL
// =========================

async function handleCoverLetterModal() {
    const textarea = document.querySelector(
        '[data-qa="vacancy-response-popup-form-letter-input"]'
    );

    if (textarea) {

        console.log("Найдено окно сопроводительного письма");

        textarea.focus();

        textarea.value = COVER_LETTER_TEXT;

        // триггерим события
        textarea.dispatchEvent(
            new Event("input", { bubbles: true })
        );

        textarea.dispatchEvent(
            new Event("change", { bubbles: true })
        );

        await sleep(500);

        // кнопка отклика
        const submitButton = document.querySelector(
            '[data-qa="vacancy-response-submit-popup"]'
        );

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.click();

            console.log("Сопроводительное отправлено");
        }

        return true;
    }

    await sleep(300);


    return false;
}

// =========================
// VACANCY
// =========================

function getVacancyId(button) {

    const href = button.getAttribute("href");

    if (!href) {
        return null;
    }

    const match = href.match(/vacancyId=(\d+)/);

    if (!match) {
        return null;
    }

    return match[1];
}

function isProcessed(vacancyId) {

    return processedVacancies.has(vacancyId);
}

function markProcessed(vacancyId) {

    processedVacancies.add(vacancyId);
}


// =========================
// TEST CHECK
// =========================

async function hasRequiredTest(vacancyId) {

    try {

        const response = await fetch(
            `https://${location.host}/applicant/vacancy_response/popup?vacancyId=${vacancyId}&isTest=no&withoutTest=no&lux=true&alreadyApplied=false`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        const isTestRequired = data.type === "test-required";

        if (isTestRequired) {

            console.log(`Вакансия ${vacancyId} требует тест`);

            invalidVacancies.push(vacancyId);
        }

        return isTestRequired;

    } catch (e) {

        console.log("Ошибка проверки теста:", e);

        return false;
    }
}



// =========================
// DOM ACTIONS
// =========================

async function scrollToButton(button) {

    button.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    await sleep(700);
}

async function clickResponseButton(button) {

    button.click();
}


// =========================
// RESPONSE PROCESSING
// =========================

async function processVacancy(button) {

    const vacancyId = getVacancyId(button);

    if (!vacancyId) {

        console.log("Не удалось получить vacancy id");

        return;
    }

    if (isProcessed(vacancyId)) {

        console.log("Уже обработано:", vacancyId);

        return;
    }

    markProcessed(vacancyId);

    console.log("Обрабатываем:", vacancyId);

    // =========================
    // CHECK TEST
    // =========================

    const requiresTest = await hasRequiredTest(vacancyId);

    if (requiresTest) {

        console.log(`Скипаем вакансию ${vacancyId} из-за теста`);

        return;
    }

    try {

        await scrollToButton(button);

        await clickResponseButton(button);

        await sleep(2500);

        await handleCoverLetterModal();

        totalResponses++;

        console.log(`Отклик №${totalResponses}`);

    } catch (e) {

        console.log("Ошибка отклика:", e);

    }

    await sleep(1500);
}


// =========================
// MAIN LOOP
// =========================

async function processCurrentPage() {

    const buttons = getResponseButtons();

    console.log(`Найдено кнопок: ${buttons.length}`);

    for (const button of buttons) {

        if (!isRunning) {

            console.log("Остановлено");

            return;
        }

        if (totalResponses >= MAX_RESPONSES) {

            console.log("Достигнут лимит");

            stopResponses();

            return;
        }

        await processVacancy(button);
    }

    console.log("Обработка страницы завершена");

    console.log("Вакансии с тестами:", invalidVacancies);
}


// =========================
// START / STOP
// =========================

async function startResponses() {

    if (isRunning) {

        console.log("Уже запущено");

        return;
    }

    isRunning = true;

    console.log("Запуск автооткликов");

    await processCurrentPage();

    stopResponses();
}

function stopResponses() {

    isRunning = false;

    console.log("Работа завершена");

    console.log("invalidVacancies:", invalidVacancies);
}


// =========================
// EXTENSION MESSAGE
// =========================

chrome.runtime.onMessage.addListener((message) => {

    if (message.action === "START_RESPONSES") {

        startResponses();
    }

    if (message.action === "STOP_RESPONSES") {

        stopResponses();
    }
});