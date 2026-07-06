// ===== LOGIN PAGE LOGIC =====

// Default credentials (can be changed)
const VALID_USERS = [
    { username: 'love', password: 'forever' },
    { username: 'mydarling', password: 'iloveyou' }
];

// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const rememberMe = document.getElementById('rememberMe');
const loginMessage = document.getElementById('loginMessage');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');

// ===== Star Canvas Background =====
function initStarCanvas() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 150;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random(),
                alphaSpeed: Math.random() * 0.02 + 0.005,
                alphaDir: 1
            });
        }
    }

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            star.alpha += star.alphaSpeed * star.alphaDir;
            if (star.alpha >= 1) star.alphaDir = -1;
            if (star.alpha <= 0.2) star.alphaDir = 1;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${star.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(drawStars);
    }

    resize();
    createStars();
    drawStars();
    window.addEventListener('resize', () => {
        resize();
        createStars();
    });
}

// ===== Floating Hearts =====
function initFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    if (!container) return;
    const hearts = ['❤️', '💕', '💖', '💗', '💝'];

    function createHeart() {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';
        container.appendChild(heart);

        setTimeout(() => heart.remove(), 20000);
    }

    for (let i = 0; i < 10; i++) {
        setTimeout(createHeart, i * 500);
    }
    setInterval(createHeart, 3000);
}

// ===== Toggle Password Visibility =====
togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.querySelector('.eye-open').classList.toggle('hidden');
    togglePassword.querySelector('.eye-closed').classList.toggle('hidden');
});

// ===== Check Remember Me on Load =====
function checkRemembered() {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
        const data = JSON.parse(remembered);
        usernameInput.value = data.username;
        passwordInput.value = data.password;
        rememberMe.checked = true;
    }
}

// ===== Form Validation =====
function validateForm() {
    let valid = true;
    usernameError.textContent = '';
    passwordError.textContent = '';

    if (!usernameInput.value.trim()) {
        usernameError.textContent = 'Please enter your username';
        valid = false;
    }

    if (!passwordInput.value.trim()) {
        passwordError.textContent = 'Please enter your password';
        valid = false;
    } else if (passwordInput.value.length < 4) {
        passwordError.textContent = 'Password must be at least 4 characters';
        valid = false;
    }

    return valid;
}

// ===== Login Handler =====
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const user = VALID_USERS.find(u => u.username === username && u.password === password);

    if (user) {
        // Save session
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('currentUser', username);

        // Remember me
        if (rememberMe.checked) {
            localStorage.setItem('rememberedUser', JSON.stringify({ username, password }));
        } else {
            localStorage.removeItem('rememberedUser');
        }

        // Show success message
        loginMessage.textContent = 'Welcome back, my love! ❤️';
        loginMessage.className = 'login-message success';

        // Redirect
        setTimeout(() => {
            window.location.href = './index.html';
        }, 1000);
    } else {
        loginMessage.textContent = 'Invalid credentials. Try again, darling.';
        loginMessage.className = 'login-message error';

        // Shake animation
        const card = document.querySelector('.login-card');
        card.style.animation = 'none';
        card.offsetHeight; // trigger reflow
        card.style.animation = 'shake 0.5s ease';
    }
});

// ===== Shake Animation =====
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// ===== Check if already logged in =====
function checkAlreadyLoggedIn() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = './index.html';
    }
}

// ===== Initialize =====
checkAlreadyLoggedIn();
checkRemembered();
initStarCanvas();
initFloatingHearts();