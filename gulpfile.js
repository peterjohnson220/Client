const gulp = require('gulp')
const purgecss = require('gulp-purgecss')

// Accept a required 'app' -a argument for the gulp task
//
// http://yargs.js.org/
const argv = require('yargs').options({
  'app': {
    alias: 'a',
    demandOption: true,
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
      whitelist: [':before', ':after'],
      whitelistPatterns: [/^modal/, /^col/, /^control-type/, /-font-size$/, /-font-size$/, /^text/, /action-item/, /-clear-item$/, /^mapboxgl/]
    }))
    .pipe(gulp.dest(`./dist/apps/${argv.app}/`))
})
