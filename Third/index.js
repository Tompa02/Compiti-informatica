const express = require('express');
const app = new express();
const fs = require("fs")
const port = 8080

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    const html = fs.readFileSync("./public/home.html", "utf-8")
    res.send(html)
})
  

app.listen(port, () => console.log(`Server avviato sulla porta ${port}`));