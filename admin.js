// ============================================
// НЕМЕЦИЯ — АДМИНКА ЛОГИКА
// ============================================

(function() {
'use strict';

const $ = (id) => document.getElementById(id);
const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;function renderVinQueue() {
    const container = $('vinQueueList');
    if (!container) return;
    
    let queue = [];
    try {
        queue = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]');
    } catch(e) {}

    if (queue.length === 0) {
        container.innerHTML = '<div class="queue-empty">Очередь запросов пуста</div>';
        return;
    }

    container.innerHTML = queue.map((item, i) => `
        <div class="queue-item">
            <div class="queue-header">
                <span class="queue-type-badge">${item.type || 'Запрос'}</span>
                <span class="queue-date">${new Date(item.date).toLocaleString('ru-RU', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})}</span>
            </div>
            ${item.description ? `<div class="queue-desc"><strong>Описание:</strong> ${item.description}</div>` : ''}
            ${item.vin ? `<div class="queue-vin"><strong>VIN:</strong> ${item.vin}</div>` : ''}
            ${item.comment ? `<div class="queue-comment"><strong>Комментарий:</strong> ${item.comment}</div>` : ''}
            <div class="queue-manager">Менеджер: ${item.manager || '—'}</div>
            <button class="queue-remove" data-index="${i}" title="Удалить из очереди">×</button>
        </div>
    `).join('');

    container.querySelectorAll('.queue-remove').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.index);
            queue.splice(idx, 1);
            localStorage.setItem('nemesia_vinQueue', JSON.stringify(queue));
            renderVinQueue();
            showToast('Запрос удалён из очереди');
        };
    });
}
    if (html !== undefined) e.innerHTML = html;
    return e;
};

function init() {
    // Theme
    const savedTheme = localStorage.getItem('nemesia_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    $('themeToggle').checked = (savedTheme === 'dark');
    $('themeToggle').onchange = () => {
        const theme = $('themeToggle').checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('nemesia_theme', theme);
    };

    // Rates
    $('rateEngine').value = CONFIG.rates.engine;
    $('rateStandard').value = CONFIG.rates.standard;
    $('saveRatesBtn').onclick = saveRates;

    // Coefficients
    $('coeffRusty').value = CONFIG.coefficients.rusty_bolts.percent;
    $('coeffAluminum').value = CONFIG.coefficients.aluminum.percent;
    $('coeffLpg').value = CONFIG.coefficients.lpg.percent;
    $('saveCoeffsBtn').onclick = saveCoeffs;

    // Managers
    renderManagers();
    $('addManagerBtn').onclick = addManager;

    // VIN queue
    renderVinQueue();
    $('exportVinBtn').onclick = exportVinQueue;

    // Add modification
    initModForm();
}

// --- RATES ---
function saveRates() {
    CONFIG.rates.engine = parseInt($('rateEngine').value) || 3000;
    CONFIG.rates.standard = parseInt($('rateStandard').value) || 2500;
    downloadConfig();
    showToast('Ставки сохранены');
}

// --- COEFFICIENTS ---
function saveCoeffs() {
    CONFIG.coefficients.rusty_bolts.percent = parseInt($('coeffRusty').value) || 15;
    CONFIG.coefficients.aluminum.percent = parseInt($('coeffAluminum').value) || 20;
    CONFIG.coefficients.lpg.percent = parseInt($('coeffLpg').value) || 10;
    downloadConfig();
    showToast('Коэффициенты сохранены');
}

// --- MANAGERS ---
function renderManagers() {
    const tbody = $('managersTable');
    tbody.innerHTML = '';
    CONFIG.managers.forEach((m, i) => {
        const tr = el('tr');
        tr.innerHTML = `<td>${m.name}</td><td style="text-align:right"><button class="admin-btn danger small" data-idx="${i}">Удалить</button></td>`;
        tr.querySelector('button').onclick = () => {
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
    const id = 'm' + Date.now();
    CONFIG.managers.push({ id, name });
    $('newManagerName').value = '';
    renderManagers();
    downloadConfig();
    showToast('Менеджер добавлен');
}

// --- VIN QUEUE ---
function renderVinQueue() {
    const container = $('vinQueueList');
    if (!container) return;
    
    let queue = [];
    try {
        queue = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]');
    } catch(e) {}

    if (queue.length === 0) {
        container.innerHTML = '<div class="queue-empty">Очередь запросов пуста</div>';
        return;
    }

    container.innerHTML = queue.map((item, i) => `
        <div class="queue-item">
            <div class="queue-header">
                <span class="queue-type-badge">${item.type || 'Запрос'}</span>
                <span class="queue-date">${new Date(item.date).toLocaleString('ru-RU', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})}</span>
            </div>
            ${item.description ? `<div class="queue-desc"><strong>Описание:</strong> ${item.description}</div>` : ''}
            ${item.vin ? `<div class="queue-vin"><strong>VIN:</strong> ${item.vin}</div>` : ''}
            ${item.comment ? `<div class="queue-comment"><strong>Комментарий:</strong> ${item.comment}</div>` : ''}
            <div class="queue-manager">Менеджер: ${item.manager || '—'}</div>
            <button class="queue-remove" data-index="${i}" title="Удалить из очереди">×</button>
        </div>
    `).join('');

    container.querySelectorAll('.queue-remove').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.index);
            queue.splice(idx, 1);
            localStorage.setItem('nemesia_vinQueue', JSON.stringify(queue));
            renderVinQueue();
            showToast('Запрос удалён из очереди');
        };
    });
}

