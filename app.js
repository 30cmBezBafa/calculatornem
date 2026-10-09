// ============================================
// NEMESIA CALCULATOR — APP LOGIC
// ============================================

let currentBrand = null;
let currentBrandData = null;
let currentMod = null;
let selectedWorks = [];
let expandedCats = new Set();
let expandedIncludes = new Set();
let isSaving = false;

// --- UTILITIES ---
function $(id) { return document.getElementById(id); }

function getRate(rateType) {
    return CONFIG.rates[rateType] || CONFIG.rates.standard;
}

function workPrice(nh, rateType) {
    return nh * getRate(rateType);
}

function formatRub(n) {
    return n.toLocaleString('ru-RU') + ' ₽';
}

function el(tag, cls) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
}

function showToast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

// --- WORK ITEM TEMPLATE (shared) ---
function workItemHTML(workId, work, price, inCalc, customNh) {
    const rateLabel = work.rateType === 'engine' ? 'ДВС' : '';
    const badge = rateLabel ? `<span class="rate-badge ${work.rateType}">${rateLabel}</span>` : '';
    const nhLabel = customNh ? `${customNh} н/ч` : `${work.nh} н/ч`;
    const hasIncludes = work.includes && work.includes.length > 0;
    const expandBtn = hasIncludes ? `<span class="expand-btn" data-work-id="${workId}" data-context="list">+</span>` : '';
    return `
        <div class="work-item${inCalc ? ' selected' : ''}${hasIncludes ? ' has-includes' : ''}" 
             data-work-id="${workId}" tabindex="0">
            <span class="checkbox"></span>
            <span class="work-name">${work.name}${badge}</span>
            <span class="work-nh">${nhLabel}</span>
            <span class="work-price">${formatRub(price)}</span>
            ${expandBtn}
        </div>
    `;
}

