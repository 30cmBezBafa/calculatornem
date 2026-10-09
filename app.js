// ============================================
// НЕМЕЦИЯ — ОСНОВНАЯ ЛОГИКА (с облаком и журналом)
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

const $ = function(id) { return document.getElementById(id); };
const el = function(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
};

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

// --- ADD OPTIONS / MODALS ---
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

// --- JOURNAL ---
function openJournal() {
    const overlay = $('journalOverlay');
    if (!overlay) return;
    overlay.classList.add('active');
    const list = $('journalList');
    if (!CONFIG.cloudUrl) {
        if (list) list.innerHTML = '<div class="calc-empty">Облако не подключено</div>';
        return;
    }
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
    if (items.length === 0) {
        list.innerHTML = '<div class="calc-empty">Ничего не найдено</div>';
        return;
    }
    list.innerHTML = items.map(function(it) {
        return '<div class="history-card" data-row="' + it.row + '">' +
            '<div class="h-row"><span class="h-car">' + (it.carLabel || '—') + '</span><span class="h-sum">' + formatRub(it.total || 0) + '</span></div>' +
            '<div class="h-date">' + (it.date || '') + ' · ' + (it.manager || '—') + '</div>' +
            '<div class="h-works">' + (it.worksCount || 0) + ' работ' + (it.data ? '' : ' · (старая запись, не восстанавливается)') + '</div>' +
            '</div>';
    }).join('');
    list.querySelectorAll('.history-card').forEach(function(card) {
        card.onclick = function() {
            const row = parseInt(card.dataset.row);
            const it = journalItems.find(function(x) { return x.row === row; });
            if (!it) return;
            if (!it.data || !it.data.modificationId) {
                showToast('В этой записи нет данных для восстановления');
                return;
            }
            closeJournal();
            restoreCalc(it.data);
            showToast('Расчёт загружен из журнала');
        };
    });
}

// --- WORK ITEM TEMPLATE ---
function workItemHTML(workId, work, price, inCalc, customNh) {
    const rateLabel = work.rateType === 'engine' ? 'ДВС' : '';
    const badge = rateLabel ? '<span class="rate-badge ' + work.rateType + '">' + rateLabel + '</span>' : '';
    const nhLabel = customNh ? customNh + ' н/ч' : work.nh + ' н/ч';
    const dotColor = customNh ? '#27ae60' : '#e74c3c';
    const dotTitle = customNh ? 'Проверено для этого автомобиля' : 'Усредненное значение';
    const confidenceDot = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + dotColor + ';margin-left:6px;" title="' + dotTitle + '"></span>';
    const hasIncludes = work.includes && work.includes.length > 0;
    const expandBtn = hasIncludes ? '<span class="expand-btn" data-work-id="' + workId + '" data-context="list">+</span>' : '';
    return '<div class="work-item' + (inCalc ? ' selected' : '') + (hasIncludes ? ' has-includes' : '') + '" data-work-id="' + workId + '" tabindex="0">' +
        '<span class="checkbox"></span>' +
        '<span class="work-name">' + work.name + badge + '</span>' +
        '<span class="work-nh">' + nhLabel + confidenceDot + '</span>' +
        '<span class="work-price">' + formatRub(price) + '</span>' +
        expandBtn +
        '</div>';
}

