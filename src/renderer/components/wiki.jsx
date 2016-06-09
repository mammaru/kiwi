'use strict'

//import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import ContentsList from './contents_list';
import { ipcRenderer } from 'electron';

export default class Wiki extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({ full_screen_mode: false });
  }

  handleToggleFullScreenMode() {
    if(!this.state.full_screen_mode){
      this.setState({ full_screen_mode: true});
    }else{
      this.setState({ full_screen_mode: false});
    }
  }
  
  render() {
    let container_classes = this.state.full_screen_mode ? 'container full-screen' : 'container';
    return (
      <div>
        <div id="contents-list">
          <ContentsList />
        </div>
        <div id={container_classes}>
          <div id="container-header">
            <nav>
              <button onClick={this.handleToggleFullScreenMode.bind(this)}>三</button>
              <Link to="/"><button>Home</button></Link>
              <Link to="/add_article"><button>+</button></Link>
            </nav>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
