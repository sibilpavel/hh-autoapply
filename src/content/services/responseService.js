import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { sleep } from '../utils.js';
import { logger } from '../logger.js';

import {
    getVacancyId,
    isProcessed,
    markProcessed,
    hasRequiredTest
} from './vacancyService.js';

export async function processVacancy(button) {

    const vacancyId = getVacancyId(button);

    if (!vacancyId) {
        return;
    }

    if (isProcessed(vacancyId)) {
        return;
    }

    markProcessed(vacancyId);

    const requiresTest =
        await hasRequiredTest(vacancyId);

    if (requiresTest) {
        return;
    }

    button.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    await sleep(CONFIG.SCROLL_DELAY);

    button.click();

    state.totalResponses++;

    logger.info(
        `Отклик №${state.totalResponses}`
    );

    await sleep(CONFIG.RESPONSE_DELAY);
}