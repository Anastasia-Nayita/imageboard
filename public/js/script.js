(function () {
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
        watch: {
            imageId: function () {
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
                location.hash = "";
            },

            submitComment: function (e) {
                e.preventDefault();
                var thatCom = this;

                var comData = {
                    comment: thatCom.comment,
                    username: thatCom.username,
                    id: thatCom.imageId,
                };

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
        },

        mounted: function () {
            var thatImg = this;

            axios
                .get("/images")
                .then(function (resp) {
                    thatImg.images = resp.data.images;
                })
                .catch(function (err) {
                    console.log("err in get/images:", err);
                });

            window.addEventListener("hashchange", function () {
                thatImg.imageId = location.hash.slice(1);
            });
        },

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

                var thatImg = this;
                axios
                    .post("/upload", formData)
                    .then(function (resp) {
                        thatImg.images.unshift(resp.data.image);
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

                        console.log("resp.data in MORE: ", resp.data);
                    })
                    .catch(function (err) {
                        console.log("err in get More script", err);
                    });
            },
        },
    });
})();
