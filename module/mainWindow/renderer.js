const {ipcRenderer} = require('electron')

document.getElementById('filePath').addEventListener('change', (ev) => {
    // console.log(input.files)
})
document.querySelector('#filePath').addEventListener('change', (ev, f) => {
    console.log(document.querySelector('#filePath').files)
})

document.querySelector("#parseFile").addEventListener('click', () => {
    console.log(document.querySelector('#filePath').files[0].path)
    let data = {
        action:"parseFile",
        path:document.querySelector('#filePath').files[0].path
    }
    ipcRenderer.send("file-message",data)
})
