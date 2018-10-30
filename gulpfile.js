var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var sequence = require("run-sequence");
var header = require('gulp-header');
var zip = require('gulp-zip');
var fs = require("fs");
var crypto = require('crypto');

var dest, i = process.argv.indexOf("--dest");
if (i > -1) {
    dest = process.argv[i + 1];
}

// It is important that you include utilities.js first, run.js second and libraries/*.js third. After that, the order is not important.
gulp.task("concat", function () {
    return gulp.src(["./app/utilities.js", "./app/run.js", "./app/libraries/*.js", "./app/modules/*.js", "./app/shared/*.js"])
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

function dist(callback) {

    sequence('concat', 'concat-pages-js', 'compress', 'sourcemap', function () {

        // Read the version number
        var version = fs.readFileSync("./version.html", "utf8");

        var files = ['./dist/kit.js', './dist/kit.min.js', './dist/pages.js', './dist/pages.min.js'];

        var remaining = files.length;
        files.forEach(function (file) {

            // Get the contents of each file so you can calculate a checksum. This is useful to know for certain if two copies of the file contain the same contents.
            const sign = crypto.createSign('SHA256');
            var contents = fs.readFileSync(file, 'utf8');
            var sha256 = crypto.createHash('sha256').update(contents).digest("hex");

            // Add headers with the release number to each of the distribution files.
            var writer = gulp.src([file]).pipe(header("/*\nComecero Kit version: " + version + "\nBuild time: " + new Date().toISOString() + "\nChecksum (SHA256): " + sha256 + "\nhttps://comecero.com\nhttps://github.com/comecero/kit\nCopyright Comecero and other contributors. Released under MIT license. See LICENSE for details.\n*/\n\n")).pipe(gulp.dest('./dist/'));

            writer.on("finish", function () {
                finish();
            });
        });

        function finish() {
            remaining--;
            if (remaining == 0) {
                if (callback)
                    callback();
            }
        }
    });
}

gulp.task('dist', function (done) {
    dist();
});

gulp.task('dist-copy', function (done) {

    if (!dest) {
        console.log("ERROR: You must supply an option --dest that provides the path the files should be copied to upon completion of dist. For example: gulp dist-copy --dest /data/temp");
        return;
    }

    dist(function () {
        gulp.src(["./dist/kit.js", "./dist/kit.min.js", "./dist/kit.js.map"])
        .pipe(gulp.dest(dest));
        console.log("Files have been copied to the destination");
    });
});

gulp.task('zip', function (done) {

    // Read the version number
    var version = fs.readFileSync("./version.html", "utf8");

    return gulp.src(["./**", "!./.git", "!./.vs", "!./.git/*", "!./settings/**", "!./settings/", "!./.gitattributes", "!./.gitignore", "!./*.sln", "!./Web.config", "!./Web.Debug.config", "!./*.zip"])
    .pipe(zip("kit-" + version + ".zip"))
    .pipe(gulp.dest("./"));

});