// ============================================
// НЕМЕЦИЯ — АДМИНКА (финальная сборка)
// ============================================
(function() {
'use strict';
const $ = function(id) { return document.getElementById(id); };
const el = function(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
};

let SESSION = null;
let EDIT_ID = null;
let brandDataCache = null;

const CAT_ICONS_LOCAL = {
    to: '🛢️', diag: '🔬', engine: '⚙️', engine_big: '🏗️', gearbox: '🔄', awd: '🧭',
    suspension: '🌀', brakes: '🛑', steering: '🛞', electrics: '⚡', climate: '❄️', exhaust: '💨'
};
function catIcon(k) {
    if (typeof CAT_ICONS !== 'undefined' && CAT_ICONS[k]) return CAT_ICONS[k];
    return CAT_ICONS_LOCAL[k] || '';
}

const BRAND_PREFIX = { volkswagen: 'vw', mercedes: 'mb' };
function brandIdPrefix(brandId) {
    return BRAND_PREFIX[brandId] || brandId;
}

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

function log(act, details) {
    if (!SESSION) return;
    cloudSend({ action: 'addLog', manager: SESSION.name, act: act, details: details || '', date: new Date().toISOString() });
}

function sha256(text) {
    if (window.crypto && crypto.subtle && window.TextEncoder) {
        return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function(buf) {
            return Array.prototype.map.call(new Uint8Array(buf), function(b) { return ('0' + b.toString(16)).slice(-2); }).join('');
        });
    }
    let h1 = 5381, h2 = 52711;
    for (let i = 0; i < text.length; i++) { const c = text.charCodeAt(i); h1 = ((h1 * 33) ^ c) >>> 0; h2 = ((h2 * 31) ^ c) >>> 0; }
    return Promise.resolve('fb' + h1.toString(16) + h2.toString(16));
}

function readSession() {
    try {
        const s = JSON.parse(localStorage.getItem('nemesia_admin_session') || 'null');
        if (s && s.exp && Date.now() < s.exp) return s;
    } catch(e) {}
    return null;
}
function writeSession(mgr) {
    SESSION = { id: mgr.id, name: mgr.name, exp: Date.now() + 24 * 3600 * 1000 };
    localStorage.setItem('nemesia_admin_session', JSON.stringify(SESSION));
}
function clearSession() {
    SESSION = null;
    localStorage.removeItem('nemesia_admin_session');
}

function fmtShort(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso || '');
    return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function cleanDate(s) {
    const str = String(s || '');
    if (str.indexOf('GMT') === -1) return str;
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// --- ВХОД ---
function initLogin() {
    const sel = $('loginManager');
    sel.innerHTML = CONFIG.managers.map(function(m) { return '<option value="' + m.id + '">' + m.name + '</option>'; }).join('');
    $('loginBtn').onclick = doLogin;
    $('loginPass').addEventListener('keydown', function(e) { if (e.key === 'Enter') doLogin(); });
}

function doLogin() {
    const err = $('loginErr');
    err.textContent = '';
    if (!CONFIG.cloudUrl) { err.textContent = 'Не задан cloudUrl в config.js — вход невозможен.'; return; }
    const mgr = CONFIG.managers.find(function(m) { return m.id === $('loginManager').value; });
    const pass = $('loginPass').value;
    if (!mgr || !pass) { err.textContent = 'Выберите менеджера и введите пароль.'; return; }
    cloudGet('action=getPass&m=' + encodeURIComponent(mgr.id)).then(function(j) {
        const stored = (j && j.ok) ? (j.hash || '') : null;
        if (stored === null) { err.textContent = 'Облако недоступно.'; return; }
        sha256(pass).then(function(hash) {
            if (stored === '') {
                const pass2 = $('loginPass2').value;
                if ($('setupFields').style.display === 'none') {
                    $('setupFields').style.display = 'block';
                    err.textContent = 'Пароль ещё не задан — повторите новый пароль и нажмите «Войти» снова.';
                    return;
                }
                if (pass !== pass2) { err.textContent = 'Пароли не совпадают.'; return; }
                if (pass.length < 6) { err.textContent = 'Минимум 6 символов.'; return; }
                cloudSend({ action: 'setPass', m: mgr.id, name: mgr.name, hash: hash, date: new Date().toISOString() }).then(function(ok) {
                    if (!ok) { err.textContent = 'Не удалось сохранить пароль.'; return; }
                    cloudSend({ action: 'addLog', manager: mgr.name, act: 'Установлен первичный пароль', details: '', date: new Date().toISOString() });
                    enter(mgr);
                });
            } else if (stored === hash) {
                cloudSend({ action: 'addLog', manager: mgr.name, act: 'Вход в админку', details: '', date: new Date().toISOString() });
                enter(mgr);
            } else {
                cloudSend({ action: 'addLog', manager: mgr.name, act: 'НЕУДАЧНЫЙ вход', details: 'неверный пароль', date: new Date().toISOString() });
                err.textContent = 'Неверный пароль.';
            }
        });
    });
}

function enter(mgr) {
    writeSession(mgr);
    $('loginOverlay').style.display = 'none';
    $('adminRoot').classList.add('unlocked');
    $('whoAmI').textContent = mgr.name;
    startAdmin();
}

// --- СТАРТ АДМИНКИ ---
function startAdmin() {
    if ($('rateEngine')) $('rateEngine').value = CONFIG.rates.engine;
    if ($('rateStandard')) $('rateStandard').value = CONFIG.rates.standard;
    if ($('saveRatesBtn')) $('saveRatesBtn').onclick = saveRates;

    if ($('coeffRusty') && CONFIG.coefficients.rusty_bolts) $('coeffRusty').value = CONFIG.coefficients.rusty_bolts.percent;
    if ($('coeffAluminum') && CONFIG.coefficients.aluminum) $('coeffAluminum').value = CONFIG.coefficients.aluminum.percent;
    if ($('coeffLpg') && CONFIG.coefficients.lpg) $('coeffLpg').value = CONFIG.coefficients.lpg.percent;
    if ($('saveCoeffsBtn')) $('saveCoeffsBtn').onclick = saveCoeffs;
    renderCoeffs();
    if ($('addCoeffBtn')) $('addCoeffBtn').onclick = addCoeff;

    renderManagers();
    if ($('addManagerBtn')) $('addManagerBtn').onclick = addManager;

    renderVinQueue();

    if ($('logoutBtn')) $('logoutBtn').onclick = function() {
        log('Выход из админки', '');
        clearSession();
        location.reload();
    };
    if ($('chgPassBtn')) $('chgPassBtn').onclick = changePass;

    initModForm();
}

function changePass() {
    const oldP = $('chgOld').value, newP = $('chgNew').value, newP2 = $('chgNew2').value;
    if (!oldP || !newP || newP !== newP2) { showToast('Проверьте поля нового пароля'); return; }
    if (newP.length < 6) { showToast('Минимум 6 символов'); return; }
    cloudGet('action=getPass&m=' + encodeURIComponent(SESSION.id)).then(function(j) {
        const stored = (j && j.ok) ? (j.hash || '') : null;
        sha256(oldP).then(function(oldHash) {
            if (stored !== oldHash) { showToast('Текущий пароль неверен'); return; }
            sha256(newP).then(function(newHash) {
                cloudSend({ action: 'setPass', m: SESSION.id, name: SESSION.name, hash: newHash, date: new Date().toISOString() }).then(function(ok) {
                    if (!ok) { showToast('Не удалось сменить пароль'); return; }
                    log('Смена пароля', '');
                    $('chgOld').value = ''; $('chgNew').value = ''; $('chgNew2').value = '';
                    showToast('Пароль изменён');
                });
            });
        });
    });
}

// --- СТАВКИ / КОЭФФИЦИЕНТЫ ---
function saveRates() {
    const oldE = CONFIG.rates.engine, oldS = CONFIG.rates.standard;
    CONFIG.rates.engine = parseInt($('rateEngine').value) || 3000;
    CONFIG.rates.standard = parseInt($('rateStandard').value) || 2500;
    log('Изменение ставок', 'ДВС/КПП: ' + oldE + '→' + CONFIG.rates.engine + '; остальные: ' + oldS + '→' + CONFIG.rates.standard);
    downloadConfig();
    showToast('Ставки сохранены');
}

function saveCoeffs() {
    const changes = [];
    if (CONFIG.coefficients.rusty_bolts) { const v = parseInt($('coeffRusty').value); if (v && v !== CONFIG.coefficients.rusty_bolts.percent) { changes.push('болты ' + CONFIG.coefficients.rusty_bolts.percent + '→' + v); CONFIG.coefficients.rusty_bolts.percent = v; } }
    if (CONFIG.coefficients.aluminum) { const v = parseInt($('coeffAluminum').value); if (v && v !== CONFIG.coefficients.aluminum.percent) { changes.push('алюминий ' + CONFIG.coefficients.aluminum.percent + '→' + v); CONFIG.coefficients.aluminum.percent = v; } }
    if (CONFIG.coefficients.lpg) { const v = parseInt($('coeffLpg').value); if (v && v !== CONFIG.coefficients.lpg.percent) { changes.push('ГБО ' + CONFIG.coefficients.lpg.percent + '→' + v); CONFIG.coefficients.lpg.percent = v; } }
    if (changes.length) log('Изменение коэффициентов', changes.join('; '));
    downloadConfig();
    showToast('Коэффициенты сохранены');
}

function renderCoeffs() {
    const box = $('coeffList');
    if (!box) return;
    box.innerHTML = '';
    const keys = Object.keys(CONFIG.coefficients);
    if (keys.length === 0) { box.innerHTML = '<div style="font-size:12px;color:var(--text-muted);padding:4px 0;">Коэффициентов нет</div>'; return; }
    keys.forEach(function(key) {
        const c = CONFIG.coefficients[key];
        const row = el('div');
        row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:5px 0;font-size:13px;border-bottom:1px solid var(--border-light);';
        row.innerHTML = '<span style="flex:1;font-weight:600;">' + c.label + ' <span style="color:var(--text-muted);font-weight:400;">(+' + c.percent + '%)</span></span>' +
            '<button class="admin-btn danger" style="padding:3px 10px;font-size:11px;">Удалить</button>';
        row.querySelector('button').onclick = function() {
            if (!confirm('Удалить коэффициент «' + c.label + '»?')) return;
            delete CONFIG.coefficients[key];
            log('Удаление коэффициента', c.label);
           
