/* ===========================
   ADMIN.JS - Admin Panel Logic
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('kimthu_session') || 'null');
    if (!session || session.role !== 'admin') return;

    initAdminPanel();
    initAdminTabs();
    initCardEditor();
    initPhotoManager();
    initTextEditor();
});

// ===== ADMIN PANEL TOGGLE =====
function initAdminPanel() {
    const fab = document.getElementById('adminFab');
    const panel = document.getElementById('adminPanel');
    const closeBtn = document.getElementById('adminClose');
    const overlay = document.getElementById('adminOverlay');

    function openPanel() {
        panel.classList.add('open');
        overlay.classList.add('show');
    }

    function closePanel() {
        panel.classList.remove('open');
        overlay.classList.remove('show');
    }

    fab.addEventListener('click', openPanel);
    closeBtn.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);

    // Gallery add button also opens panel to photos tab
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', () => {
            openPanel();
            switchTab('photos-tab');
        });
    }
}

// ===== TABS =====
function initAdminTabs() {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`.admin-tab[data-tab="${tabId}"]`)?.classList.add('active');
    document.getElementById(tabId)?.classList.add('active');
}

// ===== CARD EDITOR =====
function initCardEditor() {
    const textarea = document.getElementById('adminCardText');
    const saveBtn = document.getElementById('saveCardBtn');

    // Load current card text
    textarea.value = window.getCardText();

    saveBtn.addEventListener('click', () => {
        const text = textarea.value.trim();
        if (!text) {
            window.showToast('⚠️ Nội dung thiệp không được trống!');
            return;
        }
        window.setData('card_text', text);
        document.getElementById('cardContent').textContent = text;
        window.showToast('✅ Đã lưu thiệp thành công!');
    });
}

// ===== PHOTO MANAGER =====
function compressImage(file, maxWidth, maxHeight, quality, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            let width = img.width;
            let height = img.height;
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = width * ratio;
                height = height * ratio;
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            callback(dataUrl);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function initPhotoManager() {
    const fileInput = document.getElementById('newPhotoFile');
    const urlInput = document.getElementById('newPhotoUrl');
    const captionInput = document.getElementById('newPhotoCaption');
    const addBtn = document.getElementById('addPhotoBtnAdmin');

    addBtn.addEventListener('click', () => {
        const caption = captionInput.value.trim() || '';

        if (fileInput && fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const btnOriginalText = addBtn.innerHTML;
            addBtn.innerHTML = '⏳ Đang xử lý...';
            addBtn.disabled = true;

            compressImage(file, 1000, 1000, 0.7, (dataUrl) => {
                try {
                    addPhotoToList(dataUrl, caption);
                    fileInput.value = '';
                    urlInput.value = '';
                    captionInput.value = '';
                    window.showToast('✅ Đã tải ảnh lên!');
                } catch (e) {
                    if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
                        window.showToast('❌ Lỗi: Bộ nhớ đệm đầy (vượt quá 5MB). Hãy xóa bớt ảnh!');
                    } else {
                        window.showToast('❌ Có lỗi xảy ra khi lưu ảnh.');
                    }
                } finally {
                    addBtn.innerHTML = btnOriginalText;
                    addBtn.disabled = false;
                }
            });
        } else if (urlInput && urlInput.value.trim()) {
            try {
                addPhotoToList(urlInput.value.trim(), caption);
                urlInput.value = '';
                captionInput.value = '';
                window.showToast('✅ Đã thêm ảnh mới!');
            } catch (e) {
                window.showToast('❌ Lỗi: Bộ nhớ đệm đầy!');
            }
        } else {
            window.showToast('⚠️ Vui lòng chọn ảnh từ thiết bị hoặc dán URL!');
        }
    });

    renderAdminPhotosList();
}

function addPhotoToList(src, caption) {
    const photos = window.getPhotos();
    photos.push({ src: src, caption: caption });
    window.setData('photos', photos);
    window.renderGallery();
    renderAdminPhotosList();
}

function renderAdminPhotosList() {
    const list = document.getElementById('adminPhotosList');
    const photos = window.getPhotos();
    list.innerHTML = '';

    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'admin-photo-item';
        item.innerHTML = `
            <img src="${photo.src}" alt="" class="admin-photo-thumb" onerror="this.style.display='none'">
            <span class="admin-photo-name">${photo.caption || photo.src.split('/').pop()}</span>
            <button class="admin-photo-delete" data-index="${index}" title="Xóa">🗑️</button>
        `;
        list.appendChild(item);
    });

    // Delete handlers
    list.querySelectorAll('.admin-photo-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            const photos = window.getPhotos();
            photos.splice(idx, 1);
            window.setData('photos', photos);
            window.renderGallery();
            renderAdminPhotosList();
            window.showToast('🗑️ Đã xóa ảnh');
        });
    });
}

// ===== TEXT EDITOR =====
function initTextEditor() {
    // Load current values
    document.getElementById('adminHeroQuote').value = window.getHeroQuote();

    for (let i = 1; i <= 3; i++) {
        const titleEl = document.getElementById(`timeline-title-${i}`);
        const descEl = document.getElementById(`timeline-desc-${i}`);
        const adminTitle = document.getElementById(`adminTimeline${i}Title`);
        const adminDesc = document.getElementById(`adminTimeline${i}Desc`);
        if (titleEl && adminTitle) adminTitle.value = window.getData(`timeline_${i}_title`, titleEl.textContent);
        if (descEl && adminDesc) adminDesc.value = window.getData(`timeline_${i}_desc`, descEl.textContent);
    }

    // Save hero quote
    document.getElementById('saveHeroQuoteBtn').addEventListener('click', () => {
        const quote = document.getElementById('adminHeroQuote').value.trim();
        if (quote) {
            window.setData('hero_quote', quote);
            document.getElementById('heroQuote').textContent = quote;
            window.showToast('✅ Đã lưu lời chào!');
        }
    });

    // Save all text
    document.getElementById('saveTextBtn').addEventListener('click', () => {
        for (let i = 1; i <= 3; i++) {
            const title = document.getElementById(`adminTimeline${i}Title`).value.trim();
            const desc = document.getElementById(`adminTimeline${i}Desc`).value.trim();
            if (title) {
                window.setData(`timeline_${i}_title`, title);
                const el = document.getElementById(`timeline-title-${i}`);
                if (el) el.textContent = title;
            }
            if (desc) {
                window.setData(`timeline_${i}_desc`, desc);
                const el = document.getElementById(`timeline-desc-${i}`);
                if (el) el.textContent = desc;
            }
        }
        window.showToast('✅ Đã lưu tất cả nội dung!');
    });
}
