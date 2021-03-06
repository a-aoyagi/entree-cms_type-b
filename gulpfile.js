
// Modules
const gulp = require("gulp");
const gulpSass = require("gulp-sass");
const path = require("path");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");

// Themes
require('dotenv').config();
const themes = [
  { name: "admin", dir: `${ process.env.ADMIN_DIR }/webroot/${ process.env.ADMIN_THEME }` },
  { name: "site", dir: `${ process.env.SITE_DIR }/webroot/${ process.env.SITE_THEME }` }
];

// Task of compiling js
gulp.task('compile-js', () => {
  // Load webpack.config.js
  const webpackConfigPath = path.resolve(__dirname, "webpack.config.js");
  delete require.cache[webpackConfigPath];
  const webpackConfig = require(webpackConfigPath);

  return webpackStream(webpackConfig, webpack).on("error", function(e) {
      this.emit("end");
    })
    .pipe(gulp.dest(__dirname));
});

// Task of compiling SCSS
themes.filter(theme => {
  gulp.task(`compile-sass-${theme.name}`, () => {
    return gulp.src(`./${theme.dir}/css.src/**/*.scss`)
      .pipe(
        gulpSass({outputStyle: 'compressed'})
          .on('error', gulpSass.logError)
      )
      .pipe(
        gulp.dest(`./${theme.dir}/css`)
      );
  });
});

// Run initial tasks
gulp.task('default', () => {
  themes.filter(theme => {
    gulp.watch(`./${theme.dir}/js.src/**/*.js`, gulp.task('compile-js'));
    gulp.watch(`./${theme.dir}/js.src/**/*.ts`, gulp.task('compile-js'));
    gulp.watch(`./${theme.dir}/css.src/**/*.scss`, gulp.task(`compile-sass-${theme.name}`));
  });
});
