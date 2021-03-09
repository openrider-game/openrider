import CameraTool from "../tool/CameraTool.js";
import EmptyTool from "../tool/EmptyTool.js";
import BombTool from "../tool/item/BombTool.js";
import CheckpointTool from "../tool/item/CheckpointTool.js";
import SlowMoTool from "../tool/item/SlowMoTool.js";
import TargetTool from "../tool/item/TargetTool.js";
import BoostTool from "../tool/item/BoostTool.js";
import GravityTool from "../tool/item/GravityTool.js";
import FullscreenTool from "../tool/FullscreenTool.js";
import EraserTool from "../tool/EraserTool.js";
import PauseTool from "../tool/PauseTool.js";
import RestartTool from "../tool/RestartTool.js";
import CancelCheckpointTool from "../tool/CancelCheckpointTool.js";
import UndoTool from "../tool/UndoTool.js";
import RedoTool from "../tool/RedoTool.js";
import SolidLineTool from "../tool/item/line/SolidLineTool.js";
import SceneryLineTool from "../tool/item/line/SceneryLineTool.js";
import SolidBrushTool from "../tool/item/line/SolidBrushTool.js";
import SceneryBrushTool from "../tool/item/line/SceneryBrushTool.js";
import GridSnapTool from "../tool/GridSnapTool.js";
import SwitchBikeTool from "../tool/SwitchBikeTool.js";
import FocusGhostTool from "../tool/FocusGhostTool.js";
import StartPositionTool from "../tool/StartPositionTool.js";

export const
    LEFT_TOOLBAR_VIEWING = [PauseTool, RestartTool, CancelCheckpointTool, EmptyTool, SwitchBikeTool, FocusGhostTool, EmptyTool, CameraTool, FullscreenTool],
    LEFT_TOOLBAR_EDITING = [PauseTool, RestartTool, CancelCheckpointTool, EmptyTool, SwitchBikeTool, FocusGhostTool, EmptyTool, CameraTool, FullscreenTool, EmptyTool, UndoTool, RedoTool],
    RIGHT_TOOLBAR = [SolidBrushTool, SceneryBrushTool, SolidLineTool, SceneryLineTool, EraserTool, GridSnapTool, EmptyTool, TargetTool, CheckpointTool, BoostTool, GravityTool, BombTool, SlowMoTool, EmptyTool, StartPositionTool];