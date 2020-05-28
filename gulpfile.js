/* gulp tasks */
const { src, series, parallel, dest, watch } = require("gulp"),
imagemin = require('gulp-imagemin'),
babel = require("gulp-babel"),
sourcemaps = require("gulp-sourcemaps"),
concat = require("gulp-concat"),
sass = require("gulp-sass"),
cleanCSS = require('gulp-clean-css');

sass.compiler = require("node-sass");

const cssPath = "src/assets/sass/*.scss",
  jsPath = "src/assets/js/*.js",
  htmlPath = "src/**/*.html",
  imagesPath = "src/assets/images/*";

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

/* SASS to CSS */
function css() {
  return src(cssPath)
    .pipe(sass().on("error", sass.logError))
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

/* Starter Task  w/ Watch */
exports.default = series(parallel(html, imgs, js, css), watchIt);