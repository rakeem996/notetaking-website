const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({extended:true})); 
app.use(express.static("public"));

app.set("view engine","ejs");


//creting a database--------------------------
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/todolistDB");


//creating a item collection 
const itemSchema = new mongoose.Schema({
    name:String
});


//adding new items to db
const Item = mongoose.model("Item",itemSchema);

const defaultItems = [
    {
        name:"need to go shopping"
    },
    {
        name:"need to study"
    },
    {
        name:"watch the new show"
    }
]

//creting a list collection
const listSchema = new mongoose.Schema({
    name:String,
    items:[itemSchema]
})

//creating a model for List collection
const List = mongoose.model("List",listSchema);

app.get("/",function(req,res){
    let day = date.getDay();

    Item.find({},function(err,items){    
        if(items.length == 0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("successfully added");
                }
            });
            res.redirect("/")
        }else{
            res.render("list",{listTitle:day , ItemList:items});
        }
    })

});

app.post("/",function(req,res){
    let newItem = req.body.newItem;
    let newList = req.body.list;

    const item = new Item({
        name:newItem
    })

    if(newList == date.getDay()){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:newList} , function(err,resultList){
            if(!err){
                resultList.items.push(item);
                resultList.save();
            }
        });
        res.redirect("/"+newList);
    }



});

//getting a post requiest to delete a item----------
app.post("/delete",function(req,res){
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;
    if(listName == date.getDay()){
        Item.deleteOne({_id:checkedItem},function(err){
            if(!err){
                res.redirect("/");
            }
        });
    }else{
        List.findOneAndUpdate({name:listName} , {$pull:{items:{_id:checkedItem}}} , function(err,resultList){
            if(!err){
                res.redirect("/"+listName);
            }
        })
    }
})

//creating a list using route parameters  ---------
app.get("/:listName",function(req,res){
    customListName = _.capitalize(req.params.listName);

    List.findOne({name:customListName} , function(err,foundListName){
        if(!err){
            if(!foundListName){
                const newList = new List({
                    name:customListName,
                    items:defaultItems
                });
                newList.save();
                res.redirect("/"+customListName);
            }else{
                res.render("list",{listTitle:customListName , ItemList:foundListName.items});
            }
        }
        
    })
})

//creating a about page 
app.get("/about",function(req,res){
    res.render("about");
})

app.listen(3000,function(){
    console.log("the server has started at port 3000");
})