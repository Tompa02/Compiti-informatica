const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const port = 3000;


app.use(express.static('public'))


app.set('view engine', 'handlebars');
    app.engine('handlebars', handlebars({
        layoutsDir: __dirname + '/views/layouts',
}));



app.get('/', (req, res) => {
    res.render('main', {layout : 'index'});
});
    

app.listen(port, () => console.log(`App listening to port ${port}`));