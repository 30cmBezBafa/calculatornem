const volkswagenDB = {
    brand: 'Volkswagen',
    modifications: [
        // ================= POLO =================
        {
            id: 'vw_polo5_16mpi',
            model: 'Polo',
            generation: 'V (2009–2015)',
            engine: { code: 'CFNA', volume: '1.6 L', power: '105 л.с.', torque: '153 Нм' },
            gearbox: { code: 'Aisin', type: 'АКПП', gears: 6 },
            drive: 'Передний',
            fluids: {
                engine_oil: { volume: '4.0 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-40' },
                gearbox_oil: { volume: '1.7 л', spec: 'G 052 162', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '5.5 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'shock_absorbers', 'wheel_bearings', 'battery_under_seat', 'alternator', 'starter']
        },
        {
            id: 'vw_polo6_16mpi',
            model: 'Polo',
            generation: 'VI (2020–н.в.)',
            engine: { code: 'CWVA', volume: '1.6 L', power: '110 л.с.', torque: '155 Нм' },
            gearbox: { code: 'Aisin', type: 'АКПП', gears: 6 },
            drive: 'Передний',
            fluids: {
                engine_oil: { volume: '4.0 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-40' },
                gearbox_oil: { volume: '1.7 л', spec: 'G 052 162', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '5.5 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'shock_absorbers', 'wheel_bearings', 'battery_under_seat']
        },

        // ================= GOLF =================
        {
            id: 'vw_golf7_14tsi',
            model: 'Golf',
            generation: 'VII (2012–2020)',
            engine: { code: 'CZDA', volume: '1.4 L', power: '125 л.с.', torque: '200 Нм' },
            gearbox: { code: 'DQ200', type: 'DSG (робот)', gears: 7 },
            drive: 'Передний',
            fluids: {
                engine_oil: { volume: '4.0 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'G 052 182', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '7.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change', 'timing_chain', 'valve_cover_gasket', 'water_pump', 'thermostat', 'mechatronic', 'clutch_replacement', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'shock_absorbers', 'control_arm_bushings', 'wheel_bearings']
        },
        {
            id: 'vw_golf7_20tsi_gti',
            model: 'Golf',
            generation: 'VII GTI (2013–2020)',
            engine: { code: 'CHHA', volume: '2.0 L', power: '220 л.с.', torque: '350 Нм' },
            gearbox: { code: 'DQ381', type: 'DSG (робот)', gears: 7 },
            drive: 'Передний',
            fluids: {
                engine_oil: { volume: '5.7 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'G 052 182', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '7.5 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change', 'timing_chain', 'valve_cover_gasket', 'water_pump', 'thermostat', 'gearbox_oil_change', 'mechatronic', 'clutch_replacement', 'dual_mass_flywheel', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'shock_absorbers', 'control_arm_bushings']
        },

        // ================= JETTA =================
        {
            id: 'vw_jetta6_14tsi',
            model: 'Jetta',
            generation: 'VI (2010–2018)',
            engine: { code: 'CAXA', volume: '1.4 L', power: '122 л.с.', torque: '200 Нм' },
            gearbox: { code: 'DQ200', type: 'DSG (робот)', gears: 7 },
            drive: 'Передний',
            fluids: {
                engine_oil: { volume: '4.0 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'G 052 182', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '7.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change', 'timing_chain', 'valve_cover_gasket', 'water_pump', 'thermostat', 'mechatronic', 'clutch_replacement', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'shock_absorbers', 'wheel_bearings']
        },

        // ================= PASSAT =================
        {
            id: 'vw_passat_b7_18tsi',
            model: 'Passat',
            generation: 'B7 (2010–2015)',
            engine: { code: 'CDAA', volume: '1.8 L', power: '152 л.с.', torque: '250 Нм' },
            gearbox: { code: 'DQ250', type: 'DSG (робот)', gears: 6 },
            drive: 'Передний',
            fluids: {
                engine_oil: { volume: '4.3 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'G 052 182', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '7.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: '1.0 л', spec: 'G 002 000', viscosity: '-' },
                refrigerant: { volume: '600 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change', 'timing_chain', 'valve_cover_gasket', 'water_pump', 'thermostat', 'engine_mounts', 'gearbox_oil_change', 'mechatronic', 'clutch_replacement', 'dual_mass_flywheel', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'shock_absorbers', 'control_arm_bushings', 'wheel_bearings', 'tie_rods', 'steering_rack']
        },
        {
            id: 'vw_passat_b8_20tsi_4motion',
            model: 'Passat',
            generation: 'B8 (2015–н.в.)',
            engine: { code: 'DKZA', volume: '2.0 L', power: '220 л.с.', torque: '350 Нм' },
            gearbox: { code: 'DQ381', type: 'DSG (робот)', gears: 7 },
            drive: 'Полный (4Motion)',
            fluids: {
                engine_oil: { volume: '5.7 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'G 052 182', viscosity: '-' },
                transfer_case: { volume: '1.0 л', spec: 'G 052 145', viscosity: '-' },
                diff_front: null,
                diff_rear: { volume: '1.0 л', spec: 'G 052 145', viscosity: '-' },
                coolant: { volume: '7.5 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change', 'timing_chain', 'valve_cover_gasket', 'water_pump', 'thermostat', 'engine_mounts', 'gearbox_oil_change', 'mechatronic', 'clutch_replacement', 'dual_mass_flywheel', 'transfer_case_oil', 'diff_oil_rear', 'haldex_oil', 'haldex_filter', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'shock_absorbers', 'control_arm_bushings', 'wheel_bearings', 'tie_rods']
        },

        // ================= TIGUAN =================
        {
            id: 'vw_tiguan1_20tsi_4motion',
            model: 'Tiguan',
            generation: 'I (2007–2016)',
            engine: { code: 'CAWA', volume: '2.0 L', power: '170 л.с.', torque: '280 Нм' },
            gearbox: { code: 'Aisin', type: 'АКПП', gears: 6 },
            drive: 'Полный (4Motion)',
            fluids: {
                engine_oil: { volume: '4.3 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'G 052 162', viscosity: '-' },
                transfer_case: { volume: '1.0 л', spec: 'G 052 145', viscosity: '-' },
                diff_front: null,
                diff_rear: { volume: '1.0 л', spec: 'G 052 145', viscosity: '-' },
                coolant: { volume: '7.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: '1.0 л', spec: 'G 002 000', viscosity: '-' },
                refrigerant: { volume: '600 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change', 'timing_chain', 'valve_cover_gasket', 'water_pump', 'thermostat', 'engine_mounts', 'gearbox_oil_change', 'transfer_case_oil', 'diff_oil_rear', 'haldex_oil', 'haldex_filter', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'shock_absorbers', 'springs', 'control_arm_bushings', 'wheel_bearings', 'tie_rods']
        },
        {
            id: 'vw_tiguan2_20tsi_4motion',
            model: 'Tiguan',
            generation: 'II (2016–н.в.)',
            engine: { code: 'CZPA', volume: '2.0 L', power: '180 л.с.', torque: '320 Нм' },
            gearbox: { code: 'DQ381', type: 'DSG (робот)', gears: 7 },
            drive: 'Полный (4Motion)',
            fluids: {
                engine_oil: { volume: '5.7 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'G 052 182', viscosity: '-' },
                transfer_case: { volume: '1.0 л', spec: 'G 052 145', viscosity: '-' },
                diff_front: null,
                diff_rear: { volume: '1.0 л', spec: 'G 052 145', viscosity: '-' },
                coolant: { volume: '7.5 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change', 'timing_chain', 'valve_cover_gasket', 'water_pump', 'thermostat', 'engine_mounts', 'gearbox_oil_change', 'mechatronic', 'clutch_replacement', 'dual_mass_flywheel', 'transfer_case_oil', 'diff_oil_rear', 'haldex_oil', 'haldex_filter', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'shock_absorbers', 'control_arm_bushings', 'wheel_bearings', 'tie_rods']
        },

        // ================= TOUAREG =================
        {
            id: 'vw_touareg2_30tdi',
            model: 'Touareg',
            generation: 'II (2010–2018)',
            engine: { code: 'CJMA', volume: '3.0 L', power: '204 л.с.', torque: '400 Нм' },
            gearbox: { code: 'TR-80SD', type: 'АКПП (ZF)', gears: 8 },
            drive: 'Полный (4Motion Torsen)',
            fluids: {
                engine_oil: { volume: '8.0 л', spec: 'VW 507.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '9.0 л', spec: 'G 055 162', viscosity: '-' },
                transfer_case: { volume: '1.5 л', spec: 'G 052 145', viscosity: '-' },
                diff_front: { volume: '1.2 л', spec: 'G 052 145', viscosity: '-' },
                diff_rear: { volume: '1.5 л', spec: 'G 052 145', viscosity: '-' },
                coolant: { volume: '11.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: '1.2 л', spec: 'G 002 000', viscosity: '-' },
                refrigerant: { volume: '850 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'glow_plugs', 'fuel_filter', 'brake_fluid_change', 'coolant_change', 'timing_belt', 'water_pump', 'thermostat', 'engine_mounts', 'gearbox_oil_change', 'transfer_case_oil', 'diff_oil_front', 'diff_oil_rear', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'shock_absorbers', 'air_suspension', 'control_arm_bushings', 'wheel_bearings', 'tie_rods', 'steering_rack']
        },
        {
            id: 'vw_touareg3_30tdi',
            model: 'Touareg',
            generation: 'III (2018–н.в.)',
            engine: { code: 'CZRB', volume: '3.0 L', power: '249 л.с.', torque: '600 Нм' },
            gearbox: { code: 'TR-80SD', type: 'АКПП (ZF)', gears: 8 },
            drive: 'Полный (4Motion Torsen)',
            fluids: {
                engine_oil: { volume: '8.0 л', spec: 'VW 507.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '9.0 л', spec: 'G 055 162', viscosity: '-' },
                transfer_case: { volume: '1.5 л', spec: 'G 052 145', viscosity: '-' },
                diff_front: { volume: '1.2 л', spec: 'G 052 145', viscosity: '-' },
                diff_rear: { volume: '1.5 л', spec: 'G 052 145', viscosity: '-' },
                coolant: { volume: '11.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '850 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'glow_plugs', 'fuel_filter', 'brake_fluid_change', 'coolant_change', 'timing_belt', 'water_pump', 'thermostat', 'engine_mounts', 'gearbox_oil_change', 'transfer_case_oil', 'diff_oil_front', 'diff_oil_rear', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'shock_absorbers', 'air_suspension', 'control_arm_bushings', 'wheel_bearings', 'tie_rods']
        },

        // ================= TAOS =================
        {
            id: 'vw_taos_14tsi_4motion',
            model: 'Taos',
            generation: 'I (2021–н.в.)',
            engine: { code: 'DPCA', volume: '1.4 L', power: '150 л.с.', torque: '250 Нм' },
            gearbox: { code: 'Aisin', type: 'АКПП', gears: 8 },
            drive: 'Полный (4Motion)',
            fluids: {
                engine_oil: { volume: '4.0 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'G 052 162', viscosity: '-' },
                transfer_case: { volume: '1.0 л', spec: 'G 052 145', viscosity: '-' },
                diff_front: null,
                diff_rear: { volume: '1.0 л', spec: 'G 052 145', viscosity: '-' },
                coolant: { volume: '7.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change', 'timing_chain', 'valve_cover_gasket', 'water_pump', 'thermostat', 'engine_mounts', 'gearbox_oil_change', 'transfer_case_oil', 'diff_oil_rear', 'haldex_oil', 'haldex_filter', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'shock_absorbers', 'control_arm_bushings', 'wheel_bearings', 'tie_rods']
        },

        // ================= TERAMONT =================
        {
            id: 'vw_teramont_20tsi_4motion',
            model: 'Teramont',
            generation: 'I (2017–н.в.)',
            engine: { code: 'CXDB', volume: '2.0 L', power: '220 л.с.', torque: '350 Нм' },
            gearbox: { code: 'Aisin', type: 'АКПП', gears: 8 },
            drive: 'Полный (4Motion)',
            fluids: {
                engine_oil: { volume: '5.7 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'G 052 162', viscosity: '-' },
                transfer_case: { volume: '1.5 л', spec: 'G 052 145', viscosity: '-' },
                diff_front: { volume: '1.2 л', spec: 'G 052 145', viscosity: '-' },
                diff_rear: { volume: '1.5 л', spec: 'G 052 145', viscosity: '-' },
                coolant: { volume: '9.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '850 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change', 'timing_chain', 'valve_cover_gasket', 'water_pump', 'thermostat', 'engine_mounts', 'gearbox_oil_change', 'transfer_case_oil', 'diff_oil_front', 'diff_oil_rear', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'shock_absorbers', 'control_arm_bushings', 'wheel_bearings', 'tie_rods']
        },

        // ================= T-ROC =================
        {
            id: 'vw_troc_14tsi_4motion',
            model: 'T-Roc',
            generation: 'I (2017–н.в.)',
            engine: { code: 'CZDA', volume: '1.4 L', power: '150 л.с.', torque: '250 Нм' },
            gearbox: { code: 'DQ381', type: 'DSG (робот)', gears: 7 },
            drive: 'Полный (4Motion)',
            fluids: {
                engine_oil: { volume: '4.0 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'G 052 182', viscosity: '-' },
                transfer_case: { volume: '1.0 л', spec: 'G 052 145', viscosity: '-' },
                diff_front: null,
                diff_rear: { volume: '1.0 л', spec: 'G 052 145', viscosity: '-' },
                coolant: { volume: '7.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'spark_plugs', 'brake_fluid_change', 'coolant_change', 'timing_chain', 'valve_cover_gasket', 'water_pump', 'thermostat', 'gearbox_oil_change', 'mechatronic', 'clutch_replacement', 'transfer_case_oil', 'diff_oil_rear', 'haldex_oil', 'haldex_filter', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'shock_absorbers', 'control_arm_bushings', 'wheel_bearings', 'tie_rods']
        },

        // ================= CADDY =================
        {
            id: 'vw_caddy4_20tdi',
            model: 'Caddy',
            generation: 'IV (2015–2020)',
            engine: { code: 'CLCA', volume: '2.0 L', power: '110 л.с.', torque: '250 Нм' },
            gearbox: { code: 'DQ250', type: 'DSG (робот)', gears: 6 },
            drive: 'Передний',
            fluids: {
                engine_oil: { volume: '4.3 л', spec: 'VW 507.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'G 052 182', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '7.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '600 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'fuel_filter', 'glow_plugs', 'brake_fluid_change', 'coolant_change', 'timing_belt', 'water_pump', 'thermostat', 'engine_mounts', 'gearbox_oil_change', 'mechatronic', 'clutch_replacement', 'dual_mass_flywheel', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'shock_absorbers', 'springs', 'control_arm_bushings', 'wheel_bearings', 'tie_rods']
        },

        // ================= TRANSPORTER / MULTIVAN =================
        {
            id: 'vw_transporter_t6_20tdi',
            model: 'Transporter',
            generation: 'T6 (2015–2019)',
            engine: { code: 'DNAA', volume: '2.0 L', power: '150 л.с.', torque: '340 Нм' },
            gearbox: { code: 'DQ250', type: 'DSG (робот)', gears: 6 },
            drive: 'Передний',
            fluids: {
                engine_oil: { volume: '4.3 л', spec: 'VW 507.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'G 052 182', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '9.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: '1.0 л', spec: 'G 002 000', viscosity: '-' },
                refrigerant: { volume: '850 г', spec: 'R134a', viscosity: '-' }
            },
            works: ['oil_change', 'air_filter', 'cabin_filter', 'fuel_filter', 'glow_plugs', 'brake_fluid_change', 'coolant_change', 'timing_belt', 'water_pump', 'thermostat', 'engine_mounts', 'gearbox_oil_change', 'mechatronic', 'clutch_replacement', 'dual_mass_flywheel', 'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'shock_absorbers', 'springs', 'control_arm_bushings', 'wheel_bearings', 'tie_rods', 'steering_rack']
        }
    ]
};
