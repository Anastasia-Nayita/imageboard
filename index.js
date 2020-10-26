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
    db.getImages()
        .then((result) => {
            let images = result.rows;
            res.json({
                images,
            });
        })
        .catch((err) => {
            console.log("err", err);
        });
});

app.get("/more/:lastId", (req, res) => {
    db.getMoreImages(req.params.lastId)
        .then((result) => {
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

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    let url;

    if (req.body.imageLink) {
        url = req.body.imageLink;
    } else {
        const filename = req.file.filename;
        url = `${s3Url}${filename}`;
    }

    db.addImage(
        url,
        req.body.username,
        req.body.title,
        req.body.tags,
        req.body.desc
    ).then(({ rows }) => {
        res.json({
            image: rows[0],
        });
    });
});

app.get("/images/:id", (req, res) => {
    db.getImageById(req.params.id).then((result) => {
        let image = result[0];

        res.json({
            image,
            success: true,
        });
    });
});

app.get("/images/:id/comment", (req, res) => {
    db.getComment(req.params.id).then((results) => {
        var comments = results.rows;
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
    db.addComment(username, comment, id).then(({ rows }) => {
        var comment = rows[0];

        res.json({
            comment,
            success: true,
        });
    });
});

app.listen(8080, () => console.log("server is listenning..."));
