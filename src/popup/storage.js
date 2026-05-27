export const DEFAULT_COVER_LETTER =
    'Работал со всеми технологиями из вашей вакансии, когда удобно будет созвониться?';

export async function initCoverLetter(input) {

    chrome.storage.local.get(
        ['coverLetter'],
        result => {

            if (!result.coverLetter) {

                chrome.storage.local.set({
                    coverLetter:
                    DEFAULT_COVER_LETTER
                });

                input.value =
                    DEFAULT_COVER_LETTER;

                return;
            }

            input.value =
                result.coverLetter;
        }
    );
}

export function bindCoverLetterSave(input) {
    console.log(input.value);
    input.addEventListener('input', () => {

        chrome.storage.local.set({
            coverLetter: input.value
        });

    });
}