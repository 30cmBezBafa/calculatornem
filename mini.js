// ============================================
// БАЗА MINI (v1: схема паспорта)
// ============================================
const miniDB = {
    brand: 'MINI',
    modifications: [
        {
            id: 'mini_f56_cooper', model: 'Cooper', generation: 'F56 (2014–2021)',
            engine: { code: 'B38A15', volume: '1.5 L', power: '136 л.с.', torque: '220 Нм' },
            gearbox: { code: 'AT6', type: 'АКПП (гидротрансформатор Aisin)', gears: 6 },
            drive: 'Передний', suspension: 'spring', rear: 'multilink', parking: 'mech', battery: 'trunk', pf: false,
            fluids: {
                engine_oil: { volume: '4.5 л', spec: 'BMW LL-01', viscosity: '5W-30' },
                gearbox_oil: { volume: '6.0 л', spec: 'Aisin AT6 (G 070.2)', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '7.0 л', spec: 'BMW G48', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '480 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.6, 'spark_plugs': 0.9, 'timing_chain': 6.5, 'water_pump': 2.8, 'thermostat': 2.0, 'turbo_replacement': 3.6, 'intake_clean_carbon': 4.0, 'hp_fuel_pump': 1.6, 'oil_pan': 2.8, 'crank_seal_rear': 4.2, 'gearbox_oil_change': 1.0, 'brake_pads_front': 0.5, 'brake_pads_rear': 0.7, 'brake_discs_front': 1.0, 'brake_discs_rear': 1.2, 'wheel_bearings': 2.0, 'steering_rack': 3.6, 'alternator': 2.2, 'starter': 2.2, 'battery_trunk': 0.7, 'handbrake_cables': 1.2, 'ac_compressor': 2.8, 'radiator_main': 2.4, 'wheel_alignment': 1.0 }
        },
        {
            id: 'mini_f56_cooper_s', model: 'Cooper S', generation: 'F56 (2014–2021)',
            engine: { code: 'B48A20', volume: '2.0 L', power: '192 л.с.', torque: '280 Нм' },
            gearbox: { code: 'AT6', type: 'АКПП (гидротрансформатор Aisin)', gears: 6 },
            drive: 'Передний', suspension: 'spring', rear: 'multilink', parking: 'mech', battery: 'trunk', pf: false,
            fluids: {
                engine_oil: { volume: '5.0 л', spec: 'BMW LL-01', viscosity: '5W-30' },
                gearbox_oil: { volume: '6.0 л', spec: 'Aisin AT6 (G 070.2)', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '7.5 л', spec: 'BMW G48', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '480 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.7, 'spark_plugs': 1.0, 'timing_chain': 7.0, 'water_pump': 3.0, 'thermostat': 2.2, 'turbo_replacement': 3.8, 'intake_clean_carbon': 4.2, 'hp_fuel_pump': 1.7, 'oil_pan': 3.0, 'crank_seal_rear': 4.5, 'gearbox_oil_change': 1.0, 'brake_pads_front': 0.6, 'brake_pads_rear': 0.8, 'brake_discs_front': 1.1, 'brake_discs_rear': 1.3, 'wheel_bearings': 2.1, 'steering_rack': 3.8, 'alternator': 2.4, 'starter': 2.4, 'battery_trunk': 0.7, 'handbrake_cables': 1.2, 'ac_compressor': 3.0, 'radiator_main': 2.6, 'wheel_alignment': 1.0 }
        },
        {
            id: 'mini_r60_countryman', model: 'Countryman', generation: 'R60 (2010–2016)',
            engine: { code: 'N18B16', volume: '1.6 L', power: '184 л.с.', torque: '240 Нм' },
            gearbox: { code: 'AT6', type: 'АКПП (гидротрансформатор Aisin)', gears: 6 },
            drive: 'Полный (ALL4)', awdSys: 'torsen',
            suspension: 'spring', rear: 'multilink', parking: 'mech', battery: 'trunk', pf: false,
            fluids: {
                engine_oil: { volume: '4.5 л', spec: 'BMW LL-01', viscosity: '5W-30' },
                gearbox_oil: { volume: '6.0 л', spec: 'Aisin AT6 (G 070.2)', viscosity: '-' },
                transfer_case: { volume: '0.7 л', spec: 'BMW 75W-85', viscosity: '-' }, diff_front: { volume: '0.8 л', spec: 'BMW 75W-85', viscosity: '-' }, diff_rear: { volume: '0.9 л', spec: 'BMW 75W-85', viscosity: '-' },
                coolant: { volume: '7.5 л', spec: 'BMW G48', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '520 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.6, 'spark_plugs': 1.0, 'timing_chain': 7.0, 'water_pump': 3.0, 'thermostat': 2.2, 'turbo_replacement': 3.8, 'intake_clean_carbon': 4.2, 'hp_fuel_pump': 1.7, 'oil_pan': 3.0, 'crank_seal_rear': 4.5, 'gearbox_oil_change': 1.0, 'brake_pads_front': 0.6, 'brake_pads_rear': 0.8, 'brake_discs_front': 1.1, 'brake_discs_rear': 1.3, 'wheel_bearings': 2.2, 'steering_rack': 3.8, 'alternator': 2.4, 'starter': 2.4, 'battery_trunk': 0.8, 'handbrake_cables': 1.3, 'ac_compressor': 3.0, 'radiator_main': 2.6, 'wheel_alignment': 1.1, 'propshaft': 3.0, 'transfer_case_oil': 0.5, 'diff_oil_front': 0.5, 'diff_oil_rear': 0.5 }
        },
        {
            id: 'mini_f54_clubman', model: 'Clubman', generation: 'F54 (2015–2024)',
            engine: { code: 'B47D20', volume: '2.0 L', power: '150 л.с.', torque: '330 Нм' },
            gearbox: { code: 'AT8', type: 'АКПП (гидротрансформатор Aisin)', gears: 8 },
            drive: 'Передний', suspension: 'spring', rear: 'multilink', parking: 'mech', battery: 'trunk', pf: true,
            fluids: {
                engine_oil: { volume: '5.0 л', spec: 'BMW LL-04', viscosity: '5W-30' },
                gearbox_oil: { volume: '7.0 л', spec: 'Aisin AT8 (G 070.4)', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '8.0 л', spec: 'BMW G48', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '520 г', spec: 'R1234yf', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.6, 'glow_plugs': 1.6, 'timing_chain': 7.0, 'water_pump': 3.0, 'thermostat': 2.2, 'turbo_replacement': 3.8, 'intake_manifold': 2.8, 'intake_clean_carbon': 4.2, 'egr_valve': 2.0, 'dpf_replace': 3.2, 'injectors_diesel': 3.5, 'hp_fuel_pump': 2.2, 'oil_pan': 3.0, 'crank_seal_rear': 4.5, 'gearbox_oil_change': 1.1, 'brake_pads_front': 0.6, 'brake_pads_rear': 0.8, 'brake_discs_front': 1.1, 'brake_discs_rear': 1.3, 'wheel_bearings': 2.2, 'steering_rack': 3.8, 'alternator': 2.4, 'starter': 2.4, 'battery_trunk': 0.8, 'handbrake_cables': 1.2, 'ac_compressor': 3.0, 'radiator_main': 2.6, 'wheel_alignment': 1.0 }
        },
        {
            id: 'mini_f55_cooper', model: 'Cooper (5 дв.)', generation: 'F55 (2014–2021)',
            engine: { code: 'B38A15', volume: '1.5 L', power: '136 л.с.', torque: '220 Нм' },
            gearbox: { code: '6MT', type: 'МКПП', gears: 6 },
            drive: 'Передний', suspension: 'spring', rear: 'multilink', parking: 'mech', battery: 'trunk', pf: false,
            fluids: {
                engine_oil: { volume: '4.5 л', spec: 'BMW LL-01', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.5 л', spec: 'MTF LT-3', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '7.0 л', spec: 'BMW G48', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '480 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.6, 'spark_plugs': 0.9, 'timing_chain': 6.5, 'water_pump': 2.8, 'thermostat': 2.0, 'turbo_replacement': 3.6, 'intake_clean_carbon': 4.0, 'hp_fuel_pump': 1.6, 'oil_pan': 2.8, 'crank_seal_rear': 4.2, 'gearbox_oil_change': 0.5, 'clutch_replacement_manual': 3.8, 'brake_pads_front': 0.5, 'brake_pads_rear': 0.7, 'brake_discs_front': 1.0, 'brake_discs_rear': 1.2, 'wheel_bearings': 2.0, 'steering_rack': 3.6, 'alternator': 2.2, 'starter': 2.2, 'battery_trunk': 0.7, 'handbrake_cables': 1.2, 'ac_compressor': 2.8, 'radiator_main': 2.4, 'wheel_alignment': 1.0 }
        }
    ]
};
