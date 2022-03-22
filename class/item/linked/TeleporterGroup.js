import LinkedItemGroup from "../LinkedItemGroup.js";
import Teleporter from "./Teleporter.js";

export default class TeleporterGroup extends LinkedItemGroup {
    static get itemClass() { return Teleporter; }
}