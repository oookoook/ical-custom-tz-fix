const express = require('express');
var cors = require('cors');

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
        
        // Choose appropriate protocol module
        const protocol = icalUrl.startsWith('https') ? require('https') : require('http');
        protocol.get(icalUrl, (response) => {
            let content = '';
            response.on('data', (chunk) => {
                content += chunk;
            });
            response.on('end', () => {
                const modified = content.replace(/Customized Time Zone/g, fixedTz);
                res.send(modified);
            });
        }).on('error', (err) => {
            console.error(err);
            res.status(500).send('Error downloading iCal feed.');
        });
    });

module.exports = app;


