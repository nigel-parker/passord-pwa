// Fetches nokler.csv and renders the key overview

function renderNokler(entries) {
    const list = document.getElementById('keyList');
    const status = document.getElementById('keysStatus');
    list.innerHTML = '';

    entries.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'password-item key-item';

        const name = document.createElement('strong');
        name.className = 'key-name';
        name.textContent = entry.navn;
        item.appendChild(name);

        if (entry.beskrivelse) {
            const desc = document.createElement('p');
            desc.className = 'key-desc';
            desc.textContent = entry.beskrivelse;
            item.appendChild(desc);
        }

        list.appendChild(item);
    });

    status.textContent = entries.length === 0 ? 'Ingen nøkler' : '';
}

async function loadNokler() {
    const status = document.getElementById('keysStatus');
    status.textContent = 'Laster…';
    try {
        const response = await fetch('nokler.csv');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        renderNokler(parseNokler(await response.text()));
    } catch (err) {
        console.error('Kunne ikke laste nokler.csv:', err);
        status.textContent = 'Kunne ikke laste nøkler';
    }
}

window.addEventListener('load', loadNokler);
