// ============================================
// БАЗА MERCEDES-BENZ (v1: схема паспорта)
// ============================================
const mercedesDB = {
    brand: 'Mercedes-Benz',
    modifications: [
        {
            id: 'mb_w205_c200', model: 'C класс', generation: 'W205 (2014–2021)',
            engine: { code: 'M274DE20', volume: '2.0 L', power: '184 л.с.', torque: '300 Нм' },
            gearbox: { code: '7G', type: '7G-Tronic (автомат)', gears: 7 },
            drive: 'Задний', suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: false,
            fluids: {
                engine_oil: { volume: '5.5 л', spec: 'MB 229.5', viscosity: '5W-30' },
                gearbox_oil: { volume: '8.0 л', spec: 'MB 236.14', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: { volume: '1.3 л', spec: 'MB 235.7', viscosity: '-' },
                coolant: { volume: '9.0 л', spec: 'MB 310.1', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4+', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '580 г', spec: 'R1234yf', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.7, 'spark_plugs': 1.0, 'timing_chain': 7.0, 'water_pump': 3.0, 'thermostat': 2.2, 'turbo_replacement': 4.0, 'intake_clean_carbon': 4.5, 'hp_fuel_pump': 1.8, 'oil_pan': 3.0, 'crank_seal_rear': 4.5, 'gearbox_oil_change': 1.3, 'brake_pads_front': 0.6, 'brake_pads_rear': 0.8, 'brake_discs_front': 1.2, 'brake_discs_rear': 1.4, 'wheel_bearings': 2.2, 'steering_rack': 4.0, 'alternator': 2.5, 'starter': 2.5, 'battery_trunk': 0.8, 'ac_compressor': 3.0, 'radiator_main': 2.6, 'wheel_alignment': 1.1 }
        },
        {
            id: 'mb_w205_c220d', model: 'C класс', generation: 'W205 (2014–2021)',
            engine: { code: 'OM651DE22', volume: '2.1 L', power: '170 л.с.', torque: '400 Нм' },
            gearbox: { code: '9G', type: '9G-Tronic (автомат)', gears: 9 },
            drive: 'Задний', suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: true,
            fluids: {
                engine_oil: { volume: '6.5 л', spec: 'MB 229.51', viscosity: '5W-30' },
                gearbox_oil: { volume: '9.0 л', spec: 'MB 236.15', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: { volume: '1.3 л', spec: 'MB 235.7', viscosity: '-' },
                coolant: { volume: '9.5 л', spec: 'MB 310.1', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4+', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '580 г', spec: 'R1234yf', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.7, 'glow_plugs': 1.8, 'timing_chain': 7.5, 'water_pump': 3.0, 'thermostat': 2.2, 'turbo_replacement': 4.0, 'intake_manifold': 3.0, 'intake_clean_carbon': 4.5, 'egr_valve': 2.2, 'dpf_replace': 3.5, 'injectors_diesel': 3.8, 'hp_fuel_pump': 2.5, 'oil_pan': 3.0, 'crank_seal_rear': 4.5, 'gearbox_oil_change': 1.3, 'brake_pads_front': 0.6, 'brake_pads_rear': 0.8, 'brake_discs_front': 1.2, 'brake_discs_rear': 1.4, 'wheel_bearings': 2.2, 'steering_rack': 4.0, 'alternator': 2.5, 'starter': 2.5, 'battery_trunk': 0.8, 'ac_compressor': 3.0, 'radiator_main': 2.6, 'wheel_alignment': 1.1 }
        },
        {
            id: 'mb_x253_glc220d', model: 'GLC', generation: 'X253 (2015–2022)',
            engine: { code: 'OM651DE22', volume: '2.1 L', power: '170 л.с.', torque: '400 Нм' },
            gearbox: { code: '9G', type: '9G-Tronic (автомат)', gears: 9 },
            drive: 'Полный (4MATIC)', awdSys: 'torsen',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: true,
            fluids: {
                engine_oil: { volume: '6.5 л', spec: 'MB 229.51', viscosity: '5W-30' },
                gearbox_oil: { volume: '9.0 л', spec: 'MB 236.15', viscosity: '-' },
                transfer_case: { volume: '0.8 л', spec: 'MB 236.15', viscosity: '-' }, diff_front: { volume: '1.1 л', spec: 'MB 235.7', viscosity: '-' }, diff_rear: { volume: '1.5 л', spec: 'MB 235.7', viscosity: '-' },
                coolant: { volume: '10.0 л', spec: 'MB 310.1', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4+', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '620 г', spec: 'R1234yf', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.8, 'glow_plugs': 1.8, 'timing_chain': 7.5, 'water_pump': 3.2, 'thermostat': 2.4, 'turbo_replacement': 4.2, 'intake_manifold': 3.2, 'intake_clean_carbon': 4.8, 'egr_valve': 2.4, 'dpf_replace': 3.6, 'injectors_diesel': 4.0, 'hp_fuel_pump': 2.6, 'oil_pan': 3.2, 'crank_seal_rear': 5.0, 'gearbox_oil_change': 1.4, 'brake_pads_front': 0.7, 'brake_pads_rear': 0.9, 'brake_discs_front': 1.3, 'brake_discs_rear': 1.5, 'wheel_bearings': 2.4, 'steering_rack': 4.2, 'alternator': 2.8, 'starter': 2.8, 'battery_trunk': 0.9, 'ac_compressor': 3.2, 'radiator_main': 2.8, 'wheel_alignment': 1.2, 'propshaft': 3.2, 'transfer_case_oil': 0.6, 'diff_oil_front': 0.6, 'diff_oil_rear': 0.6, 'driveshaft_front_left': 1.6, 'driveshaft_front_right': 1.6, 'driveshaft_rear_left': 1.8, 'driveshaft_rear_right': 1.8 }
        },
        {
            id: 'mb_w212_e200', model: 'E класс', generation: 'W212 (2009–2016)',
            engine: { code: 'M274DE20', volume: '2.0 L', power: '184 л.с.', torque: '300 Нм' },
            gearbox: { code: '7G', type: '7G-Tronic (автомат)', gears: 7 },
            drive: 'Задний', suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: false,
            fluids: {
                engine_oil: { volume: '5.5 л', spec: 'MB 229.5', viscosity: '5W-30' },
                gearbox_oil: { volume: '8.0 л', spec: 'MB 236.14', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: { volume: '1.4 л', spec: 'MB 235.7', viscosity: '-' },
                coolant: { volume: '9.5 л', spec: 'MB 310.1', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4+', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '600 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.7, 'spark_plugs': 1.0, 'timing_chain': 7.0, 'water_pump': 3.0, 'thermostat': 2.2, 'turbo_replacement': 4.0, 'intake_clean_carbon': 4.5, 'hp_fuel_pump': 1.8, 'oil_pan': 3.0, 'crank_seal_rear': 4.5, 'gearbox_oil_change': 1.3, 'brake_pads_front': 0.6, 'brake_pads_rear': 0.8, 'brake_discs_front': 1.2, 'brake_discs_rear': 1.4, 'wheel_bearings': 2.2, 'steering_rack': 4.0, 'alternator': 2.5, 'starter': 2.5, 'battery_trunk': 0.8, 'ac_compressor': 3.0, 'radiator_main': 2.6, 'wheel_alignment': 1.1 }
        },
        {
            id: 'mb_w204_c180', model: 'C класс', generation: 'W204 (2007–2014)',
            engine: { code: 'M271E18', volume: '1.8 L', power: '156 л.с.', torque: '250 Нм' },
            gearbox: { code: '6MT', type: 'МКПП', gears: 6 },
            drive: 'Задний', suspension: 'spring', rear: 'multilink', parking: 'mech', battery: 'trunk', pf: false,
            fluids: {
                engine_oil: { volume: '5.5 л', spec: 'MB 229.5', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.8 л', spec: 'MB 235.10', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: { volume: '1.3 л', spec: 'MB 235.7', viscosity: '-' },
                coolant: { volume: '8.5 л', spec: 'MB 310.1', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4+', viscosity: '-' },
                power_steering: { volume: 'ГУР: 1.0 л', spec: 'MB 345.0', viscosity: '-' },
                refrigerant: { volume: '560 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.6, 'spark_plugs': 0.9, 'timing_chain': 6.5, 'water_pump': 2.8, 'thermostat': 2.0, 'turbo_replacement': 3.6, 'intake_clean_carbon': 4.0, 'hp_fuel_pump': 1.6, 'oil_pan': 2.8, 'crank_seal_rear': 4.2, 'gearbox_oil_change': 0.5, 'clutch_replacement_manual': 3.8, 'brake_pads_front': 0.5, 'brake_pads_rear': 0.7, 'brake_discs_front': 1.0, 'brake_discs_rear': 1.2, 'wheel_bearings': 2.0, 'steering_rack': 3.6, 'alternator': 2.2, 'starter': 2.2, 'battery_trunk': 0.7, 'handbrake_cables': 1.2, 'ac_compressor': 2.8, 'radiator_main': 2.4, 'wheel_alignment': 1.0 }
        }
    ]
};
