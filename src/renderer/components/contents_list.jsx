'use strict'

import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router';
import { ipcRenderer } from 'electron';
import Loading from './loading';

export default class ContentsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({});
  }

  render() {
    if (!this.state.contents_list) {
      return <Loading />
    }
    return (
      <div>
        <h4>Contents</h4>
        <div className="contents-list">
          <ul>
            {this.renderContentsList()}
          </ul>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.sendCommand('query', { method: 'get-titles' });
    //ipcRenderer.send('data:get-titles');
    ipcRenderer.on('titles', (event, data) => {
      console.log(data);
      this.setState({ contents_list: data });
    });
  }

  renderContentsList() {
    return (
      this.state.contents_list.map(data => {
        return(<li><Link to={`/${data.id}`}>{data.title}</Link></li>);
      })
    );
  }

  sendCommand(command, args) {
    console.log(command);
    ipcRenderer.send('command', command, args);
  }

  

}
