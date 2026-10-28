/* ===========================
   MAIN.JS - Core Logic
   =========================== */

// ===== SESSION CHECK =====
function getSession() {
    const s = localStorage.getItem('kimthu_session');
    return s ? JSON.parse(s) : null;
}

function checkAuth() {
    const session = getSession();
    if (!session) { window.location.href = 'index.html'; return null; }
    return session;
}

function logout() {
    localStorage.removeItem('kimthu_session');
    window.location.href = 'index.html';
}

// ===== DATA MANAGEMENT =====
const DEFAULT_PHOTOS = [
    { src: 'images/z7911749040016_4af77ee7392b2ddc87c049d1169db066.jpg', caption: 'Bức ảnh đầu tiên em gửi anh đấyyy' },
    { src: 'images/gallery-2.jpg', caption: 'Trông cứ như kiểu gái Hàn ấy nhỉ' },
    { src: 'images/gallery-3.jpg', caption: 'Xinh vclllll' },
    { src: 'images/gallery-4.jpg', caption: '' },
    { src: 'images/z7911749036077_ec752f7f31636080e6c8fa6319f3c155.jpg', caption: 'Chưa biết nói gì nhưng mà ảnh này đẹp :v' },
    { src: 'images/z7911749042473_6fb14786da1cf859065ae647df98ee58.jpg', caption: 'Muppppppp' },
    { src: 'images/z7911749049804_c95bb798e639a7fce1dcac041b539490.jpg', caption: 'Xinh gái lắm vậy thôii' },
    { src: 'images/z7911749056781_977c1a28ea3995240c767bf852758377.jpg', caption: 'Yêu lắmmmmmmmmmmm' },
    { src: 'images/z7911749066481_a99db0ab8dda68694f0cc0db868801f3.jpg', caption: 'Em sẽ không còn một mình nữa đâu' },
    { src: 'images/z7911749062765_220b51b599fdde6334912e5edcd66475.jpg', caption: 'Ái chà😋' },
    { src: 'images/z7911749064359_8e0d034eeefa04227157048974fd43b8.jpg', caption: 'Sao trông nó dễ thương mà nó ngon mà nó trắng quá' },
    { src: 'images/z7911780620982_be02443af53ff0e19ae14b72c756d8da.jpg', caption: 'Điệu đà quá công chúa của anh oiii' },
    { src: 'images/image.png', caption: 'Khẳng định chủ quyền hehe' },
    { src: 'images/image copy.png', caption: 'Sau này sẽ có những chiếc nhẫn quan trọng hơn nữa đấy nhéee' },
];

function getData(key, defaultVal) {
    const d = localStorage.getItem('kimthu_' + key);
    return d ? JSON.parse(d) : defaultVal;
}

function setData(key, val) {
    localStorage.setItem('kimthu_' + key, JSON.stringify(val));
}

function getPhotos() { return getData('photos', DEFAULT_PHOTOS); }
function getCardText() {
    return getData('card_text', `Chúc mừng sinh nhật embe của anh! 🎂\n\nVậy là em chính thức đủ 18 tuổi rồi. Đến tuổi này cũng gọi là trưởng thành rồi nhưng mà trong lòng anh thì em cũng chỉ mãi là embe của anh thôi, ra ngoài em có thể va vấp hoặc cứng rắn nhưng khi đối diện với anh thì em chẳng khác nào 1 embe thực sự cả. Cảm ơn em đã bên anh những lúc khó khăn và xoa dịu anh. Anh rất hạnh phúc khi ở bên em và rất hãnh diện khi có thể đồng hành với em bước qua tuổi 18, lại còn là tình đầu nữa chứ.\n\nCảm ơn em vì đã đến bên anh, làm cho mỗi ngày của anh tràn ngập màu hồng và mọi thứ đều trở nên nhẹ nhàng hơn.\n\nChúc em tuổi mới luôn xinh đẹp, hạnh phúc, luôn ngập tràn niềm vui và quan trọng là sức khoẻ. Anh sẽ luôn ở đây yêu em mỗi ngày. 💕\n\nAnh yêu em nhiều lắm 💕\n\n— Gia Huy 💕`);
}
function getHeroQuote() { return getData('hero_quote', '"Em là điều tuyệt vời nhất đến với anh"'); }

// ===== PRELOADER =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => { preloader.classList.add('hidden'); }, 2500);
}

// ===== NAVBAR =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const session = getSession();

    // Show username
    document.getElementById('navUser').textContent = session ? session.username : '';

    // Admin mode
    if (session && session.role === 'admin') {
        document.body.classList.add('is-admin');
    }

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
        updateActiveNav();
    });

    // Hamburger
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    // Mobile links close menu
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', logout);

    // Desktop nav links smooth scroll
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function updateActiveNav() {
    const sections = ['hero', 'timeline', 'gallery', 'card', 'love'];
    const scrollPos = window.scrollY + 200;
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (!section) return;
        const link = document.querySelector(`.nav-link[data-section="${id}"]`);
        if (!link) return;
        if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
}

