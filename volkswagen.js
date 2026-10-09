// ============================================
// БАЗА VOLKSWAGEN (Полный кастом для всех критичных работ)
// ============================================
const volkswagenDB = {
    brand: 'Volkswagen',
    modifications: [
        // ==================== GOLF VII 1.4 TSI (DSG, передний) ====================
        {
            id: 'vw_golf7_14tsi',
            model: 'Golf',
            generation: 'VII (2012–2020)',
            engine: { code: 'CZDA', volume: '1.4 L', power: '122 л.с.', torque: '200 Нм' },
            gearbox: { code: 'DQ250', type: 'DSG (робот)', gears: 6 },
            gearboxType: 'dsg',
            drive: 'Передний',
            fluids: {
                engine_oil: { volume: '4.0 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'VW G 052 182', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '7.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            works: [
                'oil_change', 'air_filter', 'cabin_filter', 'fuel_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change',
                'timing_chain', 'valve_cover_gasket', 'oil_pump', 'water_pump', 'thermostat', 'engine_mounts',
                'engine_remove_install', 'gearbox_remove_install', 'gearbox_oil_change', 'mechatronic', 'clutch_replacement', 'dual_mass_flywheel', 'gearbox_repair',
                'shock_absorbers_front', 'shock_absorbers_rear', 'springs', 'control_arm_bushings', 'ball_joints', 'sway_bar_links_front', 'sway_bar_links_rear', 'wheel_bearings',
                'brake_pads_front', 'brake_pads_rear', 'brake_pads_rear_electric_release', 'brake_discs_front', 'brake_discs_rear', 'abs_sensor',
                'tie_rods', 'steering_rack', 'eps',
                'battery_under_seat', 'battery_adaptation', 'alternator', 'starter', 'ignition_coils',
                'exhaust_flange', 'lambda_sensors', 'muffler'
            ],
            customNh: {
                'oil_change': 0.5,
                'fuel_filter': 0.8,
                'spark_plugs': 0.6,
                'timing_chain': 4.5,
                'valve_cover_gasket': 1.5,
                'oil_pump': 4.5, // Снятие поддона, доступ средний
                'water_pump': 2.5,
                'thermostat': 1.5,
                'alternator': 2.0,
                'starter': 2.0,
                'steering_rack': 3.5,
                'eps': 2.0, // ЭУР на рулевой колонке, доступ хороший
                'battery_under_seat': 0.6,
                'engine_remove_install': 10.0,
                'gearbox_remove_install': 6.0,
                'remove_drives': 1.0,
                'gearbox_oil_change': 1.0,
                'mechatronic': 4.5,
                'clutch_replacement': 5.0,
                'dual_mass_flywheel': 5.5, // TSI, двухмассовый
                'gearbox_repair': 7.0, // DQ250, доступ через лючок
                'shock_absorbers_front': 1.5, // Обычные амортизаторы
                'shock_absorbers_rear': 1.8, // Обычные амортизаторы
                'springs': 2.0,
                'control_arm_bushings': 2.5,
                'ball_joints': 1.5, // Впрессованы в рычаг, нужна перепрессовка
                'wheel_bearings': 2.0,
                'brake_pads_front': 0.5,
                'brake_pads_rear': 0.8,
                'brake_pads_rear_electric_release': 0.3,
                'brake_discs_front': 1.0,
                'brake_discs_rear': 1.5,
                'sway_bar_links_front': 0.5,
                'sway_bar_links_rear': 0.8,
                'ignition_coils': 0.3,
                'lambda_sensors': 1.0,
                'muffler': 1.5
            }
        },

        // ==================== TIGUAN II 2.0 TSI (DSG, 4Motion) ====================
        {
            id: 'vw_tiguan2_20tsi',
            model: 'Tiguan',
            generation: 'II (2016–2024)',
            engine: { code: 'CZPA', volume: '2.0 L', power: '180 л.с.', torque: '320 Нм' },
            gearbox: { code: 'DQ500', type: 'DSG (робот)', gears: 7 },
            gearboxType: 'dsg',
            drive: 'Полный (4Motion)',
            fluids: {
                engine_oil: { volume: '5.7 л', spec: 'VW 508.00', viscosity: '0W-20' },
                gearbox_oil: { volume: '2.0 л', spec: 'VW G 052 529', viscosity: '-' },
                transfer_case: null,
                diff_front: null,
                diff_rear: { volume: '0.8 л', spec: 'VW G 055 145', viscosity: '-' },
                coolant: { volume: '8.5 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '550 г', spec: 'R134a', viscosity: '-' }
            },
            works: [
                'oil_change', 'air_filter', 'cabin_filter', 'fuel_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change',
                'timing_chain', 'valve_cover_gasket', 'oil_pump', 'water_pump', 'thermostat', 'engine_mounts',
                'engine_remove_install', 'gearbox_remove_install', 'gearbox_oil_change', 'mechatronic', 'clutch_replacement', 'dual_mass_flywheel', 'gearbox_repair',
                'haldex_oil', 'haldex_filter', 'diff_oil_rear',
                'shock_absorbers_front', 'shock_absorbers_rear', 'springs', 'control_arm_bushings', 'ball_joints', 'sway_bar_links_front', 'sway_bar_links_rear', 'wheel_bearings',
                'brake_pads_front', 'brake_pads_rear', 'brake_pads_rear_electric_release', 'brake_discs_front', 'brake_discs_rear', 'abs_sensor',
                'tie_rods', 'steering_rack', 'eps',
                'battery_hood', 'battery_adaptation', 'alternator', 'starter', 'ignition_coils',
                'exhaust_flange', 'lambda_sensors', 'dpf_clean', 'muffler'
            ],
            customNh: {
                'oil_change': 0.5,
                'fuel_filter': 0.9,
                'spark_plugs': 0.8,
                'timing_chain': 6.5,
                'valve_cover_gasket': 2.0,
                'oil_pump': 5.0, // Тесно, мешает поддон и защита
                'water_pump': 3.0,
                'thermostat': 2.0,
                'alternator': 3.0,
                'starter': 2.5,
                'steering_rack': 4.0,
                'eps': 2.5, // ЭУР, но теснее из-за полного привода
                'battery_hood': 0.4,
                'engine_remove_install': 14.0,
                'gearbox_remove_install': 7.5,
                'remove_drives': 1.5,
                'gearbox_oil_change': 1.2,
                'mechatronic': 5.0,
                'clutch_replacement': 5.5,
                'dual_mass_flywheel': 6.0, // TSI, двухмассовый, доступ сложнее
                'gearbox_repair': 8.0, // DQ500, сложнее доступ
                'shock_absorbers_front': 1.8, // Обычные, но теснее из-за 4Motion
                'shock_absorbers_rear': 2.2, // Обычные, но теснее
                'springs': 2.5,
                'control_arm_bushings': 2.5,
                'ball_joints': 2.0, // Впрессованы, нужна перепрессовка
                'wheel_bearings': 2.5,
                'brake_pads_front': 0.6,
                'brake_pads_rear': 0.9,
                'brake_pads_rear_electric_release': 0.3,
                'brake_discs_front': 1.2,
                'brake_discs_rear': 1.6,
                'sway_bar_links_front': 0.6,
                'sway_bar_links_rear': 0.9,
                'ignition_coils': 0.4,
                'lambda_sensors': 1.2,
                'muffler': 2.0,
                'dpf_clean': 4.5, // TSI с GPF, сложнее
                'haldex_oil': 0.5,
                'haldex_filter': 0.5,
                'diff_oil_rear': 0.4
            }
        },

        // ==================== POLO SEDAN 1.6 MPI (МКПП, передний) ====================
        {
            id: 'vw_polo_16mpi',
            model: 'Polo Sedan',
            generation: 'IV (2010–2020)',
            engine: { code: 'CFWA', volume: '1.6 L', power: '110 л.с.', torque: '155 Нм' },
            gearbox: { code: '02T', type: 'МКПП', gears: 5 },
            gearboxType: 'manual',
            drive: 'Передний',
            fluids: {
                engine_oil: { volume: '3.6 л', spec: 'VW 502.00', viscosity: '5W-40' },
                gearbox_oil: { volume: '2.0 л', spec: 'VW G 052 512', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '5.5 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '450 г', spec: 'R134a', viscosity: '-' }
            },
            works: [
                'oil_change', 'air_filter', 'cabin_filter', 'fuel_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change',
                'timing_chain', 'valve_cover_gasket', 'oil_pump', 'water_pump', 'thermostat', 'engine_mounts',
                'engine_remove_install', 'gearbox_remove_install', 'gearbox_oil_change', 'clutch_replacement_manual', 'gearbox_repair',
                'shock_absorbers_front', 'shock_absorbers_rear', 'springs', 'control_arm_bushings', 'ball_joints', 'sway_bar_links_front', 'wheel_bearings',
                'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'abs_sensor',
                'tie_rods', 'steering_rack', 'eps',
                'battery_hood', 'battery_adaptation', 'alternator', 'starter', 'ignition_coils',
                'exhaust_flange', 'lambda_sensors', 'muffler'
            ],
            customNh: {
                'oil_change': 0.4,
                'fuel_filter': 0.8,
                'spark_plugs': 0.4,
                'timing_chain': 4.5,
                'valve_cover_gasket': 1.0,
                'oil_pump': 3.5, // Простой доступ на EA111
                'water_pump': 1.5,
                'thermostat': 1.0,
                'alternator': 1.5,
                'starter': 1.5,
                'steering_rack': 2.5,
                'eps': 1.8, // ЭУР, простой доступ
                'battery_hood': 0.3,
                'engine_remove_install': 8.0,
                'gearbox_remove_install': 4.0,
                'remove_drives': 0.8,
                'gearbox_oil_change': 0.4,
                'clutch_replacement_manual': 3.5,
                'gearbox_repair': 5.0, // МКПП, простой ремонт
                'shock_absorbers_front': 1.2, // Простые амортизаторы
                'shock_absorbers_rear': 1.0, // Простые амортизаторы, балка
                'springs': 1.5,
                'control_arm_bushings': 1.5,
                'ball_joints': 1.2, // Впрессованы, но простой доступ
                'wheel_bearings': 1.5,
                'brake_pads_front': 0.4,
                'brake_pads_rear': 0.5,
                'brake_discs_front': 0.8,
                'brake_discs_rear': 1.0,
                'sway_bar_links_front': 0.4,
                'ignition_coils': 0.3,
                'lambda_sensors': 0.8,
                'muffler': 1.0
            }
        },

        // ==================== PASSAT B8 1.4 TSI (DSG, передний) ====================
        {
            id: 'vw_passat_b8_14tsi',
            model: 'Passat',
            generation: 'B8 (2014–2023)',
            engine: { code: 'CZDA', volume: '1.4 L', power: '150 л.с.', torque: '250 Нм' },
            gearbox: { code: 'DQ250', type: 'DSG (робот)', gears: 6 },
            gearboxType: 'dsg',
            drive: 'Передний',
            fluids: {
                engine_oil: { volume: '4.5 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'VW G 052 182', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '7.5 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            works: [
                'oil_change', 'air_filter', 'cabin_filter', 'fuel_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change',
                'timing_chain', 'valve_cover_gasket', 'oil_pump', 'water_pump', 'thermostat', 'engine_mounts',
                'engine_remove_install', 'gearbox_remove_install', 'gearbox_oil_change', 'mechatronic', 'clutch_replacement', 'dual_mass_flywheel', 'gearbox_repair',
                'shock_absorbers_front', 'shock_absorbers_rear', 'springs', 'control_arm_bushings', 'ball_joints', 'sway_bar_links_front', 'sway_bar_links_rear', 'wheel_bearings',
                'brake_pads_front', 'brake_pads_rear', 'brake_pads_rear_electric_release', 'brake_discs_front', 'brake_discs_rear', 'abs_sensor',
                'tie_rods', 'steering_rack', 'eps',
                'battery_hood', 'battery_adaptation', 'alternator', 'starter', 'ignition_coils',
                'exhaust_flange', 'lambda_sensors', 'muffler'
            ],
            customNh: {
                'oil_change': 0.5,
                'fuel_filter': 0.8,
                'spark_plugs': 0.6,
                'timing_chain': 5.0,
                'valve_cover_gasket': 1.8,
                'oil_pump': 4.5, // Доступ средний
                'water_pump': 2.5,
                'thermostat': 1.5,
                'alternator': 2.5,
                'starter': 2.0,
                'steering_rack': 3.5,
                'eps': 2.2, // ЭУР, доступ средний
                'battery_hood': 0.4,
                'engine_remove_install': 12.0,
                'gearbox_remove_install': 7.0,
                'remove_drives': 1.0,
                'gearbox_oil_change': 1.0,
                'mechatronic': 4.5,
                'clutch_replacement': 5.0,
                'dual_mass_flywheel': 5.5, // TSI, двухмассовый
                'gearbox_repair': 7.0, // DQ250
                'shock_absorbers_front': 1.6, // Обычные амортизаторы
                'shock_absorbers_rear': 1.9, // Обычные амортизаторы
                'springs': 2.2,
                'control_arm_bushings': 2.5,
                'ball_joints': 1.6, // Впрессованы
                'wheel_bearings': 2.0,
                'brake_pads_front': 0.5,
                'brake_pads_rear': 0.8,
                'brake_pads_rear_electric_release': 0.3,
                'brake_discs_front': 1.0,
                'brake_discs_rear': 1.5,
                'sway_bar_links_front': 0.5,
                'sway_bar_links_rear': 0.8,
                'ignition_coils': 0.3,
                'lambda_sensors': 1.0,
                'muffler': 1.8
            }
        },

        // ==================== TOUAREG 3.0 TDI (АКПП ZF8, 4Motion Torsen) ====================
        {
            id: 'vw_touareg_cr_30tdi',
            model: 'Touareg',
            generation: 'CR (2010–2018)',
            engine: { code: 'CASA', volume: '3.0 L', power: '240 л.с.', torque: '550 Нм' },
            gearbox: { code: '09D', type: 'АКПП (гидротрансформатор ZF)', gears: 8 },
            gearboxType: 'automatic',
            drive: 'Полный (4Motion Torsen)',
            fluids: {
                engine_oil: { volume: '8.3 л', spec: 'VW 507.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '9.5 л', spec: 'VW G 055 025', viscosity: '-' },
                transfer_case: { volume: '1.1 л', spec: 'VW G 055 145', viscosity: '-' },
                diff_front: { volume: '1.5 л', spec: 'VW G 055 145', viscosity: '-' },
                diff_rear: { volume: '1.1 л', spec: 'VW G 055 145', viscosity: '-' },
                coolant: { volume: '12.0 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '650 г', spec: 'R134a', viscosity: '-' }
            },
            works: [
                'oil_change', 'air_filter', 'cabin_filter', 'fuel_filter', 'glow_plugs', 'brake_fluid_change', 'coolant_change',
                'timing_chain', 'valve_cover_gasket', 'oil_pump', 'water_pump', 'thermostat', 'engine_mounts',
                'engine_remove_install', 'gearbox_remove_install', 'gearbox_oil_change', 'gearbox_repair',
                'transfer_case_oil', 'diff_oil_front', 'diff_oil_rear', 'transfer_case_remove',
                'shock_absorbers_front_air', 'shock_absorbers_rear_air', 'springs', 'control_arm_bushings', 'ball_joints', 'sway_bar_links_front', 'sway_bar_links_rear', 'wheel_bearings',
                'brake_pads_front', 'brake_pads_rear', 'brake_pads_rear_electric_release', 'brake_discs_front', 'brake_discs_rear', 'abs_sensor',
                'tie_rods', 'steering_rack', 'eps',
                'battery_trunk', 'battery_adaptation', 'alternator', 'starter',
                'exhaust_flange', 'lambda_sensors', 'dpf_clean', 'muffler'
            ],
            customNh: {
                'oil_change': 0.7,
                'fuel_filter': 1.2,
                'glow_plugs': 1.5,
                'timing_chain': 11.0,
                'valve_cover_gasket': 3.0,
                'oil_pump': 6.0, // V6, очень тесно, снятие поддона сложное
                'water_pump': 3.5,
                'thermostat': 2.5,
                'alternator': 4.5,
                'starter': 3.5,
                'steering_rack': 5.0,
                'eps': 3.0, // ЭУР, но тяжелый агрегат, тесно
                'battery_trunk': 0.7,
                'engine_remove_install': 19.0,
                'gearbox_remove_install': 10.0,
                'remove_drives': 2.0,
                'gearbox_oil_change': 1.5,
                'gearbox_repair': 10.0, // ZF8, сложный ремонт
                'shock_absorbers_front_air': 2.5, // Пневмоамортизаторы
                'shock_absorbers_rear_air': 2.8, // Пневмоамортизаторы
                'springs': 3.5,
                'control_arm_bushings': 3.5,
                'ball_joints': 2.5, // Мощные шаровые, нужна перепрессовка
                'wheel_bearings': 3.0,
                'brake_pads_front': 0.8,
                'brake_pads_rear': 1.0,
                'brake_pads_rear_electric_release': 0.3,
                'brake_discs_front': 1.5,
                'brake_discs_rear': 1.8,
                'sway_bar_links_front': 0.8,
                'sway_bar_links_rear': 1.0,
                'lambda_sensors': 2.0,
                'muffler': 2.5,
                'dpf_clean': 5.0, // Дизель, DPF, сложная работа
                'transfer_case_oil': 0.5,
                'diff_oil_front': 0.5,
                'diff_oil_rear': 0.5,
                'transfer_case_remove': 6.0
            }
        }
    ]
};
