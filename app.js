// App initialization and UI logic

let deferredPrompt;

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('Service Worker registered', reg))
        .catch(err => console.log('Service Worker registration failed', err));
}

// Handle install prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installPrompt').style.display = 'block';
});

document.getElementById('installBtn')?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response: ${outcome}`);
        deferredPrompt = null;
        document.getElementById('installPrompt').style.display = 'none';
    }
});

document.getElementById('dismissBtn')?.addEventListener('click', () => {
    document.getElementById('installPrompt').style.display = 'none';
});

// Tab switching
function showTab(name) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    document.querySelectorAll('.tab-section').forEach(s => s.classList.toggle('active', s.id === 'tab-' + name));
    localStorage.setItem('activeTab', name);
}

document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));

// Password generation and display
function displayPasswords(count) {
    const passwordList = document.getElementById('passwordList');
    passwordList.innerHTML = '';

    const passwords = generateMultiple(count);

    passwords.forEach((password, index) => {
        const passwordItem = document.createElement('div');
        passwordItem.className = 'password-item';
        passwordItem.textContent = password;
        passwordItem.setAttribute('data-password', password);
        passwordItem.addEventListener('click', copyToClipboard);
        passwordList.appendChild(passwordItem);
    });
}

async function copyToClipboard(e) {
    const password = e.target.getAttribute('data-password');
    let success = false;

    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(password);
            success = true;
        } catch (err) {
            console.log('Clipboard API failed, trying fallback:', err);
        }
    }

    // Fallback for iOS and non-HTTPS contexts
    if (!success) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = password;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const range = document.createRange();
            range.selectNodeContents(textArea);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);

            success = document.execCommand('copy');
            document.body.removeChild(textArea);
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
    }

    if (success) {
        e.target.classList.add('copied');

        const originalText = e.target.textContent;
        e.target.textContent = '✓ Kopiert!';

        setTimeout(() => {
            e.target.textContent = originalText;
            e.target.classList.remove('copied');
        }, 1500);
    } else {
        alert('Kunne ikke kopiere passord');
    }
}

document.getElementById('generateBtn')?.addEventListener('click', () => {
    const count = parseInt(document.getElementById('countSelect').value);
    displayPasswords(count);
});

// Generate initial passwords on load
window.addEventListener('load', () => {
    showTab(localStorage.getItem('activeTab') || 'passord');
    displayPasswords(5);
});
