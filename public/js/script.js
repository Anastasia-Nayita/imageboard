(function () {
    ////no let no const no arr functions
    ///only promises

    Vue.component("first-component", {
        template: "#first-component",
        props: ["imageId"],
        data: function () {
            return {
                heading: "somekind of heading",
                imageData: [],
                comment: "",
                username: "",
                comments: [],
                next: "",
                prev: "",
            };
        },
        mounted: function () {
            // console.log("This id of the component", this.imageId);
            ///axios to make a req to get data
            // console.log("this in mounted component", this);
            var thatImg = this;
            //console.log("thatImg: ", thatImg);

            axios
                .get("/images/" + this.imageId)
                .then(function (resp) {
                    //console.log("resp.data.image SCRIPT.JS", resp.data.image);
                    thatImg.prev = resp.data.image.prev;
                    thatImg.next = resp.data.image.next;
                    thatImg.imageData = resp.data.image;
                    //console.log("thatImg.prev: ", thatImg.prev);
                    //// here should be prev and next   and add it to watcher

                    //console.log("thatImg after adding data", thatImg);
                    // console.log("thatImg.title: ", thatImg.title);
                })
                .catch(function (err) {
                    console.log("err in mounted component", err);
                });
            axios
                .get("/images/" + this.imageId + "/comment")
                .then(function (resp) {
                    thatImg.comments = resp.data.comments;
                    /// console.log("resp.data: ", resp.data);
                    /// console.log("resp.data.comments: ", resp.data.comments);
                    //console.log("thatImg after adding data", thatImg);
                    // console.log("thatImg.title: ", thatImg.title);
                })
                .catch(function (err) {
                    console.log("err in mounted component", err);
                });
        },
        watch: {
            ///when imageid changes watcher is running
            imageId: function () {
                // console.log("something changed. IM WATCHING");
                //same that in mounted think about how to make it clean and runs once
                ///also check for jibra-jabra in url                🔥🔥🔥  Come back here

                var thatImg = this;
                axios
                    .get("/images/" + this.imageId)
                    .then(function (resp) {
                        thatImg.prev = resp.data.image.prev;
                        thatImg.next = resp.data.image.next;
                        thatImg.imageData = resp.data.image;
                    })
                    .catch(function (err) {
                        console.log("err in mounted component", err);
                    });
                axios
                    .get("/images/" + this.imageId + "/comment")
                    .then(function (resp) {
                        thatImg.comments = resp.data.comments;
                    })
                    .catch(function (err) {
                        console.log("err in mounted component", err);
                    });
            },
        },
        methods: {
            handleClick: function () {
                //this.heading = "heading was clicked";

                // console.log("location.hash: ", location.hash);
                // console.log("handleClick is running in Vue Component");

                location.hash = "";

                ///when we close set url to empty string '' location.hash something
                ///thatImg.imageId = location.hash.slice(1);
            },

            submitComment: function (e) {
                e.preventDefault();
                var thatCom = this;

                var comData = {
                    comment: thatCom.comment,
                    username: thatCom.username,
                    id: thatCom.imageId,
                };
                //console.log("comData", comData);

                axios
                    .post("/comment", comData)
                    .then(function (resp) {
                        thatCom.comments.unshift(resp.data.comment);
                    })
                    .catch(function (err) {
                        console.log("err in post'comment", err);
                    });
            },
        },
    });

    new Vue({
        el: "main",
        data: {
            heading: "vue heading",
            images: [],
            imageId: location.hash.slice(1),
            title: "",
            tags: "",
            description: "",
            username: "",
            file: null,
            imageLink: "",
            // showModal: false,
        },

        mounted: function () {
            var thatImg = this;

            // console.log()
            axios
                .get("/images")
                .then(function (resp) {
                    thatImg.images = resp.data.images;
                    //console.log("resp.data.images: ", resp.data.images);
                    // resp.data.images.unshift()

                    // console.log(
                    //     "resp.data.images.id: ",
                    //     resp.data.images[0].id
                    // ); ////last id
                })
                .catch(function (err) {
                    console.log("err in get/images:", err);
                });

            window.addEventListener("hashchange", function () {
                // console.log(location.hash);
                thatImg.imageId = location.hash.slice(1);

                ///when we close set url to empty string '' location.hash something
            });
        },
        ////console.log("that.images: ", that.images),

        methods: {
            handleClick: function (e) {
                e.preventDefault();

                var formData = new FormData();

                formData.append("title", this.title);
                formData.append("tags", this.tags);
                formData.append("description", this.description);
                formData.append("username", this.username);
                if (!this.imageLink) {
                    formData.append("file", this.file);
                } else {
                    formData.append("file", this.file);
                    formData.append("imageLink", this.imageLink);
                }

                //console.log("!!!formData: ", formData);c

                //console.log("this: ", this);
                var thatImg = this;
                axios
                    .post("/upload", formData)
                    .then(function (resp) {
                        thatImg.images.unshift(resp.data.image);

                        //console.log("thatImg.images: ", thatImg.images);
                    })
                    .catch(function (err) {
                        console.log("err in post'upload", err);
                    });
            },
            handleChange: function (e) {
                this.file = e.target.files[0];
            },
            clickComponent: function (id) {
                this.imageId = null;

                console.log("clickedComponent is running");
            },
            clickMore: function (e) {
                e.preventDefault();

                var thatImg = this;
                var lastId = thatImg.images[thatImg.images.length - 1].id;
                console.log("WE ARE GETTING HERE");
                //console.log("thatImg.images[0].id: ", thatImg.images[0].id);
                axios
                    .get("/more/" + lastId)
                    .then(function (resp) {
                        thatImg.images = thatImg.images.concat(
                            resp.data.images
                        );
                        //var lastId = thatImg.images[0].id - 6;
                        // resp.data.lastId = thatImg.images[0].id - 6;
                        console.log("resp.data in MORE: ", resp.data); //// COME BACK TO SEE WHAT IS RESP HERE
                    })
                    .catch(function (err) {
                        console.log("err in get More script", err);
                    });

                // var startId = this.images[0].id;
                // var offset = 6;

                // console.log("resp.data.images.id: ", resp.data.images[0].id); ////last id
            },
        },
    });
})();
