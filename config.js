// ============================================
// КОНФИГУРАЦИЯ СИСТЕМЫ (v6: бирки, справочники, 9 марок)
// ============================================
const CONFIG = {
    // ВСТАВЬ СЮДА свою ссылку Apps Script (заканчивается на /exec)!
    cloudUrl: 'https://script.google.com/macros/s/AKfycbxplPCM6GQDSTtZTz8LQn0qjPTPe7ElAbQbuB5sIxA0rkADtTgHTRPPwnooICmyj1C7/exec',
    rates: {
        engine: 3000,
        standard: 2500
    },
    coefficients: {
        rusty_bolts:  { label: 'Прикипевшие/ржавые болты', percent: 15 },
        aluminum:     { label: 'Алюминиевые детали',       percent: 20 },
        lpg:          { label: 'Установлено ГБО',           percent: 10 }
    },
    managers: [
        { id: 'm1', name: 'Колесников А.Д.', passHash: '' },
        { id: 'm2', name: 'Цыбайло П.В.', passHash: '' },
        { id: 'm3', name: 'Шпехт В.В.', passHash: '' },
        { id: 'm4', name: 'Ванжа М.С.', passHash: '' }
    ],
    brands: [
        { id: 'volkswagen', name: 'Volkswagen',    file: 'volkswagen.js', varName: 'volkswagenDB' },
        { id: 'audi',       name: 'Audi',          file: 'audi.js',       varName: 'audiDB' },
        { id: 'skoda',      name: 'Skoda',         file: 'skoda.js',      varName: 'skodaDB' },
        { id: 'seat',       name: 'SEAT',          file: 'seat.js',       varName: 'seatDB' },
        { id: 'porsche',    name: 'Porsche',       file: 'porsche.js',    varName: 'porscheDB' },
        { id: 'bmw',        name: 'BMW',           file: 'bmw.js',        varName: 'bmwDB' },
        { id: 'mini',       name: 'MINI',          file: 'mini.js',       varName: 'miniDB' },
        { id: 'alpina',     name: 'ALPINA',        file: 'alpina.js',     varName: 'alpinaDB' },
        { id: 'mercedes',   name: 'Mercedes-Benz', file: 'mercedes.js',   varName: 'mercedesDB' }
    ],
    // === СПРАВОЧНИКИ ДЛЯ СБОРКИ ПАСПОРТА ===
    refs: {
        engineFamilies: {
            EA211_TSI: { fuel: 'petrol', timing: 'belt',  injection: 'direct', turbo: true  },
            EA211_MPI: { fuel: 'petrol', timing: 'belt',  injection: 'port',   turbo: false },
            EA111:     { fuel: 'petrol', timing: 'chain', injection: 'port',   turbo: false },
            EA888:     { fuel: 'petrol', timing: 'chain', injection: 'direct', turbo: true  },
            EA288:     { fuel: 'diesel', timing: 'belt',  injection: 'direct', turbo: true  },
            V6_TDI:    { fuel: 'diesel', timing: 'chain', injection: 'direct', turbo: true  },
            N13:       { fuel: 'petrol', timing: 'chain', injection: 'direct', turbo: true  },
            N18:       { fuel: 'petrol', timing: 'chain', injection: 'direct', turbo: true  },
            N20:       { fuel: 'petrol', timing: 'chain', injection: 'direct', turbo: true  },
            N47:       { fuel: 'diesel', timing: 'chain', injection: 'direct', turbo: true  },
            N55:       { fuel: 'petrol', timing: 'chain', injection: 'direct', turbo: true  },
            N63:       { fuel: 'petrol', timing: 'chain', injection: 'direct', turbo: true  },
            B38:       { fuel: 'petrol', timing: 'chain', injection: 'direct', turbo: true  },
            B48:       { fuel: 'petrol', timing: 'chain', injection: 'direct', turbo: true  },
            B47:       { fuel: 'diesel', timing: 'chain', injection: 'direct', turbo: true  },
            M271:      { fuel: 'petrol', timing: 'chain', injection: 'direct', turbo: true  },
            M274:      { fuel: 'petrol', timing: 'chain', injection: 'direct', turbo: true  },
            OM651:     { fuel: 'diesel', timing: 'chain', injection: 'direct', turbo: true  },
            P_CNCA:    { fuel: 'petrol', timing: 'chain', injection: 'direct', turbo: true  },
            P_CTBA:    { fuel: 'petrol', timing: 'chain', injection: 'direct', turbo: true  },
            P_CTCA:    { fuel: 'petrol', timing: 'chain', injection: 'direct', turbo: true  },
            P_CVWA:    { fuel: 'diesel', timing: 'chain', injection: 'direct', turbo: true  },
            P_CWDA:    { fuel: 'petrol', timing: 'chain', injection: 'direct', turbo: false }
        },
        engineCodes: {
            // VW/Skoda/SEAT/Audi
            CZCA: 'EA211_TSI', CZDA: 'EA211_TSI', DKLA: 'EA211_TSI', CJSA: 'EA888',
            CWVA: 'EA211_MPI', CFNA: 'EA111',
            CZPA: 'EA888', CDNB: 'EA888', DAXA: 'EA888', DAXB: 'EA888',
            DEUA: 'EA288', DFGA: 'EA288',
            CDUD: 'V6_TDI', CASA: 'V6_TDI',
            // BMW / MINI
            N13B16: 'N13', N18B16: 'N18', N20B20: 'N20', N47D20: 'N47',
            N55B30: 'N55', N63B44: 'N63',
            B38A15: 'B38', B48A20: 'B48', B47D20: 'B47',
            // Mercedes-Benz
            M271E18: 'M271', M274DE20: 'M274', OM651DE22: 'OM651',
            // Porsche / ALPINA (через N55)
            CNCA: 'P_CNCA', CTBA: 'P_CTBA', CTCA: 'P_CTCA',
            CVWA: 'P_CVWA', CWDA: 'P_CWDA'
        },
        gearboxFamilies: {
            // DSG / S-tronic / PDK
            DQ200: { gbType: 'dsg' }, DQ250: { gbType: 'dsg' }, DQ500: { gbType: 'dsg' },
            DL382: { gbType: 'dsg' }, DL501: { gbType: 'dsg' }, PDK: { gbType: 'dsg' },
            // Manual
            '02T': { gbType: 'manual' }, '6MT': { gbType: 'manual' },
            // Automatic / ZF / Mercedes G-Tronic / MINI AT
            '09D': { gbType: 'automatic' }, ZF8HP: { gbType: 'automatic' }, ZF6HP: { gbType: 'automatic' },
            '7G': { gbType: 'automatic' }, '9G': { gbType: 'automatic' },
            AT6: { gbType: 'automatic' }, AT8: { gbType: 'automatic' }, '8AT': { gbType: 'automatic' }
        },
        awdNames: {
            volkswagen: '4MOTION', audi: 'QUATTRO', skoda: '4x4', seat: '4Drive',
            porsche: 'PTM', bmw: 'xDrive', mini: 'ALL4', alpina: 'xDrive', mercedes: '4MATIC'
        }
    }
};

