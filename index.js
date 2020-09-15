const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config");
app.use(express.static("public"));

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

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const filename = req.file.filename;
    const url = `${s3Url}${filename}`;
    db.addImage(url, req.body.title, req.body.desc, req.body.username).then(
        {{rows}} => {
            res.json({
                image: rows(0)
            })
        }
    )




    console.log("file", req.file);
    console.log("input", req.body);

    if (req.file) {
        ///db insert for all info
        res.json({
            success: true,
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => console.log("server is listenning..."));