// --- WORKS LIST ---
function renderWorks(mod) {
    const container = $('worksList');
    container.innerHTML = '';

    // Group works by category
    const byCat = {};
    mod.works.forEach(wid => {
        const w = worksCatalog[wid];
        if (!w) { console.warn('Unknown workId:', wid); return; }
        if (!byCat[w.cat]) byCat[w.cat] = [];
        byCat[w.cat].push(wid);
    });

    // Render categories in order
    Object.keys(categories).forEach(catKey => {
        if (!byCat[catKey]) return;
        const catDiv = el('div', 'work-category');
        catDiv.dataset.cat = catKey;

        const header = el('div', 'work-category-header');
        const isExpanded = expandedCats.has(catKey);
        if (isExpanded) header.classList.add('expanded');
        header.innerHTML = `<span class="arrow">▶</span> ${categories[catKey]} <span class="count">${byCat[catKey].length}</span>`;
        header.onclick = () => {
            const expanded = header.classList.toggle('expanded');
            body.classList.toggle('expanded', expanded);
            if (expanded) expandedCats.add(catKey);
            else expandedCats.delete(catKey);
        };

        const body = el('div', 'work-category-body');
        if (isExpanded) body.classList.add('expanded');

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

    // Attach click handlers (delegation)
    container.onclick = onWorksListClick;
}

function onWorksListClick(e) {
    // Expand button for includes
    const expandBtn = e.target.closest('.expand-btn');
    if (expandBtn) {
        e.stopPropagation();
        const wid = expandBtn.dataset.workId;
        const item = expandBtn.closest('.work-item');
        item.classList.toggle('includes-expanded');
        // Show/hide includes list
        let incList = item.nextElementSibling;
        if (incList && incList.classList.contains('includes-list')) {
            incList.classList.toggle('expanded');
        } else {
            // Create it
            const w = worksCatalog[wid];
            if (w.includes) {
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

    // Work item click (toggle)
    const item = e.target.closest('.work-item');
    if (!item) return;
    const wid = item.dataset.workId;
    toggleWork(wid, item);
}

// --- TOGGLE WORK (no full re-render) ---
function toggleWork(workId, itemEl) {
    const w = worksCatalog[workId];
    if (!w) return;
    const idx = selectedWorks.findIndex(sw => sw.workId === workId);
    if (idx >= 0) {
        // Remove from calc
        selectedWorks.splice(idx, 1);
        itemEl.classList.remove('selected');
        expandedIncludes.delete(workId);
    } else {
        // Add to calc — учитываем customNh из текущей модификации
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
    if (selectedWorks.length === 0) {
        body.innerHTML = '<div class="calc-empty">Выберите работы из списка слева</div>';
        return;
    }

    // Render in order of addition
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

        // Includes list in calc
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

        // Coefficients
        html += `<div class="coeff-row" data-index="${i}">`;
        if (sw.coefficients.length > 0) {
            sw.coefficients.forEach((c, ci) => {
                html += `<div class="coeff-display">${CONFIG.coefficients[c.type].label}: +${c.percent}% <span class="coeff-rub">(${formatRub(c.rub)})</span> <span class="coeff-remove" data-cindex="${ci}">убрать</span></div>`;
            });
        }
        // Add coeff select
        html += `<select class="coeff-add" data-index="${i}"><option value="">+ Добавить коэффициент</option>`;
        Object.keys(CONFIG.coefficients).forEach(ck => {
            const already = sw.coefficients.some(c => c.type === ck);
            if (!already) {
                html += `<option value="${ck}">${CONFIG.coefficients[ck].label} (+${CONFIG.coefficients[ck].percent}%)</option>`;
            }
        });
        html += `</select>`;
        html += `</div>`;
        html += `</div>`;

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

    // Attach handlers
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
        btn.onclick = () => {
            const idx = parseInt(btn.closest('.coeff-row').dataset.index);
            const ci = parseInt(btn.dataset.cindex);
            selectedWorks[idx].coefficients.splice(ci, 1);
            renderCalc();
        };
    });

    body.querySelectorAll('.calc-work-remove').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.index);
            const sw = selectedWorks[idx];
            // Deselect in list
            const listItems = $('worksList').querySelectorAll('.work-item');
            listItems.forEach(item => {
                if (item.dataset.workId === sw.workId) item.classList.remove('selected');
            });
            selectedWorks.splice(idx, 1);
            expandedIncludes.delete(sw.workId);
            renderCalc();
        };
    });

    body.querySelectorAll('.expand-btn[data-calc-wid]').forEach(btn => {
        btn.onclick = () => {
            const wid = btn.dataset.calcWid;
            if (expandedIncludes.has(wid)) expandedIncludes.delete(wid);
            else expandedIncludes.add(wid);
            renderCalc();
        };
    });
}

// --- SAVE CALCULATION (with double-save protection) ---
function saveCalculation() {
    if (isSaving) return;
    if (selectedWorks.length === 0) return;
    if (!currentMod) return;

    isSaving = true;
    setTimeout(() => { isSaving = false; }, 1000);

    const mgr = $('managerSelect').value;
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

    // Save to localStorage history (last 5)
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('nemesia_history') || '[]');
    } catch(e) {}
    history.unshift(record);
    history = history.slice(0, 5);
    localStorage.setItem('nemesia_history', JSON.stringify(history));

    // Save as last calc
    localStorage.setItem('nemesia_lastCalc', JSON.stringify(record));

    renderHistory();
    showToast('Расчёт сохранён');
}

// --- RENDER HISTORY ---
function renderHistory() {
    const container = $('historyList');
    if (!container) return;
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('nemesia_history') || '[]');
    } catch(e) {}

    if (history.length === 0) {
        container.innerHTML = '<div class="history-empty">История пуста</div>';
        return;
    }

    container.innerHTML = history.map(h => `
        <div class="history-item" data-id="${h.id}">
            <div class="history-header">
                <span class="history-date">${new Date(h.date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                <span class="history-manager">${h.manager}</span>
            </div>
            <div class="history-car">${h.carLabel}</div>
            <div class="history-summary">${h.worksCount} работ · ${formatRub(h.total)}</div>
        </div>
    `).join('');

    container.querySelectorAll('.history-item').forEach(item => {
        item.onclick = () => loadHistoryItem(parseInt(item.dataset.id));
    });
}

