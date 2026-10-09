// ============================================
// НЕМЕЦИЯ — АДМИНКА (v9: очередь со статусами, без экспорта)
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
    $('whoAmI').textContent = '👤 ' + mgr.name;
    startAdmin();
}

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
            renderCoeffs();
            downloadConfig();
            showToast('Коэффициент удалён');
        };
        box.appendChild(row);
    });
}

function addCoeff() {
    const label = $('coeffNewLabel').value.trim();
    const percent = parseInt($('coeffNewPercent').value);
    if (!label || !percent) { showToast('Введите название и процент'); return; }
    CONFIG.coefficients['c' + Date.now()] = { label: label, percent: percent };
    $('coeffNewLabel').value = ''; $('coeffNewPercent').value = '';
    log('Добавление коэффициента', label + ' +' + percent + '%');
    renderCoeffs();
    downloadConfig();
    showToast('Коэффициент добавлен');
}

function renderManagers() {
    const tbody = $('managersTable');
    if (!tbody) return;
    tbody.innerHTML = '';
    CONFIG.managers.forEach(function(m, i) {
        const tr = el('tr');
        tr.innerHTML = '<td>' + m.name + '</td><td style="text-align:right"><button class="admin-btn danger" style="padding:3px 10px;font-size:11px;">Удалить</button></td>';
        tr.querySelector('button').onclick = function() {
            if (CONFIG.managers.length <= 1) { showToast('Нельзя удалить последнего менеджера'); return; }
            CONFIG.managers.splice(i, 1);
            log('Удаление менеджера', m.name);
            renderManagers();
            downloadConfig();
        };
        tbody.appendChild(tr);
    });
}

function addManager() {
    const name = $('newManagerName').value.trim();
    if (!name) { showToast('Введите имя'); return; }
    CONFIG.managers.push({ id: 'm' + Date.now(), name: name, passHash: '' });
    $('newManagerName').value = '';
    log('Добавление менеджера', name);
    renderManagers();
    downloadConfig();
    showToast('Менеджер добавлен');
}

// --- ОЧЕРЕДЬ ЗАЯВОК v2: старые сверху, новые внизу, максимум 3 в кадре, статусы ---
const STATUSES = ['Новая', 'В работе', 'Завершена'];

function renderVinQueue() {
    const container = $('vinQueueList');
    if (!container) return;
    let localQueue = [];
    try { localQueue = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]'); } catch(e) {}
    if (!CONFIG.cloudUrl) { drawQueue(container, [], localQueue, false); return; }
    container.innerHTML = '<div class="queue-empty">Загружаем из облака...</div>';
    cloudGet('action=getRequests').then(function(j) {
        let cloudItems = (j && j.ok && j.items) ? j.items : [];
        cloudItems = cloudItems.slice().reverse(); // старые сверху, новые внизу
        drawQueue(container, cloudItems, localQueue, !j.ok);
    });
}

