const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/images"
);

module.exports.getImages = () => {
    return db.query(
        `SELECT * FROM images
        ORDER BY id DESC
        LIMIT 6;`
    );
};

exports.getMoreImages = (lastId) => {
    return db.query(
        `SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 6`,
        [lastId]
    );
};

module.exports.addImage = (url, username, title, tags, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, tags, description)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *`,
        [url, username, title, tags, description]
    );
};

module.exports.getImageById = (imageId) => {
    return db
        .query(
            `SELECT * , 
                (SELECT id FROM images
                WHERE id <($1)
                ORDER BY id DESC
                LIMIT 1) AS prev,
                (SELECT id FROM images
                WHERE id >($1)
                ORDER BY id DESC
                LIMIT 1) AS next
            FROM images  
            WHERE id = ($1)`,
            [imageId]
        )
        .then(({ rows }) => rows);
};

module.exports.addComment = (username, comment, image_id) => {
    return db.query(
        `INSERT INTO comments (username, comment, image_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [username, comment, image_id]
    );
};
module.exports.getComment = (image_id) => {
    return db.query(
        `SELECT * FROM comments  
        WHERE image_id = ($1)
        `,
        [image_id]
    );
};