// --- INIT ---
function init() {
    const savedTheme = localStorage.getItem('nemesia_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if ($('themeToggle')) $('themeToggle').checked = (savedTheme === 'dark');

    const mgrSel = $('managerSelect');
    if (mgrSel) {
        mgrSel.innerHTML = '<option value="">— выбрать —</option>' +
            CONFIG.managers.map(function(m) { return '<option value="' + m.id + '">' + m.name + '</option>'; }).join('');
        const savedMgr = localStorage.getItem('nemesia_manager') || '';
        if (savedMgr) mgrSel.value = savedMgr;
        mgrSel.onchange = function() { localStorage.setItem('nemesia_manager', mgrSel.value); };
    }

    const brandSel = $('brandSelect');
    if (brandSel) {
        brandSel.disabled = false;
        brandSel.innerHTML = '<option value="">— выбрать —</option>' +
            CONFIG.brands.map(function(b) { return '<option value="' + b.id + '">' + b.name + '</option>'; }).join('');
        addAddOption('brandSelect', 'марку');
        brandSel.onchange = function() {
            if (brandSel.value === '__add__') { openAddModal('Марка'); brandSel.value = ''; return; }
            onBrandChange();
        };
    }

    if ($('modelSelect')) $('modelSelect').onchange = function() {
        if ($('modelSelect').value === '__add__') { openAddModal('Модель'); $('modelSelect').value = ''; return; }
        onModelChange();
    };
    if ($('genSelect')) $('genSelect').onchange = function() {
        if ($('genSelect').value === '__add__') { openAddModal('Поколение'); $('genSelect').value = ''; return; }
        onGenChange();
    };
    if ($('engineSelect')) $('engineSelect').onchange = function() {
        if ($('engineSelect').value === '__add__') { openAddModal('ДВС'); $('engineSelect').value = ''; return; }
        onEngineChange();
    };
    if ($('gearboxSelect')) $('gearboxSelect').onchange = function() {
        if ($('gearboxSelect').value === '__add__') { openAddModal('КПП'); $('gearboxSelect').value = ''; return; }
        onGearboxChange();
    };
    if ($('driveSelect')) $('driveSelect').onchange = function() {
        if ($('driveSelect').value === '__add__') { openAddModal('Привод'); $('driveSelect').value = ''; return; }
        onDriveChange();
    };

    if ($('globalSearch')) $('globalSearch').addEventListener('input', debounce(onSearchInput, 200));
    if ($('globalSearch')) $('globalSearch').addEventListener('keydown', onSearchKeydown);
    if ($('worksSearch')) $('worksSearch').addEventListener('input', debounce(onWorksSearch, 200));

    if ($('saveCalcBtn')) $('saveCalcBtn').onclick = saveCalculation;
    if ($('clearAllBtn')) $('clearAllBtn').onclick = clearAll;
    if ($('journalBtn')) $('journalBtn').onclick = openJournal;
    if ($('journalClose')) $('journalClose').onclick = closeJournal;
    if ($('journalSearch')) $('journalSearch').addEventListener('input', debounce(function() {
        renderJournalList($('journalSearch').value);
    }, 200));

    if ($('themeToggle')) {
        $('themeToggle').onchange = function() {
            const theme = $('themeToggle').checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('nemesia_theme', theme);
        };
    }

    if ($('vinCancel')) $('vinCancel').onclick = closeAddModal;
    if ($('vinSubmit')) $('vinSubmit').onclick = submitVin;

    const last = localStorage.getItem('nemesia_lastCalc');
    if (last) {
        try {
            const data = JSON.parse(last);
            if (data.modificationId && data.works && data.works.length > 0) showRestoreToast(data);
        } catch(e) {}
    }

    renderHistory();

    if (typeof volkswagenDB !== 'undefined') {
        currentBrandData = volkswagenDB;
        const errors = validateWorks(volkswagenDB, 'Volkswagen');
        if (errors.length > 0) console.warn('Validation errors:', errors);
    }
}

// --- BRAND CHANGE CHAIN ---
function onBrandChange() {
    const brandId = $('brandSelect').value;
    if (!brandId) return;
    currentBrand = CONFIG.brands.find(function(b) { return b.id === brandId; });
    if (brandId === 'volkswagen' && typeof volkswagenDB !== 'undefined') currentBrandData = volkswagenDB;
    else currentBrandData = null;
    if (!currentBrandData) { openAddModal('Марка'); return; }
    resetSelect('modelSelect'); resetSelect('genSelect'); resetSelect('engineSelect');
    resetSelect('gearboxSelect'); resetSelect('driveSelect');
    expandedCats.clear(); expandedIncludes.clear();
    const models = [...new Set(currentBrandData.modifications.map(function(m) { return m.model; }))].sort();
    fillSelect('modelSelect', models);
    addAddOption('modelSelect', 'модель');
}

function onModelChange() {
    const model = $('modelSelect').value;
    if (!model || !currentBrandData) return;
    resetSelect('genSelect'); resetSelect('engineSelect');
    resetSelect('gearboxSelect'); resetSelect('driveSelect');
    expandedCats.clear(); expandedIncludes.clear();
    const mods = currentBrandData.modifications.filter(function(m) { return m.model === model; });
    const gens = [...new Set(mods.map(function(m) { return m.generation; }))].sort();
    fillSelect('genSelect', gens);
    addAddOption('genSelect', 'поколение');
}

function onGenChange() {
    const model = $('modelSelect').value;
    const gen = $('genSelect').value;
    if (!gen || !currentBrandData) return;
    resetSelect('engineSelect'); resetSelect('gearboxSelect'); resetSelect('driveSelect');
    expandedCats.clear(); expandedIncludes.clear();
    const mods = currentBrandData.modifications.filter(function(m) { return m.model === model && m.generation === gen; });
    const engines = mods.map(function(m) {
        return {
            value: m.id,
            label: m.engine.code + ' / ' + m.engine.volume + ' / ' + m.engine.power + ' / ' + m.engine.torque,
            mod: m
        };
    });
    fillSelect('engineSelect', engines.map(function(e) { return e.label; }), engines.map(function(e) { return e.value; }));
    addAddOption('engineSelect', 'ДВС');
}

function onEngineChange() {
    const modId = $('engineSelect').value;
    if (!modId || !currentBrandData) return;
    const mods = currentBrandData.modifications.filter(function(m) { return m.id === modId; });
    resetSelect('gearboxSelect'); resetSelect('driveSelect');
    expandedCats.clear(); expandedIncludes.clear();
    const gearboxes = mods.map(function(m) {
        return {
            value: m.id,
            label: m.gearbox.code + ' / ' + m.gearbox.type + ' / ' + m.gearbox.gears + ' ст.',
            mod: m
        };
    });
    fillSelect('gearboxSelect', gearboxes.map(function(g) { return g.label; }), gearboxes.map(function(g) { return g.value; }));
    addAddOption('gearboxSelect', 'КПП');
}

function onGearboxChange() {
    const modId = $('gearboxSelect').value;
    if (!modId || !currentBrandData) return;
    resetSelect('driveSelect');
    expandedCats.clear(); expandedIncludes.clear();
    const mods = currentBrandData.modifications.filter(function(m) { return m.id === modId; });
    const drives = [...new Set(mods.map(function(m) { return m.drive; }))];
    fillSelect('driveSelect', drives);
    addAddOption('driveSelect', 'привод');
}

function onDriveChange() {
    const modId = $('gearboxSelect').value;
    if (!modId || !currentBrandData) return;
    const drive = $('driveSelect').value;
    const mod = currentBrandData.modifications.find(function(m) { return m.id === modId && m.drive === drive; });
    if (!mod) return;
    currentMod = mod;
    expandedCats.clear(); expandedIncludes.clear();
    selectedWorks = [];
    renderFluids(mod);
    renderWorks(mod);
    renderCalc();
    if ($('worksPanel')) $('worksPanel').style.display = 'block';
}

// --- GLOBAL SEARCH ---
function onSearchInput() {
    const q = $('globalSearch').value.trim().toLowerCase();
    const dropdown = $('searchDropdown');
    if (!q) { dropdown.classList.remove('active'); return; }
    if (!currentBrandData) {
        if (typeof volkswagenDB !== 'undefined') currentBrandData = volkswagenDB;
        else { dropdown.classList.remove('active'); return; }
    }
    searchResults = currentBrandData.modifications.filter(function(m) {
        return m.model.toLowerCase().includes(q) ||
            m.generation.toLowerCase().includes(q) ||
            m.engine.code.toLowerCase().includes(q) ||
            m.gearbox.code.toLowerCase().includes(q) ||
            m.engine.volume.toLowerCase().includes(q);
    }).slice(0, 15);
    if (searchResults.length === 0) {
        dropdown.innerHTML = '<div class="item" style="color:var(--text-muted)">Ничего не найдено. <a href="#" onclick="openAddModal(\'Модификация целиком\'); return false;">Запросить добавление</a></div>';
    } else {
        dropdown.innerHTML = searchResults.map(function(m, i) {
            return '<div class="item" data-index="' + i + '">' +
                '<div class="item-model">' + m.model + ' — ' + m.generation + '</div>' +
                '<div class="item-detail">' + m.engine.code + ' · ' + m.engine.volume + ' · ' + m.engine.power + ' · ' + m.gearbox.code + ' · ' + m.drive + '</div>' +
                '</div>';
        }).join('');
        dropdown.querySelectorAll('.item').forEach(function(item) {
            item.onclick = function() { selectFromSearch(searchResults[parseInt(item.dataset.index)]); };
        });
    }
    searchActiveIndex = -1;
    dropdown.classList.add('active');
}

function onSearchKeydown(e) {
    const dropdown = $('searchDropdown');
    if (!dropdown.classList.contains('active')) return;
    const items = dropdown.querySelectorAll('.item[data-index]');
    if (items.length === 0) return;
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        searchActiveIndex = Math.min(searchActiveIndex + 1, items.length - 1);
        items.forEach(function(it, i) { it.classList.toggle('active', i === searchActiveIndex); });
        items[searchActiveIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        searchActiveIndex = Math.max(searchActiveIndex - 1, 0);
        items.forEach(function(it, i) { it.classList.toggle('active', i === searchActiveIndex); });
        items[searchActiveIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchActiveIndex >= 0 && searchResults[searchActiveIndex]) selectFromSearch(searchResults[searchActiveIndex]);
    } else if (e.key === 'Escape') {
        dropdown.classList.remove('active');
        $('globalSearch').value = '';
    }
}

function selectFromSearch(mod) {
    $('searchDropdown').classList.remove('active');
    $('globalSearch').value = '';
    $('brandSelect').value = 'volkswagen';
    onBrandChange();
    $('modelSelect').value = mod.model; onModelChange();
    $('genSelect').value = mod.generation; onGenChange();
    $('engineSelect').value = mod.id; onEngineChange();
    $('gearboxSelect').value = mod.id; onGearboxChange();
    $('driveSelect').value = mod.drive; onDriveChange();
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.car-search-wrapper') && !e.target.closest('.modal')) {
        const dropdown = $('searchDropdown');
        if (dropdown) dropdown.classList.remove('active');
    }
});

