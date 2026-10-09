// ============================================
// БАЗА ALPINA (v1: схема паспорта, 4 модификации)
// ============================================
const alpinaDB = {
    brand: 'ALPINA',
    modifications: [
        {
            id: 'alpina_b3_f30_rwd', model: 'B3 BiTurbo', generation: 'F30 (2013–2018)',
            engine: { code: 'N55B30', volume: '3.0 L', power: '410 л.с.', torque: '600 Нм' },
            gearbox: { code: 'ZF8HP', type: 'АКПП (гидротрансформатор ZF)', gears: 8 },
            drive: 'Задний', suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: false,
            fluids: {
                engine_oil: { volume: '6.5 л', spec: 'BMW LL-01', viscosity: '5W-30' },
                gearbox_oil: { volume: '7.0 л', spec: 'ZF 8HP (G 070.5)', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: { volume: '1.4 л', spec: 'BMW 75W-85', viscosity: '-' },
                coolant: { volume: '9.5 л', spec: 'BMW G48', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '600 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.8, 'spark_plugs': 1.2, 'timing_chain': 7.5, 'water_pump': 3.2, 'thermostat': 2.4, 'turbo_replacement': 4.5, 'intake_clean_carbon': 5.0, 'hp_fuel_pump': 2.0, 'oil_pan': 3.2, 'crank_seal_rear': 5.0, 'gearbox_oil_change': 1.3, 'brake_pads_front': 0.7, 'brake_pads_rear': 0.9, 'brake_discs_front': 1.4, 'brake_discs_rear': 1.6, 'wheel_bearings': 2.4, 'steering_rack': 4.2, 'alternator': 2.8, 'starter': 2.8, 'battery_trunk': 0.9, 'ac_compressor': 3.2, 'radiator_main': 2.8, 'wheel_alignment': 1.2 }
        },
        {
            id: 'alpina_b3_f30_awd', model: 'B3 BiTurbo', generation: 'F30 (2013–2018)',
            engine: { code: 'N55B30', volume: '3.0 L', power: '410 л.с.', torque: '600 Нм' },
            gearbox: { code: 'ZF8HP', type: 'АКПП (гидротрансформатор ZF)', gears: 8 },
            drive: 'Полный (xDrive)', awdSys: 'torsen',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: false,
            fluids: {
                engine_oil: { volume: '6.5 л', spec: 'BMW LL-01', viscosity: '5W-30' },
                gearbox_oil: { volume: '7.0 л', spec: 'ZF 8HP (G 070.5)', viscosity: '-' },
                transfer_case: { volume: '0.9 л', spec: 'BMW 75W-85', viscosity: '-' }, diff_front: { volume: '1.1 л', spec: 'BMW 75W-85', viscosity: '-' }, diff_rear: { volume: '1.4 л', spec: 'BMW 75W-85', viscosity: '-' },
                coolant: { volume: '9.5 л', spec: 'BMW G48', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '600 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.8, 'spark_plugs': 1.2, 'timing_chain': 7.5, 'water_pump': 3.2, 'thermostat': 2.4, 'turbo_replacement': 4.5, 'intake_clean_carbon': 5.0, 'hp_fuel_pump': 2.0, 'oil_pan': 3.2, 'crank_seal_rear': 5.0, 'gearbox_oil_change': 1.3, 'brake_pads_front': 0.7, 'brake_pads_rear': 0.9, 'brake_discs_front': 1.4, 'brake_discs_rear': 1.6, 'wheel_bearings': 2.4, 'steering_rack': 4.2, 'alternator': 2.8, 'starter': 2.8, 'battery_trunk': 0.9, 'ac_compressor': 3.2, 'radiator_main': 2.8, 'wheel_alignment': 1.2, 'propshaft': 3.2, 'transfer_case_oil': 0.6, 'diff_oil_front': 0.6, 'diff_oil_rear': 0.6, 'driveshaft_front_left': 1.6, 'driveshaft_front_right': 1.6, 'driveshaft_rear_left': 1.8, 'driveshaft_rear_right': 1.8 }
        },
        {
            id: 'alpina_b4_f32', model: 'B4 BiTurbo', generation: 'F32 (2013–2019)',
            engine: { code: 'N55B30', volume: '3.0 L', power: '410 л.с.', torque: '600 Нм' },
            gearbox: { code: 'ZF8HP', type: 'АКПП (гидротрансформатор ZF)', gears: 8 },
            drive: 'Задний', suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: false,
            fluids: {
                engine_oil: { volume: '6.5 л', spec: 'BMW LL-01', viscosity: '5W-30' },
                gearbox_oil: { volume: '7.0 л', spec: 'ZF 8HP (G 070.5)', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: { volume: '1.4 л', spec: 'BMW 75W-85', viscosity: '-' },
                coolant: { volume: '9.5 л', spec: 'BMW G48', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '600 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.8, 'spark_plugs': 1.2, 'timing_chain': 7.5, 'water_pump': 3.2, 'thermostat': 2.4, 'turbo_replacement': 4.5, 'intake_clean_carbon': 5.0, 'hp_fuel_pump': 2.0, 'oil_pan': 3.2, 'crank_seal_rear': 5.0, 'gearbox_oil_change': 1.3, 'brake_pads_front': 0.7, 'brake_pads_rear': 0.9, 'brake_discs_front': 1.4, 'brake_discs_rear': 1.6, 'wheel_bearings': 2.4, 'steering_rack': 4.2, 'alternator': 2.8, 'starter': 2.8, 'battery_trunk': 0.9, 'ac_compressor': 3.2, 'radiator_main': 2.8, 'wheel_alignment': 1.2 }
        },
        {
            id: 'alpina_b5_f10', model: 'B5 BiTurbo', generation: 'F10 (2011–2016)',
            engine: { code: 'N63B44', volume: '4.4 L', power: '540 л.с.', torque: '730 Нм' },
            gearbox: { code: 'ZF8HP', type: 'АКПП (гидротрансформатор ZF)', gears: 8 },
            drive: 'Задний', suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: false,
            fluids: {
                engine_oil: { volume: '9.0 л', spec: 'BMW LL-01', viscosity: '5W-30' },
                gearbox_oil: { volume: '7.0 л', spec: 'ZF 8HP (G 070.5)', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: { volume: '1.6 л', spec: 'BMW 75W-85', viscosity: '-' },
                coolant: { volume: '11.0 л', spec: 'BMW G48', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '650 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 1.0, 'spark_plugs': 1.6, 'timing_chain': 9.0, 'water_pump': 3.6, 'thermostat': 2.8, 'turbo_replacement': 5.5, 'intake_clean_carbon': 5.5, 'hp_fuel_pump': 2.4, 'oil_pan': 3.6, 'crank_seal_rear': 5.5, 'gearbox_oil_change': 1.4, 'brake_pads_front': 0.8, 'brake_pads_rear': 1.0, 'brake_discs_front': 1.6, 'brake_discs_rear': 1.8, 'wheel_bearings': 2.6, 'steering_rack': 4.5, 'alternator': 3.0, 'starter': 3.0, 'battery_trunk': 1.0, 'ac_compressor': 3.5, 'radiator_main': 3.0, 'wheel_alignment': 1.2 }
        }
    ]
};
