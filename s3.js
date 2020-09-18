const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (req.body.imageLink) {
        // return res.sendStatus(500);
        // console.log("req", req);
        console.log("req.body.link", req.body.imageLink);
        // return;
        next();
    } else {
        // if (req.url)
        const { filename, mimetype, size, path } = req.file;
        console.log("req.file ", req.file);
        const promise = s3
            .putObject({
                Bucket: "touch-of-spice", ///name of the bucket
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
