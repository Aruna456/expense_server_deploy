const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: "./config.env" });
const { get_Labels } = require('./controller/controller');

const port = process.env.PORT || 5000;

// Use middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const con = require('./db/connection');

// Use routes
const routes = require('./routes/route');
app.use('/', routes);

con.then(db => {
    if (!db) return process.exit(1);

    // Listen to HTTP server
    app.listen(port, () => {
        console.log(`Server is running on port: http://localhost:${port}`);
    });

    app.on('error', err => console.log(`Failed to connect with HTTP server: ${err}`));

}).catch(error => {
    console.log(`Connection Failed...! ${error}`);
});
