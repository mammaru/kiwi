'use strict'

import { ipcRenderer } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import MarkdownForm from './markdown_form';
import Article from './article';
import Loading from './loading';

export default class MainContents extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({ editor_mode: false }); 
  }

  render() {
    if (!this.state.contents) {
      return (<Loading />);
    }
    let viewer_classes = this.state.editor_mode ? 'viewer side' : 'viewer';
    let update_button_classes = this.state.editor_mode ? '' : 'hide';
    let button_label = this.state.editor_mode ? 'Cancel' : 'Edit';
    let edit_area = this.state.editor_mode ? (<MarkdownForm contents={this.state.contents} onChange={this.handleUserInput.bind(this)}/>) : "";

    return (
      <div>
        <div id="contents-header">
          <nav>
            <button onClick={this.handleCancelButtonClicked.bind(this)}>{button_label}</button>
            <button className={update_button_classes} onClick={this.handleUpdateButtonClicked.bind(this)}>Update</button>
          </nav>
        </div>
        <div id="contents-container">
          {edit_area}
          <div className={viewer_classes}>
            <Article>{this.state.contents}</Article>
          </div>
        </div>
        <div id="contents-footer">
        </div>
      </div>
    );
  }

  componentDidMount() {
    console.log(9999);
    this.sendCommand('query', { method: 'get-contents', args: this.props.params.contents_id });
    ipcRenderer.on('contents', (event, arg) => {
      this.setState({ contents: arg });
    });
   }

  componentWillReceiveProps(nextProps) {
    console.log(10000);
    this.sendCommand('query', { method: 'get-contents', args: this.props.params.contents_id });
    ipcRenderer.on('contents', (event, arg) => {
      this.setState({ contents: arg });
    });
   }

  handleUserInput(formData) {
    this.setState({ contents: _.merge(this.state.contents, formData) });
  }

  handleToggleEditMode() {
    if(!this.state.editor_mode){
      this.setState({ editor_mode: true });
    }else{
      this.setState({ editor_mode: false });
    }
  }

  handleCancelButtonClicked() {
    this.setState({ code: this.props.code });
    this.handleToggleEditMode();
  }
  
  handleUpdateButtonClicked() {
    this.sendCommand('query', { method: 'update-contents', args: this.state.contents });
    this.sendCommand('query', { method: 'get-contents', args: this.props.params.contents_id });
    ipcRenderer.on('contents', (event, arg) => {
      this.setState({ contents: arg });
    });
    this.handleToggleEditMode();
  }

  sendCommand(command, args) {
    ipcRenderer.send('command', command, args);
  }
  
}
