/* ===========================
   AUTH.JS - Login & Session
   =========================== */

// Account database
const ACCOUNTS = [
    { username: 'Gia Huy', password: '031106', role: 'admin' },
    { username: 'Kim Thư', password: '211008', role: 'user' }
];

// Create floating hearts
function createHearts() {
    const container = document.getElementById('heartsContainer');
    const hearts = ['💕', '💖', '💗', '💝', '🌸', '✨', '💫', '🦋'];

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (12 + Math.random() * 20) + 'px';
            heart.style.animationDuration = (6 + Math.random() * 8) + 's';
            heart.style.animationDelay = (Math.random() * 5) + 's';
            container.appendChild(heart);
        }, i * 300);
    }
}

// Normalize username for comparison (case-insensitive, trim whitespace)
function normalizeUsername(input) {
    return input.trim();
}

// Authenticate user
function authenticate(username, password) {
    const normalizedInput = normalizeUsername(username);
    const account = ACCOUNTS.find(acc =>
        acc.username === normalizedInput && acc.password === password
    );
    return account || null;
}

// Save session
function saveSession(account) {
    const session = {
        username: account.username,
        role: account.role,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('kimthu_session', JSON.stringify(session));
}

// Get session
function getSession() {
    const session = localStorage.getItem('kimthu_session');
    return session ? JSON.parse(session) : null;
}

// Clear session
function clearSession() {
    localStorage.removeItem('kimthu_session');
}

// Check if already logged in
function checkExistingSession() {
    const session = getSession();
    if (session) {
        window.location.href = 'main.html';
    }
}

// Handle login form
function initLogin() {
    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');
    const loginBtn = document.getElementById('loginBtn');
    const loginCard = document.getElementById('loginCard');
    const loginWrapper = document.querySelector('.login-wrapper');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Show loading
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        errorMsg.classList.remove('show');

        // Simulate brief loading for effect
        setTimeout(() => {
            const account = authenticate(username, password);

            if (account) {
                // Success
                saveSession(account);
                loginCard.classList.add('success');

                // Create burst of hearts
                createHeartBurst();

                setTimeout(() => {
                    loginWrapper.classList.add('fade-out');
                    setTimeout(() => {
                        window.location.href = 'main.html';
                    }, 800);
                }, 600);
            } else {
                // Failed
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
                errorMsg.textContent = '💔 Sai tên hoặc mật khẩu rồi công chúa ơii!';
                errorMsg.classList.add('show');

                // Shake animation
                loginCard.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    loginCard.style.animation = '';
                }, 500);
            }
        }, 800);
    });
}

// Heart burst effect on success
function createHeartBurst() {
    const container = document.getElementById('heartsContainer');
    const burstHearts = ['💕', '💖', '💗', '💝', '🎂', '🎉', '🎊', '✨'];

    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = burstHearts[Math.floor(Math.random() * burstHearts.length)];
        heart.style.left = (40 + Math.random() * 20) + '%';
        heart.style.fontSize = (16 + Math.random() * 24) + 'px';
        heart.style.animationDuration = (2 + Math.random() * 3) + 's';
        heart.style.animationDelay = (Math.random() * 0.5) + 's';
        container.appendChild(heart);
    }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
    }
`;
document.head.appendChild(style);

// Init
document.addEventListener('DOMContentLoaded', () => {
    checkExistingSession();
    createHearts();
    initLogin();
});
