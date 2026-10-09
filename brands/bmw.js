// ============================================
// БАЗА BMW (v1: схема паспорта)
// ============================================
const bmwDB = {
    brand: 'BMW',
    modifications: [
        {
            id: 'bmw_f30_320i', model: '3 серия', generation: 'F30 (2011–2019)',
            engine: { code: 'N20B20', volume: '2.0 L', power: '184 л.с.', torque: '270 Нм' },
            gearbox: { code: 'ZF8HP', type: 'АКПП (гидротрансформатор ZF)', gears: 8 },
            drive: 'Задний', suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: false,
            fluids: {
                engine_oil: { volume: '5.0 л', spec: 'BMW LL-01', viscosity: '5W-30' },
                gearbox_oil: { volume: '7.0 л', spec: 'ZF 8HP (G 070.5)', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: { volume: '1.2 л', spec: 'BMW 75W-85', viscosity: '-' },
                coolant: { volume: '8.5 л', spec: 'BMW G48', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '560 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.7, 'spark_plugs': 1.0, 'timing_chain': 7.0, 'water_pump': 3.0, 'thermostat': 2.2, 'turbo_replacement': 4.0, 'intake_clean_carbon': 4.5, 'hp_fuel_pump': 1.8, 'oil_pan': 3.0, 'crank_seal_rear': 4.5, 'gearbox_oil_change': 1.2, 'brake_pads_front': 0.6, 'brake_pads_rear': 0.8, 'brake_discs_front': 1.2, 'brake_discs_rear': 1.4, 'wheel_bearings': 2.2, 'steering_rack': 4.0, 'alternator': 2.5, 'starter': 2.5, 'battery_trunk': 0.8, 'ac_compressor': 3.0, 'radiator_main': 2.6, 'wheel_alignment': 1.1 }
        },
        {
            id: 'bmw_f30_320d', model: '3 серия', generation: 'F30 (2011–2019)',
            engine: { code: 'N47D20', volume: '2.0 L', power: '184 л.с.', torque: '380 Нм' },
            gearbox: { code: 'ZF8HP', type: 'АКПП (гидротрансформатор ZF)', gears: 8 },
            drive: 'Задний', suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: true,
            fluids: {
                engine_oil: { volume: '5.2 л', spec: 'BMW LL-04', viscosity: '5W-30' },
                gearbox_oil: { volume: '7.0 л', spec: 'ZF 8HP (G 070.5)', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: { volume: '1.2 л', spec: 'BMW 75W-85', viscosity: '-' },
                coolant: { volume: '8.5 л', spec: 'BMW G48', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '560 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.7, 'glow_plugs': 1.8, 'timing_chain': 8.0, 'water_pump': 3.0, 'thermostat': 2.2, 'turbo_replacement': 4.0, 'intake_manifold': 3.0, 'intake_clean_carbon': 4.5, 'egr_valve': 2.2, 'dpf_replace': 3.5, 'injectors_diesel': 3.8, 'hp_fuel_pump': 2.5, 'oil_pan': 3.0, 'crank_seal_rear': 4.5, 'gearbox_oil_change': 1.2, 'brake_pads_front': 0.6, 'brake_pads_rear': 0.8, 'brake_discs_front': 1.2, 'brake_discs_rear': 1.4, 'wheel_bearings': 2.2, 'steering_rack': 4.0, 'alternator': 2.5, 'starter': 2.5, 'battery_trunk': 0.8, 'ac_compressor': 3.0, 'radiator_main': 2.6, 'wheel_alignment': 1.1 }
        },
        {
            id: 'bmw_f10_520d', model: '5 серия', generation: 'F10 (2009–2016)',
            engine: { code: 'N47D20', volume: '2.0 L', power: '184 л.с.', torque: '380 Нм' },
            gearbox: { code: 'ZF8HP', type: 'АКПП (гидротрансформатор ZF)', gears: 8 },
            drive: 'Задний', suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: true,
            fluids: {
                engine_oil: { volume: '5.2 л', spec: 'BMW LL-04', viscosity: '5W-30' },
                gearbox_oil: { volume: '7.0 л', spec: 'ZF 8HP (G 070.5)', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: { volume: '1.4 л', spec: 'BMW 75W-85', viscosity: '-' },
                coolant: { volume: '9.5 л', spec: 'BMW G48', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '600 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.8, 'glow_plugs': 1.8, 'timing_chain': 8.5, 'water_pump': 3.2, 'thermostat': 2.4, 'turbo_replacement': 4.2, 'intake_manifold': 3.2, 'intake_clean_carbon': 4.8, 'egr_valve': 2.4, 'dpf_replace': 3.6, 'injectors_diesel': 4.0, 'hp_fuel_pump': 2.6, 'oil_pan': 3.2, 'crank_seal_rear': 5.0, 'gearbox_oil_change': 1.3, 'brake_pads_front': 0.7, 'brake_pads_rear': 0.9, 'brake_discs_front': 1.3, 'brake_discs_rear': 1.5, 'wheel_bearings': 2.4, 'steering_rack': 4.2, 'alternator': 2.8, 'starter': 2.8, 'battery_trunk': 0.9, 'ac_compressor': 3.2, 'radiator_main': 2.8, 'wheel_alignment': 1.1 }
        },
        {
            id: 'bmw_f25_x3_20d', model: 'X3', generation: 'F25 (2010–2017)',
            engine: { code: 'N47D20', volume: '2.0 L', power: '184 л.с.', torque: '380 Нм' },
            gearbox: { code: 'ZF8HP', type: 'АКПП (гидротрансформатор ZF)', gears: 8 },
            drive: 'Полный (xDrive)', awdSys: 'torsen',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: true,
            fluids: {
                engine_oil: { volume: '5.2 л', spec: 'BMW LL-04', viscosity: '5W-30' },
                gearbox_oil: { volume: '7.0 л', spec: 'ZF 8HP (G 070.5)', viscosity: '-' },
                transfer_case: { volume: '0.9 л', spec: 'BMW 75W-85', viscosity: '-' }, diff_front: { volume: '1.1 л', spec: 'BMW 75W-85', viscosity: '-' }, diff_rear: { volume: '1.4 л', spec: 'BMW 75W-85', viscosity: '-' },
                coolant: { volume: '9.5 л', spec: 'BMW G48', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '620 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.8, 'glow_plugs': 1.8, 'timing_chain': 8.5, 'water_pump': 3.2, 'thermostat': 2.4, 'turbo_replacement': 4.2, 'intake_manifold': 3.2, 'intake_clean_carbon': 4.8, 'egr_valve': 2.4, 'dpf_replace': 3.6, 'injectors_diesel': 4.0, 'hp_fuel_pump': 2.6, 'oil_pan': 3.2, 'crank_seal_rear': 5.0, 'gearbox_oil_change': 1.3, 'brake_pads_front': 0.7, 'brake_pads_rear': 0.9, 'brake_discs_front': 1.3, 'brake_discs_rear': 1.5, 'wheel_bearings': 2.4, 'steering_rack': 4.2, 'alternator': 2.8, 'starter': 2.8, 'battery_trunk': 0.9, 'ac_compressor': 3.2, 'radiator_main': 2.8, 'wheel_alignment': 1.1, 'propshaft': 3.2, 'transfer_case_oil': 0.6, 'diff_oil_front': 0.6, 'diff_oil_rear': 0.6, 'driveshaft_front_left': 1.6, 'driveshaft_front_right': 1.6, 'driveshaft_rear_left': 1.8, 'driveshaft_rear_right': 1.8 }
        },
        {
            id: 'bmw_f20_118i', model: '1 серия', generation: 'F20 (2011–2019)',
            engine: { code: 'N13B16', volume: '1.6 L', power: '136 л.с.', torque: '220 Нм' },
            gearbox: { code: 'ZF8HP', type: 'АКПП (гидротрансформатор ZF)', gears: 8 },
            drive: 'Задний', suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: false,
            fluids: {
                engine_oil: { volume: '4.5 л', spec: 'BMW LL-01', viscosity: '5W-30' },
                gearbox_oil: { volume: '7.0 л', spec: 'ZF 8HP (G 070.5)', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: { volume: '1.0 л', spec: 'BMW 75W-85', viscosity: '-' },
                coolant: { volume: '7.5 л', spec: 'BMW G48', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '520 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.6, 'spark_plugs': 0.9, 'timing_chain': 6.5, 'water_pump': 2.8, 'thermostat': 2.0, 'turbo_replacement': 3.6, 'intake_clean_carbon': 4.0, 'hp_fuel_pump': 1.6, 'oil_pan': 2.8, 'crank_seal_rear': 4.2, 'gearbox_oil_change': 1.1, 'brake_pads_front': 0.5, 'brake_pads_rear': 0.7, 'brake_discs_front': 1.0, 'brake_discs_rear': 1.2, 'wheel_bearings': 2.0, 'steering_rack': 3.6, 'alternator': 2.2, 'starter': 2.2, 'battery_trunk': 0.7, 'ac_compressor': 2.8, 'radiator_main': 2.4, 'wheel_alignment': 1.0 }
        }
    ]
};
