// подключение пакетов
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer'); // проставляет префиксы
const rename = require('gulp-rename'); // переименовывает файлы
const minifycss = require('gulp-cssmin'); // минифицирует css
const tinypg = require('gulp-tinypng');
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const sass = require('gulp-sass');


gulp.task('css', function(){
    return gulp.src("src/css/**/*.css")
        .pipe(autoprefixer({
            browsers: ["cover 99.5%", "iOS 7"]
        }))
        .pipe(gulp.dest("app/css/"));
});

gulp.task('sass', function () {
    return gulp.src('./src/scss/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ["cover 99.5%", "iOS 7"]
      }))
      .pipe(gulp.dest('./app/css'));
});
   

gulp.task('cssmin', function(){
    return gulp.src("app/css/style.css") // берем файл из папки app/css
        .pipe(minifycss()) // минифицируем
        .pipe(rename('style.min.css')) // переименовываем
        .pipe(gulp.dest("app/css/")); // выгружаем
});

gulp.task('tinypng', function(){
    return gulp.src(["src/img/*.png", "src/img/*.jpg"])
    .pipe(tinypng("sJsbrFotLaTukWnLmbFWP2Ztandg8nzA"))
    .pipe(gulp.dest('app/img'));
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('src/sprite/*.png')
        .pipe(spritesmith({ // Настройка спрайта
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            imgPath: '../img/sprite.png'
        }));

    var imgStream = spriteData.img
        .pipe(gulp.dest('app/img/'));

    var cssStream = spriteData.css
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css/'));
    return merge(imgStream, cssStream);
});

gulp.task("watch", ["sass", "cssmin", 'sprite'], function(){
    gulp.watch('./src/scss/**/*.scss', ["sass"]);
    gulp.watch("app/css/style.css", ["cssmin"]);
    gulp.watch('src/sprite/*.png', ["sprite"]);
});
