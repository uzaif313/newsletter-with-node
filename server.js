const express = require('express');
const request = require('request');
const async = require('async');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const expressHbs = require('express-handlebars');
//create express app
const app  = express()

//Setup port no
const port = 8000

// body parser middleware setup for read form data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


// static asset middleware
app.use(express.static(__dirname+"/public"))

// setup template engine
app.engine('.hbs', expressHbs({defaultLayout:'application',extname:'.hbs'}))
app.set('view engine', 'hbs')

// morgan middleware setup inspect log
app.use(morgan("dev"))

app.get("/",(req ,res, next) => {
  res.render("main/home")
})

app.listen(port,(err)=>{
  if (err) {
    console.log(err)
  }else {
    console.log(`Server is Running on ${port}`)
  }
})
