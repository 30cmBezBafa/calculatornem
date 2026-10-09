// ============================================
// КОНФИГУРАЦИЯ СИСТЕМЫ
// ============================================
const CONFIG = {
    rates: {
        engine: 3000,    // ДВС/КПП
        standard: 2500   // Остальные работы
    },
    coefficients: {
        rusty_bolts:  { label: 'Прикипевшие/ржавые болты', percent: 15 },
        aluminum:     { label: 'Алюминиевые детали',       percent: 20 },
        lpg:          { label: 'Установлено ГБО',           percent: 10 }
    },
    managers: [
        { id: 'm1', name: 'Влад' },
        { id: 'm2', name: 'Иван' },
        { id: 'm3', name: 'Сергей' }
    ],
        brands: [
        { id: 'volkswagen',  name: 'Volkswagen',  file: 'volkswagen.js' }
    ]
};

const worksCatalog = {
    // === РЕГЛАМЕНТНЫЕ РАБОТЫ (ТО) ===
    oil_change:           { cat: 'to',  name: 'Замена моторного масла и масляного фильтра (комплекс)', rateType: 'standard', nh: 0.5 },
    air_filter:           { cat: 'to',  name: 'Замена воздушного фильтра', rateType: 'standard', nh: 0.3 },
    cabin_filter:         { cat: 'to',  name: 'Замена салонного фильтра', rateType: 'standard', nh: 0.3 },
    fuel_filter:          { cat: 'to',  name: 'Замена топливного фильтра', rateType: 'standard', nh: 0.5 },
    spark_plugs:          { cat: 'to',  name: 'Замена свечей зажигания (комплект)', rateType: 'standard', nh: 0.6 },
    glow_plugs:           { cat: 'to',  name: 'Замена свечей накаливания (комплект, дизель)', rateType: 'standard', nh: 0.8 },
    brake_fluid_change:   { cat: 'to',  name: 'Замена тормозной жидкости (прокачка)', rateType: 'standard', nh: 0.4 },
    coolant_change:       { cat: 'to',  name: 'Замена охлаждающей жидкости (прокачка системы)', rateType: 'standard', nh: 0.5 },
    ac_recharge:          { cat: 'to',  name: 'Заправка кондиционера (с вакуумированием)', rateType: 'standard', nh: 0.5 },

    // === ДВИГАТЕЛЬ ===
    timing_belt:          { cat: 'engine', name: 'Замена ремня ГРМ (с роликами)', rateType: 'engine', nh: 4.0 },
    timing_chain:         { cat: 'engine', name: 'Замена цепи ГРМ (с натяжителями)', rateType: 'engine', nh: 6.0 },
    valve_clearance:      { cat: 'engine', name: 'Регулировка клапанных зазоров (подбор толкателей)', rateType: 'engine', nh: 3.0 },
    valve_cover_gasket:   { cat: 'engine', name: 'Замена прокладки клапанной крышки', rateType: 'engine', nh: 1.5 },
    oil_pump:             { cat: 'engine', name: 'Замена масляного насоса (со снятием поддона)', rateType: 'engine', nh: 4.0 },
    water_pump:           { cat: 'engine', name: 'Замена водяной помпы', rateType: 'engine', nh: 2.0 },
    thermostat:           { cat: 'engine', name: 'Замена термостата (в сборе с корпусом)', rateType: 'engine', nh: 1.0 },
    engine_mounts:        { cat: 'engine', name: 'Замена опор двигателя (подушек)', rateType: 'standard', nh: 2.5 },

    // === СНЯТИЕ/УСТАНОВКА ДВС ===
    engine_remove_install: {
        cat: 'engine_big', name: 'ДВС — Снятие и установка (комплекс)',
        rateType: 'engine', nh: 12.0,
        includes: ['drain_coolant', 'remove_underguard', 'disconnect_exhaust', 'remove_drives', 'separate_gearbox']
    },
    drain_coolant:        { cat: 'engine_big', name: 'Слив охлаждающей жидкости из системы', rateType: 'standard', nh: 0.3 },
    remove_underguard:    { cat: 'engine_big', name: 'Снятие защиты картера (металлический лист)', rateType: 'standard', nh: 0.3 },
    disconnect_exhaust:   { cat: 'engine_big', name: 'Отсоединение выхлопной трассы от коллектора', rateType: 'standard', nh: 0.5 },
    remove_drives:        { cat: 'engine_big', name: 'Снятие и установка приводных валов (ШРУСов)', rateType: 'standard', nh: 1.0 },
    separate_gearbox:     { cat: 'engine_big', name: 'Отделение коробки передач от двигателя (разъединение)', rateType: 'standard', nh: 1.5 },

    // === КПП ===
    gearbox_remove_install: {
        cat: 'gearbox', name: 'КПП — Снятие и установка (комплекс)',
        rateType: 'engine', nh: 8.0,
        includes: ['remove_drives']
    },
    gearbox_oil_change:   { cat: 'gearbox', name: 'Замена масла в КПП', rateType: 'standard', nh: 0.5, gearboxType: ['manual', 'dsg', 'automatic'] },
    mechatronic:          { cat: 'gearbox', name: 'Замена мехатроника DSG (блок управления + гидроблок)', rateType: 'engine', nh: 6.0, gearboxType: ['dsg'] },
    clutch_replacement:   { cat: 'gearbox', name: 'Замена сцепления DSG (пакет фрикционов)', rateType: 'engine', nh: 5.0, gearboxType: ['dsg'] },
    clutch_replacement_manual: { cat: 'gearbox', name: 'Замена комплекта сцепления (диск + корзина + выжимной)', rateType: 'engine', nh: 4.0, gearboxType: ['manual'] },
    dual_mass_flywheel:   { cat: 'gearbox', name: 'Замена двухмассового маховика', rateType: 'engine', nh: 5.5, gearboxType: ['dsg', 'automatic'] },
    gearbox_repair:       { cat: 'gearbox', name: 'Ремонт КПП без снятия (замена соленоидов, датчиков)', rateType: 'engine', nh: 8.0 },

    // === ПОЛНЫЙ ПРИВОД ===
    transfer_case_oil:    { cat: 'awd', name: 'Замена масла в раздаточной коробке', rateType: 'standard', nh: 0.4 },
    diff_oil_front:       { cat: 'awd', name: 'Замена масла в переднем редукторе (дифференциале)', rateType: 'standard', nh: 0.4 },
    diff_oil_rear:        { cat: 'awd', name: 'Замена масла в заднем редукторе (дифференциале)', rateType: 'standard', nh: 0.4 },
    haldex_oil:           { cat: 'awd', name: 'Замена масла в муфте Haldex (полный привод MQB)', rateType: 'standard', nh: 0.5 },
    haldex_filter:        { cat: 'awd', name: 'Замена фильтра муфты Haldex (сеточка)', rateType: 'standard', nh: 0.5 },
    transfer_case_remove: { cat: 'awd', name: 'Снятие и установка раздаточной коробки', rateType: 'engine', nh: 4.0 },

    // === ПОДВЕСКА ===
    shock_absorbers_front:     { cat: 'suspension', name: 'Замена передних амортизаторов (пара)', rateType: 'standard', nh: 1.5 },
    shock_absorbers_rear:      { cat: 'suspension', name: 'Замена задних амортизаторов (пара)', rateType: 'standard', nh: 1.8 },
    shock_absorbers_front_air: { cat: 'suspension', name: 'Замена передних пневмоамортизаторов (пара, со стравливанием системы)', rateType: 'standard', nh: 2.5 },
    shock_absorbers_rear_air:  { cat: 'suspension', name: 'Замена задних пневмоамортизаторов/пневмобаллонов (пара)', rateType: 'standard', nh: 2.8 },
    springs:              { cat: 'suspension', name: 'Замена пружин подвески (пара)', rateType: 'standard', nh: 2.0 },
    control_arm_bushings: { cat: 'suspension', name: 'Замена сайлентблоков рычагов (перепрессовка)', rateType: 'standard', nh: 2.0 },
    ball_joints:          { cat: 'suspension', name: 'Замена шаровых опор', rateType: 'standard', nh: 1.5 },
    sway_bar_links_front: { cat: 'suspension', name: 'Замена стоек переднего стабилизатора (пара)', rateType: 'standard', nh: 0.6 },
    sway_bar_links_rear:  { cat: 'suspension', name: 'Замена стоек заднего стабилизатора (пара)', rateType: 'standard', nh: 0.7 },
    wheel_bearings:       { cat: 'suspension', name: 'Замена ступичных подшипников (пара, в сборе со ступицей)', rateType: 'standard', nh: 2.0 },

    // === ТОРМОЗА ===
    brake_pads_front:     { cat: 'brakes', name: 'Замена передних тормозных колодок', rateType: 'standard', nh: 0.5 },
    brake_pads_rear:      { cat: 'brakes', name: 'Замена задних тормозных колодок (механический ручник)', rateType: 'standard', nh: 0.6 },
    brake_pads_rear_electric_release: { cat: 'brakes', name: 'Разведение поршней заднего суппорта (электронный ручник, через сканер)', rateType: 'standard', nh: 0.3 },
    brake_discs_front:    { cat: 'brakes', name: 'Замена передних тормозных дисков (пара, с колодками)', rateType: 'standard', nh: 1.0 },
    brake_discs_rear:     { cat: 'brakes', name: 'Замена задних тормозных дисков (пара, с колодками)', rateType: 'standard', nh: 1.2 },
    brake_caliper_refurb: { cat: 'brakes', name: 'Ремонт тормозного суппорта (направляющие, пыльники, поршень)', rateType: 'standard', nh: 1.5 },
    brake_lines:          { cat: 'brakes', name: 'Замена тормозных шлангов (пара)', rateType: 'standard', nh: 0.8 },
    handbrake_adjust:     { cat: 'brakes', name: 'Регулировка троса ручного тормоза', rateType: 'standard', nh: 0.4 },
    abs_sensor:           { cat: 'brakes', name: 'Замена датчика ABS (колесного)', rateType: 'standard', nh: 0.3 },

    // === РУЛЕВОЕ УПРАВЛЕНИЕ ===
    tie_rods:             { cat: 'steering', name: 'Замена рулевых тяг и наконечников (пара)', rateType: 'standard', nh: 1.0 },
    rack_boots:           { cat: 'steering', name: 'Замена пыльников рулевой рейки (пара)', rateType: 'standard', nh: 1.5 },
    steering_rack:        { cat: 'steering', name: 'Замена рулевой рейки в сборе (с адаптацией)', rateType: 'engine', nh: 4.0 },
    power_steering_pump:  { cat: 'steering', name: 'Замена насоса гидроусилителя руля (ГУР)', rateType: 'standard', nh: 2.0 },
    eps:                  { cat: 'steering', name: 'Замена электромеханического усилителя руля (ЭУР)', rateType: 'standard', nh: 2.5 },

    // === ЭЛЕКТРИКА ===
    battery_under_seat:   { cat: 'electrics', name: 'Замена АКБ (расположена под сиденьем водителя)', rateType: 'standard', nh: 0.5 },
    battery_trunk:        { cat: 'electrics', name: 'Замена АКБ (расположена в багажнике)', rateType: 'standard', nh: 0.5 },
    battery_hood:         { cat: 'electrics', name: 'Замена АКБ (расположена в моторном отсеке)', rateType: 'standard', nh: 0.3 },
    battery_adaptation:   { cat: 'electrics', name: 'Адаптация/регистрация новой АКБ в бортовой сети (через сканер)', rateType: 'standard', nh: 0.4 },
    alternator:           { cat: 'electrics', name: 'Замена генератора', rateType: 'engine', nh: 2.5 },
    starter:              { cat: 'electrics', name: 'Замена стартера', rateType: 'engine', nh: 2.0 },
    ignition_coils:       { cat: 'electrics', name: 'Замена катушек зажигания (комплект)', rateType: 'standard', nh: 0.4 },

    // === ВЫХЛОПНАЯ СИСТЕМА ===
    exhaust_flange:       { cat: 'exhaust', name: 'Замена прокладки приёмной трубы (переднего соединения)', rateType: 'standard', nh: 0.5 },
    lambda_sensors:       { cat: 'exhaust', name: 'Замена лямбда-зондов (кислородных датчиков)', rateType: 'standard', nh: 1.0 },
    dpf_clean:            { cat: 'exhaust', name: 'Профилактика/удаление сажевого фильтра DPF', rateType: 'engine', nh: 4.0 },
    muffler:              { cat: 'exhaust', name: 'Замена глушителя (задней части выхлопной системы)', rateType: 'standard', nh: 1.5 }
};