// --- WORKS SEARCH ---
function onWorksSearch() {
    const q = $('worksSearch').value.trim().toLowerCase();
    const cats = document.querySelectorAll('.work-category');
    if (!q) {
        cats.forEach(function(cat) {
            const catKey = cat.dataset.cat;
            const header = cat.querySelector('.work-category-header');
            const body = cat.querySelector('.work-category-body');
            const expanded = expandedCats.has(catKey);
            header.classList.toggle('expanded', expanded);
            body.classList.toggle('expanded', expanded);
            cat.querySelectorAll('.work-item').forEach(function(w) { w.style.display = ''; });
        });
        return;
    }
    cats.forEach(function(cat) {
        let visible = 0;
        cat.querySelectorAll('.work-item').forEach(function(w) {
            const name = w.querySelector('.work-name').textContent.toLowerCase();
            const match = name.includes(q);
            w.style.display = match ? '' : 'none';
            if (match) visible++;
        });
        const header = cat.querySelector('.work-category-header');
        const body = cat.querySelector('.work-category-body');
        if (visible > 0) {
            header.classList.add('expanded'); body.classList.add('expanded');
            header.querySelector('.count').textContent = visible + ' совпад.';
        } else {
            header.classList.remove('expanded'); body.classList.remove('expanded');
        }
    });
}

