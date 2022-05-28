const {ipcRenderer} = require('electron')
let FILE_INFO = {path: "", name: "", subtitle: []}
document.querySelector('#filePath').addEventListener('change', (ev, f) => {
    console.log(document.querySelector('#filePath').files)
    let data = {
        action: "parseFile",
        path: document.querySelector('#filePath').files[0].path,
        name: document.querySelector('#filePath').files[0].name
    }
    ipcRenderer.send("file-message", data)
})


document.querySelector("#extractSubtitle").addEventListener('click', () => {
    if (FILE_INFO.subtitle.length < 1) {
        return
    }
    let data = {
        action: "extractSubtitle",
        path: FILE_INFO.path,
        name: FILE_INFO.name,
        data: FILE_INFO.subtitle
    }
    ipcRenderer.send("file-message", data)
})

ipcRenderer.on('file-message', (event, args) => {
    console.log("file-message", args)
    if ("parseFile" === args.action) {
        let _text = ""
        FILE_INFO.path = args.path
        FILE_INFO.name = args.name
        FILE_INFO.subtitle = args.data
        if (args.data.length > 0) {
            args.data.forEach((v, k) => {
                _text = _text + "<br/>" + v.index + ":" + v.name
            })
        } else {
            _text = "没有原生字幕"
        }
        document.querySelector('#subtitleList').innerHTML = _text
        document.querySelector('#extractStatus').innerHTML = "ready"
        console.log(_text)
    }
    if("extractStatus" === args.action) {
        console.log("args",args)
        document.querySelector('#extractStatus').innerHTML = args.msg
        console.log(_text)
    }
})