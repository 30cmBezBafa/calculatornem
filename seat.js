// ============================================
// БАЗА SEAT (v1: схема паспорта)
// ============================================
const seatDB = {
    brand: 'SEAT',
    modifications: [
        {
            id: 'seat_leon3_14tsi', model: 'Leon', generation: 'III (2012–2020)',
            engine: { code: 'CZDA', volume: '1.4 L', power: '150 л.с.', torque: '250 Нм' },
            gearbox: { code: 'DQ200', type: 'DSG (робот)', gears: 7 },
            drive: 'Передний', suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'hood', pf: false,
            fluids: {
                engine_oil: { volume: '4.0 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'VW G 052 512', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '7.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.5, 'spark_plugs': 0.6, 'timing_belt': 3.4, 'water_pump': 2.4, 'thermostat': 1.5, 'turbo_replacement': 3.0, 'intake_clean_carbon': 3.5, 'hp_fuel_pump': 1.2, 'oil_pan': 2.5, 'crank_seal_rear': 3.5, 'gearbox_oil_change': 0.9, 'mechatronic': 4.5, 'clutch_replacement': 5.0, 'dsg_adaptation': 0.3, 'brake_pads_front': 0.5, 'brake_pads_rear': 0.8, 'brake_discs_front': 1.0, 'brake_discs_rear': 1.3, 'wheel_bearings': 1.9, 'steering_rack': 3.2, 'alternator': 2.0, 'starter': 1.8, 'battery_hood': 0.4, 'ac_compressor': 2.6, 'radiator_main': 2.2, 'wheel_alignment': 1.0 }
        },
        {
            id: 'seat_leon3_16mpi', model: 'Leon', generation: 'III (2012–2020)',
            engine: { code: 'CWVA', volume: '1.6 L', power: '110 л.с.', torque: '155 Нм' },
            gearbox: { code: '02T', type: 'МКПП', gears: 5 },
            drive: 'Передний', suspension: 'spring', rear: 'multilink', parking: 'mech', battery: 'hood', pf: false,
            fluids: {
                engine_oil: { volume: '3.6 л', spec: 'VW 502.00', viscosity: '5W-40' },
                gearbox_oil: { volume: '2.0 л', spec: 'VW G 052 512', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '5.5 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '450 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.4, 'spark_plugs': 0.5, 'timing_belt': 3.0, 'water_pump': 1.6, 'thermostat': 1.2, 'intake_manifold': 1.5, 'injectors_petrol': 1.0, 'oil_pan': 2.0, 'crank_seal_rear': 3.0, 'gearbox_oil_change': 0.4, 'clutch_replacement_manual': 3.5, 'brake_pads_front': 0.4, 'brake_pads_rear': 0.5, 'brake_discs_front': 0.8, 'brake_discs_rear': 1.0, 'wheel_bearings': 1.6, 'steering_rack': 2.6, 'alternator': 1.6, 'starter': 1.5, 'battery_hood': 0.3, 'handbrake_cables': 1.2, 'ac_compressor': 2.4, 'radiator_main': 2.0, 'wheel_alignment': 1.0 }
        },
        {
            id: 'seat_ibiza4_16mpi', model: 'Ibiza', generation: 'IV (2008–2017)',
            engine: { code: 'CWVA', volume: '1.6 L', power: '110 л.с.', torque: '155 Нм' },
            gearbox: { code: '02T', type: 'МКПП', gears: 5 },
            drive: 'Передний', suspension: 'spring', rear: 'beam', parking: 'mech', battery: 'hood', pf: false,
            fluids: {
                engine_oil: { volume: '3.6 л', spec: 'VW 502.00', viscosity: '5W-40' },
                gearbox_oil: { volume: '2.0 л', spec: 'VW G 052 512', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '5.5 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '450 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.4, 'spark_plugs': 0.5, 'timing_belt': 3.0, 'water_pump': 1.5, 'thermostat': 1.1, 'intake_manifold': 1.4, 'injectors_petrol': 1.0, 'oil_pan': 2.0, 'crank_seal_rear': 3.0, 'gearbox_oil_change': 0.4, 'clutch_replacement_manual': 3.2, 'brake_pads_front': 0.4, 'brake_pads_rear': 0.5, 'brake_discs_front': 0.8, 'brake_discs_rear': 1.0, 'wheel_bearings': 1.5, 'steering_rack': 2.4, 'alternator': 1.5, 'starter': 1.4, 'battery_hood': 0.3, 'handbrake_cables': 1.1, 'ac_compressor': 2.2, 'radiator_main': 1.9, 'wheel_alignment': 1.0 }
        },
        {
            id: 'seat_ateca_14tsi', model: 'Ateca', generation: 'KH (2016–2024)',
            engine: { code: 'CZDA', volume: '1.4 L', power: '150 л.с.', torque: '250 Нм' },
            gearbox: { code: 'DQ250', type: 'DSG (робот)', gears: 6 },
            drive: 'Передний', suspension: 'spring', rear: 'multilink', parking: 'epb', battery: 'hood', pf: false,
            fluids: {
                engine_oil: { volume: '4.5 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'VW G 052 182', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '7.5 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '550 г', spec: 'R134a', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.6, 'spark_plugs': 0.7, 'timing_belt': 3.6, 'water_pump': 2.6, 'thermostat': 1.6, 'turbo_replacement': 3.2, 'intake_clean_carbon': 3.8, 'hp_fuel_pump': 1.3, 'oil_pan': 2.8, 'crank_seal_rear': 3.8, 'gearbox_oil_change': 1.0, 'mechatronic': 4.5, 'clutch_replacement': 5.0, 'dsg_adaptation': 0.3, 'brake_pads_front': 0.6, 'brake_pads_rear': 0.9, 'brake_discs_front': 1.1, 'brake_discs_rear': 1.4, 'wheel_bearings': 2.1, 'steering_rack': 3.4, 'alternator': 2.2, 'starter': 2.0, 'battery_hood': 0.4, 'ac_compressor': 2.8, 'radiator_main': 2.3, 'wheel_alignment': 1.0 }
        },
        {
            id: 'seat_arona_10tsi', model: 'Arona', generation: 'KJ (2017–2024)',
            engine: { code: 'DKLA', volume: '1.0 L', power: '115 л.с.', torque: '200 Нм' },
            gearbox: { code: 'DQ200', type: 'DSG (робот)', gears: 7 },
            drive: 'Передний', suspension: 'spring', rear: 'beam', parking: 'mech', battery: 'hood', pf: false,
            fluids: {
                engine_oil: { volume: '4.0 л', spec: 'VW 508.00', viscosity: '0W-20' },
                gearbox_oil: { volume: '1.7 л', spec: 'VW G 052 512', viscosity: '-' },
                transfer_case: null, diff_front: null, diff_rear: null,
                coolant: { volume: '6.5 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '480 г', spec: 'R1234yf', viscosity: '-' }
            },
            customNh: { 'oil_change': 0.4, 'spark_plugs': 0.6, 'timing_belt': 3.2, 'water_pump': 2.0, 'thermostat': 1.3, 'turbo_replacement': 2.8, 'intake_clean_carbon': 3.2, 'hp_fuel_pump': 1.1, 'oil_pan': 2.2, 'crank_seal_rear': 3.2, 'gearbox_oil_change': 0.9, 'mechatronic': 4.5, 'clutch_replacement': 5.0, 'dsg_adaptation': 0.3, 'brake_pads_front': 0.4, 'brake_pads_rear': 0.6, 'brake_discs_front': 0.9, 'brake_discs_rear': 1.1, 'wheel_bearings': 1.7, 'steering_rack': 2.8, 'alternator': 1.8, 'starter': 1.6, 'battery_hood': 0.3, 'handbrake_cables': 1.1, 'ac_compressor': 2.4, 'radiator_main': 2.0, 'wheel_alignment': 1.0 }
        }
    ]
};
