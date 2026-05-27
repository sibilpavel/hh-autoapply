export const logger = {
    info: (...args) => {
        console.log('[HH]', ...args);
    },

    error: (...args) => {
        console.error('[HH]', ...args);
    }
};