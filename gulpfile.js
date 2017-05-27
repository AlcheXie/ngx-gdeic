'use strict';

const gulp = require('gulp');
const process = require('child_process');

const exec = command => new Promise((resolve) => process.exec(command, (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    resolve();
}));

gulp.task('default', ['webpack'], () => gulp.watch(['src/**/*.ts', 'index.ts'], ['webpack']));

gulp.task('webpack', () => exec('npm run webpack')
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