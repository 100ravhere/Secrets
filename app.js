//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
mongoose.connect("mongodb://localhost:27017/user",{useNewUrlParser:true});
const userschema = new mongoose.Schema({
  email:String,
  password:String
});

userschema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const User = new mongoose.model("User",userschema);
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.get("/",function(req,res)
{
  res.render("home");
})
app.get("/register",function(req,res)
{
  res.render("register");
});
app.get("/login",function(req,res)
{
  res.render("login");
})
app.post("/register",function(req,res)
{
  const userone = new User(
{
  email: req.body.username,
  password: req.body.password
});

userone.save(function(err)
{
  if(err)
  {
    res.send(err);
  }
  else {
    res.render("secrets");
  }
})
})
app.post("/login",function(req,res)
{
  User.findOne({email:req.body.username},function(err,result)
{
  if(err)
  { console.log(err); }
  else {
    if(result)
    {
    if(result.password === req.body.password )
    {
      res.render("secrets");
    }
}
  }
})
})
app.listen(3000,function()
{
  console.log("Server started on port 3000");
})
