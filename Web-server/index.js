const express = require('express')
const path = require('path');
app = express()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/home.html'));
})

app.get('/sayhi', (req, res) =>{
    res.set('Content-Type', 'application/json')
    res.send({text: `
        Benvenuto nella pagina di saluti
        Ciao ${req.query.name!==undefined ? req.query.name : ''} ${req.query.surname!==undefined ? req.query.surname : ''} del ${req.query.course!==undefined ? req.query.course : ''}
    `})
    console.log(req.headers['accept-language'].substr(0,2))
})

app.listen(8000)