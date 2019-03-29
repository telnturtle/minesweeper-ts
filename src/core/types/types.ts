export interface Coord {
  x: number;
  y: number;
}

export interface FieldCell {
  x: number;
  y: number;
  mine: boolean;
}

export type Field = FieldCell[][];