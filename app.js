
$(document).ready(function () {

    var app = new Vue({

        el: '#app',

        data: {
            devices: [],
            count: null

        },

        created: function () {
            this.fetchData()
        },

        watch: {
            currentBranch: 'fetchData'
        },

        methods: {
            fetchData: function () {
                var scope = this;
                $.ajax({
                    url: "https://api.applicationinsights.io/beta/apps/de9defd4-5d7a-403d-9b7e-0dd210fa59c7/events/customEvents?$filter=timestamp%20lt%20now()&$select=customDimensions",
                    headers: {
                        "x-api-key": "0kf8d3tsxz437efvlem2xg6xvb7nobkco13vlpgi"
                    },
                    success: function (data) {
                        scope.devices = _.uniqBy(data.value, function (v) {
                            return v.customDimensions.macAddress;
                        });
                        scope.count = scope.devices.length;
                    },
                    error: function () {
                        scope.count = "N/A";
                    },
                    method: 'GET'
                });
            }
        }
    });
});