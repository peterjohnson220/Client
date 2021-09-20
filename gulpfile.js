const gulp = require('gulp')
const purgecss = require('gulp-purgecss')
var sass = require('gulp-dart-sass');

// Accept a required 'app' -a argument for the gulp task
//
// http://yargs.js.org/
const argv = require('yargs').options({
  'app': {
    alias: 'a',
    demandOption: false,
    describe: 'Provide an application',
    type: 'string'
  }
}).argv;

// PurgeCSS
// Script to run on a post production type build (non-prod builds do not extract styles into own bundle)
// Will use the style.css bundle as the source and look across all .js bundles in the /dist directory for the
// application for usages of the styles. Any styles that are not found in the .js files will be removed from the
// source styles.css file.
//
// This will run after each ng build [app] as part of the jenkins build process. It has also been included in the
// npm run buildallprod command.
//
// If PurgeCSS is erroneously removing styling (most likely due to a dynamic nature). Add the selector to the whitelist.
// https://purgecss.com/whitelisting.html
//
// Full PurgeCSS documentation: https://purgecss.com/
gulp.task('purgecss', () => {
  return gulp.src(`./dist/apps/${argv.app}/styles.*.css`)
    .pipe(purgecss({
      content: [`./dist/apps/${argv.app}/**/*.js`],
      whitelist: [
        ':before',
        ':after',
        'nav-tabs'
      ],
      whitelistPatterns: [
        /^modal/,
        /^col/,
        /^control-type/,
        /-font-size$/,
        /-font-family$/,
        /^text/,
        /action-item/,
        /-clear-item$/,
        /^mapboxgl/,
        /^flag-/,
        //Kendo Icon Classes
        /^k-i/]
    }))
    .pipe(gulp.dest(`./dist/apps/${argv.app}/`))
});

// Sass
// Script that should be run anytime we modify the client.scss or any of the files it imports. When executed this will
// compile client.scss using dart-sass, moving the resulting css file to a dist/assets/css folder. This css file will be
// used as a style asset for all applications.
gulp.task('sass', function () {
  return gulp.src('./assets/scss/client.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/assets/css'));
});
