const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended:true})); 
app.use(express.static("public"));

app.set("view engine","ejs");

const items = ["buy food","cook food","eat food"];
const workItems = [];

//creating a list in home route-------------
app.get("/",function(req,res){
    let day = date.getDay();
    res.render("list",{listTitle:day , ItemList:items});
});

app.post("/",function(req,res){
    let item = req.body.newItem;
    if(req.body.list == "Work List"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
});

//creating a work list ---------
app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List" , ItemList:workItems });
})

//creating a about page 
app.get("/about",function(req,res){
    res.render("about");
})

app.listen(3000,function(){
    console.log("the server has started at port 3000");
})