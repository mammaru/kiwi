'use strict';

global.shellStartTime = Date.now();

//import 'babel-polyfill';

var isDevelopment = process.env.NODE_ENV === 'development';

import app from 'app';
import crashReporter from 'crash-reporter';
import fs from 'fs';
import path from 'path';
import Application from './application';
//import server from './server';

function start() {

    //setupNikiHome();
    setupCrashReporter();
    
    // quit application when all windows are closed
    app.on('window-all-closed', () => {
        if (process.platform != 'darwin') {
            app.quit();
        }
    });

    app.on('ready', () => {
        
        const nikiApp = Application.open();
        
    });
}

function setupNikiHome() {
    nikiDocumentPath = '/Users/yuma/Documents/nuki';
}

function setupCrashReporter() {
    crashReporter.start({productName: 'Niki',
                         companyName: '',
                         submitURL: ''});
} 

start();
