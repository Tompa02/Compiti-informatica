let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:');
const express = require("express")
const fetch = require("node-fetch")
const app = new express()

db.serialize(function() {
  db.run("CREATE TABLE user (user TEXT, password TEXT)");

  let stmt = db.prepare("INSERT INTO user (user,password) VALUES (?, ?)");
  stmt.run("Tommaso Pagliani", "PWD123");



  stmt.finalize();

  db.each("SELECT user, password FROM user", function(err, row) {
      console.log(row)
  });
});



app.post("/", (req, res) => {
    try {
        if(!req.body.credit.user && !req.body.credit.password){
            db.each("SELECT user, password FROM user", function(err, row) {
                if(req.body.credit.user === row.user && req.body.credit.password === row.password){
                    res.json({status : 200, ok: "true"})
                }
            });
        }else{
            res.json({status : 401, ok: "false"})
        }
    } catch(err) {
        console.error(err)
    }
})


db.close();
