// ===== AUTH PROTECTION =====
function checkAuth() {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = './login.html';
        return false;
    }
    return true;
}

if (!checkAuth()) {
    throw new Error('Not authenticated');
}

// ===== STAR CANVAS BACKGROUND =====
function initStarCanvas() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];
    const STAR_COUNT = 200;

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
                radius: Math.random() * 1.5 + 0.3,
                alpha: Math.random(),
                alphaSpeed: Math.random() * 0.015 + 0.003,
                alphaDir: Math.random() > 0.5 ? 1 : -1
            });
        }
    }

    function createShootingStar() {
        if (Math.random() > 0.995) {
            shootingStars.push({
                x: Math.random() * canvas.width,
                y: 0,
                length: Math.random() * 80 + 50,
                speed: Math.random() * 5 + 3,
                angle: Math.PI / 4 + Math.random() * 0.3,
                alpha: 1
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw stars
        stars.forEach(star => {
            star.alpha += star.alphaSpeed * star.alphaDir;
            if (star.alpha >= 1) { star.alpha = 1; star.alphaDir = -1; }
            if (star.alpha <= 0.1) { star.alpha = 0.1; star.alphaDir = 1; }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * 0.8})`;
            ctx.fill();

            // Glow for bigger stars
            if (star.radius > 1) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${star.alpha * 0.2})`;
                ctx.fill();
            }
        });

        // Draw shooting stars
        createShootingStar();
        shootingStars = shootingStars.filter(ss => {
            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.alpha -= 0.015;

            if (ss.alpha <= 0) return false;

            ctx.beginPath();
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(
                ss.x - Math.cos(ss.angle) * ss.length,
                ss.y - Math.sin(ss.angle) * ss.length
            );
            const gradient = ctx.createLinearGradient(
                ss.x, ss.y,
                ss.x - Math.cos(ss.angle) * ss.length,
                ss.y - Math.sin(ss.angle) * ss.length
            );
            gradient.addColorStop(0, `rgba(212, 175, 55, ${ss.alpha})`);
            gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            return true;
        });

        requestAnimationFrame(draw);
    }

    resize();
    createStars();
    draw();
    window.addEventListener('resize', () => { resize(); createStars(); });
}

// ===== FLOATING HEARTS =====
function initFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    if (!container) return;
    const hearts = ['❤️', '💕', '💖', '💗', '💝', '💘', '💓'];

    function createHeart() {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 10 + 12) + 's';
        heart.style.animationDelay = Math.random() * 3 + 's';
        heart.style.fontSize = (Math.random() * 0.8 + 0.8) + 'rem';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 25000);
    }

    for (let i = 0; i < 8; i++) {
        setTimeout(createHeart, i * 600);
    }
    setInterval(createHeart, 4000);
}

// ===== NAVIGATION =====
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');
    const links = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('currentUser');
        window.location.href = './login.html';
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