function loadHistoryItem(id) {
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('nemesia_history') || '[]');
    } catch(e) {}
    const record = history.find(h => h.id === id);
    if (!record) return;

    // Find the modification
    if (!currentBrandData) {
        showToast('Сначала выберите марку');
        return;
    }
    const mod = currentBrandData.modifications.find(m => m.id === record.modificationId);
    if (!mod) {
        showToast('Модификация не найдена в базе');
        return;
    }

    // Select it
    currentMod = mod;
    selectedWorks = [];
    expandedCats.clear();
    expandedIncludes.clear();

    // Restore works
    record.works.forEach(rw => {
        const w = worksCatalog[rw.workId];
        if (!w) return;
        const price = workPrice(rw.nh, w.rateType);
        selectedWorks.push({
            workId: rw.workId,
            nh: rw.nh,
            price: price,
            rateType: w.rateType,
            name: w.name,
            includes: w.includes || null,
            coefficients: rw.coefficients.map(cType => {
                const percent = CONFIG.coefficients[cType]?.percent || 0;
                return { type: cType, percent, rub: Math.round(price * percent / 100) };
            })
        });
    });

    renderWorks(mod);
    renderCalc();
    showToast('Расчёт восстановлен');
}

// --- VIN MODAL ---
function showVinModal() {
    const modal = $('vinModal');
    if (modal) modal.classList.add('show');
}

function closeVinModal() {
    const modal = $('vinModal');
    if (modal) modal.classList.remove('show');
}

function submitVin() {
    const vin = $('vinInput').value.trim();
    const comment = $('vinComment').value.trim();
    const mgr = $('managerSelect').value;
    const mgrName = CONFIG.managers.find(m => m.id === mgr)?.name || '—';

    if (!vin) {
        showToast('Введите VIN');
        return;
    }

    // Save to VIN queue
    let queue = [];
    try {
        queue = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]');
    } catch(e) {}
    queue.unshift({ vin, comment, manager: mgrName, timestamp: Date.now() });
    localStorage.setItem('nemesia_vinQueue', JSON.stringify(queue));

    closeVinModal();
    showToast('VIN добавлен в очередь');
    renderVinQueue();
}

