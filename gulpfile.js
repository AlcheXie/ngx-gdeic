'use strict';

const gulp = require('gulp');
const process = require('child_process');
const del = require('del');
const sass = require('gulp-sass');

const exec = command => new Promise((resolve) => process.exec(command, (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    resolve();
}));

gulp.task('default', ['webpack'], () => gulp.watch(['src/**/*.ts', 'index.ts', 'src/**/*.html', 'src/**/*.scss'], ['webpack']));

gulp.task('webpack', () => del(['**/*.css'])
    .then(() => gulp.src(['**/*.scss'])
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('.')))
    .then(() => exec('npm run webpack'))
    .then((err, stdout, stderr) => {
        if (/ERROR in/.test(stdout)) {
            console.error(stdout);
            Promise.reject();
        } else {
            console.info('Webpack success!');
            Promise.resolve();
        }
    })
);

gulp.task('clean', () => del(['**/*.ngfactory.ts', '**/*.ngsummary.json', '**/*.css']));