import React, { Component } from 'react';

// cores
import { generate } from 'core/mine';

// types
import { FieldCell, Coord } from 'core/types';

interface State {
  string: string;
}

// constructor에서 this.state: State = {}를 사용하려면 선언을 다음과 같은 형식으로 해 줘야 함:
// Component<any, State>
export default class Test extends Component<any> {
  state: State = { string: 'hello' };
  map1_1: string = '';
  map1_2: string = '';
  map2_1: string = '';
  map2_2: string = '';
  field1: FieldCell[][] = [[]];
  field2: FieldCell[][] = [[]];

  componentDidMount() {
    this.field1 = generate(5, 5, 0.12, { x: 2, y: 2 });
    this.field2 = generate(10, 18, 0.12, { x: 2, y: 2 });
    this.map1_1 = this.renderFieldNumber(this.field1);
    this.map1_2 = this.renderFieldMine(this.field1);
    this.map2_1 = this.renderFieldNumber(this.field2);
    this.map2_2 = this.renderFieldMine(this.field2);
    console.log(this.map1_1);
    console.log(this.map1_2);
    console.log(this.map2_1);
    console.log(this.map2_2);
    // console.log(this.map2);
  }

  renderFieldNumber = (cellss: FieldCell[][]): string => {
    const map: string = cellss
      .map(row => row.map(cell => this.getMineCount({ x: cell.x, y: cell.y }, cellss)).join(' '))
      .join('\n');
    return map;
  };

  renderFieldMine = (cellss: FieldCell[][]): string => {
    const map: string = cellss
      .map(row => row.map(cell => (cell.mine ? 'X' : 'O')).join(' '))
      .join('\n');
    return map;
  };

  getMineCount = ({ x, y }: Coord, cellss: FieldCell[][]): number => {
    let acc = 0;

    const x_ = x - 1;
    const y_ = y - 1;
    const xLength: number = cellss[0].length;
    const yLength: number = cellss.length;
    const xLeft: boolean = x_ > 0;
    const xRight: boolean = x_ < xLength - 1;
    const yLeft: boolean = y_ > 0;
    const yRight: boolean = y_ < yLength - 1;

    const auxCoord2Mine = (x: number, y: number): boolean => {
      try {
        return cellss[y][x].mine;
      } catch (error) {
        // console.error(error);
        console.error('cellss, x, y ', cellss, x, y);
        return false;
      }
    };
    // const auxCoord2Mine = (x: number, y: number): boolean => cellss[x][y].mine;

    if (yLeft && xLeft) acc += auxCoord2Mine(x_ - 1, y_ - 1) ? 1 : 0;
    if (yLeft) acc += auxCoord2Mine(x_, y_ - 1) ? 1 : 0;
    if (yLeft && xRight) acc += auxCoord2Mine(x_ + 1, y_ - 1) ? 1 : 0;
    if (xLeft) acc += auxCoord2Mine(x_ - 1, y_) ? 1 : 0;
    if (xRight) acc += auxCoord2Mine(x_ + 1, y_) ? 1 : 0;
    if (yRight && xLeft) acc += auxCoord2Mine(x_ - 1, y_ + 1) ? 1 : 0;
    if (yRight) acc += auxCoord2Mine(x_, y_ + 1) ? 1 : 0;
    if (yRight && xRight) acc += auxCoord2Mine(x_ + 1, y_ + 1) ? 1 : 0;

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
