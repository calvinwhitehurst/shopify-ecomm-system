var express = require("express");
var app = express();
var session = require("express-session");

var morgan = require("morgan");
var cors = require("cors");
var bodyParser = require("body-parser");
var passport = require("passport");
var flash = require("connect-flash");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt-nodejs");
var favicon = require("serve-favicon");
var helmet = require("helmet");
var MySQLStore = require("express-mysql-session")(session);
var moment = require("moment");
var isLoggedIn = require("./routes/custom_modules/isLoggedIn.js");
var connection = require("./routes/custom_modules/connection");
var fetchJSON = require("./routes/custom_modules/fetchJSON.js");
var queries = require("./routes/custom_modules/queries.js");
var sqlQuery = require("./routes/custom_modules/sqlQuery.js");
var daysAgo = require("./routes/custom_modules/daysAgo.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var { RateLimiterMemory, RateLimiterRes } = require("rate-limiter-flexible");

var productview = require("./routes/productview");
var productImg = require("./routes/productimg");
var customerview = require("./routes/customerview");
var orderview = require("./routes/orderview.js");
var printshippinglabels = require("./routes/printshippinglabels");
var printview = require("./routes/printview.js");
var labelsRoutes = require("./routes/labels");
var searchRoutes = require("./routes/search");
var csvRoutes = require("./routes/csvmysql");
var adminRoutes = require("./routes/admin.js");
var taxAndHarms = require("./routes/taxAndHarms.js");
var userProfile = require("./routes/userProfile.js");
var store = require("./routes/syncToDb.js");
var webhooks = require("./routes/webhooks.js");
var connection = require("./routes/custom_modules/connection.js");
var queries = require("./routes/custom_modules/queries.js");

connection.connect(function (err) {
  if (err) throw err;
  console.log("MySQL Database is connected.");
});

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

require("./config/passport")(passport);

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);

app.locals.moment = require("moment");
app.use(cors());
app.use(morgan("dev"));
var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "controlcenter",
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 1800000,
  endConnectionOnClose: true,
};

var sessionStore = new MySQLStore(options);
//app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    key: "session_cookie_name",
    secret: "vidyapathaisalwaysrunning",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1800000,
      //path: "/",
      //sameSite: true,
      //secure: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(labelsRoutes);
app.use(searchRoutes);
app.use(csvRoutes);
app.use(adminRoutes);
app.use(printshippinglabels);
app.use(taxAndHarms);
app.use(userProfile);
app.use(store);
app.use(webhooks);

app.use("/product_view", productview);
app.use("/productImg", productImg);
app.use("/customer_view", customerview);
app.use("/orders", orderview);
app.use("/print", printview);
app.use("/store", store);

const maxWrongAttemptsFromIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 10;

