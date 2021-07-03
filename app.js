const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view enigine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

// MONGOOSE SETUP
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true});

// SCHEMA - COLLECTION
const articleSchema = {
    title: String,
    content: String
}
// MODEL
const Article = mongoose.model("Article", articleSchema);


// CHAINING METHOD TO ARTICLES
// ALL ARTICLES///////////////////////////////////////////
app.route("/articles")
    // get
    .get(function(req, res){
        // find all articles
        Article.find({}, function(err,foundArticle){
            if(!err){
                res.send(foundArticle);
            }else{
                res.send(err);
            }
        });
    })
    // post
    .post(function(req, res){
        
        const title = req.body.title;
        const content = req.body.content;

        // console.log(title, content);

        const articles = new Article({
            title: title,
            content: content
        });

        articles.save({}, function(err){
            if(!err){
                res.send("Succfully added new article");
            }else{
                res.send(err);
            }
        });
    })
    // delete
    .delete(function(req, res) {
        Article.deleteMany({},function(err){
            if(!err){
                res.send("Successfully delete all articles");
            }else{
                res.send(err);
            }
        })
    });

// SPECIFIC ARTICLES /////////////////////////////////////////
app.route("/articles/:articleTitle")
    // find one
    .get(function(req, res){
        Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
            if(!err){
                if(foundArticle){
                    res.send(foundArticle);
                }else{
                    res.send("No matching articles for that title");
                }
            }else{
                console.log(err);
            }
        });
    })
    // replace all content of the article
    .put(function(req, res){
        Article.update(
            {title:req.params.articleTitle},//which article
            {title:req.body.title, content: req.body.content},//what content
            {overwrite: true},
            function(err){
                if(!err){
                    res.send("Successfully updated article");
                }else{
                    console.log(err);
                }
            }
        );
    })
    // replace part of the article
    .patch(function(req, res){
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Successfully updated article");
                }else{
                    console.log(err);
                }
            }
        );
    })
    // delete specific/one
    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("Successfully deleted article");
                }else{
                    console.log(err);
                }
            }
        )
    });

app.listen(3000, function(){
    console.log("Server started on port 3000");
});