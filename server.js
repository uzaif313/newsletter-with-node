const express = require('express');
const request = require('request');
const async = require('async');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const expressHbs = require('express-handlebars');
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const flash = require("express-flash")

//create express app
const app  = express()

//Setup port no
const port = 8000

// mailchimp list_id
const mailchimp_list_id = "a1eb31c2dd"
const mailchimp_api_key = "c6354dbb8346f92cbaf7902e91220b47-us17"
const list_end_point = `https://us17.api.mailchimp.com/3.0/lists/${mailchimp_list_id}/members`
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

app.route("/")
    .post((req, res, next) => {
      console.log(list_end_point)
      // console.log(req.body.email)
      request({
        url:list_end_point,
        method:"POST",
        headers:{
          "Authorization": `randomUser ${mailchimp_api_key}`,
          "Content-Type": "application/json"
        },
        json:{
          'email_address':req.body.email,
          'status':"subscribed"
        }
      },function(err,response,body){
        if (err) {
          console.log(err);
        }else{
          console.log("Successfully sent")
          res.redirect("/")
        }
      })
    })
    .get((req, res, next) => {

      console.log("test")
      res.render("main/home")
    })
app.listen(port,(err)=>{
  if (err) {
    console.log(err)
  }else {
    console.log(`Server is Running on ${port}`)
  }
})
