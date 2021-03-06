require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var passport = require('passport');
var cors = require('cors');
var swaggerJsdoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

var swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "eTV",
      version: "1.0.0",
      description: "eTV REST API"
    },
    servers: [
      { url: "http://localhost:3000/api" },
      { url: "YOUR PRODUCTION URL/api" }
    ]
  },
  apis: [
    "./app_api/models/uporabniki.js",
    "./app_api/models/cakalnaVrsta.js",
    "./app_api/models/clanki.js",
    "./app_api/routes/index.js"
  ]
};
const swaggerDocument = swaggerJsdoc(swaggerOptions);


require('./app_api/models/db');
require('./app_api/konfiguracija/passport');

//var indexRouter = require('./app_server/routes/index');
var indexApi = require('./app_api/routes/index');

var app = express();

// Preusmeritev na HTTPS na Heroku
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else
      next();
  });
}

// povecane omejitve za slike
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

//require('./app_server/views/helpers/hbsh.js');

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.header('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public', 'build'))); //mogoce bo treba odstrant 21.3.1

app.use(passport.initialize());

//Handles robots.txt
app.all('/robots.txt', (req, res) => {
  res.type('text/plain')
  res.send("User-agent: *\Allow: /");
});

app.use(cors());
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  next();
});

//app.use('/', indexRouter);
app.use('/api', indexApi);
app.get(/(\/)|(\/danes)|(\/ekonomija)|(\/izobrazba)|(\/covid)|(\/kultura)|(\/sport)|(\/videoteka)|(\/prijava)|(\/profile)|(\/profile\/uredi)|(\/registracija)|(\/mediainput)|(\/odobritev)|(\/admin)|(\/live)|(\/prikaziVsePriljubljene)|(\/prikaziVseMoje)|(\/article\/[a-z0-9]{24})|(\/rezultatiIskanja\\?iskalniNiz\/[a-z0-9 +-/*&%$#@???]*)/, (req, res, next) => {
  res.sendFile(path.join(__dirname, 'app_public', 'build', 'index.html'));
});

indexApi.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
indexApi.get("/swagger.json", (req, res) => {
  res.status(200).json(swaggerDocument);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Obvladovanje napak zaradi avtentikacije
app.use((err, req, res, next) => {
  if (err.name == "UnauthorizedError") {
    res.status(401).json({"sporo??ilo": err.name + ": " + err.message});
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
