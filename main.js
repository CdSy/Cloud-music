'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

require('electron-reload')(__dirname+'/public');

let mainWindow;

function createWindow () {
  const browserOptions = {
    width: 500,
    height: 500,
    maximizeable: false,
    icon:'public/img/logo.png'
  }
  mainWindow = new BrowserWindow(browserOptions);

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
