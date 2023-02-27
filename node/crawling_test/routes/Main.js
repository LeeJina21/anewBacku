var fs = require('fs')
var readline = require('readline');
var http = require('http');
var path = require('path');

const async = require("async")
const Express = require('express')
const BodyParser = require('body-parser')
const request = require('request');
const router = Express.Router();
const CircularJSON = require("circular-json");
const zip = require('node-zip')();
const App = Express()
const mysql = require("sync-mysql")

var connection = new mysql({
    host : 'database-2.cz3zo4yskaei.ap-northeast-2.rds.amazonaws.com',
    user : 'prmj',
    port : '3306',
    password : '1234',
    database : 'cseprmj'
});

App.use(BodyParser.json())
App.use(BodyParser.urlencoded({ extended : false }))
App.use(Express.json())
App.use(Express.urlencoded({ extended : true }))

const srcFile = "./pyle/data.txt";
const wonFile = "./pyle/storied.txt";

var i,j;


/*체크박스 클릭 후 데이터저장*/
App.post("/data", (req, res) => {
 
 const data1 = req.body
 const baseUrl = data1.baseUrl
 
 fs.writeFileSync('./pyle/storied.txt','');
 
 let data2 =JSON.parse(JSON.stringify({data: data1}));
 
 delete data2['data']['buttonData'];
 delete data2['data']['baseUrl'];
 
 for (var i=1; i<7; i++) {
  if (data2['data']['D'+i]==undefined) {
   data2['data']['D'+i]=null,
   data2['data']['E'+i]=null,
   data2['data']['F'+i]=null,
   data2['data']['G'+i]=null,
   data2['data']['H'+i]=null
  }
  
  if (data2['data']['A'+i].length ==2) {
   data2['data']['A'+i]="true"
  }
  
  if (data2['data']['A'+i]!="true") {
   delete data2['data']['A'+i],
   delete data2['data']['B'+i],
   delete data2['data']['C'+i],
   delete data2['data']['D'+i],
   delete data2['data']['E'+i],
   delete data2['data']['F'+i],
   delete data2['data']['G'+i],
   delete data2['data']['H'+i]
  }
 }
 
 let All = JSON.parse(JSON.stringify({ok:true, baseUrl: baseUrl, dataAll: data2}));

var aaa = "'"+All['baseUrl']+"'"
var bbb = All['dataAll']['data']


async.series([mains], function(err, results) {
        if (err) {
            console.log('error : ' + err);
        } else {
            console.log('task finish');
        }
    }
);

function mains(){
    fs.exists(srcFile, function (exists){
        var array = fs.readFileSync(srcFile).toString().split("\n");
        console.log("H1 : ", data2['data']['> H1'])
        var j = 1;
        for(i=0; i<array.length; i++){
            var str = array[i]
            str = str.replace('AAA', aaa)
            
            
            for(const key in bbb){
                str = str.replace("'"+`${key}`+"'", `${bbb[key]}`)
                
            }
            str = str.replace("'H"+j+"'", "");
            j+=1;
            
           fs.appendFile(wonFile, str+"\n", function(){});
        }
        
    });
};
//document.getElementById('thanIf').contentDocument.location.reload(true);

});
/*체크박스 클릭 후 데이터저장 끝*/


/*크롤링 코드 영역에 파이썬 내용 출력시키기*/
App.get("/thanCode", (req, res) => {
    const textFile='./pyle/storied.txt';

    fs.exists(textFile, function (exists){
       
        /* ENOENT: no such file or directory, open './pyle/storied.py' 파일안에 내용이 없어서 오류남 예외처리 해야함*/
        if(exists){
            var textArray = fs.readFileSync(textFile).toString().split("\n");
            for(i=0; i<textArray.length; i++){
                //console.log("textArray : ", textArray[i]);
                res.write(textArray[i]);
                res.write("\n");
            }
            res.end('');
        }else{
            console.log("No exixts! : ",exists);
            res.send("\n");
        }
    });
    

});
/*크롤링 코드 영역에 파이썬 내용 출력시키기 끝*/


/* .js 파일 생성*/
App.post("/save", (req, res) => {
    const namePy = req.body.namePy  //받은 .py 파일명
    const jsFile = `./pyle/${namePy}.py`;
    
    fs.exists(wonFile, function (exists){
        var array = fs.readFileSync(wonFile).toString().split("\n");
        for(i=0; i<array.length; i++){
            var str = array[i]
            str = str.replace('BBB', namePy)
            
           fs.appendFile(jsFile, str+"\n", function(){});
        }
        
    });
});
/* .js 파일 생성 끝*/


