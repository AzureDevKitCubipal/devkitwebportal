/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var xhub = require('express-x-hub');

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

var received_updates = [];

app.get('/', function(req, res) {
  console.log(req);
  res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
});

app.get('/facebook', function(req, res) {
  if (
    req.param('hub.mode') == 'subscribe' &&
    req.param('hub.verify_token') == 'token'
  ) {
    res.send(req.param('hub.challenge'));
  } else {
    res.sendStatus(400);
  }
});

app.post('/facebook', function(req, res) {
  console.log('Facebook request body:', req.body);

  if (!req.isXHubValid()) {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.sendStatus(401);
    return;
  }

  console.log('request header X-Hub-Signature validated');
  // Process the Facebook updates here
  received_updates.unshift(req.body);
  res.sendStatus(200);
});

app.listen();

/*
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
*/