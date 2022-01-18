const {ipcMain} = require('electron')
const ffmpeg = require('ffmpeg-static-electron')
var ffprobe = require('ffprobe-static')
const ffprobeInstaller = require('@ffprobe-installer/ffprobe')
const path = require('path')
const {exec, execSync} = require('child_process')


ipcMain.on('file-message', async (event, args) => {
    console.log(args)
    console.log(ffmpeg.path);
    console.log(ffprobe.path);
    console.log(ffprobeInstaller.path, ffprobeInstaller.version)
    var _cmd
    if (args.action === "parseFile") {
        // _cmd = ffprobe.path + "  -print_format json -show_entries stream_tags:format_tags  " + JSON.stringify(args.path)
        // _cmd = JSON.stringify(ffmpeg.path) + "  -i  " + JSON.stringify(args.path)
        _cmd = JSON.stringify(ffprobe.path) + " -v error -of json " + JSON.stringify(args.path) + " -of json -show_entries \"stream=index:stream_tags=language\" -select_streams s"
        console.log(_cmd)
        let ret = []
        let _r = execSync(_cmd)

        console.log(_r.toString())

        let result = JSON.parse(_r.toString())

        console.log(result.streams)
        args.data = []
        if (result.hasOwnProperty('streams') && result.streams.length > 0) {
            result.streams.forEach((v, k) => {
                let _lang = "sub"
                if (v.tags.hasOwnProperty('language')) {
                    _lang = v.tags.language
                }
                ret.push({
                    lang: _lang,
                    index: v.index,
                    name: path.basename(args.name, path.extname(args.name)) + "." + v.index + "." + _lang + ".srt"
                })
            })
            args.data = ret

        }
        event.reply("file-message", args)
    }

    if (args.action === "extractSubtitle") {
        if (args.data.length > 0) {
            _cmd = JSON.stringify(ffmpeg.path) + " -i " + JSON.stringify(args.path)
            args.data.forEach( (v, k) => {
                let _subtitlePath = path.dirname(args.path) + "/" + v.name
                _cmd = _cmd +" -map \"0:" + v.index + "\" " + JSON.stringify(_subtitlePath)


            })
            console.log(_cmd)
            await executeShellCMD(_cmd).then(r => {
                console.log("result:", r)
            }).then(e => {
                console.log("e:", e)
            })
        }

    }


})


async function executeShellCMD(_cmd = "", _callback = null) {

    return new Promise(((resolve, reject) => {

        var ch = exec(_cmd, (err, stdout, stderr) => {
            console.log("err,stdout,stderr:", err, stdout, stderr)
            if (null !== err && "" !== err.toString()) {
                return reject(err)
            }
            if (null !== stderr && "" !== stderr.toString()) {
                return reject(stderr)
            }
        })

        ch.on('error', (e) => {
            console.log("updater:spawnErr:" + e)
            return reject(e)
        })

        ch.on('data', (_data, b, c) => {
            console.log("-----ch:stdout:data", _data, b, c)
            if ("function" === typeof (_callback)) {
                _callback(_data)
            }
        })
        ch.on('error', (a, b, c) => {
            console.log("ch:stderr:data", a, b, c)
            return reject(a)
        })
        ch.on('message', (_data, b, c) => {
            console.log("ch:stdout:message", _data, b, c)
            if ("function" === typeof (_callback)) {
                _callback(_data)
            }
        })
        ch.on('exit', (a, b, c) => {
            console.log("ch:stdout:exit", a, b, c)
            return resolve(a)
        })
        ch.on('close', (a, b, c) => {
            console.log("ch:stdout:close", a, b, c)
            return resolve(a)
        })
        ch.on('disconnect', (a, b, c) => {
            console.log("ch:stdout:disconnect", a, b, c)
            reject(a)
        })


        ch.stdout.on('data', (_data, b, c) => {
            console.log("!!!!!ch.stdout:data", _data, b, c)
            if ("function" === typeof (_callback)) {
                _callback(_data)
            }
        })
        ch.stderr.on('data', (a, b, c) => {
            console.log("ch.stderr:data", a, b, c)
        })
    }))

}