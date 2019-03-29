import { Coord, FieldCell } from 'core/types';
import { isCoordEqual } from 'core/auxs';

export const RATES = { easy: 0.12, common: 0.16, hard: 0.2 };

const generateMines = (x: number, y: number, rate: number, cleanCell: Coord): Coord[] => {
  let mineCount = Math.floor(x * y * rate);
  let mines: Coord[] = [];
  while (mineCount > 0) {
    const mine = { x: Math.floor(Math.random() * x), y: Math.floor(Math.random() * y) };
    if (!isCoordEqual(cleanCell, mine) && !mines.some(v => isCoordEqual(v, mine))) {
      mines.push(mine);
      mineCount -= 1;
    }
  }
  return mines;
};

const generateCells = (x: number, y: number, mines: Coord[]): FieldCell[][] => {
  let acc: FieldCell[][] = [];
  for (let i = 1; i <= x; i += 1) {
    let _acc_: FieldCell[] = [];
    for (let j = 1; j <= y; j += 1) {
      const _coord_ = { x: i, y: j };
      if (mines.some(v => isCoordEqual(_coord_, v))) {
        _acc_.push({ ..._coord_, mine: true });
      } else {
        _acc_.push({ ..._coord_, mine: false });
      }
    }
    acc.push(_acc_);
  }
  return acc;
};

export const generate = (
  x: number = 10,
  y: number = 18,
  rate: number = RATES.easy,
  cleanCell: Coord = { x: 1, y: 1 }
): FieldCell[][] => {
  const mines = generateMines(x, y, rate, cleanCell);
  return generateCells(x, y, mines);
};
