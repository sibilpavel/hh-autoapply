const DEFAULT_COVER_LETTER =
    'Работал со всеми технологиями из вашей вакансии, когда удобно будет созвониться?';

const coverLetterInput =
    document.getElementById('cover-letter');

// =========================
// INIT DEFAULT VALUE
// =========================

chrome.storage.local.get(
    ['coverLetter'],
    result => {

        // если текста нет — сохраняем дефолт
        if (!result.coverLetter) {

            chrome.storage.local.set({
                coverLetter: DEFAULT_COVER_LETTER
            });

            coverLetterInput.value =
                DEFAULT_COVER_LETTER;

            return;
        }

        coverLetterInput.value =
            result.coverLetter;

    }
);

// =========================
// SAVE
// =========================

coverLetterInput.addEventListener('input', () => {

    chrome.storage.local.set({
        coverLetter: coverLetterInput.value
    });

});

// =========================
// TABS
// =========================

const tabs = document.querySelectorAll('[data-tab]');

tabs.forEach(tab => {

    tab.addEventListener('click', () => {

        document
            .querySelectorAll('.nav-link')
            .forEach(el => el.classList.remove('active'));

        document
            .querySelectorAll('.tab-content')
            .forEach(el => el.classList.add('d-none'));

        tab.classList.add('active');

        document
            .getElementById(tab.dataset.tab)
            .classList.remove('d-none');

    });

});

document.getElementById("start").addEventListener("click", async () => {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.tabs.sendMessage(tab.id, {
        action: "START_RESPONSES"
    });
});