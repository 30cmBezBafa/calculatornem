// ============================================
// БАЗА SKODA (v1: схема паспорта)
// ============================================
const skodaDB = {
    brand: 'Skoda',
    modifications: [
        {
            id: 'skoda_octaviaa7_16mpi',
            model: 'Octavia',
            generation: 'A7 (2013–2020)',
            engine: { code: 'CWVA', volume: '1.6 L', power: '110 л.с.', torque: '155 Нм' },
            gearbox: { code: '02T', type: 'МКПП', gears: 5 },
            drive: 'Передний',
            suspension: 'spring', rear: 'multilink', parking: 'mech', battery: 'hood', pf: false,
            fluids: {
                engine_oil: { volume: '3.6 л', spec: 'VW 502.00', viscosity: '5W-40' },
                gearbox_oil: { volume: '2.0 л', spec: 'VW G 052 512', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '5.5 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '450 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: {
                'oil_change': 0.4, 'spark_plugs': 0.5, 'timing_belt': 3.0, 'water_pump': 1.6, 'thermostat': 1.2,
                'intake_manifold': 1.5, 'injectors_petrol': 1.0, 'lp_fuel_pump': 0.8, 'belt_accessory': 0.8,
                'oil_pan': 2.0, 'crank_seal_rear': 3.0, 'gearbox_oil_change': 0.4, 'clutch_replacement_manual': 3.5,
                'engine_remove_install': 8.0, 'brake_pads_front': 0.4, 'brake_pads_rear': 0.5,
                'brake_discs_front': 0.8, 'brake_discs_rear': 1.0, 'brake_booster': 1.2, 'handbrake_cables': 1.2,
                'sway_bar_links_front': 0.4, 'sway_bar_links_rear': 0.6, 'wheel_bearings': 1.6,
                'steering_rack': 2.6, 'alternator': 1.6, 'starter': 1.5, 'battery_hood': 0.3,
                'ac_compressor': 2.4, 'ac_condenser': 1.8, 'radiator_main': 2.0, 'wheel_alignment': 1.0
            }
        },
        {
            id: 'skoda_octaviaa7_14tsi',
            model: 'Octavia',
            generation: 'A7 (2013–2020)',
            engine: { code: 'CZDA', volume: '1.4 L', power: '150 л.с.', torque: '250 Нм' },
            gearbox: { code: 'DQ200', type: 'DSG (робот)', gears: 7 },
            drive: 'Передний',
            suspension: 'spring', rear: 'multilink', parking: 'mech', battery: 'hood', pf: false,
            fluids: {
                engine_oil: { volume: '4.0 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'VW G 052 512', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '7.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: {
                'oil_change': 0.5, 'spark_plugs': 0.6, 'timing_belt': 3.2, 'water_pump': 2.0, 'thermostat': 1.5,
                'turbo_replacement': 3.0, 'intake_manifold': 2.0, 'intake_clean_carbon': 3.5, 'hp_fuel_pump': 1.2,
                'oil_pan': 2.4, 'crank_seal_rear': 3.4, 'gearbox_oil_change': 0.9, 'mechatronic': 4.5, 'clutch_replacement': 5.0, 'dsg_adaptation': 0.3,
                'engine_remove_install': 9.5, 'brake_pads_front': 0.5, 'brake_pads_rear': 0.6,
                'brake_discs_front': 0.9, 'brake_discs_rear': 1.2, 'brake_booster': 1.2, 'handbrake_cables': 1.2,
                'sway_bar_links_front': 0.5, 'sway_bar_links_rear': 0.7, 'wheel_bearings': 1.8,
                'steering_rack': 3.0, 'alternator': 2.0, 'starter': 1.8, 'battery_hood': 0.4,
                'ac_compressor': 2.6, 'ac_condenser': 1.8, 'radiator_main': 2.2, 'wheel_alignment': 1.0
            }
        },
        {
            id: 'skoda_kodiaqns_20tsi',
            model: 'Kodiaq',
            generation: 'NS (2017–2024)',
            engine: { code: 'CZPA', volume: '2.0 L', power: '180 л.с.', torque: '320 Нм' },
            gearbox: { code: 'DQ500', type: 'DSG (робот)', gears: 7 },
            drive: 'Полный (4x4)', awdSys: 'haldex',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'hood', pf: true,
            fluids: {
                engine_oil: { volume: '5.7 л', spec: 'VW 508.00', viscosity: '0W-20' },
                gearbox_oil: { volume: '2.0 л', spec: 'VW G 052 529', viscosity: '-' },
                transfer_case: null, diff_front: null,
                diff_rear: { volume: '0.8 л', spec: 'VW G 055 145', viscosity: '-' },
                coolant: { volume: '8.5 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '550 г', spec: 'R1234yf', viscosity: '-' }
            },
            customNh: {
                'oil_change': 0.6, 'spark_plugs': 0.9, 'timing_chain': 6.5, 'water_pump': 3.0, 'thermostat': 2.0,
                'turbo_replacement': 3.5, 'intake_manifold': 2.5, 'intake_clean_carbon': 4.0, 'hp_fuel_pump': 1.5,
                'oil_pan': 3.0, 'crank_seal_rear': 4.0, 'gearbox_oil_change': 1.2, 'mechatronic': 5.0, 'clutch_replacement': 5.5, 'dsg_adaptation': 0.4,
                'haldex_oil': 0.5, 'haldex_filter': 0.5, 'diff_oil_rear': 0.4, 'propshaft': 2.5,
                'engine_remove_install': 14.0, 'brake_pads_front': 0.6, 'brake_pads_rear': 0.9,
                'brake_discs_front': 1.2, 'brake_discs_rear': 1.5, 'brake_booster': 1.5,
                'sway_bar_links_front': 0.6, 'sway_bar_links_rear': 0.9, 'wheel_bearings': 2.4,
                'steering_rack': 4.0, 'alternator': 2.8, 'starter': 2.5, 'battery_hood': 0.4,
                'ac_compressor': 3.0, 'ac_condenser': 2.0, 'radiator_main': 2.5, 'wheel_alignment': 1.0
            }
        },
        {
            id: 'skoda_superbb8_20tdi',
            model: 'Superb',
            generation: 'B8 (2015–2023)',
            engine: { code: 'DFGA', volume: '2.0 L', power: '150 л.с.', torque: '340 Нм' },
            gearbox: { code: 'DQ250', type: 'DSG (робот)', gears: 6 },
            drive: 'Передний',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: true,
            fluids: {
                engine_oil: { volume: '4.7 л', spec: 'VW 507.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'VW G 052 182', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '8.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '560 г', spec: 'R1234yf', viscosity: '-' }
            },
            customNh: {
                'oil_change': 0.6, 'glow_plugs': 1.5, 'timing_belt': 3.5, 'water_pump': 2.5, 'thermostat': 2.0,
                'turbo_replacement': 3.2, 'intake_manifold': 2.5, 'intake_clean_carbon': 4.0, 'egr_valve': 1.8,
                'dpf_replace': 3.0, 'injectors_diesel': 3.2, 'hp_fuel_pump': 2.0,
                'oil_pan': 2.8, 'crank_seal_rear': 4.0, 'gearbox_oil_change': 1.0, 'mechatronic': 4.5, 'clutch_replacement': 5.0, 'dsg_adaptation': 0.3,
                'engine_remove_install': 11.0, 'brake_pads_front': 0.6, 'brake_pads_rear': 0.8,
                'brake_discs_front': 1.1, 'brake_discs_rear': 1.4, 'brake_booster': 1.2,
                'sway_bar_links_front': 0.6, 'sway_bar_links_rear': 0.8, 'wheel_bearings': 2.0,
                'steering_rack': 3.5, 'alternator': 2.5, 'starter': 2.2, 'battery_trunk': 0.6,
                'ac_compressor': 2.8, 'ac_condenser': 1.9, 'radiator_main': 2.4, 'wheel_alignment': 1.0
            }
        },
        {
            id: 'skoda_rapidnh_16mpi',
            model: 'Rapid',
            generation: 'NH (2011–2020)',
            engine: { code: 'CWVA', volume: '1.6 L', power: '110 л.с.', torque: '155 Нм' },
            gearbox: { code: '02T', type: 'МКПП', gears: 5 },
            drive: 'Передний',
            suspension: 'spring', rear: 'beam', parking: 'mech', battery: 'hood', pf: false,
            fluids: {
                engine_oil: { volume: '3.6 л', spec: 'VW 502.00', viscosity: '5W-40' },
                gearbox_oil: { volume: '2.0 л', spec: 'VW G 052 512', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '5.5 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '450 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: {
                'oil_change': 0.4, 'spark_plugs': 0.5, 'timing_belt': 3.0, 'water_pump': 1.5, 'thermostat': 1.1,
                'intake_manifold': 1.4, 'injectors_petrol': 1.0, 'lp_fuel_pump': 0.8, 'belt_accessory': 0.8,
                'oil_pan': 2.0, 'crank_seal_rear': 3.0, 'gearbox_oil_change': 0.4, 'clutch_replacement_manual': 3.2,
                'engine_remove_install': 7.5, 'brake_pads_front': 0.4, 'brake_pads_rear': 0.5,
                'brake_discs_front': 0.8, 'brake_discs_rear': 1.0, 'brake_booster': 1.2, 'handbrake_cables': 1.1,
                'sway_bar_links_front': 0.4, 'wheel_bearings': 1.5,
                'steering_rack': 2.4, 'alternator': 1.5, 'starter': 1.4, 'battery_hood': 0.3,
                'ac_compressor': 2.2, 'ac_condenser': 1.7, 'radiator_main': 1.9, 'wheel_alignment': 1.0
            }
        }
    ]
};
