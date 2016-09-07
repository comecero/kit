var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var sequence = require("run-sequence");
var header = require('gulp-header');
var fs = require("fs");

// It is important that you include utilities.js first and run.js second. After that, the order is not important.
gulp.task("concat", function () {
    return gulp.src(["./app/utilities.js", "./app/run.js", "./app/modules/*.js", "./app/libraries/*.js", "./app/modules/*.js", "./app/shared/*.js"])
      .pipe(concat("kit.js"))
      .pipe(gulp.dest("./dist/"));
});

gulp.task("concat-pages-js", function () {
    return gulp.src(["./app/pages/**/*.js"])
      .pipe(concat("pages.js"))
      .pipe(gulp.dest("./dist/"));
});

gulp.task("compress", function () {
    return gulp.src(["./dist/*.js", "!./dist/*.min.js"])
    .pipe(uglify())
     .pipe(rename({
         extname: ".min.js"
     }))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("sourcemap", function () {
    return gulp.src(["./dist/kit.js"])
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("./dist/"));
});

gulp.task('dist', function (done) {
    sequence('concat', 'concat-pages-js', 'compress', 'sourcemap', function () {

        // Read the version number
        var version = fs.readFileSync("./version.html", "utf8");

        // Add headers with the release number to each of the distribution files.
        gulp.src(['./dist/kit.js', './dist/kit.min.js']).pipe(header("/*\nComecero Kit version: " + version + "\nhttps://comecero.com\nhttps://github.com/comecero/kit\nCopyright Comecero and other contributors. Released under MIT license. See LICENSE for details.\n*/\n\n")).pipe(gulp.dest('./dist/'));
        done();

    });
});