const worksCatalog = {
    // === ТО ===
    oil_change:           { cat: 'to',  name: 'Замена моторного масла и масляного фильтра (комплекс)', rateType: 'standard', nh: 0.5 },
    air_filter:           { cat: 'to',  name: 'Замена воздушного фильтра', rateType: 'standard', nh: 0.3 },
    cabin_filter:         { cat: 'to',  name: 'Замена салонного фильтра', rateType: 'standard', nh: 0.3 },
    fuel_filter:          { cat: 'to',  name: 'Замена топливного фильтра', rateType: 'standard', nh: 0.5 },
    spark_plugs:          { cat: 'to',  name: 'Замена свечей зажигания (комплект)', rateType: 'standard', nh: 0.6, req: { fuel: 'petrol' } },
    glow_plugs:           { cat: 'to',  name: 'Замена свечей накаливания (комплект, дизель)', rateType: 'standard', nh: 0.8, req: { fuel: 'diesel' } },
    brake_fluid_change:   { cat: 'to',  name: 'Замена тормозной жидкости (прокачка)', rateType: 'standard', nh: 0.4 },
    coolant_change:       { cat: 'to',  name: 'Замена охлаждающей жидкости (прокачка системы)', rateType: 'standard', nh: 0.5 },
    ac_recharge:          { cat: 'to',  name: 'Заправка кондиционера (с вакуумированием)', rateType: 'standard', nh: 0.5 },
    // === ДИАГНОСТИКА ===
    diag_engine:          { cat: 'diag', name: 'Компьютерная диагностика ДВС (чтение ошибок, параметры)', rateType: 'standard', nh: 0.5 },
    // === ДВИГАТЕЛЬ ===
    timing_belt:          { cat: 'engine', name: 'Замена ремня ГРМ (с роликами)', rateType: 'engine', nh: 4.0, req: { timing: 'belt' } },
    timing_chain:         { cat: 'engine', name: 'Замена цепи ГРМ (с натяжителями)', rateType: 'engine', nh: 6.0, req: { timing: 'chain' } },
    valve_clearance:      { cat: 'engine', name: 'Регулировка клапанных зазоров (подбор толкателей)', rateType: 'engine', nh: 3.0 },
    valve_cover_gasket:   { cat: 'engine', name: 'Замена прокладки клапанной крышки', rateType: 'engine', nh: 1.5 },
    oil_pump:             { cat: 'engine', name: 'Замена масляного насоса (со снятием поддона)', rateType: 'engine', nh: 4.0 },
    water_pump:           { cat: 'engine', name: 'Замена водяной помпы', rateType: 'engine', nh: 2.0 },
    thermostat:           { cat: 'engine', name: 'Замена термостата (в сборе с корпусом)', rateType: 'engine', nh: 1.0 },
    engine_mounts:        { cat: 'engine', name: 'Замена опор двигателя (подушек)', rateType: 'standard', nh: 2.5 },
    turbo_replacement:    { cat: 'engine', name: 'Замена турбокомпрессора', rateType: 'engine', nh: 4.0, req: { turbo: true } },
    turbo_actuator:       { cat: 'engine', name: 'Замена/регулировка актуатора турбины', rateType: 'engine', nh: 2.0, req: { turbo: true } },
    intake_manifold:      { cat: 'engine', name: 'Снятие/установка/замена впускного коллектора', rateType: 'engine', nh: 3.0 },
    intake_clean_carbon:  { cat: 'engine', name: 'Чистка впускного тракта от нагара (по каналам)', rateType: 'engine', nh: 4.0, req: { injection: 'direct' } },
    egr_valve:            { cat: 'engine', name: 'Замена/чистка клапана EGR', rateType: 'standard', nh: 1.5, req: { fuel: 'diesel' } },
    injectors_diesel:     { cat: 'engine', name: 'Замена форсунок (комплект, дизель, с прописыванием)', rateType: 'engine', nh: 3.0, req: { fuel: 'diesel' } },
    injectors_petrol:     { cat: 'engine', name: 'Замена топливных форсунок (комплект, бензин)', rateType: 'standard', nh: 1.5, req: { fuel: 'petrol' } },
    hp_fuel_pump:         { cat: 'engine', name: 'Замена топливного насоса высокого давления', rateType: 'engine', nh: 1.5, req: { injection: 'direct' } },
    lp_fuel_pump:         { cat: 'engine', name: 'Замена топливного насоса/модуля в баке', rateType: 'standard', nh: 1.0 },
    belt_accessory:       { cat: 'engine', name: 'Замена поликлинового ремня с роликами', rateType: 'standard', nh: 1.0 },
    vacuum_pump:          { cat: 'engine', name: 'Замена вакуумного насоса', rateType: 'standard', nh: 1.5, req: { injection: 'direct' } },
    oil_pan:              { cat: 'engine', name: 'Снятие/установка поддона ДВС (с герметизацией)', rateType: 'engine', nh: 3.0 },
    oil_separator:        { cat: 'engine', name: 'Замена клапана вентиляции картерных газов (маслоотделитель)', rateType: 'standard', nh: 1.0 },
    crank_seal_rear:      { cat: 'engine', name: 'Замена заднего сальника коленвала (со стороны маховика)', rateType: 'engine', nh: 4.0 },
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
    // === КПП И ПРИВОДНЫЕ ВАЛЫ ===
    gearbox_remove_install: {
        cat: 'gearbox', name: 'КПП — Снятие и установка (комплекс)',
        rateType: 'engine', nh: 8.0,
        includes: ['remove_drives']
    },
    gearbox_oil_change:   { cat: 'gearbox', name: 'Замена масла в КПП', rateType: 'standard', nh: 0.5 },
    mechatronic:          { cat: 'gearbox', name: 'Замена мехатроника DSG/S tronic/PDK', rateType: 'engine', nh: 6.0, req: { gbType: 'dsg' } },
    clutch_replacement:   { cat: 'gearbox', name: 'Замена сцепления DSG/S tronic/PDK (пакет фрикционов)', rateType: 'engine', nh: 5.0, req: { gbType: 'dsg' } },
    clutch_replacement_manual: { cat: 'gearbox', name: 'Замена комплекта сцепления (диск + корзина + выжимной)', rateType: 'engine', nh: 4.0, req: { gbType: 'manual' } },
    dual_mass_flywheel:   { cat: 'gearbox', name: 'Замена двухмассового маховика', rateType: 'engine', nh: 5.5, req: { turbo: true, gbType: ['dsg', 'manual'] } },
    gearbox_repair:       { cat: 'gearbox', name: 'Ремонт КПП без снятия (замена соленоидов, датчиков)', rateType: 'engine', nh: 8.0 },
    dsg_adaptation:       { cat: 'gearbox', name: 'Адаптация DSG/S tronic/PDK (базовые установки сканером)', rateType: 'standard', nh: 0.4, req: { gbType: 'dsg' } },
    driveshaft_front_left:  { cat: 'gearbox', name: 'Замена приводного вала переднего левого', rateType: 'standard', nh: 1.5 },
    driveshaft_front_right: { cat: 'gearbox', name: 'Замена приводного вала переднего правого', rateType: 'standard', nh: 1.5 },
    driveshaft_rear_left:   { cat: 'gearbox', name: 'Замена приводного вала заднего левого (4WD)', rateType: 'standard', nh: 1.5, req: { drive: 'awd' } },
    driveshaft_rear_right:  { cat: 'gearbox', name: 'Замена приводного вала заднего правого (4WD)', rateType: 'standard', nh: 1.5, req: { drive: 'awd' } },
    driveshaft_boot_front_left:  { cat: 'gearbox', name: 'Замена пыльника приводного вала переднего левого', rateType: 'standard', nh: 1.0 },
    driveshaft_boot_front_right: { cat: 'gearbox', name: 'Замена пыльника приводного вала переднего правого', rateType: 'standard', nh: 1.0 },
    driveshaft_boot_rear_left:   { cat: 'gearbox', name: 'Замена пыльника приводного вала заднего левого (4WD)', rateType: 'standard', nh: 1.0, req: { drive: 'awd' } },
    driveshaft_boot_rear_right:  { cat: 'gearbox', name: 'Замена пыльника приводного вала заднего правого (4WD)', rateType: 'standard', nh: 1.0, req: { drive: 'awd' } },
    // === ПОЛНЫЙ ПРИВОД ===
    transfer_case_oil:    { cat: 'awd', name: 'Замена масла в раздаточной коробке', rateType: 'standard', nh: 0.4, req: { awdSys: 'torsen' } },
    diff_oil_front:       { cat: 'awd', name: 'Замена масла в переднем редукторе (дифференциале)', rateType: 'standard', nh: 0.4, req: { awdSys: 'torsen' } },
    diff_oil_rear:        { cat: 'awd', name: 'Замена масла в заднем редукторе (дифференциале)', rateType: 'standard', nh: 0.4, req: { drive: 'awd' } },
    haldex_oil:           { cat: 'awd', name: 'Замена масла в муфте Haldex (полный привод MQB)', rateType: 'standard', nh: 0.5, req: { awdSys: 'haldex' } },
    haldex_filter:        { cat: 'awd', name: 'Замена фильтра муфты Haldex (сеточка)', rateType: 'standard', nh: 0.5, req: { awdSys: 'haldex' } },
    transfer_case_remove: { cat: 'awd', name: 'Снятие и установка раздаточной коробки', rateType: 'engine', nh: 4.0, req: { awdSys: 'torsen' } },
    propshaft:            { cat: 'awd', name: 'Замена карданного вала', rateType: 'engine', nh: 3.0, req: { drive: 'awd' } },
    // === ПОДВЕСКА ===
    shock_absorbers_front:     { cat: 'suspension', name: 'Замена передних амортизаторов (пара)', rateType: 'standard', nh: 1.5, req: { suspension: 'spring' } },
    shock_absorbers_rear:      { cat: 'suspension', name: 'Замена задних амортизаторов (пара)', rateType: 'standard', nh: 1.8, req: { suspension: 'spring' } },
    shock_absorbers_front_air: { cat: 'suspension', name: 'Замена передних пневмоамортизаторов (пара, со стравливанием системы)', rateType: 'standard', nh: 2.5, req: { suspension: 'air' } },
    shock_absorbers_rear_air:  { cat: 'suspension', name: 'Замена задних пневмоамортизаторов/пневмобаллонов (пара)', rateType: 'standard', nh: 2.8, req: { suspension: 'air' } },
    springs:              { cat: 'suspension', name: 'Замена пружин подвески (пара)', rateType: 'standard', nh: 2.0, req: { suspension: 'spring' } },
    control_arm_bushings: { cat: 'suspension', name: 'Замена сайлентблоков рычагов (перепрессовка)', rateType: 'standard', nh: 2.0 },
    ball_joints:          { cat: 'suspension', name: 'Замена шаровых опор', rateType: 'standard', nh: 1.5 },
    sway_bar_links_front: { cat: 'suspension', name: 'Замена стоек переднего стабилизатора (пара)', rateType: 'standard', nh: 0.6 },
    sway_bar_links_rear:  { cat: 'suspension', name: 'Замена стоек заднего стабилизатора (пара)', rateType: 'standard', nh: 0.7, req: { rear: 'multilink' } },
    wheel_bearings:       { cat: 'suspension', name: 'Замена ступичных подшипников (пара, в сборе со ступицей)', rateType: 'standard', nh: 2.0 },
    subframe_front:       { cat: 'suspension', name: 'Снятие/установка/замена переднего подрамника', rateType: 'engine', nh: 4.0 },
    stabilizer_front:     { cat: 'suspension', name: 'Замена переднего стабилизатора поперечной устойчивости', rateType: 'standard', nh: 1.0 },
    stabilizer_rear:      { cat: 'suspension', name: 'Замена заднего стабилизатора поперечной устойчивости', rateType: 'standard', nh: 1.2, req: { rear: 'multilink' } },
    air_compressor:       { cat: 'suspension', name: 'Замена компрессора пневмоподвески', rateType: 'standard', nh: 1.5, req: { suspension: 'air' } },
    air_valve_block:      { cat: 'suspension', name: 'Замена блока клапанов пневмоподвески', rateType: 'standard', nh: 1.5, req: { suspension: 'air' } },
    wheel_alignment:      { cat: 'suspension', name: 'Развал-схождение на 3D-стенде (две оси)', rateType: 'standard', nh: 1.0 },
    // === ТОРМОЗА ===
    brake_pads_front:     { cat: 'brakes', name: 'Замена передних тормозных колодок', rateType: 'standard', nh: 0.5 },
    brake_pads_rear:      { cat: 'brakes', name: 'Замена задних тормозных колодок', rateType: 'standard', nh: 0.6 },
    brake_pads_rear_electric_release: { cat: 'brakes', name: 'Разведение поршней заднего суппорта (электронный ручник, через сканер)', rateType: 'standard', nh: 0.3, req: { parking: 'epb' } },
    brake_discs_front:    { cat: 'brakes', name: 'Замена передних тормозных дисков (пара, с колодками)', rateType: 'standard', nh: 1.0 },
    brake_discs_rear:     { cat: 'brakes', name: 'Замена задних тормозных дисков (пара, с колодками)', rateType: 'standard', nh: 1.2 },
    brake_caliper_refurb: { cat: 'brakes', name: 'Ремонт тормозного суппорта (направляющие, пыльники, поршень)', rateType: 'standard', nh: 1.5 },
    brake_lines:          { cat: 'brakes', name: 'Замена тормозных шлангов (пара)', rateType: 'standard', nh: 0.8 },
    handbrake_adjust:     { cat: 'brakes', name: 'Регулировка троса ручного тормоза', rateType: 'standard', nh: 0.4, req: { parking: 'mech' } },
    abs_sensor:           { cat: 'brakes', name: 'Замена датчика ABS (колесного)', rateType: 'standard', nh: 0.3 },
    brake_booster:        { cat: 'brakes', name: 'Замена вакуумного усилителя тормозов', rateType: 'standard', nh: 1.5 },
    handbrake_cables:     { cat: 'brakes', name: 'Замена тросов механического ручника (пара)', rateType: 'standard', nh: 1.5, req: { parking: 'mech' } },
    // === РУЛЕВОЕ ===
    tie_rods:             { cat: 'steering', name: 'Замена рулевых тяг и наконечников (пара)', rateType: 'standard', nh: 1.0 },
    rack_boots:           { cat: 'steering', name: 'Замена пыльников рулевой рейки (пара)', rateType: 'standard', nh: 1.5 },
    steering_rack:        { cat: 'steering', name: 'Замена рулевой рейки в сборе (с адаптацией)', rateType: 'engine', nh: 4.0 },
    power_steering_pump:  { cat: 'steering', name: 'Замена насоса гидроусилителя руля (ГУР)', rateType: 'standard', nh: 2.0 },
    eps:                  { cat: 'steering', name: 'Замена электромеханического усилителя руля (ЭУР)', rateType: 'standard', nh: 2.5 },
    // === ЭЛЕКТРИКА ===
    battery_under_seat:   { cat: 'electrics', name: 'Замена АКБ (расположена под сиденьем водителя)', rateType: 'standard', nh: 0.5, req: { battery: 'seat' } },
    battery_trunk:        { cat: 'electrics', name: 'Замена АКБ (расположена в багажнике)', rateType: 'standard', nh: 0.5, req: { battery: 'trunk' } },
    battery_hood:         { cat: 'electrics', name: 'Замена АКБ (расположена в моторном отсеке)', rateType: 'standard', nh: 0.3, req: { battery: 'hood' } },
    battery_adaptation:   { cat: 'electrics', name: 'Адаптация/регистрация новой АКБ в бортовой сети (через сканер)', rateType: 'standard', nh: 0.4 },
    alternator:           { cat: 'electrics', name: 'Замена генератора', rateType: 'engine', nh: 2.5 },
    starter:              { cat: 'electrics', name: 'Замена стартера', rateType: 'engine', nh: 2.0 },
    ignition_coils:       { cat: 'electrics', name: 'Замена катушек зажигания (комплект)', rateType: 'standard', nh: 0.4, req: { fuel: 'petrol' } },
    window_regulator_front_left:  { cat: 'electrics', name: 'Замена стеклоподъёмника передней левой двери', rateType: 'standard', nh: 1.0 },
    window_regulator_front_right: { cat: 'electrics', name: 'Замена стеклоподъёмника передней правой двери', rateType: 'standard', nh: 1.0 },
    window_regulator_rear_left:   { cat: 'electrics', name: 'Замена стеклоподъёмника задней левой двери', rateType: 'standard', nh: 1.0 },
    window_regulator_rear_right:  { cat: 'electrics', name: 'Замена стеклоподъёмника задней правой двери', rateType: 'standard', nh: 1.0 },
    // === КОНДИЦИОНЕР И ОХЛАЖДЕНИЕ ===
    ac_compressor:        { cat: 'climate', name: 'Замена компрессора кондиционера (с заправкой системы)', rateType: 'engine', nh: 3.0 },
    ac_condenser:         { cat: 'climate', name: 'Замена конденсора (радиатора кондиционера, с заправкой)', rateType: 'standard', nh: 2.0 },
    radiator_main:        { cat: 'climate', name: 'Замена основного радиатора охлаждения', rateType: 'standard', nh: 2.5 },
    // === ВЫХЛОП ===
    exhaust_flange:       { cat: 'exhaust', name: 'Замена прокладки приёмной трубы (переднего соединения)', rateType: 'standard', nh: 0.5 },
    lambda_sensors:       { cat: 'exhaust', name: 'Замена лямбда-зондов (кислородных датчиков)', rateType: 'standard', nh: 1.0 },
    dpf_clean:            { cat: 'exhaust', name: 'Профилактика/удаление сажевого фильтра DPF', rateType: 'engine', nh: 4.0, req: { pf: true } },
    dpf_replace:          { cat: 'exhaust', name: 'Замена сажевого фильтра DPF/GPF', rateType: 'engine', nh: 3.0, req: { pf: true } },
    muffler:              { cat: 'exhaust', name: 'Замена глушителя (задней части выхлопной системы)', rateType: 'standard', nh: 1.5 }
};

