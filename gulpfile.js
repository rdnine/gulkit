/* gulp tasks */
const { src, series, parallel, dest, watch } = require("gulp"),
imagemin = require("gulp-imagemin"),
babel = require("gulp-babel"),
sourcemaps = require("gulp-sourcemaps"),
concat = require("gulp-concat"),
sass = require("gulp-sass"),
cleanCSS = require("gulp-clean-css"),
del = require("del");

sass.compiler = require("node-sass");

const cssPath = "src/assets/sass/*.scss",
    jsPath = "src/assets/js/*.js",
    htmlPath = "src/**/*.html",
    imagesPath = "src/assets/images/*";

/* Delete the destination folder */
function clean() {
        return del.sync(["dist"]);
}

/* Copy .html files to the destination folder */
function html() {
        return src(htmlPath).pipe(dest("dist"));
}

/* Optimize images to the destination folder */
function imgs() {
    return src(imagesPath).pipe(imagemin()).pipe(dest("dist/assets/images"));
}

/* Optimize JS to the destination folder */
function js() {
    return src(jsPath).pipe(babel()).pipe(dest("dist/assets/js"));
}

function jsBundle() {
    return src(jsPath)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat("all.js"))
        .pipe(sourcemaps.write("."))
        .pipe(dest("dist/assets/js"));
}

/* SASS to CSS */
function css() {
    return src(cssPath)
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("dist/assets/css"));
}

function cssBundle() {
    return src(cssPath)
        .pipe(sass().on("error", sass.logError))
        .pipe(concat("all.css"))
        .pipe(cleanCSS())
        .pipe(dest("dist/assets/css"));
}


/* Watch for changes in folders */
function watchIt() {
    watch(
        [htmlPath, cssPath, jsPath],
        { interval: 2500 },
        parallel(html, css, js)
    );
}

/* Single Task Execution */
exports.html = html;
exports.imgs = imgs;
exports.js = js;
exports.sass = css;
exports.clean = clean;

exports.jsBundle = jsBundle;
exports.cssBundle = cssBundle;

/* Development Task */
exports.dev = parallel(clean, html, imgs, js, css);

/* Production Task */
exports.prod = parallel(clean, html, imgs, jsBundle, cssBundle);

/* Starter Task    w/ Watch */
exports.default = series(parallel(html, imgs, js, css), watchIt);