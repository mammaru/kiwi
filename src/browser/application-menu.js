'use strict';

import app from 'app';
import Menu from 'menu';
import MenuItem from 'menu-item';
import fs from 'fs';
import path from 'path';
import dialog from 'dialog';
import { ipcMain } from 'electron';
import _ from 'lodash';

export default class ApplicationMenu {
  constructor() {
    this.menu = Menu.buildFromTemplate(_.cloneDeep(this.getDefaultTemplate()));
    Menu.setApplicationMenu(this.menu);
  }

  getMainWindow() {
    //console.log(global.Application.mainWindow);
    return global.Application.mainWindow;
  }
  
  getDefaultTemplate() {
    return [
      {
        label: 'Kiwi',
        submenu: [
          {label: 'About Kiwi', selector: 'orderFrontStandardAboutPanel:',},
          {type: 'separator',},
          {label: 'Quit', accelerator: 'CommandOrControl+Q', click: () => {app.quit();},},
        ],
      },
      {
        label: 'File',
        submenu: [
          {
            label: 'Import', accelerator: 'CommandOrControl+O',
            click: () => {global.Application.importFile();},
          },
          {
            label: 'Save as',
            accelerator: 'CommandOrControl+S',
            click: () => {global.Application.saveFile();},
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          {label: 'Undo', accelerator: 'CommandOrControl+Z', selector: 'undo:',},
          {label: 'Redo', accelerator: 'Shift+CommandOrControl+Z', selector: 'redo:',},
          {type: 'separator',},
          {label: 'Cut', accelerator: 'CommandOrControl+X', selector: 'cut:',},
          {label: 'Copy', accelerator: 'CommandOrControl+C', selector: 'copy:',},
          {label: 'Paste', accelerator: 'CommandOrControl+V', selector: 'paste:',},
          {label: 'Select All', accelerator: 'CommandOrControl+A', selector: 'selectAll:',},
        ],
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'CommandOrControl+R',
            click: () => {this.getMainWindow().reload();},
          },
          {
            label: 'Toggle DevTools',
            accelerator: 'Command+Alt+I',
            click: () => {this.getMainWindow().toggleDevTools();},
          }
        ]
      },
      {label: 'Help',},
    ];
  }
}
