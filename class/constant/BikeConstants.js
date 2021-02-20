import BMX from "../bike/instance/BMX.js";
import MTB from "../bike/instance/MTB.js";
import BMXRenderer from "../bike/instance/renderer/BMXRenderer.js";
import MTBRenderer from "../bike/instance/renderer/MTBRenderer.js";

export const
    BIKE_MAP = { 'BMX': BMX, 'MTB': MTB },
    SWITCH_MAP = { 'BMX': MTB, 'MTB': BMX },
    RENDERER_MAP = { 'BMX': BMXRenderer, 'MTB': MTBRenderer };