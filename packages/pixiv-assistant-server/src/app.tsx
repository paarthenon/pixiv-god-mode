import * as React from 'react'
import {ServerStatus} from './app/bootstrap'

export class App extends React.Component<undefined, undefined> {
  render() {
    return (
      <div>
        <h2>Welcome to React with Typescript</h2>
        <ServerStatus />
      </div>
    );
  }
}
