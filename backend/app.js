const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");
const usersRouter = require("./routes/users");
const attendanceRouter = require("./routes/attendance");
const commentsRouter = require("./routes/comments");
const boardRouter = require("./routes/board");
const postRouter = require("./routes/post");
const articleRouter = require("./routes/article");
const postFileRouter = require("./routes/postFile");
const authRouter = require("./routes/auth");

const app = express();

app.use(require('connect-history-api-fallback')());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json({
    limit: '10gb'
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", usersRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/board", boardRouter);
app.use("/api/post", postRouter);
app.use("/api/article", articleRouter);
app.use("/api/postFile", postFileRouter);
// app.use("/api/auth", authRouter);

const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

// 구글 OAuth 정보
const googleOAuthInfo = require('./lib/gauth');

passport.use(new GoogleStrategy({
    clientID: googleOAuthInfo.clientID,
    clientSecret: googleOAuthInfo.clientSecret,
    callbackURL: googleOAuthInfo.callbackURL,
},

function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    conn.query('SELECT * FROM capdi_users WHERE googleID = ?', [profile.id], function (err, row) {
        if (err) { console.error(err) }
        else
            console.log(row);
        
        return cb(err, row);
    });
}
));
// Google OAuth2.0
app.get('/google', passport.authenticate('google', { scpoe: ['profile'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    }
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
