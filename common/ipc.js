const {ipcMain} = require('electron')
const ffmpeg = require('ffmpeg-static-electron')
var ffprobe = require('ffprobe-static')
const ffprobeInstaller = require('@ffprobe-installer/ffprobe')

ipcMain.on('file-message', (event, args) => {
    console.log(args)
    console.log(ffmpeg.path);
    console.log(ffprobe.path);
    console.log(ffprobeInstaller.path, ffprobeInstaller.version)

    var track = args.path
    ffprobe(track).then(r=>{
        console.log(track)
    }).catch(e=>{
        console.log(e)
    })
})