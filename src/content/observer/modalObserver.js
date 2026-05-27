import {
    handleCoverLetterModal,
    handleRelocationModal
} from '../dom/modals.js';

export function createModalObserver() {

    const observer = new MutationObserver(
        async () => {

            await handleRelocationModal();

            await handleCoverLetterModal();
        }
    );

    return {
        start() {

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },

        stop() {
            observer.disconnect();
        }
    };
}