const categories = {
    'to':           'Регламентные работы (ТО)',
    'diag':         'Диагностика',
    'engine':       'Двигатель',
    'engine_big':   'Снятие/Установка ДВС',
    'gearbox':      'Коробка передач и приводные валы',
    'awd':          'Полный привод',
    'suspension':   'Подвеска',
    'brakes':       'Тормоза',
    'steering':     'Рулевое управление',
    'electrics':    'Электрика',
    'climate':      'Кондиционер и охлаждение',
    'exhaust':      'Выхлопная система'
};

// Иконки категорий (ч/б через CSS)
const CAT_ICONS = {
    to: '🛢️', diag: '🔬', engine: '⚙️', engine_big: '🏗️', gearbox: '🔄', awd: '🧭',
    suspension: '🌀', brakes: '🛑', steering: '🛞', electrics: '⚡', climate: '❄️', exhaust: '💨'
};

// Фирменные названия полного привода по маркам
const AWD_NAMES = {
    volkswagen: '4MOTION', audi: 'QUATTRO', skoda: '4x4', seat: '4Drive',
    porsche: 'PTM', bmw: 'xDrive', mini: 'ALL4', alpina: 'xDrive', mercedes: '4MATIC'
};

// === СБОРКА ПАСПОРТА МОДИФИКАЦИИ ===
// На вход: объект mod (как в файле марки). На выход: набор бирок.
function buildPassport(mod) {
    const passport = {};
    const code = mod.engine && mod.engine.code;
    const fam = code && CONFIG.refs.engineCodes[code] && CONFIG.refs.engineFamilies[CONFIG.refs.engineCodes[code]];
    if (fam) {
        passport.fuel = fam.fuel;
        passport.timing = fam.timing;
        passport.injection = fam.injection;
        passport.turbo = fam.turbo;
        passport.pf = fam.fuel === 'diesel' || (fam.fuel === 'petrol' && fam.injection === 'direct' && fam.turbo);
    }
    const gbFam = mod.gearbox && mod.gearbox.code && CONFIG.refs.gearboxFamilies[mod.gearbox.code];
    if (gbFam) passport.gbType = gbFam.gbType;
    // Привод
    if (mod.drive) {
        const d = mod.drive.toLowerCase();
        if (d.indexOf('полный') !== -1 || d === 'awd' || d.indexOf('4wd') !== -1 || d.indexOf('quattro') !== -1 || d.indexOf('xdrive') !== -1 || d.indexOf('4motion') !== -1 || d.indexOf('4matic') !== -1) {
            passport.drive = 'awd';
            // Система полного привода
            if (mod.awdSys) passport.awdSys = mod.awdSys;
            else if (d.indexOf('torsen') !== -1) passport.awdSys = 'torsen';
            else if (d.indexOf('haldex') !== -1) passport.awdSys = 'haldex';
            else if (d.indexOf('ultra') !== -1) passport.awdSys = 'ultra';
        } else if (d.indexOf('задн') !== -1 || d === 'rwd') {
            passport.drive = 'rwd';
        } else {
            passport.drive = 'fwd';
        }
    }
    if (mod.suspension) passport.suspension = mod.suspension;   // 'spring' | 'air'
    if (mod.rear)       passport.rear = mod.rear;               // 'beam' | 'multilink'
    if (mod.parking)    passport.parking = mod.parking;         // 'mech' | 'epb'
    if (mod.battery)    passport.battery = mod.battery;         // 'hood' | 'trunk' | 'seat'
    return passport;
}

