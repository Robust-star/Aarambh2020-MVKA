const express = require('express');
const ejs = require('ejs');
const path = require('path');
const http = require('http');

// create server C================
const app = express();
const server = http.createServer(app);

//end 

// Set static folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
//end

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');	

// ==================basic url extract=================

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

const index = require('./routes/index');
app.use('/', index);

// =================url end============

  
// =================server======================


// listen on port 3000
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
