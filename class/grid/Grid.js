import Vector from "../numeric/Vector.js";
import Cell from "./cell/Cell.js";

export default class Grid {
    constructor(cellSize, cellClass) {
        this.cells = new Map();

        this.cellSize = cellSize;
        this.cellClass = cellClass;
    }

    getKey(x, y) {
        return `${x},${y}`;
    }

    has(x, y) {
        return !!this.cells.has(this.getKey(x, y));
    }

    cell(x, y) {
        let key = this.getKey(x, y);

        if (!this.has(x, y)) {
            let cellX = x * this.cellSize;
            let cellY = y * this.cellSize;
            let cellClass = this.cellClass;

            this.cells.set(key, new cellClass(cellX, cellY, this.cellSize));
        }

        return this.cells.get(key);
    }

    add(item) {
        this.getCellsForItem(item).forEach(
            /**
             * @param {Cell} cell
             */
            cell => {
                cell.push(item);
            }
        );
    }

    remove(item) {
        this.getCellsForItem(item).forEach(
            /**
             * @param {Cell} cell
             */
            cell => {
                cell.remove(item);
            });
    }

    getCellsForItem(item) {
        return Grid.spread(item.pos, item.endPos, this.cellSize).reduce((cells, vec) => {
            let gridCoords = Grid.gridCoords(vec, this.cellSize);
            cells.push(this.cell(gridCoords.x, gridCoords.y));
            return cells;
        }, []);
    }

    static gridCoords(vec, cellSize) {
        return new Vector(Math.floor(vec.x / cellSize), Math.floor(vec.y / cellSize));
    }

    /**
     *
     * @param {Vector} _from
     * @param {Vector} _to
     * @param {number} cellSize
     */
    static spread(_from, _to, cellSize) {
        if (!Grid.spreadCache.has(cellSize)) {
            Grid.spreadCache.set(cellSize, new Map());
        }

        let currentCache = Grid.spreadCache.get(cellSize);
        let key = _from + ';' + _to;

        if (currentCache.has(key)) {
            return currentCache.get(key);
        }

        if (_from.x === _to.x && _from.y === _to.y) {
            currentCache.set(key, [new Vector(_from.x, _from.y)]);
            return currentCache.get(key);
        }

        currentCache.set(key, []);

        let currentLineCache = currentCache.get(key);

        const getFirstGridCoord = (sign, coord) => {
            if (sign < 0) {
                return Math.round(Math.ceil((coord + 1) / cellSize + sign) * cellSize) - 1;
            }
            return Math.round(Math.floor(coord / cellSize + sign) * cellSize);
        };

        let from = _from.clone();
        let factor = (_to.y - from.y) / (_to.x - from.x);
        let signX = _from.x < _to.x ? 1 : -1;
        let signY = _from.y < _to.y ? 1 : -1;
        let i = 0;

        currentLineCache.push(_from);

        let toGrid = Grid.gridCoords(_to, cellSize);

        while (i < 5000) {
            let fromGrid = Grid.gridCoords(from, cellSize);
            if (fromGrid.x === toGrid.x && fromGrid.y === toGrid.y) {
                break;
            }

            let to1X = getFirstGridCoord(signX, from.x);
            let to1Y = Math.round(_from.y + (to1X - _from.x) * factor);
            let to1 = new Vector(to1X, to1Y);

            let to2Y = getFirstGridCoord(signY, from.y);
            let to2X = Math.round(_from.x + (to2Y - _from.y) / factor);
            let to2 = new Vector(to2X, to2Y);

            let diff1 = _from.sub(to1);
            let diff2 = _from.sub(to2);
            if (diff1.x ** 2 + diff1.y ** 2 < diff2.x ** 2 + diff2.y ** 2) {
                from = to1;
            } else {
                from = to2;
            }

            currentLineCache.push(from);

            i++;
        }

        return currentLineCache;
    }
}

Grid.spreadCache = new Map();