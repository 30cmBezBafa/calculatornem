(function() {
'use strict';
const $ = function(id) { return document.getElementById(id); };
const el = function(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
};

const CAT_ICONS = {
    to: '🛢️', engine: '⚙️', engine_big: '🏗️', gearbox: '🔄', awd: '🧭',
    suspension: '🌀', brakes: '🛑', steering: '🛞', electrics: '⚡', exhaust: '💨'
};

function cloudGet(action) {
    if (!CONFIG.cloudUrl) return Promise.resolve({ ok: false });
    return fetch(CONFIG.cloudUrl + '?action=' + action)
        .then(function(r) { return r.json(); })
        .catch(function() { return { ok: false }; });
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
    if (CONFIG.cloudUrl) setInterval(renderVinQueue, 30000);
    if ($('exportVinBtn')) $('exportVinBtn').onclick = exportVinQueue;

    initModForm();
}

function saveRates() {
    CONFIG.rates.engine = parseInt($('rateEngine').value) || 3000;
    CONFIG.rates.standard = parseInt($('rateStandard').value) || 2500;
    downloadConfig();
    showToast('Ставки сохранены');
}

function saveCoeffs() {
    if (CONFIG.coefficients.rusty_bolts) CONFIG.coefficients.rusty_bolts.percent = parseInt($('coeffRusty').value) || CONFIG.coefficients.rusty_bolts.percent;
    if (CONFIG.coefficients.aluminum) CONFIG.coefficients.aluminum.percent = parseInt($('coeffAluminum').value) || CONFIG.coefficients.aluminum.percent;
    if (CONFIG.coefficients.lpg) CONFIG.coefficients.lpg.percent = parseInt($('coeffLpg').value) || CONFIG.coefficients.lpg.percent;
    downloadConfig();
    showToast('Коэффициенты сохранены');
}

function renderCoeffs() {
    const box = $('coeffList');
    if (!box) return;
    box.innerHTML = '';
    const keys = Object.keys(CONFIG.coefficients);
    if (keys.length === 0) {
        box.innerHTML = '<div style="font-size:12px;color:var(--text-muted);padding:4px 0;">Коэффициентов нет</div>';
        return;
    }
    keys.forEach(function(key) {
        const c = CONFIG.coefficients[key];
        const row = el('div');
        row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:5px 0;font-size:13px;border-bottom:1px solid var(--border-light);';
        row.innerHTML = '<span style="flex:1;font-weight:600;">' + c.label + ' <span style="color:var(--text-muted);font-weight:400;">(+' + c.percent + '%)</span></span>' +
            '<button class="admin-btn danger" style="padding:3px 10px;font-size:11px;">Удалить</button>';
        row.querySelector('button').onclick = function() {
            if (!confirm('Удалить коэффициент «' + c.label + '»?')) return;
            delete CONFIG.coefficients[key];
            renderCoeffs();
            downloadConfig();
            showToast('Коэффициент удалён');
        };
        box.appendChild(row);
    });
}

function addCoeff() {
    const labelEl = $('coeffNewLabel');
    const percentEl = $('coeffNewPercent');
    if (!labelEl || !percentEl) return;
    const label = labelEl.value.trim();
    const percent = parseInt(percentEl.value);
    if (!label || !percent) { showToast('Введите название и процент'); return; }
    const key = 'c' + Date.now();
    CONFIG.coefficients[key] = { label: label, percent: percent };
    labelEl.value = '';
    percentEl.value = '';
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
        tr.innerHTML = '<td>' + m.name + '</td><td style="text-align:right"><button class="admin-btn danger" style="padding:3px 10px;font-size:11px;" data-idx="' + i + '">Удалить</button></td>';
        tr.querySelector('button').onclick = function() {
            if (CONFIG.managers.length <= 1) { showToast('Нельзя удалить последнего менеджера'); return; }
            CONFIG.managers.splice(i, 1);
            renderManagers();
            downloadConfig();
        };
        tbody.appendChild(tr);
    });
}

function addManager() {
    const name = $('newManagerName').value.trim();
    if (!name) { showToast('Введите имя'); return; }
    CONFIG.managers.push({ id: 'm' + Date.now(), name: name });
    $('newManagerName').value = '';
    renderManagers();
    downloadConfig();
    showToast('Менеджер добавлен');
}

function renderVinQueue() {
    const container = $('vinQueueList');
    if (!container) return;
    let localQueue = [];
    try { localQueue = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]'); } catch(e) {}
    if (!CONFIG.cloudUrl) { drawQueue(container, [], localQueue, false); return; }
    container.innerHTML = '<div class="queue-empty">Загружаем из облака...</div>';
    cloudGet('getRequests').then(function(j) {
        const cloudItems = (j && j.ok && j.items) ? j.items : [];
        drawQueue(container, cloudItems, localQueue, !j.ok);
    });
}

