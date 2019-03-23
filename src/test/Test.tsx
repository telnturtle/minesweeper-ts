import React, { Component } from 'react';

// cores
import { generate } from 'core/mine';

// types
import { FieldCell } from 'core/types';

interface State {
  string: string;
}

// constructor에서 this.state: State = {}를 사용하려면 선언을 다음과 같은 형식으로 해 줘야 함:
// Component<any, State>
export default class Test extends Component<any> {
  state: State = { string: 'hello' };
  map1: string = '';
  map2: string = '';

  componentDidMount() {
    this.map1 = this.renderFieldText(generate());
    this.map2 = this.renderFieldText(generate(12, 21));
    console.log(this.map1);
    console.log(this.map2);
  }

  renderFieldText = (cellss: FieldCell[][]): string => {
    const map: string = cellss
      .map(row => row.map(cell => (cell.mine ? 'X' : 'O')).join(''))
      .join('\n');
    return map;
  };

  render() {
    return (
      <div>
        <div>
          {this.renderFieldText}
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
