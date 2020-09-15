const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/images"
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images`);
};

module.exports.addImage = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2,$3,$4)
        RETURNING *`,
        [url, username, title, description]
    );
};
