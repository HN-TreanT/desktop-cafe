import { app, BrowserWindow, nativeImage } from 'electron';
import * as path from 'path';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import MenuBuilder from './menu';

function createWindow() {
  const win = new BrowserWindow({
    // titleBarStyle:"hidden",
    width:1370,
    height:750,
    resizable:false,
    transparent:true,
    icon: path.join(__dirname, ".." , "/logo.ico"),
    webPreferences: {
      // contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.setOverlayIcon(nativeImage.createFromPath(path.join(__dirname, ".." , "/logo.ico")), 'Description for overlay')


  //menu
  const menuBuilder = new MenuBuilder(win)
  menuBuilder.buildMenu()

  if (app.isPackaged) {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    win.loadURL('http://localhost:3000/index.html');
    // win.loadURL('http://localhost:3000');


    win.webContents.openDevTools();

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname,
        '..',
        '..',
        'node_modules',
        '.bin',
        'electron' + (process.platform === "win32" ? ".cmd" : "")),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }
} 

app.setUserTasks([
  {
    program: process.execPath,
    arguments: '--new-window',
    iconPath:  path.join(__dirname, ".." , "/logo.ico"),
    iconIndex: 0,
    title: 'New Window',
    description: 'Create a new window'
  }
])

app.whenReady().then(() => {
 
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  createWindow();

  app.on('activate', () => {
    
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});

console.log(path.join(__dirname,"..",'/public/logo.png'))