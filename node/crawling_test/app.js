const Express = require('express')
const Morgan = require('morgan')
const Path = require('path')
const BodyParser = require('body-parser')
const CookieParser = require('cookie-parser')

const App = Express()


App.set('port', process.env.port || 3000)
App.use(Morgan('dev'))
App.use(BodyParser.json())
App.use(BodyParser.urlencoded({extended : false}))
App.use(CookieParser())
App.use(Express.static(Path.join(__dirname,'public')))

var Mysql = require('./routes/Main.js')
App.use('/', Mysql)

App.listen(App.get('port'), () => {
   console.log('3000 port : Server Started...')
})