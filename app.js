// ============================================
// НЕМЕЦИЯ — ОСНОВНАЯ ЛОГИКА (с кнопками "Добавить")
// ============================================

(function() {
'use strict';

// --- STATE ---
let currentBrand = null;
let currentBrandData = null;
let currentMod = null;
let selectedWorks = [];
let expandedCats = new Set();
let expandedIncludes = new Set();
let isSaving = false;
let searchActiveIndex = -1;
let searchResults = [];

// --- DOM HELPERS ---
const $ = (id) => document.getElementById(id);
const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
};

// --- UTILITIES ---
function getRate(rateType) {
    return CONFIG.rates[rateType] || CONFIG.rates.standard;
}

function workPrice(nh, rateType) {
    return nh * getRate(rateType);
}

function formatRub(n) {
    return n.toLocaleString('ru-RU') + ' ₽';
}

function debounce(fn, ms) {
    let t;
    return function(...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), ms);
    };
}

// Добавляет опцию "+ Добавить ..." в конец select
function addAddOption(selectId, labelText) {
    const sel = $(selectId);
    if (!sel) return;
    const opt = document.createElement('option');
    opt.value = '__add__';
    opt.textContent = `+ Добавить ${labelText}`;
    opt.style.color = '#0066cc';
    opt.style.fontWeight = 'bold';
    sel.appendChild(opt);
}

// Открывает модалку запроса на добавление
function openAddModal(type) {
    if ($('addType')) $('addType').value = type;
    if ($('vinModal')) $('vinModal').classList.add('show');
}

// --- WORK ITEM TEMPLATE ---
function workItemHTML(workId, work, price, inCalc, customNh) {
    const rateLabel = work.rateType === 'engine' ? 'ДВС' : '';
    const badge = rateLabel ? `<span class="rate-badge ${work.rateType}">${rateLabel}</span>` : '';
    const nhLabel = customNh ? `${customNh} н/ч` : `${work.nh} н/ч`;
    const confidenceDot = customNh 
        ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#27ae60;margin-left:6px;" title="Проверено для этого автомобиля"></span>'
        : '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#e74c3c;margin-left:6px;" title="Усредненное значение"></span>';
    const hasIncludes = work.includes && work.includes.length > 0;
    const expandBtn = hasIncludes ? `<span class="expand-btn" data-work-id="${workId}" data-context="list">+</span>` : '';
    return `
        <div class="work-item${inCalc ? ' selected' : ''}${hasIncludes ? ' has-includes' : ''}" 
             data-work-id="${workId}" tabindex="0">
            <span class="checkbox"></span>
            <span class="work-name">${work.name}${badge}</span>
            <span class="work-nh">${nhLabel}${confidenceDot}</span>
            <span class="work-price">${formatRub(price)}</span>
            ${expandBtn}
        </div>
    `;
}

