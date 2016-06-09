'use strict';

//import 'babel-polyfill';
import { EventEmitter } from 'events'
import app from 'app';
import BrowserWindow from 'browser-window';
import fs from 'fs';
import path from 'path';
//import net from 'net';
//import _ from 'lodash';
import dialog from 'dialog';
import { ipcMain } from 'electron';
import DocumentStorage from './storage';
import ApplicationWindow from './application-window';
import ApplicationMenu from './application-menu';
//import server from './server';

let _instance = null;
let _symbol = Symbol();

//
// Singleton class for application in browser proccess.
// create instance by Application.open()
export default class Application extends EventEmitter {
  static open() {
    if(_instance===null) {
      _instance = new Application(_symbol);
    }
    return _instance;
  }

  constructor(target) {
    if(_symbol!==target || _instance!==null) {
      throw new Error('Please use Application.instance()');
    }else{
      super();
      global.Application = this;

      let options = {
        docHomePath: '/Users/yuma/Documents/kiwi',
        type: 'sqlite3',
      };
      this.storage = new DocumentStorage(options);
      this.mainWindow = new ApplicationWindow();
      this.menu = new ApplicationMenu();
      
      this.handleEvents();
    }
  }
  
  handleEvents() {
    this.on('application:open-file', () => this.importFile() );
    this.on('query', query => this.sendQueryToStrage(query) );
    
    // quit application when all windows are closed
    app.on('window-all-closed', () => {
      if (process.platform != 'darwin') {
        app.quit();
      }
    });

    ipcMain.on('command', (event, command, args) => {
      this.emit(command, args);
    });
    
  }

  getBrowserWindow() {
    return this.mainWindow.browserWindow;
  }

  sendCommandToWindow(command, args) {
    if(!this.emit(command, args)) {
      this.mainWindow.sendCommand(command, args);
    }
  }

  sendQueryToStrage(query) {
    this.storage.execute(query, this.sendCommandToWindow.bind(this));
  }
  
  sendData(command) {
    this.sendQueryToStrage(command, this.sendCommandToWindow.bind(this, command));
  }

  importFile() {
    dialog.showOpenDialog({
      title: 'Select file to import',
      properties: ['openFile'],
      filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
    }, filePath => {
      if (filePath) {
        fs.readFile(filePath[0], 'utf8', (err, data) => {
          if (err) {
            return console.log(err);
          }else{
            this.mainWindow.sendData('fileContent', data);
          }
        });
      }
    });
  }

  saveFile() {
    dialog.showSaveDialog({
      title: 'Save markdown file',
      filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
    }, filePath => {
      let w;
      this.mainWindow.send('saveFile');
      ipcMain.on('contentToSave', (event, content) => {
        fs.writeFile(filePath, content, err => {
          if (err) {
            return console.log(err);
          }
        });
      });
    });
  }
  
}
