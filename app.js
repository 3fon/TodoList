const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const mongoose = require('mongoose')
const date = require(__dirname + "/date.js");


const day = date.getDay();
const app = express();

let list = "/";

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String,
    list: String,
}

const Item = mongoose.model("Item", itemsSchema);



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
    list = "/";
    Item.find({list: "main"},(err, foundItems) =>{
        if (err) {
            console.log(err);
        } else {

            res.render("list", {listTitle: day, newListItem: foundItems, whichList: list})
        }
    });

});

app.get("/work", (req, res) => {
    list = "/work";
    Item.find({list: "work"},(err, foundItems) =>{
        if (err) {
            console.log(err);
        } else {

            res.render("list", {listTitle: day, newListItem: foundItems, whichList: list})
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});

// POSTS

app.post("/", (req, res) => {
    const item = new Item ({
        name: req.body.newItem,
        list: "main"
    });
    item.save();
    res.redirect("/");
});

app.post("/work", (req, res) => {
    const item = new Item ({
        name: req.body.newItem,
        list: "work"
    });
    item.save();
    res.redirect("/work");
});

app.post("/delete", (req, res) => {

    const checkedItemId = req.body.checkedItem;
    Item.findOne({_id: checkedItemId}, (err, foundItem) => {

        if(err){
            console.log(err);
        } else {
            foundItem.delete();
            res.redirect("/" + foundItem.list);
        }
    });
});




app.listen(3000, () => {
    console.log("Server started on port 3000");
});


