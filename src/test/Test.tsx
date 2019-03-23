import React, { Component } from 'react';

interface State {
  string: string;
}

export default class Test extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = { string: 'hello' };
  }

  render() {
    return (
      <div>
        <div>
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
