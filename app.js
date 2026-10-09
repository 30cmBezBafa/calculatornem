// ============================================
// НЕМЕЦИЯ — ОСНОВНАЯ ЛОГИКА (финальная сборка)
// ============================================
(function() {
'use strict';

let currentBrand = null;
let currentBrandData = null;
let currentMod = null;
let selectedWorks = [];
let expandedCats = new Set();
let expandedIncludes = new Set();
let isSaving = false;
let searchActiveIndex = -1;
let searchResults = [];
let journalItems = [];
let historyItems = [];

const ICON_FALLBACK = {
    to: '🛢️', diag: '🔬', engine: '⚙️', engine_big: '🏗️', gearbox: '🔄', awd: '🧭',
    suspension: '🌀', brakes: '🛑', steering: '🛞', electrics: '⚡', climate: '❄️', exhaust: '💨'
};
const AWD_FALLBACK = {
    volkswagen: '4MOTION', audi: 'QUATTRO', skoda: '4x4', seat: '4Drive',
    porsche: 'PTM', bmw: 'xDrive', mini: 'ALL4', alpina: 'xDrive', mercedes: '4MATIC'
};
// Исторические префиксы id модификаций
const BRAND_PREFIX = { volkswagen: 'vw', mercedes: 'mb' };

const $ = function(id) { return document.getElementById(id); };
const el = function(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
};

function catIcon(key) {
    if (typeof CAT_ICONS !== 'undefined' && CAT_ICONS[key]) return CAT_ICONS[key];
    return ICON_FALLBACK[key] || '';
}

function awdName(brandId) {
    const map = (typeof AWD_NAMES !== 'undefined') ? AWD_NAMES : AWD_FALLBACK;
    return map[brandId] || 'AWD';
}

function modBrandId(modId) {
    for (let i = 0; i < CONFIG.brands.length; i++) {
        const b = CONFIG.brands[i];
        const alt = BRAND_PREFIX[b.id];
        if (modId.indexOf(b.id + '_') === 0) return b.id;
        if (alt && modId.indexOf(alt + '_') === 0) return b.id;
    }
    return 'volkswagen';
}

function getRate(rateType) { return CONFIG.rates[rateType] || CONFIG.rates.standard; }
function workPrice(nh, rateType) { return nh * getRate(rateType); }
function formatRub(n) { return n.toLocaleString('ru-RU') + ' ₽'; }
function debounce(fn, ms) {
    let t;
    return function() {
        const args = arguments;
        clearTimeout(t);
        t = setTimeout(function() { fn.apply(null, args); }, ms);
    };
}

// Даты: убираем хвосты вида "GMT+0600 (Омск...)", если они прилетели
function cleanDate(s) {
    const str = String(s || '');
    if (str.indexOf('GMT') === -1) return str;
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function fmtShortLocal(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso || '');
    return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// Список работ: старая схема (массив works) или новая (бирки)
function worksFor(mod) {
    if (mod.works && mod.works.length) {
        const gt = mod.gearboxType || null;
        return mod.works.filter(function(wid) {
            const w = worksCatalog[wid];
            if (!w) return false;
            if (w.gearboxType && gt && w.gearboxType.indexOf(gt) === -1) return false;
            return true;
        });
    }
    if (typeof collectWorks === 'function') return collectWorks(mod);
    return [];
}

function timingLabel(mod) {
    if (mod.timing) return mod.timing;
    if (!mod.works && typeof buildPassport === 'function') {
        const p = buildPassport(mod);
        if (p.timing) return p.timing === 'belt' ? 'Ремень' : 'Цепь';
    }
    if (mod.works) {
        if (mod.works.indexOf('timing_belt') !== -1) return 'Ремень';
        if (mod.works.indexOf('timing_chain') !== -1) return 'Цепь';
    }
    return null;
}

function driveLabel(drive, brandId) {
    if (!drive) return drive;
    const d = String(drive).toLowerCase();
    if (d.indexOf('полный') !== -1 || d === 'awd' || d.indexOf('4wd') !== -1 ||
        d.indexOf('quattro') !== -1 || d.indexOf('xdrive') !== -1 ||
        d.indexOf('4motion') !== -1 || d.indexOf('4matic') !== -1) {
        return awdName(brandId) + ' — Полный привод';
    }
    if (d.indexOf('задн') !== -1 || d === 'rwd') return 'RWD — Задний привод';
    if (d.indexOf('передн') !== -1 || d === 'fwd') return 'FWD — Передний привод';
    return drive;
}

function currentBrandId() { return currentBrand ? currentBrand.id : 'volkswagen'; }

function capType(t) {
    if (!t) return t;
    return String(t).replace(/(^|[\s(])([a-zа-яё])/g, function(m, p1, p2) { return p1 + p2.toUpperCase(); });
}

function dash(v) {
    if (v === null || v === undefined) return '—';
    const s = String(v).trim();
    if (s === '' || s === '-') return '—';
    return s;
}

// --- ПЛИТКИ МАРОК ---
function renderBrandTiles() {
    const box = $('brandTiles');
    if (!box) return;
    box.innerHTML = '';
    CONFIG.brands.forEach(function(b) {
        const tile = el('div', 'brand-tile');
        tile.dataset.brand = b.id;
        tile.title = b.name;
        const img = document.createElement('img');
        const txt = el('span', 'brand-tile-text', b.name);
        const candidates = b.logo ? [b.logo] : ['img/brands/' + b.id + '.svg', 'img/brands/' + b.id + '.png'];
        let ci = 0;
        img.onerror = function() {
            ci++;
            if (ci < candidates.length) {
                img.src = candidates[ci];
            } else {
                img.style.display = 'none';
                txt.style.display = 'block';
            }
        };
        img.alt = b.name;
        img.src = candidates[0];
        tile.appendChild(img);
        tile.appendChild(txt);
        tile.onclick = function() {
            const sel = $('brandSelect');
            if (sel) sel.value = b.id;
            onBrandChange();
        };
        box.appendChild(tile);
    });
    const addTile = el('div', 'brand-tile brand-tile-add');
    addTile.textContent = '+ Добавить марку';
    addTile.onclick = function() { openAddModal('Марка'); };
    box.appendChild(addTile);
    syncBrandTiles();
}

function syncBrandTiles() {
    const box = $('brandTiles');
    if (!box) return;
    const cur = currentBrand ? currentBrand.id : '';
    box.querySelectorAll('.brand-tile').forEach(function(t) {
        t.classList.toggle('active', t.dataset.brand === cur);
    });
}

// --- ЛЕНИВАЯ ПОДГРУЗКА БАЗ ---
function brandDBByName(varName) {
    if (window[varName]) return window[varName];
    try {
        return eval('typeof ' + varName + ' !== "undefined" ? ' + varName + ' : null');
    } catch (e) {
        return null;
    }
}

function ensureBrand(brandId) {
    const b = CONFIG.brands.find(function(x) { return x.id === brandId; });
    if (!b) return Promise.resolve(null);
    const existing = brandDBByName(b.varName);
    if (existing) return Promise.resolve(existing);
    return new Promise(function(res) {
        const s = document.createElement('script');
        s.src = b.file;
        s.onload = function() { res(brandDBByName(b.varName)); };
        s.onerror = function() { res(null); };
        document.head.appendChild(s);
    });
}

// --- CLOUD ---
function cloudSend(payload) {
    if (!CONFIG.cloudUrl) return Promise.resolve(false);
    return fetch(CONFIG.cloudUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    }).then(function(r) { return r.json(); })
      .then(function(j) { return !!(j && j.ok); })
      .catch(function() { return false; });
}

function cloudGet(action) {
    if (!CONFIG.cloudUrl) return Promise.resolve({ ok: false });
    return fetch(CONFIG.cloudUrl + '?action=' + action)
        .then(function(r) { return r.json(); })
        .catch(function() { return { ok: false }; });
}

// --- МОДАЛКИ ---
function addAddOption(selectId, labelText) {
    const sel = $(selectId);
    if (!sel) return;
    const opt = document.createElement('option');
    opt.value = '__add__';
    opt.textContent = '+ Добавить ' + labelText;
    opt.style.color = '#0066cc';
    opt.style.fontWeight = 'bold';
    sel.appendChild(opt);
}

function openAddModal(type) {
    const typeSel = $('addType');
    if (typeSel) typeSel.value = type;
    const overlay = $('addOverlay');
    if (overlay) overlay.classList.add('active');
}

function closeAddModal() {
    const overlay = $('addOverlay');
    if (overlay) overlay.classList.remove('active');
}

// --- ЖУРНАЛ РАСЧЁТОВ ---
function openJournal() {
    const overlay = $('journalOverlay');
    if (!overlay) return;
    overlay.classList.add('active');
    const list = $('journalList');
    if (!CONFIG.cloudUrl) { if (list) list.innerHTML = '<div class="calc-empty">Облако не подключено</div>'; return; }
    if (list) list.innerHTML = '<div class="calc-empty">Загружаем журнал...</div>';
    cloudGet('getCalcs').then(function(j) {
        journalItems = (j && j.ok && j.items) ? j.items : [];
        renderJournalList($('journalSearch') ? $('journalSearch').value : '');
    });
}

function closeJournal() {
    const overlay = $('journalOverlay');
    if (overlay) overlay.classList.remove('active');
}

function renderJournalList(filter) {
    const list = $('journalList');
    if (!list) return;
    const q = (filter || '').trim().toLowerCase();
    const items = journalItems.filter(function(it) {
        if (!q) return true;
        return (it.carLabel || '').toLowerCase().includes(q) || (it.manager || '').toLowerCase().includes(q);
    });
    if (items.length === 0) { list.innerHTML = '<div class="calc-empty">Ничего не найдено</div>'; return; }
    list.innerHTML = items.map(function(it) {
        return '<div class="history-card" data-row="' + it.row + '">' +
            '<div class="h-row"><span class="h-car">' + (it.carLabel || '—') + '</span><span class="h-sum">' + formatRub(it.total || 0) + '</span></div>' +
            '<div class="h-date">' + cleanDate(it.date) + '</div>' +
            '<div class="h-foot"><span class="h-works">' + (it.worksCount || 0) + ' работ' + (it.data ? '' : ' · старая запись') + '</span><span class="h-manager">' + (it.manager || '—') + '</span></div></div>';
    }).join('');
    list.querySelectorAll('.history-card').forEach(function(card) {
        card.onclick = function() {
            const row = parseInt(card.dataset.row);
            const it = journalItems.find(function(x) { return x.row === row; });
            if (!it || !it.data || !it.data.modificationId) { showToast('В этой записи нет данных для восстановления'); return; }
            closeJournal();
            restoreCalc(it.data);
            showToast('Расчёт загружен из журнала');
        };
    });
}

// --- ИСТОРИЯ (последние 5 из облака) ---
function renderHistory() {
    const section = $('historySection');
    if (!section) return;
    const list = $('historyList');
    if (!list) return;
    if (!CONFIG.cloudUrl) { renderLocalHistory(); return; }
    section.style.display = 'block';
    list.innerHTML = '<div class="calc-empty" style="padding:12px 20px">Загружаем...</div>';
    cloudGet('getCalcs').then(function(j) {
        if (!j || !j.ok) { renderLocalHistory(); return; }
        historyItems = (j.items || []).slice(0, 5);
        if (historyItems.length === 0) { section.style.display = 'none'; return; }
        list.innerHTML = historyItems.map(function(it) {
            return '<div class="history-card" data-row="' + it.row + '">' +
                '<div class="h-row"><span class="h-car">' + (it.carLabel || '—') + '</span>' +
                '<span class="h-sumwrap"><span class="h-sum">' + formatRub(it.total || 0) + '</span>' +
                '<span class="h-del" data-row="' + it.row + '" title="Удалить из общего журнала">×</span></span></div>' +
                '<div class="h-date">' + cleanDate(it.date) + '</div>' +
                '<div class="h-foot"><span class="h-works">' + (it.worksCount || 0) + ' работ</span><span class="h-manager">' + (it.manager || '—') + '</span></div></div>';
        }).join('');
        list.querySelectorAll('.h-del').forEach(function(btn) {
            btn.onclick = function(e) {
                e.stopPropagation();
                const row = parseInt(btn.dataset.row);
                if (!confirm('Удалить этот расчёт из общего журнала? Он исчезнет у всех менеджеров.')) return;
                cloudSend({ action: 'deleteCalc', row: row }).then(function(ok) {
                    showToast(ok ? 'Расчёт удалён из общего журнала' : 'Не удалось удалить');
                    renderHistory();
                });
            };
        });
        list.querySelectorAll('.history-card').forEach(function(card) {
            card.onclick = function(e) {
                if (e.target.classList.contains('h-del')) return;
                const row = parseInt(card.dataset.row);
                const it = historyItems.find(function(x) { return x.row === row; });
                if (!it || !it.data || !it.data.modificationId) { showToast('В этой записи нет данных для восстановления'); return; }
                restoreCalc(it.data);
                showToast('Расчёт загружен из общего журнала');
            };
        });
    });
}

function renderLocalHistory() {
    const section = $('historySection');
    if (!section) return;
    const list = $('historyList');
    if (!list) return;
    let history = [];
    try { history = JSON.parse(localStorage.getItem('nemesia_history') || '[]'); } catch(e) {}
    if (history.length === 0) { section.style.display = 'none'; return; }
    section.style.display = 'block';
    list.innerHTML = '';
    history.forEach(function(h) {
        const card = el('div', 'history-card');
        card.innerHTML = '<div class="h-row"><
