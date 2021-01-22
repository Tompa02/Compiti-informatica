const express = require("express")
const fetch = require("node-fetch")
const app = new express()

app.get("/", async (req, res) => {
    try {
        let data = await fetch("https://jsonplaceholder.typicode.com/posts")
        data = await data.json()
        const body = []
        data.forEach((e) => {
            res.write(`<div><div style="font-size: 18px;"><b>Title: ${e.title}</b></div><br>${e.body} <br> id: ${e.id}</div> <br>`)
        });
        res.end()
    } catch(err) {
        console.error(err)
    }
})

app.get("/posts/:id", async (req, res) => {
    try {
        let data = await fetch(`https://jsonplaceholder.typicode.com/posts/${req.params.id}`)
        let comments = await fetch(`https://jsonplaceholder.typicode.com/posts/${req.params.id}/comments`)
        data = await data.json()
        comments = await comments.json()

        res.write(`<div><div style="font-size: 18px;"><b>Title: ${data.title}</b></div><br>${data.body} <br> id: ${data.id}</div> <br><br>`)

        comments.forEach((e) => {
            res.write(`<div>
                <div style="font-size: 15px;">
                    <b>Comment title: ${e.name}</b>
                </div>
                    ${e.body} 
                <br> 
                    name: ${e.email}
                </div>
                <br>`)
        });
        res.end()
    } catch(err) {
        console.error(err)
    }
})

app.listen(8000, () => {})