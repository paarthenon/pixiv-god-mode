'use strict';

var gulp = require('gulp');
var fs = require('fs');
var exec = require('child_process').exec;
var less = require('gulp-less');

function consoleCommand(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, function(error, stdout, stderr){
			if (error) {
				console.log(stdout);
				console.log(error);
				reject(stderr);
			} else {
				resolve();
			}
		});
	});
}

gulp.task('build', () => consoleCommand('node ./node_modules/webpack/bin/webpack.js'));

const popupProps = {
	merged: 'build/webpack/popup.min.js',
	dest: 'dist/chrome/vendor/chrome/popup',
}
const backgroundProps = {
	merged: 'build/webpack/background.min.js',
	dest: 'dist/chrome/vendor/chrome/',
}
const contentProps = {
	merged: 'build/webpack/content.min.js',
	dest: 'dist/chrome/vendor/chrome/',
}
const optionsProps = {
	merged: 'build/webpack/options.min.js',
	dest: 'dist/chrome/vendor/chrome/options',
}
const props = [
	popupProps,
	backgroundProps,
	contentProps,
	optionsProps
];

function fileCopy(src, dst) {
	return new Promise(resolve => gulp.src(src)
		.pipe(gulp.dest(dst))
		.on('end', resolve))
}

function buildLESS(src, dest) {
	return gulp.src(src)
		.pipe(less({
			paths: [
				'.',
				'./node_modules/bootstrap-less',
				'./node_modules/bootswatch',
				'./node_modules',
			]
		}))
		.pipe(gulp.dest(dest));
}

gulp.task('build-less-popup', () => buildLESS('res/less/popup.less', 'build/css'));
gulp.task('build-less-content', () =>  buildLESS('res/less/content.less', 'build/css'));

gulp.task('build-less', gulp.series('build-less-popup', 'build-less-content'));

gulp.task('chrome-resources', gulp.series('build'), function(){
	return Promise.all([
		fileCopy('vendor/chrome/**/*.html', 'dist/chrome/vendor/chrome'),
		fileCopy('vendor/chrome/resources/**/*', 'dist/chrome/resources'),
		fileCopy('vendor/chrome/manifest.json', 'dist/chrome'),
	]);
});

gulp.task('chrome-code', gulp.series('build'), function(){
	return Promise.all(props.map(prop => fileCopy(prop.merged, prop.dest)));
});

gulp.task('chrome-css', gulp.series('build-less'), () => {
	return fileCopy('build/css/**/*.css', 'dist/chrome/css');
});

gulp.task('chrome-fonts', () => {
	return fileCopy('res/fonts/**/*', 'dist/chrome/fonts');
});

gulp.task('dev', gulp.series(
	'chrome-code',
	'chrome-resources',
	'chrome-css',
	'chrome-fonts',
));

gulp.task('release', gulp.series(
	'chrome-code',
	'chrome-resources',
	'chrome-css',
	'chrome-fonts',
));

gulp.task('build-tests', () => consoleCommand('tsc -p test'));
// TODO: Use alsatian's API like an adult.
gulp.task('test', gulp.series('build-tests'), () => consoleCommand('node ./node_modules/alsatian/cli/alsatian-cli.js build/test/**/*.js'));

gulp.task('default', gulp.series('dev'));
