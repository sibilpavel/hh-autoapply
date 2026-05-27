import { CONFIG } from './config.js';
import { state } from './state.js';
import { logger } from './logger.js';

import { getResponseButtons } from './dom/buttons.js';

import { processVacancy } from './services/responseService.js';

import { createModalObserver } from './observer/modalObserver.js';

import { MESSAGES } from '../shared/messages.js';

const modalObserver = createModalObserver();

async function processCurrentPage() {

    const buttons = getResponseButtons();

    logger.info(
        `Найдено кнопок: ${buttons.length}`
    );

    for (const button of buttons) {

        if (!state.isRunning) {

            logger.info('Остановлено');

            return;
        }

        if (
            state.totalResponses >=
            CONFIG.MAX_RESPONSES
        ) {

            logger.info('Достигнут лимит');

            stopResponses();

            return;
        }

        await processVacancy(button);
    }

    logger.info('Обработка завершена');

    logger.info(
        'Вакансии с тестами:',
        state.invalidVacancies
    );
}

async function startResponses() {

    if (state.isRunning) {
        return;
    }

    state.isRunning = true;

    modalObserver.start();

    await processCurrentPage();

    stopResponses();
}

function stopResponses() {

    state.isRunning = false;

    modalObserver.stop();

    logger.info('Stopped');
}

chrome.runtime.onMessage.addListener(
    message => {

        if (
            message.action ===
            MESSAGES.START_RESPONSES
        ) {

            startResponses();
        }

        if (
            message.action ===
            MESSAGES.STOP_RESPONSES
        ) {

            stopResponses();
        }
    }
);