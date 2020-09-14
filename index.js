const express = require("express");
const app = express();
const db = require("./db");
app.use(express.static("public"));

app.get("/images", (req, res) => {
    //console.log("something in the get");
    db.getImages()
        .then((result) => {
            console.log("result.rows ", result.rows);
            let images = result.rows;
            res.json({
                images,
            });
        })
        .catch((err) => {
            console.log("err", err);
        });
});

app.listen(8080, () => console.log("server is listenning..."));