function exportVinQueue() {
    let queue = [];
    try {
        queue = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]');
    } catch(e) {}
    if (queue.length === 0) { showToast('Очередь пуста'); return; }
    const blob = new Blob([JSON.stringify(queue, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'vin_queue.json';
    a.click();
    URL.revokeObjectURL(a.href);
}

// --- ADD MODIFICATION ---
function initModForm() {
    // Brand select
    const brandSel = $('modBrand');
    brandSel.innerHTML = CONFIG.brands.map(b => `<option value="${b.id}">${b.name}</option>`).join('');

    // Works list grouped by category
    const container = $('modWorksList');
    Object.keys(categories).forEach(catKey => {
        const catWorks = Object.entries(worksCatalog).filter(([id, w]) => w.cat === catKey);
        if (catWorks.length === 0) return;

        const h = el('div', 'work-category-header');
        h.style.cursor = 'pointer';
        h.style.marginTop = '8px';
        h.innerHTML = `<span class="arrow" style="font-size:10px;transition:transform 0.2s;display:inline-block;width:12px">▶</span> ${categories[catKey]} <span style="margin-left:auto;font-size:11px;color:var(--text-muted)">${catWorks.length}</span>`;
        
        const body = el('div', 'work-category-body');
        body.style.display = 'none';
        
        h.onclick = () => {
            const expanded = h.classList.toggle('expanded');
            body.style.display = expanded ? 'block' : 'none';
            h.querySelector('.arrow').style.transform = expanded ? 'rotate(90deg)' : '';
        };

        catWorks.forEach(([wid, w]) => {
            const row = el('div', 'mod-form-row');
            row.innerHTML = `
                <div class="mod-group" style="flex:3">
                    <label>${w.name}</label>
                </div>
                <div class="mod-group" style="flex:1">
                    <label>Нормо-часы</label>
                    <input type="number" class="admin-input" data-wid="${wid}" placeholder="${w.nh}" step="0.1" style="font-size:12px">
                </div>
                <div class="mod-group" style="flex:1">
                    <label>Ставка</label>
                    <select class="rate-select" data-wid="${wid}">
                        <option value="standard" ${w.rateType === 'standard' ? 'selected' : ''}>Обычная</option>
                        <option value="engine" ${w.rateType === 'engine' ? 'selected' : ''}>ДВС/КПП</option>
                    </select>
                </div>
            `;
            body.appendChild(row);
        });

        container.appendChild(h);
        container.appendChild(body);
    });

    $('saveModBtn').onclick = saveMod;
}

function saveMod() {
    const brandId = $('modBrand').value;
    const brandName = CONFIG.brands.find(b => b.id === brandId)?.name || '';
    const model = $('modModel').value.trim();
    const gen = $('modGen').value.trim();
    if (!model || !gen) { showToast('Заполните модель и поколение'); return; }

    // Engine
    const engineCode = $('modEngineCode').value.trim();
    const engineVol = $('modEngineVol').value.trim();
    const enginePower = $('modEnginePower').value.trim();
    const engineTorque = $('modEngineTorque').value.trim();

    // Gearbox
    const gbCode = $('modGbCode').value.trim();
    const gbType = $('modGbType').value.trim();
    const gbGears = parseInt($('modGbGears').value) || 0;
    const drive = $('modDrive').value;

    // Works
    const workInputs = document.querySelectorAll('#modWorksList input[data-wid]');
    const workSelects = document.querySelectorAll('#modWorksList select[data-wid]');
    const works = [];
    workInputs.forEach(input => {
        const nh = parseFloat(input.value);
        if (nh > 0) {
            const wid = input.dataset.wid;
            works.push(wid);
        }
    });

    if (works.length === 0) { showToast('Добавьте хотя бы одну работу'); return; }

    // Fluids
    function fluidOrEmpty(vol, spec, visc) {
        if (!vol && !spec) return null;
        return { volume: vol || '-', spec: spec || '-', viscosity: visc || '-' };
    }

    const driveIsAWD = drive.includes('Полный');
    const modId = brandId + '_' + engineCode.toLowerCase() + '_' + Date.now().toString(36);

    const newMod = {
        id: modId,
        model: model,
        generation: gen,
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

    // Add to brand database
    let brandData = null;
    if (brandId === 'volkswagen' && typeof volkswagenDB !== 'undefined') {
        brandData = volkswagenDB;
    }

    if (!brandData) {
        showToast('База для марки ' + brandName + ' не загружена. Скачайте шаблон.');
        // Download template
        const template = {
            brand: brandName,
            modifications: [newMod]
        };
        const blob = new Blob([
            `// ${brandName} база\nconst ${brandId}DB = ` + JSON.stringify(template, null, 2) + ';'
        ], { type: 'text/javascript' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = brandId + '.js';
        a.click();
        URL.revokeObjectURL(a.href);
        return;
    }

    brandData.modifications.push(newMod);

    // Download updated file
    const varName = brandId + 'DB';
    const content = `// ${brandName} база (обновлено ${new Date().toLocaleString('ru-RU')})\nconst ${varName} = ` + JSON.stringify(brandData, null, 2) + ';';
    const blob = new Blob([content], { type: 'text/javascript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = brandId + '.js';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('Файл ' + brandId + '.js скачан — замените им старый');
}

// --- DOWNLOAD CONFIG ---
function downloadConfig() {
    const content = '// КОНФИГУРАЦИЯ СИСТЕМЫ (обновлено ' + new Date().toLocaleString('ru-RU') + ')\n' +
        'const CONFIG = ' + JSON.stringify(CONFIG, null, 2) + ';\n\n' +
        '// Каталог работ\nconst worksCatalog = ' + JSON.stringify(worksCatalog, null, 2) + ';\n\n' +
        'const categories = ' + JSON.stringify(categories, null, 2) + ';\n\n' +
        'function validateWorks(brandData, brandName) {\n' +
        '    const errors = [];\n' +
        '    if (!brandData || !brandData.modifications) return errors;\n' +
        '    brandData.modifications.forEach((mod, i) => {\n' +
        '        if (!mod.works) return;\n' +
        '        mod.works.forEach(workId => {\n' +
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
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
})();