function drawQueue(container, cloudItems, localItems, cloudError) {
    let banner = cloudError ? '<div class="queue-empty">Облако недоступно — показаны локальные заявки</div>' : '';
    let bodyHtml = '';
    localItems.forEach(function(item, i) {
        bodyHtml += '<div class="queue-item"><div class="queue-header"><span class="queue-type-badge" style="background:var(--danger);color:#fff">ждёт отправки</span>' +
            '<span class="queue-date">' + fmtShort(item.date) + '</span></div>' +
            (item.description ? '<div class="queue-desc"><strong>Описание:</strong> ' + item.description + '</div>' : '') +
            (item.vin ? '<div class="queue-vin"><strong>VIN:</strong> ' + item.vin + '</div>' : '') +
            '<div class="queue-foot"><span class="queue-manager">Менеджер: ' + (item.manager || '—') + '</span></div>' +
            '<button class="queue-remove" data-local="' + i + '" title="Удалить">×</button></div>';
    });
    cloudItems.forEach(function(item) {
        const opts = STATUSES.map(function(st) {
            return '<option value="' + st + '"' + ((item.status || 'Новая') === st ? ' selected' : '') + '>' + st + '</option>';
        }).join('');
        bodyHtml += '<div class="queue-item"><div class="queue-header"><span class="queue-type-badge">' + (item.type || 'Запрос') + '</span>' +
            '<span class="queue-date">' + item.date + '</span></div>' +
            (item.description ? '<div class="queue-desc"><strong>Описание:</strong> ' + item.description + '</div>' : '') +
            (item.vin ? '<div class="queue-vin"><strong>VIN:</strong> ' + item.vin + '</div>' : '') +
            (item.comment ? '<div class="queue-comment"><strong>Комментарий:</strong> ' + item.comment + '</div>' : '') +
            '<div class="queue-foot"><span class="queue-manager">Менеджер: ' + (item.manager || '—') + '</span>' +
            '<select class="queue-status" data-row="' + item.row + '" title="Статус заявки">' + opts + '</select></div>' +
            '<button class="queue-remove" data-row="' + item.row + '" title="Удалить">×</button></div>';
    });
    if (bodyHtml === '') bodyHtml = '<div class="queue-empty">Очередь запросов пуста</div>';
    container.innerHTML = banner + bodyHtml;

    container.querySelectorAll('.queue-remove[data-local]').forEach(function(btn) {
        btn.onclick = function() {
            const idx = parseInt(btn.dataset.local);
            let q = [];
            try { q = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]'); } catch(e) {}
            q.splice(idx, 1);
            localStorage.setItem('nemesia_vinQueue', JSON.stringify(q));
            renderVinQueue();
            showToast('Локальная заявка удалена');
        };
    });
    container.querySelectorAll('.queue-remove[data-row]').forEach(function(btn) {
        btn.onclick = function() {
            const row = parseInt(btn.dataset.row);
            cloudSend({ action: 'deleteRequest', row: row }).then(function(ok) {
                if (ok) log('Удаление заявки', 'строка ' + row);
                renderVinQueue();
                showToast('Заявка удалена из таблицы');
            });
        };
    });
    container.querySelectorAll('.queue-status').forEach(function(sel) {
        sel.onchange = function() {
            const row = parseInt(sel.dataset.row);
            const status = sel.value;
            cloudSend({ action: 'setStatus', row: row, status: status }).then(function(ok) {
                if (!ok) { showToast('Не удалось сменить статус'); renderVinQueue(); return; }
                if (status === 'Завершена') {
                    log('Заявка завершена и удалена', 'строка ' + row);
                    showToast('Заявка завершена и убрана из очереди');
                } else {
                    log('Смена статуса заявки', status + ' (строка ' + row + ')');
                    showToast('Статус: ' + status);
                }
                renderVinQueue();
            });
        };
    });
}

function fmtShort(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso || '');
    return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// --- ФОРМА МОДИФИКАЦИИ ---
function brandDBByName(varName) {
    if (window[varName]) return window[varName];
    try {
        return eval('typeof ' + varName + ' !== "undefined" ? ' + varName + ' : null');
    } catch (e) {
        return null;
    }
}

