'use strict';

var gulp = require('gulp');
var fs = require('fs');
var exec = require('child_process').exec;
var less = require('gulp-less');

function consoleCommand(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, function(error, stdout, stderr){
			if (error) {
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
				'./node_modules/bootstrap-less'
			]
		}))
		.pipe(gulp.dest(dest));
}

gulp.task('build-less-popup', () => buildLESS('res/less/popup.less', 'build/css'));
gulp.task('build-less-content', () =>  buildLESS('res/less/content.less', 'build/css'));

gulp.task('build-less',['build-less-popup', 'build-less-content']);

gulp.task('chrome-resources', ['build'], function(){
	return Promise.all([
		fileCopy('vendor/chrome/**/*.html', 'dist/chrome/vendor/chrome'),
		fileCopy('vendor/chrome/resources/**/*', 'dist/chrome/resources'),
		fileCopy('vendor/chrome/manifest.json', 'dist/chrome'),
		fileCopy('config.js', 'dist/chrome'),
	]);
});

gulp.task('chrome-code', ['build'], function(){
	return Promise.all(props.map(prop => fileCopy(prop.merged, prop.dest)));
});

gulp.task('chrome-css', ['build-less'], () => {
	return fileCopy('build/css/**/*.css', 'dist/chrome/css');
})

gulp.task('chrome-fonts', () => {
	return fileCopy('res/fonts/**/*', 'dist/chrome/fonts');
})

gulp.task('dev', [
	'chrome-code',
	'chrome-resources',
	'chrome-css',
	'chrome-fonts',
]);

gulp.task('release', [
	'chrome-code',
	'chrome-resources',
	'chrome-css',
	'chrome-fonts',
]);

gulp.task('default', ['dev']);