// --- FLUIDS ---
function renderFluids(mod) {
    const f = mod.fluids;
    const rows = [
        ['Моторное масло', f.engine_oil],
        ['Масло КПП', f.gearbox_oil],
        ['Масло раздатки', f.transfer_case],
        ['Масло переднего редуктора', f.diff_front],
        ['Масло заднего редуктора', f.diff_rear],
        ['Охлаждающая жидкость', f.coolant],
        ['Тормозная жидкость', f.brake_fluid],
        ['Усилитель руля (ГУР)', f.power_steering],
        ['Хладагент кондиционера', f.refrigerant]
    ];
    let html = '<tr><th>Жидкость</th><th>Объём</th><th>Допуск</th><th>Вязкость</th></tr>';
    rows.forEach(function(row) {
        const name = row[0]; const data = row[1];
        if (!data) html += '<tr><td class="fluid-name">' + name + '</td><td class="fluid-na" colspan="3">—</td></tr>';
        else html += '<tr><td class="fluid-name">' + name + '</td><td>' + data.volume + '</td><td>' + data.spec + '</td><td>' + data.viscosity + '</td></tr>';
    });
    if ($('fluidsTable')) $('fluidsTable').innerHTML = html;
    if ($('fluidsPanel')) $('fluidsPanel').classList.add('active');
}

// --- WORKS LIST ---
function renderWorks(mod) {
    const container = $('worksList');
    container.innerHTML = '';
    const byCat = {};
    const modGearboxType = mod.gearboxType || null;
    mod.works.forEach(function(wid) {
        const w = worksCatalog[wid];
        if (!w) return;
        if (w.gearboxType && modGearboxType && !w.gearboxType.includes(modGearboxType)) return;
        if (!byCat[w.cat]) byCat[w.cat] = [];
        byCat[w.cat].push(wid);
    });
    Object.keys(categories).forEach(function(catKey) {
        if (!byCat[catKey]) return;
        const catDiv = el('div', 'work-category');
        catDiv.dataset.cat = catKey;
        const body = el('div', 'work-category-body');
        const header = el('div', 'work-category-header');
        const isExpanded = expandedCats.has(catKey);
        if (isExpanded) { header.classList.add('expanded'); body.classList.add('expanded'); }
        header.innerHTML = '<span class="arrow">▶</span> ' + categories[catKey] + ' <span class="count">' + byCat[catKey].length + '</span>';
        header.onclick = function() {
            const expanded = header.classList.toggle('expanded');
            body.classList.toggle('expanded', expanded);
            if (expanded) expandedCats.add(catKey); else expandedCats.delete(catKey);
        };
        byCat[catKey].forEach(function(wid) {
            const w = worksCatalog[wid];
            const customNh = (mod.customNh && mod.customNh[wid]) ? mod.customNh[wid] : null;
            const finalNh = customNh || w.nh;
            const price = workPrice(finalNh, w.rateType);
            const inCalc = selectedWorks.some(function(sw) { return sw.workId === wid; });
            body.insertAdjacentHTML('beforeend', workItemHTML(wid, w, price, inCalc, customNh));
        });
        catDiv.appendChild(header);
        catDiv.appendChild(body);
        container.appendChild(catDiv);
    });
    container.onclick = onWorksListClick;
}

