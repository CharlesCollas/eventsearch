'use strict';

var express    = require('express'),
    Lanyrd     = require('lanyrd'),
    bodyParser = require('body-parser'),
    morgan     = require('morgan');	// log requests to the console (express4)

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended': 'true'}));           // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

var jsonArr = [];

function parseEvents(res, events, jsonArr) {
    if (events.length > 0) {
		for (var i = 0; i < events.length; i++) {
			if (events[i].subtitle) {
				var split = events[i].subtitle.split(" — ");

				var date = split[0];
				var splitdate = date.split(" ");
				var day = splitdate[0];
				var year = splitdate[splitdate.length - 1];
				var datevent = date.slice(date.indexOf(day) + day.length, date.indexOf(year));

				var place = split[1];
			} else {
				var day = "";
				var datevent = "";
				var year = "";
				var place = "";
			}

			jsonArr.push({
				title: events[i].title,
				link: events[i].external,
				day: day,
				datevent: datevent,
				year: year,
		        place: place,
		        isevent: "yes"
		    });
		}
	} else {
		jsonArr.push({
			isevent: "no"
		});
	}

	res.json(jsonArr);
}

app.post('/events', function(req, res) {
	if (req.body.newsearch === 1) {
		while (jsonArr.length > 0) {
		    jsonArr.pop();
		}

	}
	Lanyrd.search(req.body.text, req.body.page, req.body.context, function(err, resp, events) {
		parseEvents(res, events, jsonArr);
	});
});

app.get('*', function(req, res) {
    res.sendFile('/index.html');
});

app.listen(8080);