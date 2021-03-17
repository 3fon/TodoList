const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const mongoose = require('mongoose')
const date = require(__dirname + "/date.js");

const day = date.getDay();

const app = express();

let list = "/"
let items = [];
let workItems = [];

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String,
    list: String,
}

const Item = mongoose.model("Item", itemsSchema);



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
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

})

app.post("/", (req, res) => {
    let item = req.body.newItem;
    items.push(item);
    res.redirect("/");
})

app.get("/work", (req, res) => {
    list = "/work";
    res.render("list", {listTitle: "Work List", newListItem: workItems, whichList: list});
})

app.post("/work", (req, res) => {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})

app.get("/about", (req, res) => {
    res.render("about");
})


app.listen(3000, () => {
    console.log("Server started on port 3000");
})


