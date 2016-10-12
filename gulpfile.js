var gulp = require('gulp');
var fs = require('fs');
var exec = require('child_process').exec;
var babel = require('gulp-babel');
var jspm = require('jspm');

gulp.task('build', function(callback){
    exec('tsc -p .', function(error, stdout, stderr) {
        if(stdout){ console.log(stdout) }
        if(stderr){ console.log(stderr) }

        if(error){
            console.log('Typescript build error');
        }else{
            callback();
        }
   });
});

gulp.task('es5', ['build'], function() {
	return gulp.src('build/es6/**/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('build/es5'));
})

builder = new jspm.Builder();
builder.config({
	paths: { '*': 'build/es5/*' }
});

function bundleDev(source, output) {
	let bundleSettings = {
		minify: false,
	}
	return builder.buildStatic(source, output, bundleSettings);
}

function bundleRelease(source, output) {
	let bundleSettings = {
		minify: true,
		mangle: false, // terribleCache is truly terrible and uses constructor function names, which can't work if mangled
		uglify: {beautify: {ascii_only: true}}, // diacritics needs to faithfully store the unicode string map.
	}
	return builder.buildStatic(source, output, bundleSettings);
}

function bundleEntryPoint(props, release) {
	if (release) {
		return bundleRelease(props.source, props.merged)
			.then(() => fileCopy(props.merged, props.dest));
	} else {
		return bundleDev(props.source, props.merged)
			.then(() => fileCopy(props.merged, props.dest));
	}
}

function fileCopy(src, dst) {
	return new Promise(resolve => gulp.src(src)
		.pipe(gulp.dest(dst))
		.on('end', resolve))
}

let popupProps = {
	source: 'vendor/chrome/popup/bootstrap',
	merged: 'build/merged/popup.min.js',
	dest: 'dist/chrome/vendor/chrome/popup',
}
let backgroundProps = {
	source: 'vendor/chrome/background/main',
	merged: 'build/merged/background.min.js',
	dest: 'dist/chrome/vendor/chrome/',
}
let contentProps = {
	source: 'vendor/chrome/content/chrome',
	merged: 'build/merged/content.min.js',
	dest: 'dist/chrome/vendor/chrome/',
}
let optionsProps = {
	source: 'vendor/chrome/options/options',
	merged: 'build/merged/options.min.js',
	dest: 'dist/chrome/vendor/chrome/options',
}

gulp.task('bundle-popup', ['es5'], () => bundleEntryPoint(popupProps));
gulp.task('bundle-background', ['es5'], () => bundleEntryPoint(backgroundProps));
gulp.task('bundle-content', ['es5'], () => bundleEntryPoint(contentProps));
gulp.task('bundle-options', ['es5'], () => bundleEntryPoint(optionsProps));

gulp.task('bundle-popup-release', ['es5'], () => bundleEntryPoint(popupProps, true));
gulp.task('bundle-background-release', ['es5'], () => bundleEntryPoint(backgroundProps, true));
gulp.task('bundle-content-release', ['es5'], () => bundleEntryPoint(contentProps, true));
gulp.task('bundle-options-release', ['es5'], () => bundleEntryPoint(optionsProps, true));

gulp.task('chrome-resources', ['es5'], function(){
	return Promise.all([
		fileCopy('vendor/chrome/**/*.html', 'dist/chrome/vendor/chrome'),
		fileCopy('vendor/chrome/resources/**/*', 'dist/chrome/resources'),
		fileCopy('vendor/chrome/manifest.json', 'dist/chrome'),
		fileCopy('config.js', 'dist/chrome'),
	]);
});

gulp.task('dev', [
	'chrome-resources',
	'bundle-popup',
	'bundle-background',
	'bundle-content',
	'bundle-options',
]);

gulp.task('release', [
	'chrome-resources',
	'bundle-popup-release',
	'bundle-background-release',
	'bundle-content-release',
	'bundle-options-release',
]);

gulp.task('default', ['dev']);
