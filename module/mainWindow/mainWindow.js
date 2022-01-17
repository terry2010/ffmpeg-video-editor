const {app, BrowserWindow} = require('electron')
const path = require('path')


module.exports = class {
    win = null

    constructor() {
        return this
    }

    createWindow() {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                nodeIntegration: true,
                contextIsolation: false
            },
        })
        win.webContents.openDevTools({mode: 'detach'})


        win.loadFile(path.join(__dirname, 'index.html'))
        this.win = win

    }



}

