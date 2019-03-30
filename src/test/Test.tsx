import React, { Component } from 'react';

// cores
import { generate, RATES, aroundCoords } from '../core/mine';

// types
import { FieldCell, Coord, Field } from 'core/types';

// auxs
import { isCoordEqual, isArrIncludesCoord } from '../core/auxs';

interface State {
  string: string;
}

// constructor에서 this.state: State = {}를 사용하려면 선언을 다음과 같은 형식으로 해 줘야 함:
// Component<any, State>
export default class Test extends Component<any> {
  state: State = { string: 'hello' };
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
      this.getCleanCellsByCoord(initialClickCoord, this.field2, [])
    );
    console.log(this.map2_number);
    console.log(this.map2_mine);

    console.log('8, 16 , ', this.getMineCountByCoord({x:8,y:16}, this.field2))
  }

  renderFieldNumber = (field: Field): string => {
    const map: string = field
      .map(row =>
        row.map(cell => this.isCellMine(cell, field) ? 'X' : this.getMineCountByCoord({ x: cell.x, y: cell.y }, field)).join(' ')
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

  getCleanCellsByCoord = (coord: Coord, field: Field, openedCell: FieldCell[]): Coord[] => {
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

    // const x = coord.x - 1;
    // const y = coord.y - 1;
    const xLength: number = field[0].length;
    const yLength: number = field.length;
    // const xLeft: boolean = x > 0;
    // const xRight: boolean = x < xLength - 1;
    // const yLeft: boolean = y > 0;
    // const yRight: boolean = y < yLength - 1;

    // const auxCoord2Mine = (x: number, y: number): boolean => {
    //   try {
    //     return field[y][x].mine;
    //   } catch (error) {
    //     return false;
    //   }
    // };
    // // const auxCoord2Mine = (x: number, y: number): boolean => cellss[x][y].mine;

    // if (yLeft && xLeft) acc += this.isCellMine({ x: x - 1, y: y - 1 }, field) ? 1 : 0;
    // if (yLeft) acc += this.isCellMine({ x: x, y: y - 1 }, field) ? 1 : 0;
    // if (yLeft && xRight) acc += this.isCellMine({ x: x + 1, y: y - 1 }, field) ? 1 : 0;
    // if (xLeft) acc += this.isCellMine({ x: x - 1, y }, field) ? 1 : 0;
    // if (xRight) acc += this.isCellMine({ x: x + 1, y }, field) ? 1 : 0;
    // if (yRight && xLeft) acc += this.isCellMine({ x: x - 1, y: y + 1 }, field) ? 1 : 0;
    // if (yRight) acc += this.isCellMine({ x: x, y: y + 1 }, field) ? 1 : 0;
    // if (yRight && xRight) acc += this.isCellMine({ x: x + 1, y: y + 1 }, field) ? 1 : 0;

    aroundCoords(coord, xLength, yLength).forEach(coord => {
      acc += this.isCellMine(coord, field) ? 1 : 0;
    });

    return acc;
  };

  render() {
    return (
      <div>
        <div>
          {this.renderFieldNumber}
          <button
            onClick={(): void => {
              this.setState(
                ({ string }: State): State => ({ string: string === 'hello' ? 'world' : 'hello' })
              );
            }}
          >
            {this.state.string}
          </button>
        </div>
      </div>
    );
  }
}
