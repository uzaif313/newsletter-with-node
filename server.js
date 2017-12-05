const express = require('express');
const request = require('request');
const async = require('async');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const expressHbs = require('express-handlebars');
const session = require("express-session");
const redis = require("redis");
const redisStore = require("connect-redis")(session);
const flash = require("express-flash")
const client = redis.createClient();
require('dotenv').config()
//create express app
const app  = express()

// redis Setup

app.use(session({
    secret:"SuPeRSecrET",
    store:new redisStore({
      host:"localhost",
      port:6379,
      client:client,
      ttl:260
    }),
    saveUninitialized:false,
    resave:false,
}))
app.use(flash());


//Setup port no
const port = 8000

// mailchimp list_id
const mailchimp_list_id = process.env.mailchimp_list_id;
const mailchimp_api_key = process.env.mailchimp_api_key;
const list_end_point    = process.env.list_end_point;
//mongolab

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
          req.flash("success","You Have submitted email")
          res.redirect("/")
        }
      })
    })
    .get((req, res, next) => {
      res.render("main/home",{message:req.flash("success")})
    })
app.listen(port,(err)=>{
  if (err) {
    console.log(err)
  }else {
    console.log(`Server is Running on ${port}`)
  }
})