// ===== COUNTDOWN TIMER =====
function initCountdown() {
    // Change this date to your anniversary or special date
    const targetDate = new Date('2027-07-07T00:00:00').getTime();

   const daysEl = document.getElementById('countDays');
const hoursEl = document.getElementById('countHours');
const minutesEl = document.getElementById('countMinutes');
const secondsEl = document.getElementById('countSeconds');
const messageEl = document.getElementById('countdownMessage');

console.log(daysEl);
console.log(hoursEl);
console.log(minutesEl);
console.log(secondsEl);
console.log(messageEl);

    function update() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            messageEl.textContent = '❤️ Our special moment is here! ❤️';
            triggerConfetti();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

// ===== MUSIC PLAYER =====
function initMusicPlayer() {
    // Playlist - replace src with your own MP3 file paths or URLs
    // Example: { title: 'Song Name', artist: 'Artist', src: './music/song.mp3' }
    const playlist = [
        { title: 'Our Love Song', artist: 'For You', src: 'copy_5A84357F-FEDE-46DE-9CBA-C02BE9AB2AD5.mp3' },
        { title: 'Thinking of You', artist: 'Always', src: '2.mp3' },
        { title: 'Forever Together', artist: 'My Heart', src: '3.mp3' },
        { title: 'Distance Means Nothing', artist: 'Us', src: '4.mp3' },
        { title: 'You Are My Everything', artist: 'Eternal', src: 'Vs0GgWlMgGYTLJ7.mp3' }
    ];

    let currentTrack = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isLoop = false;
    let volume = 0.7;

    // Create audio element
    const audio = new Audio();
    audio.volume = volume;

    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const loopBtn = document.getElementById('loopBtn');
    const progressFill = document.getElementById('progressFill');
    const progressThumb = document.getElementById('progressThumb');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const vinylDisc = document.getElementById('vinylDisc');
    const volumeBar = document.getElementById('volumeBar');
    const volumeFill = document.getElementById('volumeFill');
    const volumeThumb = document.getElementById('volumeThumb');

    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${String(s).padStart(2, '0')}`;
    }

    function loadTrack(index) {
        const track = playlist[index];
        songTitle.textContent = track.title;
        songArtist.textContent = track.artist;
        currentTimeEl.textContent = '0:00';
        totalTimeEl.textContent = '0:00';
        progressFill.style.width = '0%';
        progressThumb.style.left = '0%';

        if (track.src) {
            audio.src = track.src;
            audio.load();
        } else {
            audio.src = '';
            songArtist.textContent = track.artist + ' • Add MP3 to play';
        }
    }

    function togglePlay() {
        if (!playlist[currentTrack].src) {
            songArtist.textContent = '⚠️ Add MP3 files to playlist src';
            return;
        }

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(() => {
                songArtist.textContent = 'Click again to play';
            });
        }
    }

    function updatePlayState() {
        playBtn.querySelector('.play-icon').classList.toggle('hidden', isPlaying);
        playBtn.querySelector('.pause-icon').classList.toggle('hidden', !isPlaying);
        vinylDisc.classList.toggle('playing', isPlaying);
    }

    function nextTrack() {
        if (isShuffle) {
            let next = Math.floor(Math.random() * playlist.length);
            while (next === currentTrack && playlist.length > 1) {
                next = Math.floor(Math.random() * playlist.length);
            }
            currentTrack = next;
        } else {
            currentTrack = (currentTrack + 1) % playlist.length;
        }
        loadTrack(currentTrack);
        if (isPlaying && playlist[currentTrack].src) {
            audio.play().catch(() => {});
        } else {
            isPlaying = false;
            updatePlayState();
        }
    }

    function prevTrack() {
        if (audio.currentTime > 3 && playlist[currentTrack].src) {
            audio.currentTime = 0;
            return;
        }
        currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrack);
        if (isPlaying && playlist[currentTrack].src) {
            audio.play().catch(() => {});
        } else {
            isPlaying = false;
            updatePlayState();
        }
    }

    // Audio events
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const pct = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = pct + '%';
            progressThumb.style.left = pct + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
        if (isLoop) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        } else {
            nextTrack();
        }
    });

    audio.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayState();
    });

    audio.addEventListener('play', () => {
        isPlaying = true;
        updatePlayState();
    });

    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);

    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    });

    loopBtn.addEventListener('click', () => {
        isLoop = !isLoop;
        loopBtn.classList.toggle('active', isLoop);
    });

    // Progress bar click
    progressBar.addEventListener('click', (e) => {
        if (!audio.duration) return;
        const rect = progressBar.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pct * audio.duration;
    });

    // Volume bar click
    volumeBar.addEventListener('click', (e) => {
        const rect = volumeBar.getBoundingClientRect();
        const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
        volume = pct;
        audio.volume = volume;
        volumeFill.style.width = (pct * 100) + '%';
        volumeThumb.style.left = (pct * 100) + '%';
    });

    // Initialize volume display
    volumeFill.style.width = (volume * 100) + '%';
    volumeThumb.style.left = (volume * 100) + '%';

    loadTrack(currentTrack);
}

// ===== SURPRISE =====
function initSurprise() {
    const surpriseBtn = document.getElementById('surpriseBtn');
    const surpriseOverlay = document.getElementById('surpriseOverlay');
    const surpriseClose = document.getElementById('surpriseClose');

    surpriseBtn.addEventListener('click', () => {
        surpriseOverlay.classList.add('active');
        triggerConfetti();
        triggerSparkles();
        createSurpriseHearts();
    });

    surpriseClose.addEventListener('click', () => {
        surpriseOverlay.classList.remove('active');
    });

    surpriseOverlay.addEventListener('click', (e) => {
        if (e.target === surpriseOverlay) {
            surpriseOverlay.classList.remove('active');
        }
    });
}

function createSurpriseHearts() {
    const container = document.getElementById('surpriseHeartsAnim');
    container.innerHTML = '';
    const hearts = ['❤️', '💖', '💕', '💗'];
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heart.style.fontSize = (Math.random() * 1 + 1) + 'rem';
        container.appendChild(heart);
    }
}

// ===== CONFETTI =====
function triggerConfetti() {
    const colors = ['#d4af37', '#e8a0bf', '#ff6b6b', '#4ecdc4', '#fff', '#ffd700'];
    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 8 + 5) + 'px';
            confetti.style.height = (Math.random() * 8 + 5) + 'px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// ===== SPARKLES =====
function triggerSparkles() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('span');
            sparkle.className = 'sparkle';
            sparkle.textContent = '✨';
            sparkle.style.left = (Math.random() * 80 + 10) + 'vw';
            sparkle.style.top = (Math.random() * 80 + 10) + 'vh';
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1500);
        }, i * 100);
    }
}

// ===== GALLERY =====
function initGallery() {
    const items = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightboxContent');
    const lightboxClose = document.getElementById('lightboxClose');

    items.forEach(item => {
        item.addEventListener('click', () => {
            const placeholder = item.querySelector('.gallery-placeholder');
            if (placeholder) {
                lightboxContent.innerHTML = placeholder.outerHTML;
            }
            lightbox.classList.add('active');
        });

        // Heart animation
        const heartBtn = item.querySelector('.gallery-heart');
        if (heartBtn) {
            heartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                heartBtn.classList.add('liked');
                setTimeout(() => heartBtn.classList.remove('liked'), 500);
            });
        }
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
        }
    });
}

// ===== SMOOTH SCROLL FOR HERO BUTTON =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== PARALLAX EFFECT =====
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const hero = document.querySelector('.hero-content');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = 1 - (scrolled / 800);
        }
    });
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    initStarCanvas();
    initFloatingHearts();
    initNavigation();
    initScrollAnimations();
    initCountdown();
    initMusicPlayer();
    initSurprise();
    initGallery();
    initSmoothScroll();
    initParallax();
});