const categories = {
    'to':           'Регламентные работы (ТО)',
    'engine':       'Двигатель',
    'engine_big':   'Снятие/Установка ДВС',
    'gearbox':      'Коробка передач',
    'awd':          'Полный привод',
    'suspension':   'Подвеска',
    'brakes':       'Тормоза',
    'steering':     'Рулевое управление',
    'electrics':    'Электрика',
    'exhaust':      'Выхлопная система'
};

function validateWorks(brandData, brandName) {
    const errors = [];
    if (!brandData || !brandData.modifications) return errors;
    brandData.modifications.forEach((mod, i) => {
        if (!mod.works) return;
        mod.works.forEach(workId => {
            if (!worksCatalog[workId]) {
                errors.push(`[${brandName}] Модификация #${i} (${mod.model || '?'}): неизвестный workId "${workId}"`);
            }
        });
    });
    return errors;
}

// Валидация: проверка что все workId в базах существуют в каталоге
function validateWorks(brandData, brandName) {
    const errors = [];
    if (!brandData || !brandData.modifications) return errors;
    brandData.modifications.forEach((mod, i) => {
        if (!mod.works) return;
        mod.works.forEach(workId => {
            if (!worksCatalog[workId]) {
                errors.push(`[${brandName}] Модификация #${i} (${mod.model || '?'}): неизвестный workId "${workId}"`);
            }
        });
    });
    return errors;
}
