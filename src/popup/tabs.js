export function initTabs() {

    const tabs =
        document.querySelectorAll('[data-tab]');

    tabs.forEach(tab => {

        tab.addEventListener('click', () => {

            document
                .querySelectorAll('.nav-link')
                .forEach(el =>
                    el.classList.remove('active')
                );

            document
                .querySelectorAll('.tab-content')
                .forEach(el =>
                    el.classList.add('d-none')
                );

            tab.classList.add('active');

            document
                .getElementById(tab.dataset.tab)
                .classList.remove('d-none');
        });

    });
}