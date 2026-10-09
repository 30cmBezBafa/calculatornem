// ============================================
// БАЗА PORSCHE (v1: схема паспорта)
// ВНИМАНИЕ: коды CTBA/CTCA/CWDA сверить при первом обслуживании
// ============================================
const porscheDB = {
    brand: 'Porsche',
    modifications: [
        {
            id: 'porsche_macan_20', model: 'Macan', generation: '95B (2014–2021)',
            engine: { code: 'CNCA', volume: '2.0 L', power: '237 л.с.', torque: '350 Нм' },
            gearbox: { code: 'PDK', type: 'PDK (робот)', gears: 7 },
            drive: 'Полный (PTM)', awdSys: 'ptm',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'hood', pf: false,
            fluids: {
                engine_oil: { volume: '5.7 л', spec: 'VW 502.00', viscosity: '5W-40' },
                gearbox_oil: { volume: '7.4 л', spec: 'VW G 052 529', viscosity: '-' },
                transfer_case: null, diff_front: { volume: '0.9 л', spec: 'VW G 055 145', viscosity: '-' }, diff_rear: { volume: '1.0 л', spec: 'VW G 055 145', viscosity: '-' },
                coolant: { volume: '9.0 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '650 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.8, 'spark_plugs': 1.2, 'timing_chain': 7.0, 'water_pump': 3.2, 'thermostat': 2.4, 'turbo_replacement': 4.0, 'intake_clean_carbon': 4.5, 'hp_fuel_pump': 1.8, 'oil_pan': 3.4, 'crank_seal_rear': 5.0, 'gearbox_oil_change': 1.4, 'mechatronic': 6.0, 'clutch_replacement': 6.5, 'dsg_adaptation': 0.5, 'brake_pads_front': 0.8, 'brake_pads_rear': 1.1, 'brake_discs_front': 1.5, 'brake_discs_rear': 1.8, 'wheel_bearings': 2.6, 'steering_rack': 4.5, 'alternator': 3.0, 'starter': 3.0, 'battery_hood': 0.6, 'ac_compressor': 3.5, 'radiator_main': 3.0, 'wheel_alignment': 1.2, 'propshaft': 3.0, 'diff_oil_rear': 0.6, 'driveshaft_front_left': 1.8, 'driveshaft_front_right': 1.8, 'driveshaft_rear_left': 2.0, 'driveshaft_rear_right': 2.0 }
        },
        {
            id: 'porsche_macan_s', model: 'Macan S', generation: '95B (2014–2021)',
            engine: { code: 'CTBA', volume: '3.0 L', power: '340 л.с.', torque: '460 Нм' },
            gearbox: { code: 'PDK', type: 'PDK (робот)', gears: 7 },
            drive: 'Полный (PTM)', awdSys: 'ptm',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'hood', pf: false,
            fluids: {
                engine_oil: { volume: '6.5 л', spec: 'VW 502.00', viscosity: '5W-40' },
                gearbox_oil: { volume: '7.4 л', spec: 'VW G 052 529', viscosity: '-' },
                transfer_case: null, diff_front: { volume: '0.9 л', spec: 'VW G 055 145', viscosity: '-' }, diff_rear: { volume: '1.0 л', spec: 'VW G 055 145', viscosity: '-' },
                coolant: { volume: '9.5 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '650 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.9, 'spark_plugs': 1.4, 'timing_chain': 7.5, 'water_pump': 3.4, 'thermostat': 2.5, 'turbo_replacement': 4.5, 'intake_clean_carbon': 5.0, 'hp_fuel_pump': 2.0, 'oil_pan': 3.6, 'crank_seal_rear': 5.5, 'gearbox_oil_change': 1.4, 'mechatronic': 6.0, 'clutch_replacement': 6.5, 'dsg_adaptation': 0.5, 'brake_pads_front': 0.9, 'brake_pads_rear': 1.2, 'brake_discs_front': 1.6, 'brake_discs_rear': 1.9, 'wheel_bearings': 2.8, 'steering_rack': 4.8, 'alternator': 3.2, 'starter': 3.2, 'battery_hood': 0.6, 'ac_compressor': 3.6, 'radiator_main': 3.2, 'wheel_alignment': 1.2, 'propshaft': 3.2, 'diff_oil_rear': 0.6, 'driveshaft_front_left': 1.8, 'driveshaft_front_right': 1.8, 'driveshaft_rear_left': 2.0, 'driveshaft_rear_right': 2.0 }
        },
        {
            id: 'porsche_macan_gts', model: 'Macan GTS', generation: '95B (2015–2021)',
            engine: { code: 'CTCA', volume: '3.6 L', power: '360 л.с.', torque: '500 Нм' },
            gearbox: { code: 'PDK', type: 'PDK (робот)', gears: 7 },
            drive: 'Полный (PTM)', awdSys: 'ptm',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'hood', pf: false,
            fluids: {
                engine_oil: { volume: '6.5 л', spec: 'VW 502.00', viscosity: '5W-40' },
                gearbox_oil: { volume: '7.4 л', spec: 'VW G 052 529', viscosity: '-' },
                transfer_case: null, diff_front: { volume: '0.9 л', spec: 'VW G 055 145', viscosity: '-' }, diff_rear: { volume: '1.0 л', spec: 'VW G 055 145', viscosity: '-' },
                coolant: { volume: '9.5 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '650 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.9, 'spark_plugs': 1.4, 'timing_chain': 7.5, 'water_pump': 3.4, 'thermostat': 2.5, 'turbo_replacement': 4.5, 'intake_clean_carbon': 5.0, 'hp_fuel_pump': 2.0, 'oil_pan': 3.6, 'crank_seal_rear': 5.5, 'gearbox_oil_change': 1.4, 'mechatronic': 6.0, 'clutch_replacement': 6.5, 'dsg_adaptation': 0.5, 'brake_pads_front': 0.9, 'brake_pads_rear': 1.2, 'brake_discs_front': 1.6, 'brake_discs_rear': 1.9, 'wheel_bearings': 2.8, 'steering_rack': 4.8, 'alternator': 3.2, 'starter': 3.2, 'battery_hood': 0.6, 'ac_compressor': 3.6, 'radiator_main': 3.2, 'wheel_alignment': 1.2, 'propshaft': 3.2, 'diff_oil_rear': 0.6, 'driveshaft_front_left': 1.8, 'driveshaft_front_right': 1.8, 'driveshaft_rear_left': 2.0, 'driveshaft_rear_right': 2.0 }
        },
        {
            id: 'porsche_cayenne_30tdi', model: 'Cayenne', generation: '958 (2010–2017)',
            engine: { code: 'CVWA', volume: '3.0 L', power: '245 л.с.', torque: '550 Нм' },
            gearbox: { code: '8AT', type: 'АКПП (гидротрансформатор)', gears: 8 },
            drive: 'Полный (PTM)', awdSys: 'torsen',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'seat', pf: true,
            fluids: {
                engine_oil: { volume: '8.0 л', spec: 'VW 507.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '9.0 л', spec: 'VW G 055 025', viscosity: '-' },
                transfer_case: { volume: '1.0 л', spec: 'VW G 055 145', viscosity: '-' }, diff_front: { volume: '1.5 л', spec: 'VW G 055 145', viscosity: '-' }, diff_rear: { volume: '1.1 л', spec: 'VW G 055 145', viscosity: '-' },
                coolant: { volume: '11.0 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '700 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 1.0, 'glow_plugs': 2.0, 'timing_chain': 10.0, 'water_pump': 3.8, 'thermostat': 2.8, 'turbo_replacement': 5.0, 'intake_manifold': 4.0, 'intake_clean_carbon': 5.0, 'egr_valve': 2.5, 'dpf_replace': 4.0, 'injectors_diesel': 4.0, 'hp_fuel_pump': 3.0, 'oil_pan': 4.0, 'crank_seal_rear': 6.0, 'gearbox_oil_change': 1.6, 'brake_pads_front': 1.0, 'brake_pads_rear': 1.3, 'brake_discs_front': 1.8, 'brake_discs_rear': 2.0, 'wheel_bearings': 3.0, 'steering_rack': 5.0, 'alternator': 3.5, 'starter': 3.5, 'battery_under_seat': 1.0, 'ac_compressor': 4.0, 'radiator_main': 3.5, 'wheel_alignment': 1.3, 'propshaft': 3.5, 'transfer_case_oil': 0.6, 'diff_oil_front': 0.6, 'diff_oil_rear': 0.6 }
        },
        {
            id: 'porsche_cayenne_36', model: 'Cayenne', generation: '958 (2010–2017)',
            engine: { code: 'CWDA', volume: '3.6 L', power: '300 л.с.', torque: '400 Нм' },
            gearbox: { code: '8AT', type: 'АКПП (гидротрансформатор)', gears: 8 },
            drive: 'Полный (PTM)', awdSys: 'torsen',
            suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'seat', pf: false,
            fluids: {
                engine_oil: { volume: '7.5 л', spec: 'VW 502.00', viscosity: '5W-40' },
                gearbox_oil: { volume: '9.0 л', spec: 'VW G 055 025', viscosity: '-' },
                transfer_case: { volume: '1.0 л', spec: 'VW G 055 145', viscosity: '-' }, diff_front: { volume: '1.5 л', spec: 'VW G 055 145', viscosity: '-' }, diff_rear: { volume: '1.1 л', spec: 'VW G 055 145', viscosity: '-' },
                coolant: { volume: '11.0 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '700 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 1.0, 'spark_plugs': 1.6, 'timing_chain': 9.5, 'water_pump': 3.6, 'thermostat': 2.6, 'intake_manifold': 3.8, 'oil_pan': 4.0, 'crank_seal_rear': 6.0, 'gearbox_oil_change': 1.6, 'brake_pads_front': 1.0, 'brake_pads_rear': 1.3, 'brake_discs_front': 1.8, 'brake_discs_rear': 2.0, 'wheel_bearings': 3.0, 'steering_rack': 5.0, 'alternator': 3.5, 'starter': 3.5, 'battery_under_seat': 1.0, 'ac_compressor': 4.0, 'radiator_main': 3.5, 'wheel_alignment': 1.3, 'propshaft': 3.5, 'transfer_case_oil': 0.6, 'diff_oil_front': 0.6, 'diff_oil_rear': 0.6 }
        }
    ]
};
