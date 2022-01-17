const {ipcMain} = require('electron')
const ffmpeg = require('ffmpeg-static-electron')
var ffprobe = require('ffprobe-static')
const ffprobeInstaller = require('@ffprobe-installer/ffprobe')

const {exec, execSync} = require('child_process')

ipcMain.on('file-message', (event, args) => {
    console.log(args)
    console.log(ffmpeg.path);
    console.log(ffprobe.path);
    console.log(ffprobeInstaller.path, ffprobeInstaller.version)

    let _cmd = ffprobe.path + "  -print_format json -show_entries stream_tags:format_tags  " + JSON.stringify(args.path)
    console.log(_cmd)

    let _r = execSync(_cmd)

    console.log(_r)

})