// ===== HERO PARTICLES =====
function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'hero-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 6 + 's';
        p.style.animationDuration = (4 + Math.random() * 4) + 's';
        container.appendChild(p);
    }
}

// ===== LOAD SAVED CONTENT =====
function loadSavedContent() {
    // Hero quote
    const heroQuote = document.getElementById('heroQuote');
    if (heroQuote) heroQuote.textContent = getHeroQuote();

    // Card
    const cardContent = document.getElementById('cardContent');
    if (cardContent) cardContent.textContent = getCardText();

    // Timeline
    for (let i = 1; i <= 3; i++) {
        const title = getData(`timeline_${i}_title`, null);
        const desc = getData(`timeline_${i}_desc`, null);
        if (title) { const el = document.getElementById(`timeline-title-${i}`); if (el) el.textContent = title; }
        if (desc) { const el = document.getElementById(`timeline-desc-${i}`); if (el) el.textContent = desc; }
    }
}

// ===== GALLERY =====
let currentLightboxIndex = 0;

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    const photos = getPhotos();
    const isAdmin = getSession()?.role === 'admin';
    grid.innerHTML = '';

    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item reveal';
        item.innerHTML = `
            <img src="${photo.src}" alt="${photo.caption || ''}" loading="lazy">
            <div class="gallery-item-overlay">
                <span class="gallery-item-caption">${photo.caption || ''}</span>
            </div>
            ${isAdmin ? `<button class="gallery-item-delete" data-index="${index}" title="Xóa ảnh">🗑️</button>` : ''}
        `;

        // Click to open lightbox
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-item-delete')) return;
            openLightbox(index);
        });

        grid.appendChild(item);
        addTiltEffect(item);

        // Stagger animation
        setTimeout(() => { item.classList.add('visible'); }, 100 + index * 150);
    });

    // Delete buttons
    if (isAdmin) {
        grid.querySelectorAll('.gallery-item-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.index);
                deletePhoto(idx);
            });
        });
    }
}

function deletePhoto(index) {
    const photos = getPhotos();
    photos.splice(index, 1);
    setData('photos', photos);
    renderGallery();
    showToast('🗑️ Đã xóa ảnh');
}

