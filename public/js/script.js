(function () {
    ////no let no const no arr functions
    ///only promises
    new Vue({
        el: "main",
        data: {
            heading: "vue heading",
            // cuteAnimals: [],
            images: [],
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
    });
})();
