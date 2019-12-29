/* eslint-disable no-plusplus,no-console,no-constant-condition,no-throw-literal,no-restricted-syntax,max-len */
import Tile from './SudokuTile';

const coordToIndex = (row, col) => col + 9 * row;

const indexToCoord = (idx) => {
  const col = idx % 9;
  const row = Math.floor(idx / 9);
  return {
    col,
    row,
  };
};

export default class Board {
  tiles;

  solutions;

  calls;

  head;

  stop;

  update;

  constructor() {
    this.tiles = Board.initTiles();
    this.solved = false;
    this.resetTemporary();
  }

  getRows() {
    return this.reduceTiles('row');
  }

  getCols() {
    return this.reduceTiles('col');
  }

  getBoxes() {
    return this.reduceTiles('box');
  }

  getUsedNumbers(tile) {
    const row = this.getTilesWhere('row', tile.row);
    const col = this.getTilesWhere('col', tile.col);
    const box = this.getTilesWhere('box', tile.box);
    const values = row.concat(col, box)
      .filter(t => t.value !== null || t.temporary !== null)
      .map(t => t.value || t.temporary);
    return [...new Set(values)].sort();
  }

  getAvailableNumbers(tile) {
    if (tile.value) {
      return [];
    }
    const all = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const used = this.getUsedNumbers(tile);
    return all.filter(number => used.indexOf(number) === -1 && tile.tried.indexOf(number) === -1);
  }

  setValues(values) {
    for (let i = 0; i < values.length; i++) {
      this.tiles[i].value = values[i] || null;
    }
  }

  resetTemporary() {
    for (let i = 0; i < 81; i++) {
      this.tiles[i].temporary = null;
    }
  }

  isSolved() {
    return !this.getValues()
      .some(value => !value);
  }

  solve() {
    this.resetTemporary();
    this.solutions = [];
    this.calls = 0;
    this.stop = false;
    this.solved = false;
    this.orderByAvailable();
    this.forwardToNextUnsolved();
    this.solveBacktracking();
  }

  orderByAvailable() {
    const ordered = this.tiles.slice()
      .map(tile => {
        tile.available = this.getAvailableNumbers(tile);
        return tile;
      })
      .sort((a,b) => {
        return a.available.length - b.available.length;
      });
    // const ordered = this.tiles;
    ordered.forEach(tile => {
      if (!this.head) {
        this.head = tile;
      } else {
        this.head.next = tile;
        tile.prev = this.head;
        this.head = tile;
      }
    });
    // rewind
    while (this.head.prev) {
      this.head = this.head.prev;
    }
  }

  solveBacktracking() {
    if (this.stop) {
      return;
    }
    const fn = () => {
      this.calls++;
      const available = this.getAvailableNumbers(this.head);
      if (!available.length) {
        this.backtrack();
      } else {
        const number = available[0];
        this.tryNumber(this.head, number);
        if (this.isSolved()) {
          this.onSolved();
          return;
        }
        this.forwardToNextUnsolved();
      }
      this.solveBacktracking();
    };
    if (this.calls % 500 === 0) {
      setTimeout(fn, 0);
    } else {
      fn();
    }
  }

  forwardToNextUnsolved() {
    while (true) {
      if (!this.head.value && !this.head.temporary) {
        break;
      }
      this.head = this.head.next;
    }
  }

  backtrack() {
    this.head.tried = [];
    this.head.temporary = null;
    while (true) {
      if (!this.head.prev) {
        debugger;
      }
      this.head = this.head.prev;
      if (!this.head.value) {
        const available = this.getAvailableNumbers(this.head);
        if (available.length) {
          break;
        }
        this.head.tried = [];
        this.head.temporary = null;
      }
    }
  }

  onSolved() {
    this.stop = true;
    this.solved = true;
    // for (let i = 0; i < this.tiles.length; i++) {
    //   const tile = this.tiles[i];
    //   if (!tile.value) {
    //     this.tiles[i].value = tile.temporary;
    //   }
    // }
  }

  tryNumber(tile, number) {
    const idx = this.getIdx(tile.id);
    this.tiles[idx].temporary = number;
    this.tiles[idx].tried.push(number);
  }

  getTemporary(id) {
    return this.tiles[this.getIdx(id)].temporary;
  }

  getIdx(id) {
    return this.tiles.findIndex(tile => tile.id === id);
  }

  getValues() {
    return this.tiles.map(tile => tile.value || tile.temporary);
  }

  getFirstUnsolved() {
    return this.tiles.find(tile => !tile.value && !tile.temporary);
  }

  getUnsolved() {
    return this.tiles.filter(tile => !tile.value && !tile.temporary);
  }

  reduceTiles(attr) {
    return this.tiles.reduce((result, tile) => {
      if (!result[tile[attr]]) {
        result[tile[attr]] = [];
      }
      result[tile[attr]].push(tile);
      return result;
    }, {});
  }

  getTilesWhere(attr, value, except) {
    return this.tiles.filter(tile => tile[attr] === value && (typeof except === 'undefined' ? true : tile.id !== except));
  }

  static initTiles() {
    const tiles = [];
    let count = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const tile = new Tile(count++, row, col);
        tiles.push(tile);
      }
    }
    // Link
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      const { row, col } = indexToCoord(i);
      if (row > 0) {
        tile.up = tiles[coordToIndex(row - 1, col)];
      }
      if (col > 0) {
        tile.left = tiles[coordToIndex(row, col - 1)];
      }
      if (row < 8) {
        tile.down = tiles[coordToIndex(row + 1, col)];
      }
      if (col < 8) {
        tile.right = tiles[coordToIndex(row, col + 1)];
      }
      tiles[i] = tile;
    }
    return tiles;
  }
}
