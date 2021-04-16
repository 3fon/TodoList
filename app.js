const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const mongoose = require('mongoose')
const date = require(__dirname + "/date.js");
const _ = require('lodash');

const day = date.getDay();
const app = express();

let list = "/";

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://admin-test:test@cluster0.guakv.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String
}

const listSchema = {
    name: String,
    items: [itemsSchema],
}

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
    List.findOne({name: "Today"}, (err, foundList) => {
        res.render("list", {listTitle: "Today", newListItem: foundList.items, whichList: list})
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/:customListName", (req, res) => {
    const listName = _.capitalize(req.params.customListName);
    List.findOne({name: listName}, (err, foundList) => {
        if (err) {
            console.log(err);
        } else if (!foundList) {
            // if foundList doesnt exists - create a new list
            const list = new List({
                name: listName,
            });
            list.save();
            res.redirect("/" + listName);
        } else {
            res.render("list", {listTitle: listName, newListItem: foundList.items, whichList: listName})
        }
    });
});



// POSTS

app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.listName;
    const item = new Item ({
        name: itemName,
    });
    if (itemName != "") {        
        List.findOne({name: listName}, (err, foundList) => {
        foundList.items.push(item);
        foundList.save();
        if (listName === "Today"){
            res.redirect("/");
        } else {
            res.redirect("/" + listName);
        }
    });        
    }
    
    

});

app.post("/delete", (req, res) => {
    const itemId = req.body.checkedItem;
    const listName = req.body.listName;

    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemId}}}, (err, foundList) => {
        if (err){
            console.log(err);
        } else {
            res.redirect("/" + listName);
        }
    });
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server started successfully!");
});


