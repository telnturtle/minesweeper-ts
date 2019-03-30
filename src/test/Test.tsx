import React, { Component } from 'react';

// cores
import { generate, RATES, aroundCoords } from '../core/mine';

// types
import { FieldCell, Coord, Field, MapCell, Map } from 'core/types';

// auxs
import { isCoordEqual, isArrIncludesCoord } from '../core/auxs';

interface State {
  string: string;
  opened: Coord[];
}

// constructor에서 this.state: State = {}를 사용하려면 선언을 다음과 같은 형식으로 해 줘야 함:
// Component<any, State>
export default class Test extends Component<any> {
  state: State = { string: 'hello', opened: [] };
  map1_number: string = '';
  map1_mine: string = '';
  map2_number: string = '';
  map2_mine: string = '';
  field1: Field = [[]];
  field2: Field = [[]];

  componentDidMount() {
    this.field1 = generate(5, 5, RATES.normal, { x: 2, y: 2 });
    this.map1_number = this.renderFieldNumber(this.field1);
    this.map1_mine = this.renderFieldMine(this.field1);
    console.log(this.map1_number);
    console.log(this.map1_mine);

    const initialClickCoord = { x: 5, y: 10 };
    console.log('\n\n5, 10, normal ');
    this.field2 = generate(10, 18, RATES.normal, initialClickCoord);
    this.map2_number = this.renderFieldNumber(this.field2);
    this.map2_mine = this.renderFieldMine(
      this.field2,
      // this.getCleanCellsByCoord(initialClickCoord, this.field2, [])
      []
    );
    console.log(this.map2_number);
    console.log(this.map2_mine);
    console.log('8, 16 , ', this.getMineCountByCoord({ x: 8, y: 16 }, this.field2));
    this.setState({ opened: this.getCleanCellsByCoord(initialClickCoord, this.field2, []) }, () => {
      this.onClick({ x: 2, y: 2 });
      setTimeout(() => {
        this.map2_mine = this.renderFieldMine(this.field2, this.state.opened);
        console.log(this.map2_mine);
      }, 1000);
    });
  }

  renderFieldNumber = (field: Field, opened: Coord[] = []): string => {
    const map: string = field
      .map(row =>
        row
          .map(cell =>
            this.isCellMine(cell, field)
              ? 'X'
              : this.getMineCountByCoord({ x: cell.x, y: cell.y }, field)
          )
          .join(' ')
      )
      .join('\n');
    return map;
  };

  renderFieldMine = (field: Field, clicked: Coord[] = []): string => {
    const map: string = field
      .map(row =>
        row.map(cell => (cell.mine ? 'X' : isArrIncludesCoord(clicked, cell) ? 'C' : 'O')).join(' ')
      )
      .join('\n');
    return map;
  };

  isCellMine = ({ x, y }: Coord, field: Field) => field[y - 1][x - 1].mine;

  getCleanCellsByCoord = (coord: Coord, field: Field, openedCell: Coord[]): Coord[] => {
    const xLength: number = field[0].length;
    const yLength: number = field.length;

    let queue: Coord[] = [coord];
    let acc: Coord[] = [];
    let openedOrMines: Coord[] = openedCell.map(({ x, y }) => ({ x, y }));
    const _f_ = (c: Coord) => {
      if (!isArrIncludesCoord(openedOrMines, c) && !isArrIncludesCoord(acc, c)) {
        if (this.isCellMine(c, field) || this.getMineCountByCoord(c, field) > 0)
          openedOrMines.push(c);
        else {
          queue.push(c);
          acc.push(c);
        }
      }
    };

    let _c_ = null;
    while ((_c_ = queue.shift()) !== undefined) {
      let { x, y } = _c_;
      if (y - 1 > 0) _f_({ x, y: y - 1 });
      if (yLength >= y + 1) _f_({ x, y: y + 1 });
      if (x - 1 > 0) _f_({ x: x - 1, y });
      if (xLength >= x + 1) _f_({ x: x + 1, y });
    }

    return acc;
  };

  getMineCountByCoord = (coord: Coord, field: Field): number => {
    if (this.isCellMine(coord, field)) return 9;

    let acc = 0;
    const { xLength, yLength } = this.getXYLength(field);
    aroundCoords(coord, xLength, yLength).forEach(coord => {
      acc += this.isCellMine(coord, field) ? 1 : 0;
    });

    return acc;
  };

  openCell = (coord: Coord): void => {
    const prevOpened = this.state.opened.map(({ x, y }) => ({ x, y }));
    const { xLength, yLength } = this.getXYLength(this.field2);
    const aroundsToOpen = aroundCoords(coord, xLength, yLength).filter(
      c => !isArrIncludesCoord(prevOpened, c) && this.isCellMine(c, this.field2)
    );

    this.setState({ opened: this.state.opened.concat(aroundsToOpen) });
  };

  getXYLength = (arr: any[][]): { xLength: number; yLength: number } => ({
    xLength: arr[0].length,
    yLength: arr.length
  });

  onClick = (coord: Coord): void => {
    if (this.isCellMine(coord, this.field2)) {
      // TODO: bang
      window.alert('Bang!');
    }
    this.openCell(coord);
  };

  render() {
    return (
      <div>
        <div>
          {this.renderFieldNumber}
          <button
            onClick={(): void => {
              this.setState(({ string }: State) => ({
                string: string === 'hello' ? 'world' : 'hello'
              }));
            }}
          >
            {this.state.string}
          </button>
        </div>
      </div>
    );
  }
}