function drawQueue(container, cloudItems, localItems, cloudError) {
    let banner = cloudError ? '<div class="queue-empty">Облако недоступно — показаны локальные заявки</div>' : '';
    let bodyHtml = '';
    localItems.forEach(function(item, i) {
        bodyHtml += '<div class="queue-item"><div class="queue-header"><span class="queue-type-badge" style="background:var(--danger);color:#fff">ждёт отправки</span>' +
            '<span class="queue-date">' + new Date(item.date).toLocaleString('ru-RU', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'}) + '</span></div>' +
            (item.description ? '<div class="queue-desc"><strong>Описание:</strong> ' + item.description + '</div>' : '') +
            (item.vin ? '<div class="queue-vin"><strong>VIN:</strong> ' + item.vin + '</div>' : '') +
            '<div class="queue-manager">Менеджер: ' + (item.manager || '—') + '</div>' +
            '<button class="queue-remove" data-local="' + i + '" title="Удалить">×</button></div>';
    });
    cloudItems.forEach(function(item) {
        bodyHtml += '<div class="queue-item"><div class="queue-header"><span class="queue-type-badge">' + (item.type || 'Запрос') + '</span>' +
            '<span class="queue-date">' + item.date + '</span></div>' +
            (item.description ? '<div class="queue-desc"><strong>Описание:</strong> ' + item.description + '</div>' : '') +
            (item.vin ? '<div class="queue-vin"><strong>VIN:</strong> ' + item.vin + '</div>' : '') +
            (item.comment ? '<div class="queue-comment"><strong>Комментарий:</strong> ' + item.comment + '</div>' : '') +
            '<div class="queue-manager">Менеджер: ' + (item.manager || '—') + ' · Статус: ' + (item.status || '—') + '</div>' +
            '<button class="queue-remove" data-row="' + item.row + '" title="Удалить из таблицы">×</button></div>';
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
            cloudSend({ action: 'deleteRequest', row: row }).then(function() {
                renderVinQueue();
                showToast('Заявка удалена из таблицы');
            });
        };
    });
}

function exportVinQueue() {
    if (CONFIG.cloudUrl) {
        cloudGet('getRequests').then(function(j) {
            const cloud = (j && j.ok && j.items) ? j.items : [];
            let local_q = [];
            try { local_q = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]'); } catch(e) {}
            downloadJson({ cloud: cloud, localPending: local_q });
        });
    } else {
        let local_q = [];
        try { local_q = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]'); } catch(e) {}
        downloadJson(local_q);
    }
}

function downloadJson(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'vin_queue.json';
    a.click();
    URL.revokeObjectURL(a.href);
}

function initModForm() {
    const brandSel = $('modBrand');
    if (!brandSel) return;
    brandSel.innerHTML = CONFIG.brands.map(function(b) { return '<option value="' + b.id + '">' + b.name + '</option>'; }).join('');
    const container = $('modWorksList');
    if (!container) return;
    Object.keys(categories).forEach(function(catKey) {
        const catWorks = Object.entries(worksCatalog).filter(function(entry) { return entry[1].cat === catKey; });
        if (catWorks.length === 0) return;
        const h = el('div', 'work-category-header');
        h.style.cursor = 'pointer';
        h.style.marginTop = '8px';
        h.innerHTML = '<span class="arrow" style="font-size:9px;transition:transform 0.15s;display:inline-block;width:12px">▶</span> <span class="cat-icon">' + (CAT_ICONS[catKey] || '') + '</span> ' + categories[catKey] + ' <span style="margin-left:auto;font-size:11px;color:var(--text-muted)">' + catWorks.length + '</span>';
        const body = el('div', 'work-category-body');
        body.style.display = 'none';
        h.onclick = function() {
            const expanded = h.classList.toggle('expanded');
            body.style.display = expanded ? 'block' : 'none';
            h.querySelector('.arrow').style.transform = expanded ? 'rotate(90deg)' : '';
        };
        catWorks.forEach(function(entry) {
            const wid = entry[0];
            const w = entry[1];
            const row = el('div', 'mod-form-row');
            row.innerHTML = '<div class="mod-group" style="flex:3"><label>' + w.name + '</label></div>' +
                '<div class="mod-group" style="flex:1"><label>Нормо-часы</label><input type="number" class="admin-input" data-wid="' + wid + '" placeholder="' + w.nh + '" step="0.1"></div>' +
                '<div class="mod-group" style="flex:1"><label>Ставка</label><select class="rate-select" data-wid="' + wid + '"><option value="standard"' + (w.rateType === 'standard' ? ' selected' : '') + '>Обычная</option><option value="engine"' + (w.rateType === 'engine' ? ' selected' : '') + '>ДВС/КПП</option></select></div>';
            body.appendChild(row);
        });
        container.appendChild(h);
        container.appendChild(body);
    });
    if ($('saveModBtn')) $('saveModBtn').onclick = saveMod;
}

