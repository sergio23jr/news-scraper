$(document).ready(function () {

    $("#scrape-articles").on("click", function () {
        $("#articles").empty()

        $.getJSON("/articles", function (articles) {

            articles.forEach(article => {
                const parentDiv = $("<div>")
                parentDiv.attr({ id: article._id, class: "parent-article row News-Articles", style: "margin: 2px 0; background-color: white;" })
                const titleDiv = $("<div>")
                titleDiv.addClass("News-Articles col-md-10")
                parentDiv.append(titleDiv)
                const title = $("<a>")
                title.attr({ class: "article-text", href: "https://www.chicagotribune.com" + article.link, target: "_blank" })
                titleText = $("<h4>")
                titleText.addClass("text-left")
                titleText.text(article.title)
                title.append(titleText)
                titleDiv.append(title);

                const buttonDiv = $("<div>")
                buttonDiv.addClass("col-md-2 btnDiv")
                parentDiv.append(buttonDiv)
                const saveBtn = $("<button>")
                saveBtn.text("Save Article")
                saveBtn.addClass("btn btn-success btn-save")
                saveBtn.attr({ id: article._id })
                buttonDiv.append(saveBtn)
                $("#articles").append(parentDiv)

            })
        });

        // Grab the articles as a json

    })

    $(document).on("click", ".btn-save", function () {
        const articleId = this.id

        $.ajax({
            method: "POST",
            url: "/saveArticle/" + articleId,
            data: {
                _id: articleId
            }
        }).then(function (data) {
            console.log("Article saved")
        });
    })

    $(document).on("click", "#clear-articles", function () {
        $("#articles").empty()
    });

    $("#saved-articles").on("click", function (err, res) {
        $("#articles").empty()
        $.getJSON("/saveArticle", function (articles) {
            articles.forEach(article => {
                const parentDiv = $("<div>")
                parentDiv.attr({ id: article._id, class: "row News-Articles", style: "margin: 2px 0; background-color: white;" })
                const titleDiv = $("<div>")
                titleDiv.addClass("News-Articles col-md-10")
                parentDiv.append(titleDiv)
                const title = $("<a>")
                title.attr({ class: "article-text", href: "https://www.chicagotribune.com" + article.link })
                titleText = $("<h4>")
                titleText.text(article.title)
                title.append(titleText)
                titleDiv.append(title);

                const buttonDiv = $("<div>")
                buttonDiv.addClass("btnDiv col-md-2")
                parentDiv.append(buttonDiv)
                const noteBtn = $("<button>")
                noteBtn.text("Add Note")
                noteBtn.attr({
                    id: article._id,
                    type: "button",
                    class: " btn-note btn btn-primary",
                    "data-toggle": "modal",
                    "data-target": "#myModal"
                })
                buttonDiv.append(noteBtn)
                $("#articles").append(parentDiv)
            })
        })
    })
});