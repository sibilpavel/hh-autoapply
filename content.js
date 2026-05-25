// =========================
// STATE
// =========================

let totalResponses = 0;

let isRunning = false;

const MAX_RESPONSES = 100;

const processedVacancies = new Set();

// список вакансий с тестами
const invalidVacancies = [];

// =========================
// UTILS
// =========================

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCoverLetterText() {

    return new Promise(resolve => {

        chrome.storage.local.get(
            ['coverLetter'],
            result => resolve(result.coverLetter)
        );

    });

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

    if (!textarea) {
        return false;
    }

    // защита от повторной обработки
    if (textarea.dataset.processed === "true") {
        return false;
    }

    textarea.dataset.processed = "true";

    console.log("Найдено окно сопроводительного письма");

    textarea.focus();

    textarea.value = await getCoverLetterText();

    textarea.dispatchEvent(
        new Event("input", { bubbles: true })
    );

    textarea.dispatchEvent(
        new Event("change", { bubbles: true })
    );

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

// =========================
// RELOCATION MODAL
// =========================

async function handleRelocationModal() {

    const relocationButton = document.querySelector(
        '[data-qa="relocation-warning-confirm"]'
    );

    if (!relocationButton) {
        return false;
    }

    // защита от повторного клика
    if (relocationButton.dataset.processed === "true") {
        return false;
    }

    relocationButton.dataset.processed = "true";

    console.log("Найдено relocation модальное окно");

    relocationButton.click();

    console.log('Нажата кнопка "Все равно откликнуться"');

    return true;
}

// =========================
// MODAL OBSERVER
// =========================

function startModalObserver() {

    const observer = new MutationObserver(async () => {

        await handleRelocationModal();

        await handleCoverLetterModal();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    return observer;
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

    if (!vacancyId || isProcessed(vacancyId)) {
        return;
    }

    markProcessed(vacancyId);

    const requiresTest = await hasRequiredTest(vacancyId);

    if (requiresTest) {
        return;
    }

    await scrollToButton(button);

    button.click();

    totalResponses++;

    console.log(`Отклик №${totalResponses}`);

    await sleep(800);
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

let modalObserver = null;

async function startResponses() {

    if (isRunning) {
        return;
    }

    isRunning = true;

    modalObserver = startModalObserver();

    await processCurrentPage();

    stopResponses();
}

function stopResponses() {

    isRunning = false;

    modalObserver?.disconnect();

    console.log("Stopped");
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