/*파이썬 실행하는 .js 파일 실행*/
App.post("/execution", (req, res) => {
    const namePy = req.body.namePy  //받은 .py 파일명
    //console.log("namePy : ",namePy);
    

    const spawn = require('child_process').spawn;
    const result = spawn('python', [`pyle/${namePy}.py`]);
    
    /*파이썬 실행하는 .js 파일 실행 끝*/

    async.series([pythonDo], function(err, results) {
        if (err) {
            console.log('error : ' + err);
        } else {
            console.log('task finish');
        }
    });
    
    function pythonDo(callback){
        console.log("크롤링 돌아감");
        
        result.stdout.on('data', function(data) {
        console.log(data.toString());
        });
            
        result.stderr.on('data', function(data) {
            console.log(data.toString());
        });
    };
    
});
/*파이썬 실행하는 .js 파일 실행 끝*/


/*html 결과값 띄우기*/
App.get("/htmlSee", (req, res) => {
    const pythonSee = `./hrmlEss.csv`;

    fs.exists(pythonSee, function (exists){
       
        if(exists){
            var textArray = fs.readFileSync(pythonSee).toString().split("\n");
            for(i=0; i<textArray.length; i++){
                //console.log("textArray : ", textArray[i]);
                res.write(textArray[i]);
                res.write("\n");
            }
            res.end('');
        }else{
            console.log("No exixts! : ",exists);
            res.send("\n");
        }
    });
});
/*html 결과값 띄우기 끝*/


/*파이썬 결과값 띄우기 결고확인 버튼*/
App.get("/pythonResultSee", (req, res) => {
        let namePy = req.query.namePy  //받은 .py 파일명
        const pythonSee = `./${namePy}.csv`;
        //console.log("파이썬 결과값 띄우기 옴", req.query.namePy, "pythonResultSee 오다!!");
        //console.log("pythonSee : ", pythonSee);
        
        fs.exists(pythonSee, function (exists){
            if(exists){
                var textArray = fs.readFileSync(pythonSee).toString().split("\n");
                
                for(i=0; i<textArray.length; i++){
                    //console.log("textArray : ", textArray[i]);
                    res.write(textArray[i]);
                    res.write("\n");
                }
                res.end('');
            }else{
                console.log("No exixts! : ",exists);
                res.send("\n");
            }
        });
        
});
/*파이썬 결과값 띄우기 끝*/


/* xml, json 파일 유저 디렉토리에 저장*/
App.post("/fileSave", (req, res) => {
    const namePy = req.body.namePy  //받은 .py 파일명
    console.log("저장 namePy : ",namePy);
    
    let filepath = `./${namePy}.csv`;
    let filepath2 = `./${namePy}.json`;
    
    
    zip.file(`${namePy}.csv`, fs.readFileSync(`${namePy}.csv`));
    zip.file(`${namePy}.json`, fs.readFileSync(`${namePy}.json`));
    var zipdata = zip.generate({base64:false,compression:'DEFLATE'});
    fs.writeFileSync(`${namePy}.zip`, zipdata, 'binary');

    res.download(`./${namePy}.zip`)

});
/* xml, json 파일 유저 디렉토리에 저장 끝*/


/* json 파일 DB에 저장*/
App.post("/DBstorage", (req, res) => {
    const namePy = req.body.namePy  //받은 .py 파일명
    console.log("저장 namePy : ",namePy);
    let filepath2 = `./${namePy}.json`;

    fs.readFile(filepath2, (err, data) => {
        var user = JSON.parse(data) 
        
        for(i=0; i<user.length; i++){
            const result = connection.query(
             "INSERT INTO IT_EDU (EDU_CODE, WEBSITE_LIST,COURSE_NAME,COURSE_DURATION,BEGIN_DATE,DESCRIPTION,PUBLICITY,WEBSITE, TYPE, ID) values(?, ?, ?, ?,?, ?, ?, ?, ?, ?)", [
                  null,
                  user[i]['사이트명'],
                  user[i]['과정명'],
                  user[i]['과정기간'],
                  user[i]['과정날짜'],
                  user[i]['설명'],
                  'YES',
                  user[i]['사이트 주소'],
                  user[i]['과정분류'],
                  'admin'
              ]);
        }
        
    });

});
/* json 파일 DB에 저 끝*/







module.exports = App;