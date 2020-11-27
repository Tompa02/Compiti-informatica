const express = require('express')
const path = require('path');
app = express()

app.get('/', (req, res) => {
    if(req.headers['accept-language'].substr(0,2)==='it'){
        res.send("Benvenuto nella pagina di accesso");
    }else{
        res.send("Welcome to the home page")
    }
    
})

app.get('/sayhi', (req, res) =>{
    res.send(`
        Benvenuto nella pagina di saluti
        Ciao ${req.query.name!==undefined ? req.query.name : ''} ${req.query.surname!==undefined ? req.query.surname : ''} ${req.query.course!==undefined ? 'del '+req.query.course : ''}
    `)
    console.log()
})

app.listen(8000)