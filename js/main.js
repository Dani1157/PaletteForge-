/* ════════════════════════════════════════════
   CORE FUNCTIONS & GLOBAL STATE
════════════════════════════════════════════ */

// Global state
let BASE = '#e8a020';
let SCHEMES = null;
let PREV = 'landing';
let gradType = 'linear';
let gradStops = ['#e8a020', '#e84060'];
let gradAngle = 135;
let currentExportFmt = 'css';
let imgPage = 1, imgCurrentQ = '', imgCurrentColor = '';
let activeUser = null;
let activeTemplate = 0;

/* ════════════════════════════════════════════
   UTILS
════════════════════════════════════════════ */

function copy(text) {
    navigator.clipboard.writeText(text).then(() =>
        toast(`Copied: ${text.length > 40 ? text.slice(0, 40) + '…' : text}`, 'in')
    );
}

function copyAll(cs) {
    navigator.clipboard.writeText(cs.join(', ')).then(() => toast('All colors copied', 'ok'));
}

function toast(msg, type = 'in') {
    const el = document.createElement('div');
    el.className = `toast ${type === 'ok' ? 'ok' : type === 'er' ? 'er' : 'in'}`;
    el.innerHTML = `<span style="font-weight:700">${type === 'ok' ? '✓' : type === 'er' ? '✗' : '·'}</span><span>${msg}</span>`;
    document.getElementById('toasts').appendChild(el);
    setTimeout(() => {
        el.style.animation = 'tout .3s ease forwards';
        setTimeout(() => el.remove(), 300);
    }, 3000);
}

/* ════════════════════════════════════════════
   COLOR SYNC
════════════════════════════════════════════ */

function syncAllColorUIs(hex) {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    BASE = hex;
    document.getElementById('forgeWell').style.background = hex;
    document.getElementById('forgeColor').value = hex;
    document.getElementById('forgeHex').value = hex;
    document.getElementById('globalSwatch').style.background = hex;
    document.getElementById('globalPicker').value = hex;
    document.getElementById('globalHex').textContent = hex;
    document.documentElement.style.setProperty('--ac', hex);
    const { r, g, b } = h2r(hex);
    document.documentElement.style.setProperty('--acr', `${r},${g},${b}`);
}

function onGlobalColor(v) {
    syncAllColorUIs(v);
    if (SCHEMES) forge();
}

function onForgeColor(v) {
    syncAllColorUIs(v);
}

function onHexType(v) {
    if (!v.startsWith('#')) v = '#' + v;
    if (/^#[0-9a-fA-F]{6}$/.test(v)) syncAllColorUIs(v);
}

/* ════════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════════ */

function nav(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nitem').forEach(n => n.classList.remove('active'));
    
    const page = document.getElementById('page-' + id);
    if (page) page.classList.add('active');
    
    // Nav matching
    const nmap = {
        forge: 'nf', images: 'ni', gradients: 'ng', mixer: 'nm',
        contrast: 'nc', templates: 'nt', typography: 'nty',
        aistudio: 'na', collection: 'nco', export: 'nex', explore: 'ne'
    };
    const targetNav = document.getElementById(nmap[id]);
    if (targetNav) targetNav.classList.add('active');
    
    // Lazy builds
    if (id === 'typography') renderTypo();
    if (id === 'gradients') renderSavedGrads();
    if (id === 'contrast') updateContrast();
    if (id === 'collection') renderCollection();
    if (id === 'export') buildExportPage();
    if (id === 'explore') renderExploreGrid('trending');
    if (id === 'templates') renderTemplates();
    if (id === 'mixer') updateMixer();
    if (id === 'forge' && SCHEMES) renderColorInfo();
    
    document.getElementById('main').scrollTo(0, 0);
}

/* ════════════════════════════════════════════
   THEME / MISC
════════════════════════════════════════════ */

function toggleTheme() {
    const d = document.documentElement;
    d.dataset.theme = d.dataset.theme === 'dark' ? 'light' : 'dark';
    document.getElementById('themeBtn').classList.toggle('on', d.dataset.theme === 'light');
}

function sharePalette() {
    const url = location.href.split('?')[0] + (BASE ? `?p=${BASE.replace('#', '')}` : '');
    copy(url);
    toast('Share link copied!', 'ok');
}

function randomColor() {
    const h = Math.floor(Math.random() * 360),
        s = 50 + Math.floor(Math.random() * 40),
        l = 40 + Math.floor(Math.random() * 22);
    const { r, g, b } = hs2r(h, s, l);
    const hex = r2h(r, g, b);
    syncAllColorUIs(hex);
    document.getElementById('forgeHex').value = hex;
    forge();
}

function applyScheme(cs) {
    syncAllColorUIs(cs[0]);
    document.getElementById('forgeHex').value = cs[0];
    forge();
}

/* ════════════════════════════════════════════
   MODALS / OVERLAYS
════════════════════════════════════════════ */

function openOverlay(id) {
    document.getElementById(id).classList.add('open');
}

function closeOverlay(id) {
    document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('.overlay').forEach(m =>
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); })
);

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.overlay.open').forEach(m => m.classList.remove('open'));
    }
});

