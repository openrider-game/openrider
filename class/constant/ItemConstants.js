import Bomb from "../item/Bomb.js";
import SlowMo from "../item/SlowMo.js";
import Boost from "../item/directional/Boost.js";
import Checkpoint from "../item/reachable/Checkpoint.js";
import Gravity from "../item/directional/Gravity.js";
import Target from "../item/reachable/Target.js";
import TeleporterGroup from "../item/linked/TeleporterGroup.js";

export const
    ITEM_LIST = [Bomb, SlowMo, Boost, Checkpoint, Gravity, Target, TeleporterGroup],
    LINE = 'LINE',
    LINE_FOREGROUND = 'LINE_FOREGROUND';