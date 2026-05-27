import { SELECTORS } from './selectors.js';

export function getResponseButtons() {
    return Array.from(
        document.querySelectorAll(
            SELECTORS.responseButtons
        )
    );
}