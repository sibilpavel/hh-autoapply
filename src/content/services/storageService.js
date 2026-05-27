export async function getCoverLetter() {

    return new Promise(resolve => {

        chrome.storage.local.get(
            ['coverLetter'],
            result => resolve(result.coverLetter || '')
        );

    });
}