function ensureBrandData(brandId) {
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

function currentTempMod() {
    const pfSel = $('modPf').value;
    return {
        id: EDIT_ID || 'temp',
        model: $('modModel').value.trim() || '?',
        generation: $('modGen').value.trim() || '?',
        engine: { code: $('modEngineCode').value.trim(), volume: $('modEngineVol').value.trim(), power: $('modEnginePower').value.trim(), torque: $('modEngineTorque').value.trim() },
        gearbox: { code: $('modGbCode').value.trim(), type: $('modGbType').value.trim(), gears: parseInt($('modGbGears').value) || 0 },
        drive: $('modDrive').value,
        awdSys: $('modAwdSys').value || undefined,
        suspension: $('modSuspension').value,
        rear: $('modRear').value,
        parking: $('modParking').value,
        battery: $('modBattery').value,
        pf: pfSel === 'yes' ? true : (pfSel === 'no' ? false : undefined)
    };
}

function passportText(mod) {
    if (typeof buildPassport !== 'function') return '—';
    const p = buildPassport(mod);
    const parts = [];
    parts.push(p.fuel === 'diesel' ? 'дизель' : (p.fuel === 'petrol' ? 'бензин' : 'топливо?'));
    parts.push(p.timing === 'belt' ? 'ремень' : (p.timing === 'chain' ? 'цепь' : 'ГРМ?'));
    if (p.turbo) parts.push('турбо');
    if (p.pf) parts.push('DPF/GPF');
    parts.push(p.gbType === 'dsg' ? 'робот' : (p.gbType === 'manual' ? 'механика' : (p.gbType === 'automatic' ? 'автомат' : 'КПП?')));
    parts.push(p.drive === 'awd' ? 'полный' : (p.drive === 'rwd' ? 'задний' : 'передний'));
    if (p.awdSys) parts.push(p.awdSys);
    parts.push(p.suspension === 'air' ? 'пневмо' : 'пружины');
    parts.push(p.rear === 'beam' ? 'балка' : 'многорычажка');
    parts.push(p.parking === 'epb' ? 'электроручник' : 'мехручник');
    parts.push('АКБ: ' + (p.battery === 'hood' ? 'капот' : (p.battery === 'trunk' ? 'багажник' : 'сиденье')));
    return parts.join(' · ');
}

function refreshPassportPreview() {
    const mod = currentTempMod();
    $('passportPreview').textContent = 'Паспорт: ' + passportText(mod);
    renderCustomNhTable(mod);
}

function renderCustomNhTable(mod) {
    const container = $('modWorksList');
    if (!container) return;
    const saved = {};
    container.querySelectorAll('input[data-wid]').forEach(function(inp) { saved[inp.dataset.wid] = inp.value; });
    const list = (typeof collectWorks === 'function') ? collectWorks(mod) : [];
    const byCat = {};
    list.forEach(function(wid) {
        const w = worksCatalog[wid];
        if (!w) return;
        if (!byCat[w.cat]) byCat[w.cat] = [];
        byCat[w.cat].push(wid);
    });
    container.innerHTML = '';
    if (list.length === 0) {
        container.innerHTML = '<div style="font-size:12px;color:var(--text-muted);">Не удалось собрать список работ: проверьте коды ДВС и КПП по справочникам.</div>';
        return;
    }
    Object.keys(categories).forEach(function(catKey) {
        if (!byCat[catKey]) return;
        const h = el('div', 'work-category-header');
        h.style.cursor = 'pointer';
        h.style.marginTop = '8px';
        h.innerHTML = '<span class="arrow" style="font-size:9px;transition:transform 0.15s;display:inline-block;width:12px">▶</span> <span class="cat-icon">' + catIcon(catKey) + '</span> ' + categories[catKey] + ' <span style="margin-left:auto;font-size:11px;color:var(--text-muted)">' + byCat[catKey].length + '</span>';
        const body = el('div', 'work-category-body');
        body.style.display = 'none';
        h.onclick = function() {
            const expanded = h.classList.toggle('expanded');
            body.style.display = expanded ? 'block' : 'none';
            h.querySelector('.arrow').style.transform = expanded ? 'rotate(90deg)' : '';
        };
        byCat[catKey].forEach(function(wid) {
            const w = worksCatalog[wid];
            const row = el('div', 'mod-form-row');
            row.innerHTML = '<div class="mod-group" style="flex:3"><label>' + w.name + '</label></div>' +
                '<div class="mod-group" style="flex:1"><label>Н/ч (база ' + w.nh + ')</label><input type="number" class="admin-input" data-wid="' + wid + '" step="0.1" placeholder="' + w.nh + '" value="' + (saved[wid] || '') + '"></div>';
            body.appendChild(row);
        });
        container.appendChild(h);
        container.appendChild(body);
    });
}

function initModForm() {
    const brandSel = $('modBrand');
    if (!brandSel) return;
    brandSel.innerHTML = CONFIG.brands.map(function(b) { return '<option value="' + b.id + '">' + b.name + '</option>'; }).join('');
    brandSel.onchange = function() {
        EDIT_ID = null;
        loadEditOptions();
        refreshPassportPreview();
    };
    if ($('modEditSelect')) $('modEditSelect').onchange = function() { EDIT_ID = this.value || null; };
    if ($('modLoadBtn')) $('modLoadBtn').onclick = loadModIntoForm;
    ['modEngineCode', 'modGbCode', 'modDrive', 'modAwdSys', 'modSuspension', 'modRear', 'modParking', 'modBattery', 'modPf'].forEach(function(id) {
        const node = $(id);
        if (node) node.onchange = refreshPassportPreview;
    });
    loadEditOptions();
    refreshPassportPreview();
    if ($('saveModBtn')) $('saveModBtn').onclick = saveMod;
}

function loadEditOptions() {
    const brandId = $('modBrand').value;
    const sel = $('modEditSelect');
    sel.innerHTML = '<option value="">— новая модификация —</option>';
    ensureBrandData(brandId).then(function(db) {
        brandDataCache = db;
        if (!db) return;
        db.modifications.forEach(function(m) {
            sel.insertAdjacentHTML('beforeend', '<option value="' + m.id + '">' + m.model + ' ' + m.generation + ' · ' + m.engine.code + ' · ' + m.gearbox.code + '</option>');
        });
    });
}

function loadModIntoForm() {
    const id = $('modEditSelect').value;
    if (!id || !brandDataCache) { showToast('Выберите модификацию'); return; }
    const m = brandDataCache.modifications.find(function(x) { return x.id === id; });
    if (!m) return;
    EDIT_ID = m.id;
    $('modModel').value = m.model;
    $('modGen').value = m.generation;
    $('modEngineCode').value = m.engine.code;
    $('modEngineVol').value = m.engine.volume;
    $('modEnginePower').value = m.engine.power;
    $('modEngineTorque').value = m.engine.torque;
    $('modGbCode').value = m.gearbox.code;
    $('modGbType').value = m.gearbox.type;
    $('modGbGears').value = m.gearbox.gears;
    $('modDrive').value = (m.drive || '').indexOf('Полный') !== -1 ? 'Полный' : ((m.drive || '').indexOf('Задн') !== -1 ? 'Задний' : 'Передний');
    $('modAwdSys').value = m.awdSys || '';
    $('modSuspension').value = m.suspension || 'spring';
    $('modRear').value = m.rear || 'multilink';
    $('modParking').value = m.parking || 'epb';
    $('modBattery').value = m.battery || 'hood';
    $('modPf').value = (m.pf === true) ? 'yes' : (m.pf === false ? 'no' : 'auto');
    const f = m.fluids || {};
    $('flOilVol').value = f.engine_oil ? f.engine_oil.volume : '';
    $('flOilSpec').value = f.engine_oil ? f.engine_oil.spec : '';
    $('flOilVisc').value = f.engine_oil ? f.engine_oil.viscosity : '';
    $('flGbVol').value = f.gearbox_oil ? f.gearbox_oil.volume : '';
    $('flGbSpec').value = f.gearbox_oil ? f.gearbox_oil.spec : '';
    $('flTfVol').value = f.transfer_case ? f.transfer_case.volume : '';
    $('flTfSpec').value = f.transfer_case ? f.transfer_case.spec : '';
    $('flDfVol').value = f.diff_front ? f.diff_front.volume : '';
    $('flDrVol').value = f.diff_rear ? f.diff_rear.volume : '';
    $('flCoolVol').value = f.coolant ? f.coolant.volume : '';
    $('flCoolSpec').value = f.coolant ? f.coolant.spec : '';
    $('flBrSpec').value = f.brake_fluid ? f.brake_fluid.spec : '';
    $('flPsVol').value = f.power_steering ? f.power_steering.volume : '';
    $('flAcVol').value = f.refrigerant ? f.refrigerant.volume : '';
    $('flAcSpec').value = f.refrigerant ? f.refrigerant.spec : '';
    refreshPassportPreview();
    const cn = m.customNh || {};
    document.querySelectorAll('#modWorksList input[data-wid]').forEach(function(inp) {
        if (cn[inp.dataset.wid] !== undefined) inp.value = cn[inp.dataset.wid];
    });
    showToast('Модификация загружена в форму');
}

function saveMod() {
    const brandId = $('modBrand').value;
    const brand = CONFIG.brands.find(function(b) { return b.id === brandId; });
    const brandLabel = brand ? brand.name : '';
    const model = $('modModel').value.trim();
    const gen = $('modGen').value.trim();
    if (!model || !gen) { showToast('Заполните модель и поколение'); return; }
    const engineCode = $('modEngineCode').value.trim();
    const gbCode = $('modGbCode').value.trim();
    if (!CONFIG.refs.engineCodes[engineCode]) { showToast('Код ДВС не найден в справочнике семейств'); return; }
    if (!CONFIG.refs.gearboxFamilies[gbCode]) { showToast('Код КПП не найден в справочнике семейств'); return; }
    function fluidOrEmpty(vol, spec, visc) {
        if (!vol && !spec) return null;
        return { volume: vol || '-', spec: spec || '-', viscosity: visc || '-' };
    }
    const pfSel = $('modPf').value;
    const driveRaw = $('modDrive').value;
    const awdSys = $('modAwdSys').value;
    const drive = driveRaw === 'Полный' ? ('Полный (' + ((typeof AWD_NAMES !== 'undefined' ? AWD_NAMES[brandId] : '') || awdSys || '4WD') + (awdSys === 'torsen' ? ' Torsen' : '') + ')') : driveRaw;
    const customNh = {};
    document.querySelectorAll('#modWorksList input[data-wid]').forEach(function(inp) {
        const v = parseFloat(inp.value);
        if (v > 0) customNh[inp.dataset.wid] = v;
    });
    const newMod = {
        id: EDIT_ID || (brandId + '_' + engineCode.toLowerCase() + '_' + Date.now().toString(36)),
        model: model,
        generation: gen,
        engine: { code: engineCode, volume: $('modEngineVol').value.trim(), power: $('modEnginePower').value.trim(), torque: $('modEngineTorque').value.trim() },
        gearbox: { code: gbCode, type: $('modGbType').value.trim(), gears: parseInt($('modGbGears').value) || 0 },
        drive: drive,
        suspension: $('modSuspension').value,
        rear: $('modRear').value,
        parking: $('modParking').value,
        battery: $('modBattery').value,
        fluids: {
            engine_oil: fluidOrEmpty($('flOilVol').value, $('flOilSpec').value, $('flOilVisc').value),
            gearbox_oil: fluidOrEmpty($('flGbVol').value, $('flGbSpec').value, '-'),
            transfer_case: (driveRaw === 'Полный') ? fluidOrEmpty($('flTfVol').value, $('flTfSpec').value, '-') : null,
            diff_front: (driveRaw === 'Полный' && awdSys === 'torsen') ? fluidOrEmpty($('flDfVol').value, '', '-') : null,
            diff_rear: (driveRaw === 'Полный') ? fluidOrEmpty($('flDrVol').value, '', '-') : null,
            coolant: fluidOrEmpty($('flCoolVol').value, $('flCoolSpec').value, '-'),
            brake_fluid: { volume: '-', spec: $('flBrSpec').value || 'DOT 4', viscosity: '-' },
            power_steering: fluidOrEmpty($('flPsVol').value, '-', '-'),
            refrigerant: fluidOrEmpty($('flAcVol').value, $('flAcSpec').value, '-')
        },
        customNh: customNh
    };
    if (awdSys) newMod.awdSys = awdSys;
    if (pfSel === 'yes') newMod.pf = true;
    if (pfSel === 'no') newMod.pf = false;
    ensureBrandData(brandId).then(function(db) {
        if (!db) { showToast('База марки не загружена'); return; }
        if (EDIT_ID) {
            const idx = db.modifications.findIndex(function(x) { return x.id === EDIT_ID; });
            if (idx === -1) { showToast('Модификация не найдена'); return; }
            db.modifications[idx] = newMod;
            log('Редактирование модификации', brandLabel + ' ' + model + ' ' + gen + ' (' + engineCode + ')');
        } else {
            db.modifications.push(newMod);
            log('Добавление модификации', brandLabel + ' ' + model + ' ' + gen + ' (' + engineCode + ')');
        }
        const varName = brandId + 'DB';
        const content = '// ' + brandLabel + ' база (обновлено ' + new Date().toLocaleString('ru-RU') + ')\nconst ' + varName + ' = ' + JSON.stringify(db, null, 2) + ';';
        const blob = new Blob([content], { type: 'text/javascript' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = brandId + '.js';
        a.click();
        URL.revokeObjectURL(a.href);
        showToast('Файл ' + brandId + '.js скачан — положите его в папку brands/ и запушьте');
    });
}

function downloadConfig() {
    const content = '// КОНФИГУРАЦИЯ СИСТЕМЫ (обновлено ' + new Date().toLocaleString('ru-RU') + ')\n' +
        'const CONFIG = ' + JSON.stringify(CONFIG, null, 2) + ';\n\n' +
        '// Каталог работ\nconst worksCatalog = ' + JSON.stringify(worksCatalog, null, 2) + ';\n\n' +
        'const categories = ' + JSON.stringify(categories, null, 2) + ';\n\n' +
        'const CAT_ICONS = ' + JSON.stringify((typeof CAT_ICONS !== 'undefined' ? CAT_ICONS : CAT_ICONS_LOCAL), null, 2) + ';\n\n' +
        'const AWD_NAMES = ' + JSON.stringify((typeof AWD_NAMES !== 'undefined' ? AWD_NAMES : {}), null, 2) + ';\n\n' +
        'function buildPassport(mod) { ' + (typeof buildPassport === 'function' ? buildPassport.toString() : '') + ' }\n\n' +
        'function collectWorks(mod) { ' + (typeof collectWorks === 'function' ? collectWorks.toString() : '') + ' }\n\n' +
        'function validateWorks(brandData, brandName) { ' + (typeof validateWorks === 'function' ? validateWorks.toString() : '') + ' }';
    const blob = new Blob([content], { type: 'text/javascript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'config.js';
    a.click();
    URL.revokeObjectURL(a.href);
}

function showToast(msg) {
    let toast = document.getElementById('adminToast');
    if (!toast) {
        toast = el('div');
        toast.id = 'adminToast';
        toast.style.cssText = 'position:fixed;bottom:20px;right:20px;left:20px;background:var(--bg-card);border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:2px;padding:12px 16px;box-shadow:0 4px 12px rgba(0,0,0,0.12);font-size:13px;z-index:4000;display:none;';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(function() { toast.style.display = 'none'; }, 3000);
}

function init() {
    const savedTheme = localStorage.getItem('nemesia_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if ($('themeToggle')) {
        $('themeToggle').checked = (savedTheme === 'dark');
        $('themeToggle').onchange = function() {
            const theme = $('themeToggle').checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('nemesia_theme', theme);
        };
    }
    SESSION = readSession();
    if (SESSION) {
        $('loginOverlay').style.display = 'none';
        $('adminRoot').classList.add('unlocked');
        $('whoAmI').textContent = '👤 ' + SESSION.name;
        startAdmin();
    } else {
        initLogin();
    }
}

document.addEventListener('DOMContentLoaded', init);
})();