// Фильтрует список работ по паспорту + применяет include/exclude модификации
function collectWorks(mod) {
    const p = buildPassport(mod);
    const result = [];
    Object.keys(worksCatalog).forEach(function(wid) {
        const w = worksCatalog[wid];
        const req = w.req || {};
        let ok = true;
        Object.keys(req).forEach(function(key) {
            const need = req[key];
            const have = p[key];
            if (Array.isArray(need)) {
                if (need.indexOf(have) === -1) ok = false;
            } else {
                if (have !== need) ok = false;
            }
        });
        if (ok) result.push(wid);
    });
    // Добавляем include
    if (mod.include) mod.include.forEach(function(wid) {
        if (worksCatalog[wid] && result.indexOf(wid) === -1) result.push(wid);
    });
    // Убираем exclude
    if (mod.exclude) {
        mod.exclude.forEach(function(wid) {
            const i = result.indexOf(wid);
            if (i !== -1) result.splice(i, 1);
        });
    }
    return result;
}

// Валидация базы
function validateWorks(brandData, brandName) {
    const errors = [];
    if (!brandData || !brandData.modifications) return errors;
    brandData.modifications.forEach(function(mod, i) {
        const tag = '[' + brandName + ' ' + (mod.model || '?') + ' ' + (mod.engine ? mod.engine.code : '') + ']';
        if (mod.customNh) {
            Object.keys(mod.customNh).forEach(function(wid) {
                if (!worksCatalog[wid]) errors.push(tag + ' customNh: неизвестная работа "' + wid + '"');
            });
        }
        (mod.include || []).forEach(function(wid) {
            if (!worksCatalog[wid]) errors.push(tag + ' include: неизвестная работа "' + wid + '"');
        });
        (mod.exclude || []).forEach(function(wid) {
            if (!worksCatalog[wid]) errors.push(tag + ' exclude: неизвестная работа "' + wid + '"');
        });
        if (mod.engine && !CONFIG.refs.engineCodes[mod.engine.code]) {
            errors.push(tag + ' код ДВС не найден в справочнике семейств');
        }
        if (mod.gearbox && !CONFIG.refs.gearboxFamilies[mod.gearbox.code]) {
            errors.push(tag + ' код КПП не найден в справочнике семейств');
        }
    });
    return errors;
}
