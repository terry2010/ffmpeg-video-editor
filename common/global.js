global.manWindow = new (require('../module/mainWindow/mainWindow'))

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