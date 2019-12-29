export default class Tile {
  id;

  row;

  col;

  box;

  available;

  value;

  up;

  down;

  left;

  right;

  temporary;

  tried;

  next;

  prev;

  constructor(id, row, col) {
    this.id = id;
    this.row = row;
    this.col = col;
    this.box = this.calculateBox();
    this.value = null;
    this.temporary = null;
    this.available = [];
    this.tried = [];
  }

  calculateBox() {
    const horizontal = Math.floor(this.col / 3);
    const vertical = Math.floor(this.row / 3);
    return horizontal + (vertical * 3);
  }

  getValue() {
    return this.value || this.temporary;
  }
}