// ===== LIGHTBOX =====
function openLightbox(index) {
    const photos = getPhotos();
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const counter = document.getElementById('lightboxCounter');

    img.src = photos[index].src;
    caption.textContent = photos[index].caption || '';
    counter.textContent = `${index + 1} / ${photos.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(dir) {
    const photos = getPhotos();
    currentLightboxIndex = (currentLightboxIndex + dir + photos.length) % photos.length;
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const counter = document.getElementById('lightboxCounter');
    img.src = photos[currentLightboxIndex].src;
    caption.textContent = photos[currentLightboxIndex].caption || '';
    counter.textContent = `${currentLightboxIndex + 1} / ${photos.length}`;
}

function initLightbox() {
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', () => navigateLightbox(-1));
    document.getElementById('lightboxNext').addEventListener('click', () => navigateLightbox(1));
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('lightbox').classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Touch swipe for lightbox
    let touchStartX = 0;
    const lightbox = document.getElementById('lightbox');
    lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            navigateLightbox(diff > 0 ? 1 : -1);
        }
    });
}

// ===== SURPRISE CARD =====
function initSurpriseCard() {
    const card = document.getElementById('surpriseCard');
    const instruction = document.getElementById('cardInstruction');
    let isFlipped = false;

    card.addEventListener('click', () => {
        isFlipped = !isFlipped;
        card.classList.toggle('flipped', isFlipped);
        instruction.textContent = isFlipped ? '👆 Nhấn lần nữa để đóng' : '👆 Nhấn vào thiệp để mở';

        if (isFlipped) {
            launchConfetti();
        }
    });
}

// ===== CONFETTI =====
function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    const section = canvas.parentElement;
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;

    const particles = [];
    const colors = ['#b76e79', '#f4a6c1', '#d4a574', '#e8c9a0', '#fce4ec', '#ff6b8a', '#ffd700'];

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 1) * 12 - 4,
            size: 4 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            gravity: 0.15,
            life: 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        particles.forEach(p => {
            if (p.life <= 0) return;
            alive = true;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.rotSpeed;
            p.life -= 0.008;
            p.vx *= 0.99;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
        });

        if (alive) requestAnimationFrame(animate);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animate();
}

// ===== LOVE COUNTER =====
function initLoveCounter() {
    // Anniversary: June 1st of the year they started dating
    // Using June 1, 2025 as a reference since user said they started dating on June 1
    const startDate = new Date(2026, 5, 8); // June 8, 2026

    function update() {
        const now = new Date();
        const diff = now - startDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        animateCounter('counterDays', days);
        animateCounter('counterHours', hours);
        animateCounter('counterMinutes', minutes);
        animateCounter('counterSeconds', seconds);
    }

    update();
    setInterval(update, 1000);
}

function animateCounter(id, value) {
    const el = document.getElementById(id);
    if (el && el.textContent !== String(value)) {
        el.textContent = value;
    }
}

// ===== LOVE PARTICLES =====
function initLoveParticles() {
    const container = document.getElementById('loveParticles');
    const emojis = ['💕', '💖', '💗', '✨', '🌸', '💫'];
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'love-particle';
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 8 + 's';
        p.style.animationDuration = (6 + Math.random() * 6) + 's';
        container.appendChild(p);
    }
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .timeline-item, .gallery-item').forEach(el => {
        observer.observe(el);
    });
}

// ===== TOAST =====
function showToast(text) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');
    toastText.textContent = text;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2500);
}

// Make globally accessible
window.showToast = showToast;
window.getPhotos = getPhotos;
window.setData = setData;
window.getData = getData;
window.renderGallery = renderGallery;
window.getCardText = getCardText;
window.getHeroQuote = getHeroQuote;

// ===== NEW FEATURES =====
// 1. Floating Hearts
function initFloatingHearts() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('.gallery-item') || e.target.closest('.lightbox-content') || e.target.closest('.nav-links')) return;
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = ['💕', '💖', '💗', '💝'][Math.floor(Math.random() * 4)];
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        document.body.appendChild(heart);
        setTimeout(() => { heart.remove(); }, 1000);
    });
}

// 2. Music Player
function initMusicPlayer() {
    const player = document.getElementById('musicPlayer');
    const btn = document.getElementById('musicBtn');
    const audio = document.getElementById('bgMusic');
    if (!player || !btn || !audio) return;

    let isPlaying = false;
    setTimeout(() => { player.classList.add('visible'); }, 2000);

    btn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            btn.classList.remove('playing');
        } else {
            audio.play().catch(e => console.log(e));
            btn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
}

// 3. Love Notes
const DEFAULT_LOVE_NOTES = [
    "Cảm ơn em vì luôn kiên nhẫn lắng nghe anh",
    "Cảm ơn em vì đã lựa chọn xuất hiện trong cuộc đời anh",
    "Cảm ơn em vì đã mang đến màu hồng cho cuộc đời anh",
    "Giọng nói của em là thứ làm anh rất ấn tượng ngay từ lần đầu nói chuyện",
    "Mọi biểu cảm trên khuôn mặt của em đều rất dễ thương đấy vợ ngố của anh ạ",
    "Cảm ơn em vì đã cố gắng chờ đợi đến ngày mình gặp nhau",
    "Cảm ơn em vì đã thay đổi vì anh",
    "Cảm ơn em vì luôn dịu dàng với anh",
    "Cảm ơn em vì đã tin tưởng anh",
    "Cảm ơn em vì đã ở bên những lúc anh cảm thấy khó khăn nhất",
    "Cảm ơn em vì vẫn ở lại dù là khi mọi chuyện không được suôn sẻ",
];
function getLoveNotes() { return getData('love_notes', DEFAULT_LOVE_NOTES); }

function initLoveNotes() {
    const btn = document.getElementById('loveNoteBtn');
    const popup = document.getElementById('loveNotePopup');
    const overlay = document.getElementById('loveNoteOverlay');
    const closeBtn = document.getElementById('loveNoteClose');
    const textEl = document.getElementById('loveNoteText');
    if (!btn || !popup) return;

    btn.addEventListener('click', () => {
        const notes = getLoveNotes();
        textEl.textContent = notes[Math.floor(Math.random() * notes.length)];
        popup.classList.add('show');
        overlay.classList.add('show');
    });

    closeBtn.addEventListener('click', () => { popup.classList.remove('show'); overlay.classList.remove('show'); });
    overlay.addEventListener('click', () => { popup.classList.remove('show'); overlay.classList.remove('show'); });
}

// 4. Tilt Effect
function addTiltEffect(element) {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        element.style.transform = `scale(1.02) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    element.addEventListener('mouseleave', () => { element.style.transform = ''; });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    const session = checkAuth();
    if (!session) return;

    initPreloader();
    initNavbar();
    initHeroParticles();
    loadSavedContent();
    renderGallery();
    initLightbox();
    initSurpriseCard();
    initLoveCounter();
    initLoveParticles();

    // Initialize new features
    initFloatingHearts();
    initMusicPlayer();
    initLoveNotes();

    // Delay scroll reveal slightly
    setTimeout(initScrollReveal, 500);
});
