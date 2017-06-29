const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// This creates a basic express app
var app = express();

// Allows the use of patials, which function as reusable snippets
hbs.registerPartials(__dirname + '/views/partials')
// This is used to set various express related configurations.
// passing in a key/value pair.
app.set('view engine', 'hbs');
// Asking express to use some inbuild middleware. __dirname has the path to the project.
// Accessed by typing: http://localhost:3000/help.html
app.use(express.static(__dirname + '/public'));

// Another example of middleware
app.use((req, res, next) => {
  // Here we create a timestamp
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`
  console.log(log);
  // additional argument (callback function) is now required.
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server log.');
    }
  });
  // Without next the programme doesn't continue.
  next();
});

// Challenge middleware
app.use((req, res, next) => {
  app.get('/maintenance', (req, res) => {
    res.render('maintenance.hbs', {
    });
  });
})

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// Sets up a handler for an http get request.
// Here we point at the local root. The second argument is the function to run and
// tells express what to send back to the person who made the request.
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Homepage',
    welcomeMessage: 'Welcome to this fantastic website!',
    //currentYear: new Date().getFullYear()
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    //currentYear: new Date().getFullYear()
  });
});

// app.get('/about', (req, res) => {
//   res.send('About Page');
// });

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Request went bad!'
  })
});

// binds app to listen on port 3000, a common port for local development
// Takes a second argument which can be a function.
app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
