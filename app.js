/* eslint-disable no-undef */
const express = require("express");
const csrf = require("tiny-csrf");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const { User } = require("./models");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const usersRoutes = require("./routes/users");
const sportsRoutes = require("./routes/sports");
const sessionsRoutes = require("./routes/sessions");
const userSessionsRoutes = require("./routes/usersessions");
const dashboardRoutes = require("./routes/dashboard");
const loginRoutes = require("./routes/login");
const loginSessionsRoutes = require("./routes/loginSession");
const signupRoutes = require("./routes/signup");
const profileRoutes = require("./routes/profile");
const sigoutRoutes = require("./routes/signout");
const playerSessionsRoutes = require("./routes/playerSessions");
const reportsRoutes = require("./routes/reports");
const flash = require("connect-flash");
app.set("views", path.join(__dirname, "views"));
app.use(flash());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(
  session({
    secret: 'your-32-character-long-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  })
);

app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (userName, password, done) => {
      if (userName.trim() === "") {
        return done(null, false, { message: "Email cannot be empty" });
      }
      if (password.trim() === "") {
        return done(null, false, { message: "Password cannot be empty" });
      }
      User.findOne({ where: { email: userName } })
        .then(async (user) => {
          if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Invalid password" });
            }
          } else {
            return done(null, false, {
              message: "Invalid account credentials",
            });
          }
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      console.log("deserializing user in session", user.id);
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

const ensureNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // User is authenticated, redirect to "/dashboard" or any other appropriate page
    return res.redirect("/dashboard");
  }
  // User is not authenticated, continue to the next middleware
  return next();
};

app.get("/", ensureNotAuthenticated, (req, res) => {
  res.render("index");
});

app.use("/users", usersRoutes);
app.use("/sports", connectEnsureLogin.ensureLoggedIn(), sportsRoutes);
app.use("/sessions", connectEnsureLogin.ensureLoggedIn(), sessionsRoutes);
app.use("/reports", connectEnsureLogin.ensureLoggedIn(), reportsRoutes);
app.use("/usersessions", userSessionsRoutes);
app.use("/dashboard", connectEnsureLogin.ensureLoggedIn(), dashboardRoutes);
app.use(
  "/playerSessions",
  connectEnsureLogin.ensureLoggedIn(),
  playerSessionsRoutes
);
app.use("/login", ensureNotAuthenticated, loginRoutes);
app.use("/loginSession", loginSessionsRoutes);
app.use("/signup", ensureNotAuthenticated, signupRoutes);
app.use("/signout", sigoutRoutes);
app.use("/profile", connectEnsureLogin.ensureLoggedIn(), profileRoutes);


app.use((req, res, next) => {
  res.render("./pages/404");
  next();
});
module.exports = app;
