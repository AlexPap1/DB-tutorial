// Global variables
const express = require('express');
const path = require('path');
const { resourceLimits } = require('worker_threads');
const connection = require('./db/connection');

// Tell node that we are creating an "express" server
const app = express();
// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get all tables that aren't waiting
app.get('/api/tables', function(req, res) {
    connection.query('SELECT * FROM tables WHERE isWaiting = FALSE', function(err, dbTables) {
        res.json(dbTables)
    });
});

// Save a new table
// Set isWaiting to true if there are already 5 or more "seated" tables
app.post('/api/tables', function(req, res) {
    connection.query('SELECT COUNT(IF(isWaiting = FALSE, 1, NULL)) "count" FROM tables', function(err, dbSeated) {
        if (err) throw err;
        
        //[0] first item in dbSteaed count
        if (dbSeated [0].count > 4) {
            req.body.isWaiting = true;
        }

        connection.query('INSERT INTO tables SET ?', req.body, function(err, result) {
            if (err) throw err;
            
            connection.query('SELECT * FROM tables WHERE id = ?', (result.insertID), function(err, dbTables) {
                res.json(dbTables[0])
            });
        });
    });
});


// Get all tables where isWaiting is true (waiting list)
app.get('/api/waitlist', function(req,res) {
    connection.query('SELECT * FROM tables WHERE isWaiting = TRUE', function(err, dbTables) {
        res.json(dbTables)
    });
});

// Clear all tables
app.delete('/api/tables', function (req, res) {
    connection.query('DELETE FROM tables', function(err, results) {
        if (err) throw err;
        res.json(results);
    });
});

// Render tables.html at the "/tables" path
app.get('/tables', function(req, res) {
    res.sendFile(path.join(__dirname, './public/tables.html'));
});

// Render reserve.html at the "/reserve" path
app.get('/reserve', function(req, res) {
    res.sendFile(path.join(__dirname, './public/home.html'));
});

// All other paths serve the home.html page MUST GO LAST
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './public/reserve.html'));
});

// create connection to port
app.listen(PORT, function() {
    console.log(`Listening at ${PORT}`)
});