const limiterSlowBruteByIP = new RateLimiterMemory({
  keyPrefix: "login_fail_ip_per_day",
  points: maxWrongAttemptsFromIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 3, // Block for 3 hours, if 100 wrong attempts per day
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMemory({
  keyPrefix: "login_fail_consecutive_username_and_ip",
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 14, // Store number for 14 days since first fail
  blockDuration: 60 * 60, // Block for 1 hour
});

// ////////////////////////////////////////////////////////////

passport.use(
  // "local-login",
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      // usernameField: "username",
      // passwordField: "password",
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    async function (req, username, password, done) {
      const usernameIPkey = `${username}_${req.ip}`;
      let resUsernameAndIP;
      try {
        let retrySecs = 0;

        const resGet = await Promise.all([
          limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
          limiterSlowBruteByIP.get(req.ip),
        ]);
        resUsernameAndIP = resGet[0];
        const resSlowByIP = resGet[1];
        // Check if IP or Username + IP is already blocked
        if (
          resSlowByIP !== null &&
          resSlowByIP.consumedPoints > maxWrongAttemptsFromIPperDay
        ) {
          retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
        } else if (
          resUsernameAndIP !== null &&
          resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP
        ) {
          retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
        }

        if (retrySecs > 0) {
          return done(null, false, { statusCode: 429, retrySecs });
        }
      } catch (err) {
        return done(err);
      }
      // callback with email and password from our form
      connection.query(queries.userName, [username], async function (
        err,
        rows
      ) {
        if (err) {
          //console.log("1st: " + err);
          return done(err);
        }
        if (!rows.length || !bcrypt.compareSync(password, rows[0].password)) {
          try {
            await Promise.all([
              limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey),
              limiterSlowBruteByIP.consume(req.ip),
            ]);
            return done(
              null,
              false,
              req.flash("loginMessage", "Oops! Wrong user or wrong password.")
            );
          } catch (rlRejected) {
            if (rlRejected instanceof RateLimiterRes) {
              return done(null, false, {
                statusCode: 429,
                retrySecs: Math.round(rlRejected.msBeforeNext / 1000) || 1,
              });
            } else {
              //console.log("3rd: " + rlRejected);
              return done(rlRejected);
            }
          }
        } else {
          if (
            resUsernameAndIP !== null &&
            resUsernameAndIP.consumedPoints > 0
          ) {
            // Reset on successful authorisation
            try {
              await limiterConsecutiveFailsByUsernameAndIP.delete(
                usernameIPkey
              );
            } catch (err) {
              // handle err only when other than memory limiter used
              //console.log("2nd: " + err);
            }
          }
          // all is well, return successful user
          return done(null, rows[0]);
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
  connection.query(queries.userDeserial, [id], function (err, rows) {
    done(err, rows[0]);
  });
});

//require("./routes/loginroutes.js")(app, passport);
app.get("/", function (req, res) {
  connection.query(
    queries.usersCreate +
      queries.usersBase +
      queries.warehouseCreate +
      queries.warehouseBase,
    function () {
      res.render("login", {
        message: req.flash("loginMessage"),
      });
    }
  );
});

app.get("/home", isLoggedIn, function (req, res, next) {
  var username = req.user.username;
  sqlQuery(
    queries.webhooksCreate +
      queries.storesCreate +
      queries.stores +
      queries.stores +
      queries.userName,
    username
  )
    .then(function (rows) {
      var data = [];
      for (var i = 0; i < rows[2].length; i++) {
        data.push(
          fetchJSON(
            "https://" +
              rows[2][i].api_key +
              ":" +
              rows[2][i].pswrd +
              "@" +
              rows[2][i].shop_url +
              "/admin/api/2019-04/events.json?filter=Product&verb=published&limit=5&created_at_min=" +
              daysAgo(5)
          )
        );
      }
      connection.query(queries.loginUpdate, username, function () {
        Promise.all(data)
          .then((data) => {
            res.render("home", {
              user: req.user,
              data: data,
              moment: moment,
              rows: rows[2],
              rows2: rows[3],
              profile: rows[4][0],
            });
          })
          .catch((err) => console.error("There was a problem", err));
      });
    })
    .error(function (e) {
      console.log("Error handler " + e);
    })
    .catch(function (e) {
      console.log("Catch handler " + e);
    });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

var authentication = passport.authenticate("local-login", {
  successRedirect: "/home", // redirect to the secure profile section
  failureRedirect: "/", // redirect back to the signup page if there is an error
  failureFlash: true, // allow flash messages
});

app.post("/", authentication, function (res, err, user, context = {}) {
  if (err) {
    console.log("1st: " + err);
    return next(err);
  }
  if (context.statusCode === 429) {
    console.log("status code was triggered");
    res.set("Retry-After", String(context.retrySecs));
    return res.status(429).send("Too Many Requests");
  }
  if (!user) {
    console.log("user was triggered");
    return res.redirect("/");
  }
  console.log("Success");
  res.redirect("/home");
});

app.use(authentication, express.static(__dirname + "/public"));
app.use(authentication, favicon(__dirname + "/public/img/favicon.ico"));
app.get("/*", function (req, res) {
  res.redirect("/");
});

//404 catch-all handler (middleware)
app.use(function (req, res, next) {
  res.status(404);
  connection.query(
    queries.stores + queries.userName,
    req.user.username,
    function (err, rows, fields) {
      res.render("404", {
        rows: rows[0],
        profile: rows[1][0],
      });
    }
  );
});

//500 error handler (middleware)
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  connection.query(
    queries.stores + queries.userName,
    req.user.username,
    function (err, rows, fields) {
      res.render("500", {
        rows: rows,
        profile: rows[1][0],
      });
    }
  );
});

app.listen(app.get("port"), function () {
  console.log(
    "Express started on http://localhost:" +
      app.get("port") +
      "; press Ctrl-C to terminate."
  );
});
