const { app, BrowserWindow } = require('electron')

app.on('open-file',()=>{
    console.log("open-file",e)
})

module.exports = function () {

}