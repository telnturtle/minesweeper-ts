import { Coord, FieldCell } from 'core/types';
import { isCoordEqual } from 'core/auxs';

export const RATES = { easy: 0.12, common: 0.16, hard: 0.2 };

const generateMines = (x: number, y: number, rate: number = RATES.easy): Coord[] => {
  // const generateMine(x: number, y: number, rate: number): [number, number][] => {
  let mines = Math.floor(x * y * rate);
  let tuples: Coord[] = [];
  while (mines > 0) {
    const tuple = { x: Math.floor(Math.random() * x), y: Math.floor(Math.random() * y) };
    if (!tuples.some(v => isCoordEqual(v, tuple))) {
      tuples.push(tuple);
      mines = mines - 1;
    }
  }
  return tuples;
};

const generateCells = (x: number, y: number, mines: Coord[]): FieldCell[][] => {
  let acc: FieldCell[][] = [];
  for (let i = 0; i < x; i += 1) {
    let _acc_: FieldCell[] = [];
    for (let j = 0; j < y; j += 1) {
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
  rate: number = RATES.easy
): FieldCell[][] => {
  const mines = generateMines(x, y, rate);
  return generateCells(x, y, mines);
};
