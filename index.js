const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config");
app.use(express.static("public"));
app.use(express.json());

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.get("/images", (req, res) => {
    //// console.log("something in the get");
    db.getImages()
        .then((result) => {
            //console.log("result.rows ", result.rows);
            let images = result.rows; ///check data from animalsa again
            res.json({
                images,
            });
        })
        .catch((err) => {
            console.log("err", err);
        });
});

app.get("/more/:lastId", (req, res) => {
    // db.getMoreImages(lastId)
    // console.log("req.params.lastId: ", req.params.lastId);
    db.getMoreImages(req.params.lastId)
        .then((result) => {
            console.log("result.rows in MORE: ", result.rows);
            let images = result.rows;

            res.json({
                images,
                success: true,
            });
        })
        .catch((err) => {
            console.log("err in getMore", err);
        });
});

// app.post("/more", (req, res) => {
//     // db.getMoreImages(lastId)
//     console.log("SOMETHING IN THE POST MORE");
// });

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    let url;

    if (req.body.imageLink) {
        url = req.body.imageLink;
    } else {
        const filename = req.file.filename;
        url = `${s3Url}${filename}`;
    }

    console.log("req.body: ", req.body);
    /////    cutUrl=newUrl.substring(url.lastIndexOf('/') + 1)   cut url part

    db.addImage(url, req.body.username, req.body.title, req.body.desc).then(
        ({ rows }) => {
            res.json({
                image: rows[0],
            }); ///add catch for err and do success true/false
        }
    );

    // console.log("file", req.file);
    // console.log("input", req.body);
});

app.get("/images/:id", (req, res) => {
    // console.log("something in the get imageId");
    //console.log("req.params: ", req.params);
    db.getImageById(req.params.id).then((result) => {
        /// console.log("result in image/id: ", result[0]);
        let image = result[0];

        res.json({
            image,
            success: true,
        });
    });
});

app.get("/images/:id/comment", (req, res) => {
    // console.log("something in the get imageId");
    //console.log("req.params in images/:id/comment :  ", req.params);
    //console.log("req.params.id in images/:id/comment :  ", req.params.id);

    db.getComment(req.params.id).then((results) => {
        var comments = results.rows;
        // console.log("comments in images/:id/comment", comments);
        res.json({
            comments,
            success: true,
        });
    });
});

app.post("/comment", (req, res) => {
    var comment = req.body.comment;
    var username = req.body.username;
    var id = req.body.id;
    ///console.log("req.params", req.body);
    db.addComment(username, comment, id).then(({ rows }) => {
        /// console.log("this worked");
        ///  console.log("req.body: ", req.body);
        var comment = rows[0];

        res.json({
            comment,
            success: true,
        });
    });
});

app.listen(8080, () => console.log("server is listenning..."));
