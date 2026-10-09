// ============================================
// НЕМЕЦИЯ — ОБЩЕЕ ЯДРО (core.js)
// Общие функции для калькулятора и админки
// ============================================

// --- DOM-хелперы ---
const $ = function(id) { return document.getElementById(id); };
const el = function(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
};

// --- Утилиты ---
function formatRub(n) { return n.toLocaleString('ru-RU') + ' ₽'; }
function debounce(fn, ms) {
    let t;
    return function() {
        const args = arguments;
        clearTimeout(t);
        t = setTimeout(function() { fn.apply(null, args); }, ms);
    };
}

// Дата: если пришёл хвост "GMT+0600 (Омск...)" — форматируем заново
function cleanDate(s) {
    const str = String(s || '');
    if (str.indexOf('GMT') === -1) return str;
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// --- Облако ---
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

function cloudGet(query) {
    if (!CONFIG.cloudUrl) return Promise.resolve({ ok: false });
    return fetch(CONFIG.cloudUrl + '?' + query)
        .then(function(r) { return r.json(); })
        .catch(function() { return { ok: false }; });
}

// --- Ленивая загрузка базы марки ---
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
