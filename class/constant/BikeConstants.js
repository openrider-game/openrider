export const // Bike
    BIKE_BMX = 'BMX',
    BIKE_MTB = 'MTB',
    BIKE_HAR = 'HAR',
    BMX_INITIAL_STATE = [
        [
            // head pos
            0, -1,
            // head oldpos
            0, -1,
            // head velocity
            0, 0,
            // backwheel pos
            -21, 38,
            // backwheel oldpos
            -21, 38,
            // backwheel velocity
            0, 0,
            // backwheel speedvalue
            0,
            // frontwheel pos
            21, 38,
            // frontwheel oldpos
            21, 38,
            // frontwheel velocity
            0, 0,
            // frontwheel speedvalue
            0,
            // headtoback length
            45,
            // fronttoback length
            42,
            // headtofront length
            45,
            // direction
            1,
            // gravity
            0, 0.3,
            // slow
            false,
            // targets reached
            0,
            // objects reached
            [],
            // time
            0
        ]
    ],
    MTB_INITIAL_STATE = [
        [2, -3, 2, -3, 0, 0, -23, 35, -23, 35, 0, 0, 0, 23, 35, 23, 35, 0, 0, 0, 47, 45, 45, 1, 0, 0.3, false, 0, [], 0]
    ],
    HAR_INITIAL_STATE = [
        [-5, 4.5, -5, 4.5, 0, 0, -23, 35, -23, 35, 0, 0, 0, 23, 35, 23, 35, 0, 0, 0, 35, 45, 45, 1, 0, 0.3, false, 0, [], 0]
    ];