function saveMod() {
    const brandId = $('modBrand').value;
    const brandName = CONFIG.brands.find(function(b) { return b.id === brandId; });
    const brandLabel = brandName ? brandName.name : '';
    const model = $('modModel').value.trim();
    const gen = $('modGen').value.trim();
    if (!model || !gen) { showToast('Заполните модель и поколение'); return; }
    const engineCode = $('modEngineCode').value.trim();
    const engineVol = $('modEngineVol').value.trim();
    const enginePower = $('modEnginePower').value.trim();
    const engineTorque = $('modEngineTorque').value.trim();
    const timing = $('modTiming') ? $('modTiming').value.trim() : '';
    const gbCode = $('modGbCode').value.trim();
    const gbType = $('modGbType').value.trim();
    const gbGears = parseInt($('modGbGears').value) || 0;
    const drive = $('modDrive').value;
    const workInputs = document.querySelectorAll('#modWorksList input[data-wid]');
    const works = [];
    workInputs.forEach(function(input) { if (parseFloat(input.value) > 0) works.push(input.dataset.wid); });
    if (works.length === 0) { showToast('Добавьте хотя бы одну работу'); return; }
    function fluidOrEmpty(vol, spec, visc) {
        if (!vol && !spec) return null;
        return { volume: vol || '-', spec: spec || '-', viscosity: visc || '-' };
    }
    const driveIsAWD = drive && drive.indexOf('Полный') !== -1;
    const modId = brandId + '_' + engineCode.toLowerCase() + '_' + Date.now().toString(36);
    const newMod = {
        id: modId, model: model, generation: gen,
        engine: { code: engineCode, volume: engineVol, power: enginePower, torque: engineTorque },
        gearbox: { code: gbCode, type: gbType, gears: gbGears },
        drive: drive,
        fluids: {
            engine_oil: fluidOrEmpty($('flOilVol').value, $('flOilSpec').value, $('flOilVisc').value),
            gearbox_oil: fluidOrEmpty($('flGbVol').value, $('flGbSpec').value, '-'),
            transfer_case: driveIsAWD ? fluidOrEmpty($('flTfVol').value, $('flTfSpec').value, '-') : null,
            diff_front: driveIsAWD ? fluidOrEmpty($('flDfVol').value, '', '-') : null,
            diff_rear: driveIsAWD ? fluidOrEmpty($('flDrVol').value, '', '-') : null,
            coolant: fluidOrEmpty($('flCoolVol').value, $('flCoolSpec').value, '-'),
            brake_fluid: { volume: '-', spec: $('flBrSpec').value || 'DOT 4', viscosity: '-' },
            power_steering: fluidOrEmpty($('flPsVol').value, '-', '-'),
            refrigerant: fluidOrEmpty($('flAcVol').value, $('flAcSpec').value, '-')
        },
        works: works
    };
    if (timing) newMod.timing = timing;
    let brandData = null;
    if (brandId === 'volkswagen' && typeof volkswagenDB !== 'undefined') brandData = volkswagenDB;
    if (!brandData) {
        showToast('База для марки ' + brandLabel + ' не загружена. Скачайте шаблон.');
        const template = { brand: brandLabel, modifications: [newMod] };
        const blob = new Blob(['// ' + brandLabel + ' база\nconst ' + brandId + 'DB = ' + JSON.stringify(template, null, 2) + ';'], { type: 'text/javascript' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = brandId + '.js';
        a.click();
        URL.revokeObjectURL(a.href);
        return;
    }
    brandData.modifications.push(newMod);
    const varName = brandId + 'DB';
    const content = '// ' + brandLabel + ' база (обновлено ' + new Date().toLocaleString('ru-RU') + ')\nconst ' + varName + ' = ' + JSON.stringify(brandData, null, 2) + ';';
    const blob = new Blob([content], { type: 'text/javascript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = brandId + '.js';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('Файл ' + brandId + '.js скачан — замените им старый');
}

function downloadConfig() {
    const content = '// КОНФИГУРАЦИЯ СИСТЕМЫ (обновлено ' + new Date().toLocaleString('ru-RU') + ')\n' +
        'const CONFIG = ' + JSON.stringify(CONFIG, null, 2) + ';\n\n' +
        '// Каталог работ\nconst worksCatalog = ' + JSON.stringify(worksCatalog, null, 2) + ';\n\n' +
        'const categories = ' + JSON.stringify(categories, null, 2) + ';\n\n' +
        'function validateWorks(brandData, brandName) {\n' +
        '    const errors = [];\n' +
        '    if (!brandData || !brandData.modifications) return errors;\n' +
        '    brandData.modifications.forEach(function(mod, i) {\n' +
        '        if (!mod.works) return;\n' +
        '        mod.works.forEach(function(workId) {\n' +
        '            if (!worksCatalog[workId]) errors.push("[" + brandName + "] Модификация #" + i + ": неизвестный workId " + workId);\n' +
        '        });\n' +
        '    });\n' +
        '    return errors;\n' +
        '}';
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
        toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:12px 16px;box-shadow:0 4px 12px rgba(0,0,0,0.12);font-size:13px;z-index:1000;display:none;max-width:320px';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(function() { toast.style.display = 'none'; }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
})();
