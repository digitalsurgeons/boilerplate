var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var config = require('../config');
var pngquant = require('imagemin-pngquant');

var imgSrc = config.paths.images + '/**';
var imgDest = config.paths.dist + '/img';

// Minify any new images
module.exports = function() {
    gulp.src(imgSrc)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(imgDest));
}
