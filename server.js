var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var logger = require("morgan");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/NewsScraper", { useNewUrlParser: true });
// mongoose.connect("mongodb://sergio23jr:Home5104@ds029197.mlab.com:29197/news-scraper", { useNewUrlParser: true });
mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_URL || "mongodb://news-scraper:soccer23@ds119755.mlab.com:19755/heroku_wh2j1psc",
    {
        useeMongoClient: true
    });

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


//routes

app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.chicagotribune.com/news/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("a.trb_outfit_relatedListTitle_a").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .text();
            result.link = $(this)
                .attr("href");

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log("article", dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log("error", err);
                });
        });

        // Send a message to the client
        res.send("Scrape Complete");
    });
});

app.get("/articles", async function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    const articles = await db.Article.find()


    res.json(articles)

});

app.get("/saveArticle", async function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    const articles = await db.Article.find({ saved: true })

    res.json(articles)

});

app.post("/saveArticle/:id", async function (req, res) {
    console.log("in theis route")
    let articleBeingSave = req.params.id
    const test = db.Article.find({ _id: articleBeingSave })
    db.Article.updateOne({ _id: articleBeingSave }, { $set: { saved: true } }).then((err, data) => {
        console.log(res.json(data))
    })
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
