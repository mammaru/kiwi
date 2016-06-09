'use strict';

//import 'babel-polyfill';
import { EventEmitter } from 'events'
import app from 'app';
import BrowserWindow from 'browser-window';
import fs from 'fs';
import path from 'path';
import dialog from 'dialog';
import { ipcMain } from 'electron';

export default class ApplicationWindow extends EventEmitter {
  
  constructor() {
    super();
    this.browserWindow = null;

    let options = {
      //show: false,
      title: 'Kiwi',
      width: 1024,
      height: 768,
      transparent: false,
      frame: true
    }

    // start up Chromium and load welcome page
    this.browserWindow = new BrowserWindow(options);

    this.handleEvents();

    this.browserWindow.loadURL('file://' + __dirname + '/../static/index.html');
    //this.mainWindow.loadURL('http://localhost:'+port+'/');

  }

  handleEvents() {
    this.browserWindow.openDevTools();
    // quit when window close
    this.browserWindow.on('closed', () => {
      this.browserWindow = null;
    });
    this.browserWindow.webContents.on('did-finish-load', () => {
      global.Application.sendData('titles');
    });
  }

  close() {
    this.browserWindow.close();
  }

  reload() {
    this.browserWindow.webContents.reloadIgnoringCache();
  }

  toggleDevTools() {
    this.browserWindow.toggleDevTools();
  }  

  sendMessage(message, detail) {
    this.sendCommandToBrowserWindow('message', message, detail);
  }
  
  sendCommand(command, args) {
    this.browserWindow.webContents.send(command, args);
    //this.sendCommandToBrowserWindow(command, args);
  }
  
  sendCommandToBrowserWindow(command, args) {
    this.browserWindow.webContents.send('command', command, args);
  }

}
