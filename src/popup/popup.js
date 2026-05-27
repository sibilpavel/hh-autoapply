import {
    initCoverLetter,
    bindCoverLetterSave
} from './storage.js';

import { initTabs } from './tabs.js';

import { MESSAGES } from '../shared/messages.js';

const coverLetterInput =
    document.getElementById('cover-letter');

initCoverLetter(coverLetterInput);

bindCoverLetterSave(coverLetterInput);

initTabs();


document
    .getElementById('start')
    .addEventListener('click', async () => {

        const [tab] =
            await chrome.tabs.query({
                active: true,
                currentWindow: true
            });

        chrome.tabs.sendMessage(tab.id, {
            action:
            MESSAGES.START_RESPONSES
        });
    });