function renderVinQueue() {
    const container = $('vinQueueList');
    if (!container) return;
    let queue = [];
    try {
        queue = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]');
    } catch(e) {}

    if (queue.length === 0) {
        container.innerHTML = '<div class="queue-empty">Очередь пуста</div>';
        return;
    }

    container.innerHTML = queue.map((item, i) => `
        <div class="queue-item">
            <div class="queue-vin">${item.vin}</div>
            <div class="queue-comment">${item.comment || '—'}</div>
            <div class="queue-manager">${item.manager}</div>
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

// --- INIT ---
function init() {
    // Brand select
    const brandSelect = $('brandSelect');
    CONFIG.brands.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.id;
        opt.textContent = b.name;
        brandSelect.appendChild(opt);
    });
    brandSelect.onchange = onBrandChange;

    // Manager select
    const mgrSelect = $('managerSelect');
    CONFIG.managers.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.name;
        mgrSelect.appendChild(opt);
    });

    // VIN modal
    const vinClose = $('vinClose');
    if (vinClose) vinClose.onclick = closeVinModal;
    const vinSubmit = $('vinSubmit');
    if (vinSubmit) vinSubmit.onclick = submitVin;

    // Save button
    const saveBtn = $('saveBtn');
    if (saveBtn) saveBtn.onclick = saveCalculation;

    // Clear button
    const clearBtn = $('clearBtn');
    if (clearBtn) clearBtn.onclick = () => {
        selectedWorks = [];
        expandedCats.clear();
        expandedIncludes.clear();
        $('worksList').innerHTML = '';
        renderCalc();
    };

    // Load brand data (volkswagen is loaded via script tag)
    if (typeof volkswagenDB !== 'undefined') {
        currentBrandData = volkswagenDB;
        // Validate
        const errors = validateWorks(volkswagenDB, 'Volkswagen');
        if (errors.length > 0) console.warn('Validation errors:', errors);
    }

    // Render history & queue
    renderHistory();
    renderVinQueue();
}

// --- BRAND CHANGE ---
function onBrandChange() {
    const brandId = $('brandSelect').value;
    if (!brandId) return;
    const brand = CONFIG.brands.find(b => b.id === brandId);
    currentBrand = brand;

    // For now only volkswagen is loaded
    if (brandId === 'volkswagen' && typeof volkswagenDB !== 'undefined') {
        currentBrandData = volkswagenDB;
        const errors = validateWorks(volkswagenDB, 'Volkswagen');
        if (errors.length > 0) console.warn('Validation errors:', errors);
    } else {
        currentBrandData = null;
    }

    if (!currentBrandData) {
        showVinModal();
        return;
    }

    // Render model select
    const modelSelect = $('modelSelect');
    modelSelect.innerHTML = '<option value="">— Выберите модель —</option>';
    const models = [...new Set(currentBrandData.modifications.map(m => m.model))];
    models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        modelSelect.appendChild(opt);
    });
    modelSelect.onchange = onModelChange;
    modelSelect.disabled = false;

    // Reset downstream
    $('generationSelect').innerHTML = '<option value="">— Сначала выберите модель —</option>';
    $('generationSelect').disabled = true;
    $('engineSelect').innerHTML = '<option value="">— Сначала выберите поколение —</option>';
    $('engineSelect').disabled = true;
    $('worksList').innerHTML = '';
    selectedWorks = [];
    expandedCats.clear();
    expandedIncludes.clear();
    renderCalc();
}

function onModelChange() {
    const model = $('modelSelect').value;
    if (!model) return;

    const gens = [...new Set(currentBrandData.modifications.filter(m => m.model === model).map(m => m.generation))];
    const genSelect = $('generationSelect');
    genSelect.innerHTML = '<option value="">— Выберите поколение —</option>';
    gens.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g;
        genSelect.appendChild(opt);
    });
    genSelect.onchange = onGenerationChange;
    genSelect.disabled = false;

    $('engineSelect').innerHTML = '<option value="">— Сначала выберите поколение —</option>';
    $('engineSelect').disabled = true;
    $('worksList').innerHTML = '';
    selectedWorks = [];
    expandedCats.clear();
    expandedIncludes.clear();
    renderCalc();
}

function onGenerationChange() {
    const gen = $('generationSelect').value;
    const model = $('modelSelect').value;
    if (!gen || !model) return;

    const mods = currentBrandData.modifications.filter(m => m.model === model && m.generation === gen);
    const engSelect = $('engineSelect');
    engSelect.innerHTML = '<option value="">— Выберите модификацию —</option>';
    mods.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.engine.code} / ${m.engine.volume} / ${m.engine.power} / ${m.engine.torque}`;
        engSelect.appendChild(opt);
    });
    engSelect.onchange = onEngineChange;
    engSelect.disabled = false;

    $('worksList').innerHTML = '';
    selectedWorks = [];
    expandedCats.clear();
    expandedIncludes.clear();
    renderCalc();
}

function onEngineChange() {
    const modId = $('engineSelect').value;
    if (!modId) return;

    const mod = currentBrandData.modifications.find(m => m.id === modId);
    if (!mod) return;

    currentMod = mod;
    selectedWorks = [];
    expandedCats.clear();
    expandedIncludes.clear();

    renderWorks(mod);
    renderCalc();
}

// Start
document.addEventListener('DOMContentLoaded', init);
