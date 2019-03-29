import * as types from 'core/types';

export const isCoordEqual = ({ x, y }: types.Coord, coord: types.Coord): boolean =>
  x === coord.x && y === coord.y;

export const isArrIncludesCoord = (arr: types.Coord[], coord: types.Coord) =>
  arr.some(c => isCoordEqual(c, coord));
