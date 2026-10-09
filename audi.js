// ============================================
// БАЗА AUDI (v1: схема паспорта)
// Нормо-часы вне customNh = базовые из каталога (красная точка, усреднённые)
// ============================================
const audiDB = {
    brand: 'Audi',
    modifications: [
        {
            id: 'audi_a4b8_20tfsi',
            model: 'A4',
            generation: 'B8 (2008–2015)',
            engine: { code: 'CDNB', volume: '2.0 L', power: '180 л.с.', torque: '320 Нм' },
            gearbox: { code: 'DL501', type: 'S tronic (робот)', gears: 7 },
            drive: 'Полный (quattro)', awdSys: 'torsen',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'hood', pf: false,
            fluids: {
                engine_oil: { volume: '5.0 л', spec: 'VW 502.00', viscosity: '5W-40' },
                gearbox_oil: { volume: '7.4 л', spec: 'VW G 052 529', viscosity: '-' },
                transfer_case: { volume: '0.9 л', spec: 'VW G 055 145', viscosity: '-' },
                diff_front: { volume: '0.9 л', spec: 'VW G 055 145', viscosity: '-' },
                diff_rear: { volume: '1.0 л', spec: 'VW G 055 145', viscosity: '-' },
                coolant: { volume: '8.5 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '600 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: {
                'oil_change': 0.6, 'spark_plugs': 0.9, 'timing_chain': 6.0, 'water_pump': 2.5, 'thermostat': 2.0,
                'turbo_replacement': 3.5, 'intake_manifold': 2.5, 'intake_clean_carbon': 4.0, 'hp_fuel_pump': 1.5,
                'oil_pan': 3.0, 'crank_seal_rear': 4.5, 'gearbox_oil_change': 1.2, 'clutch_replacement': 5.5, 'dsg_adaptation': 0.4,
                'engine_remove_install': 12.0, 'brake_pads_front': 0.6, 'brake_pads_rear': 0.9,
                'brake_discs_front': 1.2, 'brake_discs_rear': 1.5, 'brake_booster': 1.5,
                'sway_bar_links_front': 0.6, 'sway_bar_links_rear': 0.8, 'wheel_bearings': 2.2,
                'steering_rack': 4.0, 'alternator': 2.5, 'starter': 2.5, 'battery_hood': 0.4,
                'ac_compressor': 3.0, 'ac_condenser': 2.0, 'radiator_main': 2.5, 'wheel_alignment': 1.0
            }
        },
        {
            id: 'audi_a4b9_20tdi',
            model: 'A4',
            generation: 'B9 (2015–2023)',
            engine: { code: 'DEUA', volume: '2.0 L', power: '190 л.с.', torque: '400 Нм' },
            gearbox: { code: 'DL382', type: 'S tronic (робот)', gears: 7 },
            drive: 'Полный (quattro ultra)', awdSys: 'ultra',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: true,
            fluids: {
                engine_oil: { volume: '4.8 л', spec: 'VW 507.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '7.2 л', spec: 'VW G 052 529', viscosity: '-' },
                transfer_case: null, diff_front: null,
                diff_rear: { volume: '0.85 л', spec: 'VW G 055 145', viscosity: '-' },
                coolant: { volume: '8.5 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '580 г', spec: 'R1234yf', viscosity: '-' }
            },
            customNh: {
                'oil_change': 0.6, 'glow_plugs': 1.6, 'timing_belt': 4.0, 'water_pump': 2.5, 'thermostat': 2.0,
                'turbo_replacement': 3.5, 'intake_manifold': 2.5, 'intake_clean_carbon': 4.0, 'egr_valve': 2.0,
                'dpf_replace': 3.0, 'injectors_diesel': 3.5, 'hp_fuel_pump': 2.0,
                'oil_pan': 3.0, 'crank_seal_rear': 4.5, 'gearbox_oil_change': 1.2, 'dsg_adaptation': 0.4,
                'engine_remove_install': 11.0, 'brake_pads_front': 0.6, 'brake_pads_rear': 0.9,
                'brake_discs_front': 1.2, 'brake_discs_rear': 1.5, 'brake_booster': 1.5,
                'sway_bar_links_front': 0.6, 'sway_bar_links_rear': 0.8, 'wheel_bearings': 2.2,
                'steering_rack': 4.0, 'alternator': 2.5, 'starter': 2.5, 'battery_trunk': 0.7,
                'ac_compressor': 3.0, 'ac_condenser': 2.0, 'radiator_main': 2.5, 'wheel_alignment': 1.0
            }
        },
        {
            id: 'audi_a6c7_30tdi',
            model: 'A6',
            generation: 'C7 (2011–2018)',
            engine: { code: 'CDUD', volume: '3.0 L', power: '245 л.с.', torque: '500 Нм' },
            gearbox: { code: 'DL501', type: 'S tronic (робот)', gears: 7 },
            drive: 'Полный (quattro)', awdSys: 'torsen',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'trunk', pf: true,
            fluids: {
                engine_oil: { volume: '8.0 л', spec: 'VW 507.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '7.4 л', spec: 'VW G 052 529', viscosity: '-' },
                transfer_case: { volume: '0.9 л', spec: 'VW G 055 145', viscosity: '-' },
                diff_front: { volume: '0.9 л', spec: 'VW G 055 145', viscosity: '-' },
                diff_rear: { volume: '1.0 л', spec: 'VW G 055 145', viscosity: '-' },
                coolant: { volume: '9.5 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '650 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: {
                'oil_change': 0.8, 'glow_plugs': 1.8, 'timing_chain': 9.0, 'water_pump': 3.0, 'thermostat': 2.5,
                'turbo_replacement': 4.0, 'intake_manifold': 3.5, 'intake_clean_carbon': 4.5, 'egr_valve': 2.2,
                'dpf_replace': 3.5, 'injectors_diesel': 4.0, 'hp_fuel_pump': 2.5,
                'oil_pan': 3.5, 'crank_seal_rear': 5.5, 'gearbox_oil_change': 1.3, 'dsg_adaptation': 0.4,
                'engine_remove_install': 14.0, 'brake_pads_front': 0.7, 'brake_pads_rear': 1.0,
                'brake_discs_front': 1.4, 'brake_discs_rear': 1.6, 'brake_booster': 2.0,
                'sway_bar_links_front': 0.7, 'sway_bar_links_rear': 0.9, 'wheel_bearings': 2.5,
                'steering_rack': 4.5, 'alternator': 3.0, 'starter': 3.0, 'battery_trunk': 0.8,
                'ac_compressor': 3.5, 'ac_condenser': 2.5, 'radiator_main': 3.0, 'wheel_alignment': 1.0
            }
        },
        {
            id: 'audi_q5fy_20tfsi',
            model: 'Q5',
            generation: 'FY (2017–2024)',
            engine: { code: 'DAXB', volume: '2.0 L', power: '249 л.с.', torque: '370 Нм' },
            gearbox: { code: 'DL382', type: 'S tronic (робот)', gears: 7 },
            drive: 'Полный (quattro ultra)', awdSys: 'ultra',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'hood', pf: true,
            fluids: {
                engine_oil: { volume: '5.2 л', spec: 'VW 508.00', viscosity: '0W-20' },
                gearbox_oil: { volume: '7.2 л', spec: 'VW G 052 529', viscosity: '-' },
                transfer_case: null, diff_front: null,
                diff_rear: { volume: '0.9 л', spec: 'VW G 055 145', viscosity: '-' },
                coolant: { volume: '9.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '620 г', spec: 'R1234yf', viscosity: '-' }
            },
            customNh: {
                'oil_change': 0.7, 'spark_plugs': 1.0, 'timing_chain': 6.5, 'water_pump': 3.0, 'thermostat': 2.2,
                'turbo_replacement': 3.8, 'intake_manifold': 2.8, 'intake_clean_carbon': 4.0, 'hp_fuel_pump': 1.5,
                'oil_pan': 3.2, 'crank_seal_rear': 5.0, 'gearbox_oil_change': 1.2, 'dsg_adaptation': 0.4,
                'engine_remove_install': 13.0, 'brake_pads_front': 0.7, 'brake_pads_rear': 1.0,
                'brake_discs_front': 1.4, 'brake_discs_rear': 1.6, 'brake_booster': 1.5,
                'sway_bar_links_front': 0.7, 'sway_bar_links_rear': 0.9, 'wheel_bearings': 2.5,
                'steering_rack': 4.2, 'alternator': 2.8, 'starter': 2.8, 'battery_hood': 0.5,
                'ac_compressor': 3.2, 'ac_condenser': 2.2, 'radiator_main': 2.8, 'wheel_alignment': 1.0
            }
        },
        {
            id: 'audi_a38v_18tsi',
            model: 'A3',
            generation: '8V (2012–2020)',
            engine: { code: 'CJSA', volume: '1.8 L', power: '180 л.с.', torque: '250 Нм' },
            gearbox: { code: 'DQ250', type: 'S tronic (робот)', gears: 6 },
            drive: 'Передний',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'hood', pf: false,
            fluids: {
                engine_oil: { volume: '5.2 л', spec: 'VW 502.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'VW G 052 182', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '7.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '520 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: {
                'oil_change': 0.5, 'spark_plugs': 0.8, 'timing_chain': 5.0, 'water_pump': 2.2, 'thermostat': 1.8,
                'turbo_replacement': 3.0, 'intake_manifold': 2.2, 'intake_clean_carbon': 3.5, 'hp_fuel_pump': 1.2,
                'oil_pan': 2.6, 'crank_seal_rear': 4.0, 'gearbox_oil_change': 1.0, 'mechatronic': 4.5, 'clutch_replacement': 5.0, 'dsg_adaptation': 0.3,
                'engine_remove_install': 10.0, 'brake_pads_front': 0.5, 'brake_pads_rear': 0.8,
                'brake_discs_front': 1.0, 'brake_discs_rear': 1.3, 'brake_booster': 1.2,
                'sway_bar_links_front': 0.5, 'sway_bar_links_rear': 0.7, 'wheel_bearings': 2.0,
                'steering_rack': 3.5, 'alternator': 2.2, 'starter': 2.0, 'battery_hood': 0.4,
                'ac_compressor': 2.6, 'ac_condenser': 1.8, 'radiator_main': 2.2, 'wheel_alignment': 1.0
            }
        }
    ]
};
