const express = require('express')
const bodyParser = require('body-parser')
const CircularJSON = require('circular-json')
const request = require('request')
const mysql = require("sync-mysql")
const env =require("dotenv").config({ path:"../../.env"});
const moment = require('moment');

var connection = new mysql({
	host : process.env.host,
	user : process.env.user,
	password : process.env.password,
	database : process.env.database
});
// var date = moment().format('YYYY-MM-DD');

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

//디비 연결되었는지 확인하기 위해 띄움
app.get("/hello", (req, res)=>{
	const result = connection.query("SELECT * FROM event");
	if(result){
	console.log("DB connected d");
	res.send("DB connected");
	}
})

// Select all rows from st_info table
app.get("/select", (req, res) => {
  const result = connection.query("SELECT * FROM event");
  console.log(result);
  res.writeHead(200);
  var template = `
  <!doctype html>
  <html>
  <head>
    <title>Result</title>
    <meta charset="utf-8">
  </head>
  <body>
   <table border="1" margin:auto; text-align:center;>
    <form method="post" action='/api/users/userBody' name='userForm' target='targetURL'>
     <tr>
       <th>EVENT_NUM</th>
       <th>EVENT_NAME</th>
       <th>EVENT_CONTENT</th>
       <th>DATE</th>
       <th>수정</th>
       <th>삭제</th>
     </tr>
    </form>
   `;
   for(var i=0; i<result.length; i++) {
    template += `
    
     <tr>
       <form method="get" action='/update' onsubmit="수정하시겠습니까?">
           <th>${result[i]['event_num']}</th>
           <th><input type="test" name="event_name" value="${result[i]['event_name']}"></th>
           <th><input type="test" name="event_content" value="${result[i]['event_content']}"></th>
           <th>${result[i]['date']}</th>
           <th><button type="submit" action='/update' name="update_event" onsubmit="수정하시겠습니까?">수정</button></th>
       </form>
       
       <form method="get" action='/delete' onsubmit="삭제하시겠습니까?">
       <th><button type="submit" action='/delete' name="delete_event" value="${result[i]['event_num']}" onsubmit="삭제하시겠습니까?">삭제</button></th>
       </form>
     </tr>
    `
   }
   template +=`
     </table>
  </body>
  </html>
 `;
  res.end(template);
})

// insert data into event table
app.get("/insert", (req, res) => {
    const { EVENT_NAME, EVENT_CONTENT, DATE } = req.query;
    console.log("인설트 된 내용 : ", EVENT_NAME, EVENT_CONTENT, DATE);
    const result = connection.query(
        "INSERT INTO event values (?, ?, ?, ?)", [
            null,
            EVENT_NAME,
            EVENT_CONTENT,
            DATE	
]);

const urls = "http://54.180.178.89:3000/select/"

request(urls, { json:true }, (err, result, body) => {
    if (err) { return console.log(err) }
        res.send(CircularJSON.stringify(body))
    })
})



// update row from event table
app.get("/update", (req, res) => {
	const { update_event, event_name, event_content, DATE } = req.query;
	console.log("업데이트된 내용 : ",update_event, event_name, event_content, DATE);
	const result = connection.query("UPDATE event SET EVENT_NAME=?, event_content=?, DATE=? WHERE EVENT_NUM=?", [
	    event_name,
        event_content,
        null,
        update_event
]);


const urls = "http://54.180.178.89:3000/select/"
request(urls, { json:true }, (err, result, body) => {
	if (err) { return console.log(err) }
	res.send(CircularJSON.stringify(body))
	 })
})

// delete row from st_info table
app.get("/delete", (req, res) => {
	const delete_event = req.query.delete_event
	console.log("딜리트 쪽 ", delete_event)
	const result = connection.query("DELETE FROM event WHERE EVENT_NUM=?", [
		delete_event
	]);

// const urls = "http://54.180.178.89:3000/select/"
// request(urls, { json:true }, (err, result, body) => {
// 	if (err) { return console.log(err) }
// 		res.send(CircularJSON.stringify(body))
// 	})
 })

module.exports = app;