function onWorksListClick(e) {
    const expandBtn = e.target.closest('.expand-btn');
    if (expandBtn) {
        e.stopPropagation();
        const wid = expandBtn.dataset.workId;
        const item = expandBtn.closest('.work-item');
        item.classList.toggle('includes-expanded');
        let incList = item.nextElementSibling;
        if (incList && incList.classList.contains('includes-list')) {
            incList.classList.toggle('expanded');
        } else {
            const w = worksCatalog[wid];
            if (w && w.includes) {
                const list = el('div', 'includes-list');
                w.includes.forEach(function(incId) {
                    const inc = worksCatalog[incId];
                    if (inc) {
                        const incPrice = workPrice(inc.nh, inc.rateType);
                        list.insertAdjacentHTML('beforeend',
                            '<div class="include-item"><span>' + inc.name + '</span><span>' + inc.nh + ' н/ч · ' + formatRub(incPrice) + '</span></div>');
                    }
                });
                list.classList.add('expanded');
                item.insertAdjacentElement('afterend', list);
            }
        }
        return;
    }
    const item = e.target.closest('.work-item');
    if (!item) return;
    toggleWork(item.dataset.workId, item);
}

function toggleWork(workId, itemEl) {
    const w = worksCatalog[workId];
    if (!w) return;
    const idx = selectedWorks.findIndex(function(sw) { return sw.workId === workId; });
    if (idx >= 0) {
        selectedWorks.splice(idx, 1);
        itemEl.classList.remove('selected');
        expandedIncludes.delete(workId);
    } else {
        const customNh = (currentMod && currentMod.customNh && currentMod.customNh[workId]) ? currentMod.customNh[workId] : null;
        const finalNh = customNh || w.nh;
        const price = workPrice(finalNh, w.rateType);
        selectedWorks.push({
            workId: workId, nh: finalNh, price: price, rateType: w.rateType,
            name: w.name, includes: w.includes || null, coefficients: []
        });
        itemEl.classList.add('selected');
    }
    renderCalc();
}

