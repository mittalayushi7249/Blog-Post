var express = require("express");
var app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/blog_post",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
var expressSanitiser = require("express-sanitizer");
app.use(expressSanitiser());

var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);
// Blog.create({
//     title:"Dogs",
//     image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSm6XvG47t5XgBXfQfA3XXn3i3uQnd6yyX7GA&usqp=CAU",
//     body:"It's impossible to pick favorites when it comes to dogs. Every single one of them deserves the title of man's best friend, and every single one of them deserves a life full of love, cuddles, and lots and lots of toys"
// });
app.get("/",function(req,res){
    res.redirect("/blogs");
});
//index route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
});
//new route
app.get("/blogs/new",function(req,res){
    res.render("new");
});
//create route
app.post("/blogs",function(req,res){
    var newblog = {
        title: req.body.title,
        image: req.body.image,
        body: req.sanitize(req.body.body)
    }
    Blog.create(newblog,function(err,newBlog){
        if(err)
        {
            res.render("new");
        }
        else
        {
            res.redirect("/blogs");
        }
    })
});
//show route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("show",{foundBlog:foundBlog})
        }
    });
});
//edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{foundBlog:foundBlog});
        }
    })
    
});
//update route
app.put("/blogs/:id",function(req,res){
    var updateblog = {
        title: req.body.title,
        image: req.body.image,
        body: req.sanitize(req.body.body) 
    };
    Blog.findByIdAndUpdate(req.params.id,updateblog,function(err,updateBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+(req.params.id));
        }
    });
});
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndDelete(req.params.id,function(err){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
});

app.listen(3000,function(){
    console.log("Blog Post ka server connected");
});
