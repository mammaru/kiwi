'use strict'

import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router';
import { ipcRenderer, remote } from 'electron';
import Divider from './divider';
import Markdown from './markdown';
import _ from 'lodash';

export default class DashBoard extends React.Component {
  constructor(props) {
    super(props);
    //this.setSummary();
    this.state = ({ summary: [] })
  }

  render() {
    return (
      <div>
        <Divider>Latest Updates</Divider>
        {this.renderSummary()}
      </div>
    );
  }

  componentDidMount() {
    this.sendCommand('query', { method: 'get-summary'});
    ipcRenderer.on('summary', (event, data) => {
      this.setState({ summary: data });
    });
  }

  renderSummary() {
    return (
      this.state.summary.map(contents => {
        //console.log(contents.id);
        return(
          <div>
            <h4><Link to={`/${contents.id}`}>{contents.title}</Link></h4>
            <p>Last modified: {contents.updated_at}</p>
            <Markdown>{this.summarizeContentsBody(contents.body)}</Markdown>
            <Divider />
          </div>
        );
      })
    );
  }

  summarizeContentsBody(arg) {
    let str = "";
    sectionizeMarkdown(arg).map(sec => {
      //console.log(sec);
      for(let key in sec){
        str += key + "\n" + sec[key] + "\n";
      }
    });
    //console.log(str);
    return (
      str.replace(/#+/g, "####")
    );
  }

  sendCommand(command, args) {
    ipcRenderer.send('command', command, args);
  }
  
}

function sectionizeMarkdown(md) {
  let summary = [],
      array, section, body;
  md.match(/#+[^#]*#/g).forEach((sec, index, arr) => {
    section = {};
    array = sec.split("\n");
    if(array[0].length>100) {
      array[0] = array[0].substring(0,100) + "...";
    }
    let body = array.slice(1, array.length-1);
    body.map((str, idx, arr1) => {
      if(str.length>1000) {
        return (str.substring(0,1000) + "...");
      }else{
        return (str);
      }
    });
    for(let i = 0; i < body.length; i++){
      if(body[i]===""){
        body.splice(i,1);
      }
    }
    body = body.join("\n");
    if(body.length>100) {
      body = body.substring(0, 100) + "...";
    }
    section[array[0]] = body;
    summary.push(section);
  });
  return(summary);
}
