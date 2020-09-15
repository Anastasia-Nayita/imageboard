(function () {
    ////no let no const no arr functions
    ///only promises
    new Vue({
        el: "main",
        data: {
            heading: "vue heading",
            // cuteAnimals: [],
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        },

        mounted: function () {
            var that = this;
            axios
                .get("/images")
                .then(function (resp) {
                    //console.log("resp.data: ", resp.data);
                    that.images = resp.data.images;

                    // console.log("resp.data: ", resp.data.images);
                })
                .catch(function (err) {
                    console.log("err in get/images:", err);
                });
        },
        methods: {
            handleClick: function (e) {
                e.preventDefault();
                // console.log("this: ", this);
                var formData = new FormData();

                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(function (resp) {
                        console.log("resp in post/upload", resp);
                    })
                    .catch(function (err) {
                        console.log("err in post'upload", err);
                    });
            },
            handleChange: function (e) {
                //console.log("handleChange is firering");
                // console.log("file", e.target.files[0]);
                this.file = e.target.files[0];
            },
        },
    });
})();
