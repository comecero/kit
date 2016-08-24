var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var sequence = require("run-sequence");

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
        done();
    });
});