// --- CALC PANEL ---
function renderCalc() {
    const body = $('calcBody');
    if (!body) return;
    if (selectedWorks.length === 0) {
        body.innerHTML = '<div class="calc-empty">Выберите работы из списка слева</div>';
        return;
    }
    let html = '';
    let totalWorks = 0;
    let totalCoeff = 0;
    selectedWorks.forEach(function(sw, i) {
        const hasIncludes = sw.includes && sw.includes.length > 0;
        const isIncExpanded = expandedIncludes.has(sw.workId);
        let coeffSum = 0;
        sw.coefficients.forEach(function(c) { coeffSum += c.rub; });
        html += '<div class="calc-work-card' + (hasIncludes ? ' has-includes' : '') + '" data-index="' + i + '">';
        html += '<div class="calc-work-header">';
        html += '<span class="calc-work-name">' + sw.name + '</span>';
        if (hasIncludes) html += '<span class="expand-btn" data-calc-wid="' + sw.workId + '" style="cursor:pointer;font-size:14px;width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:3px;flex-shrink:0;">' + (isIncExpanded ? '−' : '+') + '</span>';
        html += '<span class="calc-work-remove" data-index="' + i + '">×</span></div>';
        html += '<div class="calc-work-info"><span>' + sw.nh + ' н/ч · ' + formatRub(sw.price) + '</span><span class="calc-work-price">' + formatRub(sw.price + coeffSum) + '</span></div>';
        if (hasIncludes && isIncExpanded) {
            html += '<div class="includes-list expanded" style="padding:4px 0 4px 12px;">';
            sw.includes.forEach(function(incId) {
                const inc = worksCatalog[incId];
                if (inc) {
                    const incPrice = workPrice(inc.nh, inc.rateType);
                    html += '<div class="include-item"><span>' + inc.name + '</span><span>' + inc.nh + ' н/ч · ' + formatRub(incPrice) + '</span></div>';
                }
            });
            html += '</div>';
        }
        html += '<div class="coeff-row" data-index="' + i + '">';
        if (sw.coefficients.length > 0) {
            sw.coefficients.forEach(function(c, ci) {
                html += '<div class="coeff-display">' + CONFIG.coefficients[c.type].label + ': +' + c.percent + '% <span class="coeff-rub">(' + formatRub(c.rub) + ')</span> <span class="coeff-remove" data-cindex="' + ci + '">убрать</span></div>';
            });
        }
        html += '<select class="coeff-add" data-index="' + i + '"><option value="">+ Добавить коэффициент</option>';
        Object.keys(CONFIG.coefficients).forEach(function(ck) {
            const already = sw.coefficients.some(function(c) { return c.type === ck; });
            if (!already) html += '<option value="' + ck + '">' + CONFIG.coefficients[ck].label + ' (+' + CONFIG.coefficients[ck].percent + '%)</option>';
        });
        html += '</select></div></div>';
        totalWorks += sw.price + coeffSum;
        totalCoeff += coeffSum;
    });
    html += '<div class="calc-total">';
    html += '<div class="calc-total-row"><span>Работы:</span><span>' + formatRub(totalWorks - totalCoeff) + '</span></div>';
    if (totalCoeff > 0) html += '<div class="calc-total-row"><span>Коэффициенты:</span><span>+' + formatRub(totalCoeff) + '</span></div>';
    html += '<div class="calc-total-row final"><span>Итого:</span><span>' + formatRub(totalWorks) + '</span></div></div>';
    body.innerHTML = html;

    body.querySelectorAll('.calc-work-remove').forEach(function(btn) {
        btn.onclick = function(e) {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            const wid = selectedWorks[idx].workId;
            selectedWorks.splice(idx, 1);
            expandedIncludes.delete(wid);
            const leftItem = document.querySelector('.work-item[data-work-id="' + wid + '"]');
            if (leftItem) leftItem.classList.remove('selected');
            renderCalc();
        };
    });
    body.querySelectorAll('.coeff-add').forEach(function(sel) {
        sel.onchange = function() {
            const idx = parseInt(sel.dataset.index);
            const cType = sel.value;
            if (!cType) return;
            const sw = selectedWorks[idx];
            const percent = CONFIG.coefficients[cType].percent;
            const rub = Math.round(sw.price * percent / 100);
            sw.coefficients.push({ type: cType, percent: percent, rub: rub });
            renderCalc();
        };
    });
    body.querySelectorAll('.coeff-remove').forEach(function(btn) {
        btn.onclick = function(e) {
            e.stopPropagation();
            const workIdx = parseInt(btn.closest('.coeff-row').dataset.index);
            const coeffIdx = parseInt(btn.dataset.cindex);
            selectedWorks[workIdx].coefficients.splice(coeffIdx, 1);
            renderCalc();
        };
    });
    body.querySelectorAll('.expand-btn[data-calc-wid]').forEach(function(btn) {
        btn.onclick = function(e) {
            e.stopPropagation();
            const wid = btn.dataset.calcWid;
            if (expandedIncludes.has(wid)) expandedIncludes.delete(wid);
            else expandedIncludes.add(wid);
            renderCalc();
        };
    });
}

// --- SAVE CALCULATION ---
function saveCalculation() {
    if (isSaving || selectedWorks.length === 0 || !currentMod) return;
    isSaving = true;
    setTimeout(function() { isSaving = false; }, 1000);
    const mgr = $('managerSelect') ? $('managerSelect').value : '';
    const mgrName = CONFIG.managers.find(function(m) { return m.id === mgr; });
    const mgrLabel = mgrName ? mgrName.name : '—';
    const total = selectedWorks.reduce(function(sum, sw) {
        const coeffSum = sw.coefficients.reduce(function(s, c) { return s + c.rub; }, 0);
        return sum + sw.price + coeffSum;
    }, 0);
    const record = {
        id: Date.now(),
        date: new Date().toISOString(),
        manager: mgrLabel,
        modificationId: currentMod.id,
        carLabel: (currentBrand ? currentBrand.name : '') + ' ' + currentMod.model + ' ' + currentMod.generation + ' ' + currentMod.engine.code,
        worksCount: selectedWorks.length,
        total: total,
        works: selectedWorks.map(function(sw) {
            return {
                workId: sw.workId,
                nh: sw.nh,
                coefficients: sw.coefficients.map(function(c) { return c.type; })
            };
        })
    };
    let history = [];
    try { history = JSON.parse(localStorage.getItem('nemesia_history') || '[]'); } catch(e) {}
    history.unshift(record);
    history = history.slice(0, 5);
    localStorage.setItem('nemesia_history', JSON.stringify(history));
    localStorage.setItem('nemesia_lastCalc', JSON.stringify(record));
    renderHistory();
    showToast('Расчёт сохранён');

    // Отправка в облако (с полем data для восстановления)
    if (CONFIG.cloudUrl) {
        cloudSend({
            action: 'addCalc',
            date: record.date,
            manager: record.manager,
            carLabel: record.carLabel,
            worksCount: record.worksCount,
            total: record.total,
            worksList: selectedWorks.map(function(sw) { return sw.name + ' (' + sw.nh + ' н/ч)'; }).join('; '),
            coeffs: selectedWorks.filter(function(sw) { return sw.coefficients.length > 0; })
                .map(function(sw) {
                    return sw.name + ': ' + sw.coefficients.map(function(c) {
                        return CONFIG.coefficients[c.type].label + ' +' + c.percent + '%';
                    }).join(', ');
                }).join('; '),
            data: record
        });
    }
}

