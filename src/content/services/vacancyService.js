import { state } from '../state.js';
import { logger } from '../logger.js';

export function getVacancyId(button) {

    const href = button.getAttribute('href');

    if (!href) {
        return null;
    }

    const match = href.match(/vacancyId=(\d+)/);

    return match?.[1] || null;
}

export function isProcessed(vacancyId) {

    return state.processedVacancies.has(vacancyId);
}

export function markProcessed(vacancyId) {

    state.processedVacancies.add(vacancyId);
}

export async function hasRequiredTest(vacancyId) {

    try {

        const response = await fetch(
            `https://${location.host}/applicant/vacancy_response/popup?vacancyId=${vacancyId}&isTest=no&withoutTest=no&lux=true&alreadyApplied=false`,
            {
                method: 'GET',
                credentials: 'include'
            }
        );

        const data = await response.json();

        const requiresTest =
            data.type === 'test-required';

        if (requiresTest) {

            state.invalidVacancies.push(vacancyId);

            logger.info(
                `Вакансия ${vacancyId} требует тест`
            );
        }

        return requiresTest;

    } catch (e) {

        logger.error('Ошибка проверки теста', e);

        return false;
    }
}