// --- INIT ---
function init() {
    const savedTheme = localStorage.getItem('nemesia_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if ($('themeToggle')) $('themeToggle').checked = (savedTheme === 'dark');

    const mgrSel = $('managerSelect');
    if (mgrSel) {
        mgrSel.innerHTML = '<option value="">— выбрать —</option>' +
            CONFIG.managers.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
        const savedMgr = localStorage.getItem('nemesia_manager') || '';
        if (savedMgr) mgrSel.value = savedMgr;
        mgrSel.onchange = () => localStorage.setItem('nemesia_manager', mgrSel.value);
    }

    const brandSel = $('brandSelect');
    if (brandSel) {
        brandSel.disabled = false;
        brandSel.innerHTML = '<option value="">— выбрать —</option>' +
            CONFIG.brands.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
        addAddOption('brandSelect', 'марку');
        brandSel.onchange = () => {
            if (brandSel.value === '__add__') {
                openAddModal('Марка');
                brandSel.value = '';
                return;
            }
            onBrandChange();
        };
    }

    if ($('modelSelect')) {
        $('modelSelect').onchange = () => {
            if ($('modelSelect').value === '__add__') {
                openAddModal('Модель');
                $('modelSelect').value = '';
                return;
            }
            onModelChange();
        };
    }
    if ($('genSelect')) {
        $('genSelect').onchange = () => {
            if ($('genSelect').value === '__add__') {
                openAddModal('Поколение');
                $('genSelect').value = '';
                return;
            }
            onGenChange();
        };
    }
    if ($('engineSelect')) {
        $('engineSelect').onchange = () => {
            if ($('engineSelect').value === '__add__') {
                openAddModal('ДВС');
                $('engineSelect').value = '';
                return;
            }
            onEngineChange();
        };
    }
    if ($('gearboxSelect')) {
        $('gearboxSelect').onchange = () => {
            if ($('gearboxSelect').value === '__add__') {
                openAddModal('КПП');
                $('gearboxSelect').value = '';
                return;
            }
            onGearboxChange();
        };
    }
    if ($('driveSelect')) {
        $('driveSelect').onchange = () => {
            if ($('driveSelect').value === '__add__') {
                openAddModal('Привод');
                $('driveSelect').value = '';
                return;
            }
            onDriveChange();
        };
    }

    if ($('globalSearch')) $('globalSearch').addEventListener('input', debounce(onSearchInput, 200));
    if ($('globalSearch')) $('globalSearch').addEventListener('keydown', onSearchKeydown);
    if ($('worksSearch')) $('worksSearch').addEventListener('input', debounce(onWorksSearch, 200));

    if ($('saveCalcBtn')) $('saveCalcBtn').onclick = saveCalculation;
    if ($('clearAllBtn')) $('clearAllBtn').onclick = clearAll;

    if ($('themeToggle')) {
        $('themeToggle').onchange = () => {
            const theme = $('themeToggle').checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('nemesia_theme', theme);
        };
    }

    if ($('vinCancel')) $('vinCancel').onclick = () => $('vinModal').classList.remove('active');
    if ($('vinSubmit')) $('vinSubmit').onclick = submitVin;

    const last = localStorage.getItem('nemesia_lastCalc');
    if (last) {
        try {
            const data = JSON.parse(last);
            if (data.modificationId && data.works && data.works.length > 0) {
                showRestoreToast(data);
            }
        } catch(e) {}
    }

    renderHistory();

    if (typeof volkswagenDB !== 'undefined') {
        currentBrandData = volkswagenDB;
        const errors = validateWorks(volkswagenDB, 'Volkswagen');
        if (errors.length > 0) console.warn('Validation errors:', errors);
    }
}

// --- BRAND CHANGE ---
function onBrandChange() {
    const brandId = $('brandSelect').value;
    if (!brandId) return;
    const brand = CONFIG.brands.find(b => b.id === brandId);
    currentBrand = brand;
    
    if (brandId === 'volkswagen' && typeof volkswagenDB !== 'undefined') {
        currentBrandData = volkswagenDB;
    } else {
        currentBrandData = null;
    }

    if (!currentBrandData) {
        openAddModal('Марка');
        return;
    }

    resetSelect('modelSelect');
    resetSelect('genSelect');
    resetSelect('engineSelect');
    resetSelect('gearboxSelect');
    resetSelect('driveSelect');
    expandedCats.clear();
    expandedIncludes.clear();

    const models = [...new Set(currentBrandData.modifications.map(m => m.model))].sort();
    fillSelect('modelSelect', models);
    addAddOption('modelSelect', 'модель');
}

function onModelChange() {
    const model = $('modelSelect').value;
    if (!model || !currentBrandData) return;
    resetSelect('genSelect');
    resetSelect('engineSelect');
    resetSelect('gearboxSelect');
    resetSelect('driveSelect');
    expandedCats.clear();
    expandedIncludes.clear();

    const mods = currentBrandData.modifications.filter(m => m.model === model);
    const gens = [...new Set(mods.map(m => m.generation))].sort();
    fillSelect('genSelect', gens);
    addAddOption('genSelect', 'поколение');
}

function onGenChange() {
    const model = $('modelSelect').value;
    const gen = $('genSelect').value;
    if (!gen || !currentBrandData) return;
    resetSelect('engineSelect');
    resetSelect('gearboxSelect');
    resetSelect('driveSelect');
    expandedCats.clear();
    expandedIncludes.clear();

    const mods = currentBrandData.modifications.filter(m => m.model === model && m.generation === gen);
    const engines = mods.map(m => ({
        value: m.id,
        label: `${m.engine.code} / ${m.engine.volume} / ${m.engine.power} / ${m.engine.torque}`,
        mod: m
    }));
    fillSelect('engineSelect', engines.map(e => e.label), engines.map(e => e.value));
    addAddOption('engineSelect', 'ДВС');
}

function onEngineChange() {
    const modId = $('engineSelect').value;
    if (!modId || !currentBrandData) return;
    const mods = currentBrandData.modifications.filter(m => m.id === modId);
    resetSelect('gearboxSelect');
    resetSelect('driveSelect');
    expandedCats.clear();
    expandedIncludes.clear();

    const gearboxes = mods.map(m => ({
        value: m.id,
        label: `${m.gearbox.code} / ${m.gearbox.type} / ${m.gearbox.gears} ст.`,
        mod: m
    }));
    fillSelect('gearboxSelect', gearboxes.map(g => g.label), gearboxes.map(g => g.value));
    addAddOption('gearboxSelect', 'КПП');
}

function onGearboxChange() {
    const modId = $('gearboxSelect').value;
    if (!modId || !currentBrandData) return;
    resetSelect('driveSelect');
    expandedCats.clear();
    expandedIncludes.clear();

    const mods = currentBrandData.modifications.filter(m => m.id === modId);
    const drives = [...new Set(mods.map(m => m.drive))];
    fillSelect('driveSelect', drives);
    addAddOption('driveSelect', 'привод');
}

function onDriveChange() {
    const modId = $('gearboxSelect').value;
    if (!modId || !currentBrandData) return;
    const drive = $('driveSelect').value;
    const mod = currentBrandData.modifications.find(m => m.id === modId && m.drive === drive);
    if (!mod) return;

    currentMod = mod;
    expandedCats.clear();
    expandedIncludes.clear();
    selectedWorks = [];

    renderFluids(mod);
    renderWorks(mod);
    renderCalc();
    if ($('worksPanel')) $('worksPanel').style.display = 'block';
}

// --- SEARCH ---
function onSearchInput() {
    const q = $('globalSearch').value.trim().toLowerCase();
    const dropdown = $('searchDropdown');
    if (!q) { dropdown.classList.remove('active'); return; }
    if (!currentBrandData) {
        if (typeof volkswagenDB !== 'undefined') currentBrandData = volkswagenDB;
        else { dropdown.classList.remove('active'); return; }
    }

    searchResults = currentBrandData.modifications.filter(m => {
        return (
            m.model.toLowerCase().includes(q) ||
            m.generation.toLowerCase().includes(q) ||
            m.engine.code.toLowerCase().includes(q) ||
            m.gearbox.code.toLowerCase().includes(q) ||
            m.engine.volume.toLowerCase().includes(q)
        );
    }).slice(0, 15);

    if (searchResults.length === 0) {
        dropdown.innerHTML = '<div class="item" style="color:var(--text-muted)">Ничего не найдено. <a href="#" onclick="openAddModal(\'Модификация целиком\'); return false;">Запросить добавление</a></div>';
    } else {
        dropdown.innerHTML = searchResults.map((m, i) => `
            <div class="item" data-index="${i}">
                <div class="item-model">${m.model} — ${m.generation}</div>
                <div class="item-detail">${m.engine.code} · ${m.engine.volume} · ${m.engine.power} · ${m.gearbox.code} · ${m.drive}</div>
            </div>
        `).join('');
        dropdown.querySelectorAll('.item').forEach(item => {
            item.onclick = () => {
                const idx = parseInt(item.dataset.index);
                selectFromSearch(searchResults[idx]);
            };
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
        items.forEach((it, i) => it.classList.toggle('active', i === searchActiveIndex));
        items[searchActiveIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        searchActiveIndex = Math.max(searchActiveIndex - 1, 0);
        items.forEach((it, i) => it.classList.toggle('active', i === searchActiveIndex));
        items[searchActiveIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchActiveIndex >= 0 && searchResults[searchActiveIndex]) {
            selectFromSearch(searchResults[searchActiveIndex]);
        }
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
    $('modelSelect').value = mod.model;
    onModelChange();
    $('genSelect').value = mod.generation;
    onGenChange();
    $('engineSelect').value = mod.id;
    onEngineChange();
    $('gearboxSelect').value = mod.id;
    onGearboxChange();
    $('driveSelect').value = mod.drive;
    onDriveChange();
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.car-search-wrapper')) {
        const dropdown = $('searchDropdown');
        if (dropdown) dropdown.classList.remove('active');
    }
});

// --- WORKS SEARCH ---
function onWorksSearch() {
    const q = $('worksSearch').value.trim().toLowerCase();
    const cats = document.querySelectorAll('.work-category');
    if (!q) {
        cats.forEach(cat => {
            const catKey = cat.dataset.cat;
            const header = cat.querySelector('.work-category-header');
            const body = cat.querySelector('.work-category-body');
            const expanded = expandedCats.has(catKey);
            header.classList.toggle('expanded', expanded);
            body.classList.toggle('expanded', expanded);
            cat.querySelectorAll('.work-item').forEach(w => w.style.display = '');
        });
        return;
    }
    cats.forEach(cat => {
        let visible = 0;
        cat.querySelectorAll('.work-item').forEach(w => {
            const name = w.querySelector('.work-name').textContent.toLowerCase();
            const match = name.includes(q);
            w.style.display = match ? '' : 'none';
            if (match) visible++;
        });
        const header = cat.querySelector('.work-category-header');
        const body = cat.querySelector('.work-category-body');
        if (visible > 0) {
            header.classList.add('expanded');
            body.classList.add('expanded');
            header.querySelector('.count').textContent = visible + ' совпад.';
        } else {
            header.classList.remove('expanded');
            body.classList.remove('expanded');
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
    rows.forEach(([name, data]) => {
        if (!data) {
            html += `<tr><td class="fluid-name">${name}</td><td class="fluid-na" colspan="3">—</td></tr>`;
        } else {
            html += `<tr><td class="fluid-name">${name}</td><td>${data.volume}</td><td>${data.spec}</td><td>${data.viscosity}</td></tr>`;
        }
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
    
    mod.works.forEach(wid => {
        const w = worksCatalog[wid];
        if (!w) { console.warn('Unknown workId:', wid); return; }
        
        if (w.gearboxType && modGearboxType) {
            if (!w.gearboxType.includes(modGearboxType)) return;
        }
        
        if (!byCat[w.cat]) byCat[w.cat] = [];
        byCat[w.cat].push(wid);
    });

    Object.keys(categories).forEach(catKey => {
        if (!byCat[catKey]) return;
        const catDiv = el('div', 'work-category');
        catDiv.dataset.cat = catKey;

        const body = el('div', 'work-category-body');
        const header = el('div', 'work-category-header');
        const isExpanded = expandedCats.has(catKey);
        
        if (isExpanded) {
            header.classList.add('expanded');
            body.classList.add('expanded');
        }
        
        header.innerHTML = `<span class="arrow">▶</span> ${categories[catKey]} <span class="count">${byCat[catKey].length}</span>`;
        header.onclick = () => {
            const expanded = header.classList.toggle('expanded');
            body.classList.toggle('expanded', expanded);
            if (expanded) expandedCats.add(catKey);
            else expandedCats.delete(catKey);
        };

        byCat[catKey].forEach(wid => {
            const w = worksCatalog[wid];
            const customNh = (mod.customNh && mod.customNh[wid]) ? mod.customNh[wid] : null;
            const finalNh = customNh || w.nh;
            const price = workPrice(finalNh, w.rateType);
            const inCalc = selectedWorks.some(sw => sw.workId === wid);
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
                w.includes.forEach(incId => {
                    const inc = worksCatalog[incId];
                    if (inc) {
                        const incPrice = workPrice(inc.nh, inc.rateType);
                        list.insertAdjacentHTML('beforeend',
                            `<div class="include-item"><span>${inc.name}</span><span>${inc.nh} н/ч · ${formatRub(incPrice)}</span></div>`);
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
    const wid = item.dataset.workId;
    toggleWork(wid, item);
}

// --- TOGGLE WORK ---
function toggleWork(workId, itemEl) {
    const w = worksCatalog[workId];
    if (!w) return;
    const idx = selectedWorks.findIndex(sw => sw.workId === workId);
    if (idx >= 0) {
        selectedWorks.splice(idx, 1);
        itemEl.classList.remove('selected');
        expandedIncludes.delete(workId);
    } else {
        const customNh = (currentMod && currentMod.customNh && currentMod.customNh[workId]) ? currentMod.customNh[workId] : null;
        const finalNh = customNh || w.nh;
        const price = workPrice(finalNh, w.rateType);
        selectedWorks.push({
            workId: workId,
            nh: finalNh,
            price: price,
            rateType: w.rateType,
            name: w.name,
            includes: w.includes || null,
            coefficients: []
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

    selectedWorks.forEach((sw, i) => {
        const w = worksCatalog[sw.workId];
        const hasIncludes = sw.includes && sw.includes.length > 0;
        const isIncExpanded = expandedIncludes.has(sw.workId);

        let coeffSum = 0;
        sw.coefficients.forEach(c => { coeffSum += c.rub; });

        html += `<div class="calc-work-card${hasIncludes ? ' has-includes' : ''}" data-index="${i}">`;
        html += `<div class="calc-work-header">`;
        html += `<span class="calc-work-name">${sw.name}</span>`;
        if (hasIncludes) {
            html += `<span class="expand-btn" data-calc-wid="${sw.workId}" style="cursor:pointer;font-size:14px;width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:3px;flex-shrink:0;">${isIncExpanded ? '−' : '+'}</span>`;
        }
        html += `<span class="calc-work-remove" data-index="${i}">×</span>`;
        html += `</div>`;
        html += `<div class="calc-work-info">`;
        html += `<span>${sw.nh} н/ч · ${formatRub(sw.price)}</span>`;
        html += `<span class="calc-work-price">${formatRub(sw.price + coeffSum)}</span>`;
        html += `</div>`;

        if (hasIncludes && isIncExpanded) {
            html += `<div class="includes-list expanded" style="padding:4px 0 4px 12px;">`;
            sw.includes.forEach(incId => {
                const inc = worksCatalog[incId];
                if (inc) {
                    const incPrice = workPrice(inc.nh, inc.rateType);
                    html += `<div class="include-item"><span>${inc.name}</span><span>${inc.nh} н/ч · ${formatRub(incPrice)}</span></div>`;
                }
            });
            html += `</div>`;
        }

        html += `<div class="coeff-row" data-index="${i}">`;
        if (sw.coefficients.length > 0) {
            sw.coefficients.forEach((c, ci) => {
                html += `<div class="coeff-display">${CONFIG.coefficients[c.type].label}: +${c.percent}% <span class="coeff-rub">(${formatRub(c.rub)})</span> <span class="coeff-remove" data-cindex="${ci}">убрать</span></div>`;
            });
        }
        html += `<select class="coeff-add" data-index="${i}"><option value="">+ Добавить коэффициент</option>`;
        Object.keys(CONFIG.coefficients).forEach(ck => {
            const already = sw.coefficients.some(c => c.type === ck);
            if (!already) {
                html += `<option value="${ck}">${CONFIG.coefficients[ck].label} (+${CONFIG.coefficients[ck].percent}%)</option>`;
            }
        });
        html += `</select></div></div>`;

        totalWorks += sw.price + coeffSum;
        totalCoeff += coeffSum;
    });

    html += `<div class="calc-total">`;
    html += `<div class="calc-total-row"><span>Работы:</span><span>${formatRub(totalWorks - totalCoeff)}</span></div>`;
    if (totalCoeff > 0) {
        html += `<div class="calc-total-row"><span>Коэффициенты:</span><span>+${formatRub(totalCoeff)}</span></div>`;
    }
    html += `<div class="calc-total-row final"><span>Итого:</span><span>${formatRub(totalWorks)}</span></div>`;
    html += `</div>`;

    body.innerHTML = html;

    body.querySelectorAll('.calc-work-remove').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            const wid = selectedWorks[idx].workId;
            selectedWorks.splice(idx, 1);
            expandedIncludes.delete(wid);
            const leftItem = document.querySelector(`.work-item[data-work-id="${wid}"]`);
            if (leftItem) leftItem.classList.remove('selected');
            renderCalc();
        };
    });

    body.querySelectorAll('.coeff-add').forEach(sel => {
        sel.onchange = () => {
            const idx = parseInt(sel.dataset.index);
            const cType = sel.value;
            if (!cType) return;
            const sw = selectedWorks[idx];
            const percent = CONFIG.coefficients[cType].percent;
            const rub = Math.round(sw.price * percent / 100);
            sw.coefficients.push({ type: cType, percent, rub });
            renderCalc();
        };
    });

    body.querySelectorAll('.coeff-remove').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const workIdx = parseInt(btn.closest('.coeff-row').dataset.index);
            const coeffIdx = parseInt(btn.dataset.cindex);
            selectedWorks[workIdx].coefficients.splice(coeffIdx, 1);
            renderCalc();
        };
    });

    body.querySelectorAll('.expand-btn[data-calc-wid]').forEach(btn => {
        btn.onclick = (e) => {
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
    setTimeout(() => { isSaving = false; }, 1000);

    const mgr = $('managerSelect')?.value;
    const mgrName = CONFIG.managers.find(m => m.id === mgr)?.name || '—';

    const total = selectedWorks.reduce((sum, sw) => {
        const coeffSum = sw.coefficients.reduce((s, c) => s + c.rub, 0);
        return sum + sw.price + coeffSum;
    }, 0);

    const record = {
        id: Date.now(),
        date: new Date().toISOString(),
        manager: mgrName,
        modificationId: currentMod.id,
        carLabel: `${currentBrand?.name || ''} ${currentMod.model} ${currentMod.generation} ${currentMod.engine.code}`,
        worksCount: selectedWorks.length,
        total: total,
        works: selectedWorks.map(sw => ({
            workId: sw.workId,
            nh: sw.nh,
            coefficients: sw.coefficients.map(c => c.type)
        }))
    };

    let history = [];
    try { history = JSON.parse(localStorage.getItem('nemesia_history') || '[]'); } catch(e) {}
    history.unshift(record);
    history = history.slice(0, 5);
    localStorage.setItem('nemesia_history', JSON.stringify(history));
    localStorage.setItem('nemesia_lastCalc', JSON.stringify(record));

    renderHistory();
    showToast('Расчёт сохранён');
}

// --- RESTORE ---
function showRestoreToast(data) {
    if (!$('toastText') || !$('toastButtons') || !$('toast')) return;
    $('toastText').innerHTML = `Восстановить последний расчёт?<br><strong>${data.carLabel}</strong> — ${data.worksCount} работ, ${formatRub(data.total)}`;
    const btns = $('toastButtons');
    btns.innerHTML = '';
    const yesBtn = el('button', 'toast-btn primary', 'Да');
    yesBtn.onclick = () => {
        $('toast').classList.remove('active');
        restoreCalc(data);
    };
    const noBtn = el('button', 'toast-btn', 'Нет');
    noBtn.onclick = () => {
        $('toast').classList.remove('active');
        localStorage.removeItem('nemesia_lastCalc');
    };
    btns.appendChild(yesBtn);
    btns.appendChild(noBtn);
    $('toast').classList.add('active');
}

function restoreCalc(data) {
    if (!currentBrandData) return;
    const mod = currentBrandData.modifications.find(m => m.id === data.modificationId);
    if (!mod) return;

    $('brandSelect').value = 'volkswagen';
    onBrandChange();
    $('modelSelect').value = mod.model;
    onModelChange();
    $('genSelect').value = mod.generation;
    onGenChange();
    $('engineSelect').value = mod.id;
    onEngineChange();
    $('gearboxSelect').value = mod.id;
    onGearboxChange();
    $('driveSelect').value = mod.drive;
    onDriveChange();

    selectedWorks = [];
    data.works.forEach(sw => {
        const w = worksCatalog[sw.workId];
        if (!w) return;
        const nh = sw.nh !== undefined ? sw.nh : w.nh;
        const price = workPrice(nh, w.rateType);
        const coefficients = (sw.coefficients || []).map(cType => {
            const c = CONFIG.coefficients[cType];
            if (!c) return null;
            return { type: cType, percent: c.percent, rub: Math.round(price * c.percent / 100) };
        }).filter(Boolean);
        selectedWorks.push({
            workId: sw.workId,
            nh: nh,
            price: price,
            rateType: w.rateType,
            name: w.name,
            includes: w.includes || null,
            coefficients: coefficients
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
    if (history.length === 0) {
        if ($('historySection')) $('historySection').style.display = 'none';
        return;
    }
    if ($('historySection')) $('historySection').style.display = 'block';
    const list = $('historyList');
    if (!list) return;
    list.innerHTML = '';
    history.forEach(h => {
        const card = el('div', 'history-card');
        card.innerHTML = `
            <div class="h-row">
                <span class="h-car">${h.carLabel}</span>
                <span class="h-sum">${formatRub(h.total)}</span>
            </div>
            <div class="h-date">${new Date(h.date).toLocaleString('ru-RU')} · ${h.manager}</div>
            <div class="h-works">${h.worksCount} работ</div>
        `;
        card.onclick = () => restoreCalc(h);
        list.appendChild(card);
    });
}

// --- CLEAR ALL ---
function clearAll() {
    selectedWorks = [];
    expandedCats.clear();
    expandedIncludes.clear();
    currentMod = null;
    if ($('brandSelect')) $('brandSelect').value = '';
    resetSelect('modelSelect');
    resetSelect('genSelect');
    resetSelect('engineSelect');
    resetSelect('gearboxSelect');
    resetSelect('driveSelect');
    if ($('globalSearch')) $('globalSearch').value = '';
    if ($('worksSearch')) $('worksSearch').value = '';
    if ($('fluidsPanel')) $('fluidsPanel').classList.remove('active');
    if ($('worksPanel')) $('worksPanel').style.display = 'none';
    renderCalc();
    showToast('Все поля очищены');
}

// --- VIN / ADD MODAL ---
function submitVin() {
    const vin = $('vinInput')?.value.trim();
    const comment = $('vinComment')?.value.trim();
    const addType = $('addType')?.value || 'Модификация целиком';
    const description = $('addDescription')?.value.trim();
    
    if (!description && !vin) { 
        showToast('Опишите запрос или введите VIN'); 
        return; 
    }
    
    let queue = [];
    try { queue = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]'); } catch(e) {}
    queue.push({
        type: addType,
        description: description,
        vin: vin,
        comment: comment,
        date: new Date().toISOString(),
        manager: CONFIG.managers.find(m => m.id === $('managerSelect')?.value)?.name || '—'
    });
    localStorage.setItem('nemesia_vinQueue', JSON.stringify(queue));
    
    if ($('vinModal')) $('vinModal').classList.remove('show');
    if ($('vinInput')) $('vinInput').value = '';
    if ($('vinComment')) $('vinComment').value = '';
    if ($('addDescription')) $('addDescription').value = '';
    showToast('Запрос добавлен в очередь');
    renderVinQueue();
}

function renderVinQueue() {
    const container = $('vinQueueList');
    if (!container) return;
    let queue = [];
    try { queue = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]'); } catch(e) {}

    if (queue.length === 0) {
        container.innerHTML = '<div class="queue-empty">Очередь пуста</div>';
        return;
    }

    container.innerHTML = queue.map((item, i) => `
        <div class="queue-item">
            <div class="queue-type"><strong>${item.type || 'Запрос'}</strong></div>
            ${item.description ? `<div class="queue-desc">${item.description}</div>` : ''}
            ${item.vin ? `<div class="queue-vin">VIN: ${item.vin}</div>` : ''}
            ${item.comment ? `<div class="queue-comment">${item.comment}</div>` : ''}
            <div class="queue-manager">${item.manager} · ${new Date(item.date).toLocaleString('ru-RU', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})}</div>
            <button class="queue-remove" data-index="${i}">×</button>
        </div>
    `).join('');

    container.querySelectorAll('.queue-remove').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.index);
            queue.splice(idx, 1);
            localStorage.setItem('nemesia_vinQueue', JSON.stringify(queue));
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
        labels.forEach((l, i) => {
            sel.insertAdjacentHTML('beforeend', `<option value="${values[i]}">${l}</option>`);
        });
    } else {
        labels.forEach(l => {
            sel.insertAdjacentHTML('beforeend', `<option value="${l}">${l}</option>`);
        });
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
    setTimeout(() => $('toast').classList.remove('active'), 3000);
}

// --- START ---
document.addEventListener('DOMContentLoaded', init);
})();
