'use strict'

//import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="wrapper">{this.props.children}</div>
    );
  }
}
