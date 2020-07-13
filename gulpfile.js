const gulp = require("gulp");
const jshint = require("gulp-jshint");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const runSequence = require("run-sequence");
const browserSync = require("browser-sync").create();

gulp.task("processHTML", (done) => {
  gulp.src("*.html").pipe(gulp.dest("dist"));
  done();
});

gulp.task("processJS", (done) => {
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
  done();
});

gulp.task("babelPolyfill", (done) => {
  gulp
    .src("node_modules/babel-polyfill/browser.js")
    .pipe(gulp.dest("dist/node_modules/babel-polyfill"));
  done();
});

gulp.task("watch", (callback) => {
  gulp.watch("*.js", ["processJS"]);
  gulp.watch("*.html", ["processHTML"]);

  gulp.watch("dist/*.js", browserSync.reload);
  gulp.watch("dist/*.html", browserSync.reload);
  callback();
});

gulp.task("default", (callback) => {
  gulp.series("processHTML", "processJS", "babelPolyfill", "watch");
  callback();
});
gulp.task("browserSync", (callback) => {
  browserSync.init({
    server: "./dist",
    port: 8080,
    ui: {
      port: 8081,
    },
  });
});
