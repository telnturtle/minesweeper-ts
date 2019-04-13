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
  field: Field;
}

// constructor에서 this.state: State = {}를 사용하려면 선언을 다음과 같은 형식으로 해 줘야 함:
// Component<any, State>
export default class Test extends Component<any> {
  state: State = { string: 'hello', opened: [], field: [] };

  componentDidMount() {}

  isCellMine = ({ x, y }: Coord, field: Field) => field[y - 1][x - 1].mine;

  getCleanCellsByCoord = (coord: Coord, field: Field, openedCell: Coord[]): Coord[] => {
    const xLength: number = field[0].length;
    const yLength: number = field.length;

    let queue: Coord[] = [coord];
    let acc: Coord[] = [coord];
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

  // if getMineCountByCoord === 0 then open wide else only open clicked cell
  // TODO: else 로직 확인  
  openCell = (coord: Coord): void => {
    // If the cell's around mine count equals 0
    if (this.getMineCountByCoord(coord, this.state.field) !== 0) {
      this.concatToOpened(coord);
    }
    // Else
    else {
      const { xLength, yLength } = this.getXYLength(this.state.field);
      const toOpen = this.getCleanCellsByCoord(coord, this.state.field, this.state.opened)
        .filter(c => !isArrIncludesCoord(this.state.opened, c))
        .map(c => aroundCoords(c, xLength, yLength))
        .flat()
        .reduce((acc: Coord[], c) => (!isArrIncludesCoord(acc, c) ? acc.concat(c) : acc), [])
        .filter(c => !this.isCellMine(c, this.state.field));

      this.concatToOpened(toOpen);
    }
  };

  getXYLength = (arr: any[][]): { xLength: number; yLength: number } => ({
    xLength: arr[0].length,
    yLength: arr.length
  });

  onClick = (coord: Coord): void => {
    // init
    if (this.state.field.length === 0) {
      const field = generate(10, 18, RATES.normal, coord);
      this.setState({ field }, () => {
        this.openCell(coord);
      });
    }
    // not init
    else {
      if (this.isCellMine(coord, this.state.field)) window.alert('Bang!');
      else this.openCell(coord);
    }
  };

  isOpened = (c: Coord): boolean => isArrIncludesCoord(this.state.opened, c);

  concatToOpened = (toConcat: Coord | Coord[], callback = () => {}) => {
    this.setState({ opened: this.state.opened.concat(toConcat) }, callback);
  };

  render() {
    return (
      <div>
        <div>
          <button
            onClick={(): void => {
              this.setState(({ string }: State) => ({
                string: string === 'hello' ? 'world' : 'hello'
              }));
            }}
          >
            {this.state.string}
          </button>
          <div>
            {this.state.field.length === 0
              ? Array(18)
                  .fill(null)
                  .map((n, y) => (
                    <div key={`temp-${y}`} style={{ display: 'flex' }}>
                      {Array(10)
                        .fill(null)
                        .map((n, x) => (
                          <div
                            onClick={() => this.onClick({ x: x + 1, y: y + 1 })}
                            style={{ width: '40px', height: '40px', backgroundColor: 'gray' }}
                            key={`${x}-${y}`}
                          >
                            N
                          </div>
                        ))}
                    </div>
                  ))
              : this.state.field.map((row, i) => (
                  <div key={`test-${i}`} style={{ display: 'flex' }}>
                    {row.map(({ x, y, mine }) => (
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'gray'
                        }}
                        key={`${x}-${y}`}
                        onClick={() => this.onClick({ x, y })}
                      >
                        {this.isOpened({ x, y })
                          ? mine
                            ? 'M'
                            : this.getMineCountByCoord({ x, y }, this.state.field)
                          : // '?'
                            `(${this.getMineCountByCoord({ x, y }, this.state.field)})`}
                      </div>
                    ))}
                  </div>
                ))}
          </div>
        </div>
      </div>
    );
  }
}
