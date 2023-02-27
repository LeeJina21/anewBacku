const express = require('express')
const bodyParser = require('body-parser')
const app = express()
 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))
app.use(express.json())
app.use(express.urlencoded({ extented : true }))
 
const users = [
         { id : 1, name : "User1"},
         { id : 2, name : "User2"},
         { id : 3, name : "User3"}
];
 
// simple api
app.get("/Hello", (req, res) => {
         res.send("Hello World!!");
});
 
// request param X, response 0
app.get("/api/users", (req,res) => {
         res.json({ ok:true, users : users});
});

// Query param, request param 0, response 0
app.get("/api/users/user", (req, res) => {
         const user_id = req.query.user_id;
         const user = users.filter(data => data.id == user_id);
         res.json({ ok:false, users : user });
});

// Path param, request param 0, response 0
app.get("/api/users/:user_id", (req, res) => {
         const user_id = req.params.user_id
         const user = users.filter(data => data.id == user_id);
         res.json({ ok:false, users : user });
});

// post, request body, response 0
app.post("/api/users/userBody", (req, res) => {
         const user_id = req.body.id;
         const user = users.filter(data => data.id == user_id);
         res.json({ ok:true, users : user });
});

// post, request body, response 0
app.post("/api/users/add", (req, res) => {
         const { id, name } = req.body;
         const user = users.concat(data => data.id == user_id);
         res.json({ ok:true, users : user });
});

// put, request body, response 0
app.put("/api/users/update", (req, res) => {
         const { id, name } = req.body;
         const user = users.map(data => {
                  if (data.id == id ) data.name = name
                  return {
                           id : data.id,
                           name : data.name
                  }
         })
         res.json({ ok:true, users : user });
});

// patch, request body, response 0
app.patch("/api/users/update/:user_id", (req, res) => {
         const { user_id } = req.params;
         const { name } = req.body;
         const user = users.map(data => {
                  if (data.id == user_id ) data.name = name
                  return {
                           id : data.id,
                           name : data.name
                  }
         });
         res.json({ ok:true, users : user });
});

//delete, request body, response 0
app.delete("/api/users/delete", (req, res) => {
         const { user_id } = req.body;
         const user = users.filter ( data => data.id != user_id );
         res.json({ ok:true, users : user });
});

module.exports = app;