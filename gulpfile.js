const gulp = require('gulp');
const {parallel, watch} = require('gulp');
const rename = require("gulp-rename");
const cleanCSS = require('gulp-clean-css');
 
gulp.task('minify-css', () => {
  return gulp.src('_site/assets/css/base.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('_site/assets/css/'));
});


gulp.task("watch", function(){
  gulp.watch("_site/assets/css/base.css", gulp.series("minify-css"))
})
