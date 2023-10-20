import Bomb from "../item/Bomb.js";
import SlowMo from "../item/SlowMo.js";
import Boost from "../item/directional/Boost.js";
import Checkpoint from "../item/reachable/Checkpoint.js";
import Gravity from "../item/directional/Gravity.js";
import Target from "../item/reachable/Target.js";
import Teleporter from "../item/linked/Teleporter.js";

export const
    ITEM_LIST = [Bomb, SlowMo, Boost, Checkpoint, Gravity, Target, Teleporter],
    LINE = 'LINE',
    LINE_FOREGROUND = 'LINE_FOREGROUND',
    MODIFIERS = {
        INVINCIBILITY: 1 << 0,
        NO_STEER: 1 << 1
    };