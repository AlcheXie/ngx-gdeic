'use strict';

const gulp = require('gulp');
const process = require('child_process');
const del = require('del');
const sass = require('gulp-sass');

const exec = command => new Promise((resolve, reject) => process.exec(command, (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    if (!err) {
        resolve();
    } else {
        reject();
    }
}));

gulp.task('default', ['webpack'], () => gulp.watch(['src/**/*.ts', 'index.ts', 'src/**/*.html', 'src/**/*.scss'], ['webpack']));

gulp.task('webpack', ['clean'], () => del(['bundles/**/*.css', 'bundles/**/*.html'])
    .then(() => gulp.src(['src/**/*.scss'])
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('bundles')))
    .then(() => gulp.src(['src/**/*.html'])
        .pipe(gulp.dest('bundles')))
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

gulp.task('sweep', () => del(['**/*.ngfactory.ts', '**/*.ngsummary.json']));

gulp.task('clean', ['sweep'], () => del(['bundles']));