// --- RESTORE ---
function showRestoreToast(data) {
    if (!$('toastText') || !$('toastButtons') || !$('toast')) return;
    $('toastText').innerHTML = 'Восстановить последний расчёт?<br><strong>' + data.carLabel + '</strong> — ' + data.worksCount + ' работ, ' + formatRub(data.total);
    const btns = $('toastButtons');
    btns.innerHTML = '';
    const yesBtn = el('button', 'toast-btn primary', 'Да');
    yesBtn.onclick = function() { $('toast').classList.remove('active'); restoreCalc(data); };
    const noBtn = el('button', 'toast-btn', 'Нет');
    noBtn.onclick = function() { $('toast').classList.remove('active'); localStorage.removeItem('nemesia_lastCalc'); };
    btns.appendChild(yesBtn); btns.appendChild(noBtn);
    $('toast').classList.add('active');
}

function restoreCalc(data) {
    if (!currentBrandData) return;
    const mod = currentBrandData.modifications.find(function(m) { return m.id === data.modificationId; });
    if (!mod) { showToast('Автомобиль не найден в базе'); return; }
    $('brandSelect').value = 'volkswagen'; onBrandChange();
    $('modelSelect').value = mod.model; onModelChange();
    $('genSelect').value = mod.generation; onGenChange();
    $('engineSelect').value = mod.id; onEngineChange();
    $('gearboxSelect').value = mod.id; onGearboxChange();
    $('driveSelect').value = mod.drive; onDriveChange();
    selectedWorks = [];
    data.works.forEach(function(sw) {
        const w = worksCatalog[sw.workId];
        if (!w) return;
        const nh = sw.nh !== undefined ? sw.nh : w.nh;
        const price = workPrice(nh, w.rateType);
        const coefficients = (sw.coefficients || []).map(function(cType) {
            const c = CONFIG.coefficients[cType];
            if (!c) return null;
            return { type: cType, percent: c.percent, rub: Math.round(price * c.percent / 100) };
        }).filter(Boolean);
        selectedWorks.push({
            workId: sw.workId, nh: nh, price: price, rateType: w.rateType,
            name: w.name, includes: w.includes || null, coefficients: coefficients
        });
    });
    renderWorks(mod);
    renderCalc();
    showToast('Расчёт восстановлен');
}

// --- HISTORY ---
function renderHistory() {
    let history = [];
    try { history = JSON.parse(localStorage.getItem('nemesia_history') || '[]'); } catch(e) {}
    if (history.length === 0) { if ($('historySection')) $('historySection').style.display = 'none'; return; }
    if ($('historySection')) $('historySection').style.display = 'block';
    const list = $('historyList');
    if (!list) return;
    list.innerHTML = '';
    history.forEach(function(h) {
        const card = el('div', 'history-card');
        card.innerHTML = '<div class="h-row"><span class="h-car">' + h.carLabel + '</span><span class="h-sum">' + formatRub(h.total) + '</span></div>' +
            '<div class="h-date">' + new Date(h.date).toLocaleString('ru-RU') + ' · ' + h.manager + '</div>' +
            '<div class="h-works">' + h.worksCount + ' работ</div>';
        card.onclick = function() { restoreCalc(h); };
        list.appendChild(card);
    });
}

