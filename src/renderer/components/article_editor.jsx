'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import ArticleForm from './article_form';
import Article from './article';
import Loading from './loading';
import { ipcRenderer } from 'electron';
import _ from 'lodash';

export default class ArticleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      preview_mode: false,
      contents: {
        title: "New article",
        body: "# Welcome\nWrite awesome things here!",
        created_at: "",
        updated_at: ""
      }
    });
  }
  
  render() {
    let preview_area_classes = this.state.preview_mode ? 'preview' : 'hide';
    let button_label = this.state.preview_mode ? 'Close' : 'Preview';
    return (
      <div>
        <div id="editor-header">
          <nav>
            <button onClick={this.handleCancelButtonClicked.bind(this)}>{button_label}</button>
            <button onClick={this.handleSaveButtonClicked.bind(this)}>Save</button>
          </nav>
        </div>
        <div id="editor-container">
          <div id="artticle-form">
            <ArticleForm contents={this.state.contents} onChange={this.handleFormChange.bind(this)} />
          </div>
          <div className={preview_area_classes}>
            <Article>{this.state.contents}</Article>
          </div>
        </div>
        <div id="editor-footer">
        </div>
      </div>
    );
  }

  componentDidMount() {
    ipcRenderer.on('fileContent', (event, fileData) => {
      this.setState({ contents: _.merge(this.state.contents, { body: fileData }) });
    });
    ipcRenderer.on('saveFile', () => {
      ipcRenderer.send('contentToSave', this.state.contents.body);
    });
  }

  handleFormChange(formData) {
    this.setState({ contents: _.merge(this.state.contents, formData) });
  }
  
  handleToggleEditMode() {
    if(!this.state.preview_mode){
      this.setState({ preview_mode: true });
    }else{
      this.setState({ preview_mode: false });
    }
  }

  handleCancelButtonClicked() {
    this.handleToggleEditMode();
  }

  handleSaveButtonClicked() {
    this.sendCommand('query', { method: 'save-contents', args: this.state.contents });
  }

  sendCommand(command, args) {
    ipcRenderer.send('command', command, args);
  }
  
}