/* ════════════════════════════════════════════
   AUTH
════════════════════════════════════════════ */

function switchAuth(tab) {
    document.getElementById('aform-login').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('aform-reg').style.display = tab === 'reg' ? 'block' : 'none';
    document.getElementById('atab-login').style.background = tab === 'login' ? 'var(--ac)' : 'var(--s2)';
    document.getElementById('atab-login').style.color = tab === 'login' ? '#1a0e00' : 'var(--tx2)';
    document.getElementById('atab-reg').style.background = tab === 'reg' ? 'var(--ac)' : 'var(--s2)';
    document.getElementById('atab-reg').style.color = tab === 'reg' ? '#1a0e00' : 'var(--tx2)';
}

function doLogin() {
    const email = document.getElementById('loginEmail').value || 'demo@user.com';
    const name = email.split('@')[0];
    activeUser = { name, email };
    document.getElementById('authArea').innerHTML =
        `<div class="user-area" onclick="openOverlay('authModal')"><div class="uavatar">${name[0].toUpperCase()}</div><span class="uname">${name}</span></div>`;
    closeOverlay('authModal');
    toast(`Welcome back, ${name}!`, 'ok');
}

function doReg() {
    const name = document.getElementById('regName').value || 'User';
    const email = document.getElementById('regEmail').value || 'user@email.com';
    activeUser = { name, email };
    document.getElementById('authArea').innerHTML =
        `<div class="user-area" onclick="openOverlay('authModal')"><div class="uavatar">${name[0].toUpperCase()}</div><span class="uname">${name}</span></div>`;
    closeOverlay('authModal');
    toast(`Welcome to PaletteForge, ${name}!`, 'ok');
}

/* ════════════════════════════════════════════
   TRENDING CHIPS (empty state)
════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // Trending chips
    document.getElementById('trendChips').innerHTML = TRENDS.map(c =>
        `<button class="btn btn-s" onclick="syncAllColorUIs('${c.h}');document.getElementById('forgeHex').value='${c.h}';forge()" style="gap:8px">
            <div style="width:14px;height:14px;border-radius:3px;background:${c.h};flex-shrink:0"></div>${c.n}
        </button>`
    ).join('');
    
    // Event listeners for color inputs
    document.getElementById('globalPicker').addEventListener('input', e => syncAllColorUIs(e.target.value));
    document.getElementById('forgeColor').addEventListener('input', e => syncAllColorUIs(e.target.value));
    document.getElementById('forgeHex').addEventListener('keydown', e => { if (e.key === 'Enter') forge(); });
    
    // Initial theme
    if (window.matchMedia('(prefers-color-scheme:light)').matches) {
        document.documentElement.dataset.theme = 'light';
    }
    
    // Initial builds
    buildExportPage();
    renderSidebar();
    renderSavedGrads();
    initGrad();
    updateMixer();
    
    // Load from URL param
    const urlP = new URLSearchParams(location.search).get('p');
    if (urlP && /^[0-9a-fA-F]{6}$/.test(urlP)) {
        syncAllColorUIs('#' + urlP);
        document.getElementById('forgeHex').value = '#' + urlP;
        setTimeout(forge, 80);
    }
});