// --- CLEAR ALL ---
function clearAll() {
    selectedWorks = [];
    expandedCats.clear(); expandedIncludes.clear();
    currentMod = null;
    if ($('brandSelect')) $('brandSelect').value = '';
    resetSelect('modelSelect'); resetSelect('genSelect');
    resetSelect('engineSelect'); resetSelect('gearboxSelect'); resetSelect('driveSelect');
    if ($('globalSearch')) $('globalSearch').value = '';
    if ($('worksSearch')) $('worksSearch').value = '';
    if ($('fluidsPanel')) $('fluidsPanel').classList.remove('active');
    if ($('worksPanel')) $('worksPanel').style.display = 'none';
    renderCalc();
    showToast('Все поля очищены');
}

// --- ADD REQUEST ---
function submitVin() {
    const vin = $('vinInput') ? $('vinInput').value.trim() : '';
    const comment = $('vinComment') ? $('vinComment').value.trim() : '';
    const addType = $('addType') ? $('addType').value : 'Модификация целиком';
    const description = $('addDescription') ? $('addDescription').value.trim() : '';
    if (!description && !vin) { showToast('Опишите запрос или введите VIN'); return; }
    const mgrSel = $('managerSelect');
    const mgrName = mgrSel ? CONFIG.managers.find(function(m) { return m.id === mgrSel.value; }) : null;
    const item = {
        id: Date.now(), type: addType, description: description,
        vin: vin, comment: comment, date: new Date().toISOString(),
        manager: mgrName ? mgrName.name : '—'
    };
    let queue = [];
    try { queue = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]'); } catch(e) {}
    queue.push(item);
    localStorage.setItem('nemesia_vinQueue', JSON.stringify(queue));
    closeAddModal();
    if ($('vinInput')) $('vinInput').value = '';
    if ($('vinComment')) $('vinComment').value = '';
    if ($('addDescription')) $('addDescription').value = '';

    if (CONFIG.cloudUrl) {
        cloudSend({
            action: 'addRequest', type: addType, description: description,
            vin: vin, comment: comment, date: item.date, manager: item.manager
        }).then(function(ok) {
            if (ok) {
                queue = [];
                localStorage.setItem('nemesia_vinQueue', JSON.stringify(queue));
                showToast('Запрос отправлен в общую очередь');
            } else {
                showToast('Запрос сохранён локально (нет связи с облаком)');
            }
            renderVinQueue();
        });
    } else {
        showToast('Запрос добавлен (облако не подключено)');
        renderVinQueue();
    }
}

function renderVinQueue() {
    const container = $('vinQueueList');
    if (!container) return;
    let queue = [];
    try { queue = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]'); } catch(e) {}
    if (queue.length === 0) { container.innerHTML = '<div class="queue-empty">Очередь пуста</div>'; return; }
    container.innerHTML = queue.map(function(item, i) {
        return '<div class="queue-item">' +
            '<div class="queue-type"><strong>' + (item.type || 'Запрос') + '</strong></div>' +
            (item.description ? '<div class="queue-desc">' + item.description + '</div>' : '') +
            (item.vin ? '<div class="queue-vin">VIN: ' + item.vin + '</div>' : '') +
            (item.comment ? '<div class="queue-comment">' + item.comment + '</div>' : '') +
            '<div class="queue-manager">' + item.manager + ' · ' + new Date(item.date).toLocaleString('ru-RU', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'}) + '</div>' +
            '<button class="queue-remove" data-index="' + i + '">×</button></div>';
    }).join('');
    container.querySelectorAll('.queue-remove').forEach(function(btn) {
        btn.onclick = function() {
            const idx = parseInt(btn.dataset.index);
            let q = [];
            try { q = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]'); } catch(e) {}
            q.splice(idx, 1);
            localStorage.setItem('nemesia_vinQueue', JSON.stringify(q));
            renderVinQueue();
        };
    });
}

// --- HELPERS ---
function fillSelect(id, labels, values) {
    const sel = $(id);
    if (!sel) return;
    sel.disabled = false;
    sel.innerHTML = '<option value="">— выбрать —</option>';
    if (values) {
        labels.forEach(function(l, i) { sel.insertAdjacentHTML('beforeend', '<option value="' + values[i] + '">' + l + '</option>'); });
    } else {
        labels.forEach(function(l) { sel.insertAdjacentHTML('beforeend', '<option value="' + l + '">' + l + '</option>'); });
    }
}

function resetSelect(id) {
    const sel = $(id);
    if (!sel) return;
    sel.disabled = true;
    sel.innerHTML = '<option value="">—</option>';
}

function showToast(msg) {
    if (!$('toastText') || !$('toast')) return;
    $('toastText').innerHTML = msg;
    if ($('toastButtons')) $('toastButtons').innerHTML = '';
    $('toast').classList.add('active');
    setTimeout(function() { $('toast').classList.remove('active'); }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
})();
