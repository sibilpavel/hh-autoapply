import { SELECTORS } from './selectors.js';
import { getCoverLetter } from '../services/storageService.js';
import { logger } from '../logger.js';

export async function handleCoverLetterModal() {

    const textarea = document.querySelector(
        SELECTORS.coverLetterTextarea
    );

    if (!textarea) {
        return false;
    }

    if (textarea.dataset.processed === 'true') {
        return false;
    }

    textarea.dataset.processed = 'true';

    textarea.focus();

    textarea.value = await getCoverLetter();

    textarea.dispatchEvent(
        new Event('input', { bubbles: true })
    );

    textarea.dispatchEvent(
        new Event('change', { bubbles: true })
    );

    const submitButton = document.querySelector(
        SELECTORS.coverLetterSubmit
    );

    if (submitButton) {

        submitButton.disabled = false;

        submitButton.click();

        logger.info('Сопроводительное отправлено');
    }

    return true;
}

export async function handleRelocationModal() {

    const button = document.querySelector(
        SELECTORS.relocationConfirm
    );

    if (!button) {
        return false;
    }

    if (button.dataset.processed === 'true') {
        return false;
    }

    button.dataset.processed = 'true';

    button.click();

    logger.info('Подтвержден relocation');

    return true;
}