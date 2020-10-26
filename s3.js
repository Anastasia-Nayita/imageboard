const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (req.body.imageLink) {
        console.log("req.body.link", req.body.imageLink);
        next();
    } else {
        const { filename, mimetype, size, path } = req.file;
        console.log("req.file ", req.file);
        const promise = s3
            .putObject({
                Bucket: "touch-of-spice",
                ACL: "public-read",
                Key: filename,
                Body: fs.createReadStream(path),
                ContentType: mimetype,
                ContentLength: size,
            })
            .promise();
        promise
            .then(() => {
                console.log("promise worked");
                next();
            })
            .catch((err) => {
                console.log("err", err);
                res.sendStatus(500);
            });
    }
};
