const express = require('express');
var cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());


const isAuthenticated = function (req, res, next) {
    if(!process.env.API_KEY || process.env.API_KEY.length == 0) {
        console.log('Authentication disabled.');
        next();
        return;
    }

    if(req.query.key && req.query.key == process.env.API_KEY) {
        next();
    } else {
        res.sendStatus(403);
    }
  };

app.use(isAuthenticated);

app.route('/')
    .get(function(req, res) {
        // return hello world in JSON
        res.json({ message: 'Hello World!' });
    })

app.route('/fixed-ical.ics')
    .get(function(req, res) {
        // Retrieve query parameters
        const icalUrl = req.query.ical;
        const fixedTz = req.query["fixed-tz"];
        if (!icalUrl || !fixedTz) {
            return res.status(400).send('Missing "ical" or "fixed-tz" query parameters.');
        }
        
        // Validate the icalUrl is a proper URL
        try {
            new URL(icalUrl);
        } catch (e) {
            return res.status(400).send('Invalid "ical" URL provided.');
        }
        
        // Use axios to fetch the iCal content
        axios.get(icalUrl, {
            headers: {
                //'User-Agent': 'curl/8.5.0',
                //'Accept': '*/*'
            },
            responseType: 'text'
        })
        .then(response => {
            const modified = response.data.replace(/Customized Time Zone/g, fixedTz);
            res.set('Content-Type', 'text/calendar');
            res.send(modified);
        })
        .catch(err => {
            console.error('Error downloading iCal feed:', err.message);
            res.status(500).send('Error downloading iCal feed.');
        });
    });

module.exports = app;


