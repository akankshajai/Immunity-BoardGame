const gulp = require("gulp");
const gulpSequence = require("gulp-sequence");
const jshint = require("gulp-jshint");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync").create();

gulp.task("processHTML", (callback) => {
  gulp.src("*.html").pipe(gulp.dest("dist"));
  callback();
});

gulp.task("processJS", (callback) => {
  gulp
    .src("*.js")
    .pipe(
      jshint({
        esversion: 6,
      })
    )
    .pipe(jshint.reporter("default"))
    .pipe(
      babel({
        presets: ["env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
  callback();
});

gulp.task("babelPolyfill", (callback) => {
  gulp
    .src("node_modules/babel-polyfill/browser.js")
    .pipe(gulp.dest("dist/node_modules/babel-polyfill"));
  callback();
});

gulp.task("default", (callback) => {
  gulp.series("processHTML", "processJS", "babelPolyfill", "watch");
  callback();
});

gulp.task("watch", (callback) => {
  gulp.watch("*.js", ["processJS"]);
  gulp.watch("*.html", ["processHTML"]);
  callback();
});
