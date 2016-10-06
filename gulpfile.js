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

gulp.task('bundle', ['es5'], function() {
	builder = new jspm.Builder();
	builder.config({
		paths: { '*': 'build/es5/*' }
	});

	let bundleSettings = {
		minify: true,
		mangle: false, // terribleCache is truly terrible and uses constructor function names, which can't work if mangled
		uglify: {beautify: {ascii_only: true}}, // diacritics needs to faithfully store the unicode string map.
	}
	return Promise.all([
		builder.buildStatic('vendor/chrome/popup/bootstrap', 'build/merged/popup.min.js', bundleSettings),
		builder.buildStatic('vendor/chrome/background/main', 'build/merged/background.min.js', bundleSettings),
		builder.buildStatic('vendor/chrome/content/chrome', 'build/merged/content.min.js', bundleSettings),
		builder.buildStatic('vendor/chrome/options/options', 'build/merged/options.min.js', bundleSettings),
	]);
});

function fileCopy(src, dst) {
	return new Promise(resolve => gulp.src(src)
		.pipe(gulp.dest(dst))
		.on('end', resolve))
}

gulp.task('chrome-resources', ['es5'], function(){
	return Promise.all([
		fileCopy('vendor/chrome/**/*.html', 'dist/chrome/vendor/chrome'),
		fileCopy('vendor/chrome/resources/*', 'dist/chrome/resources'),
		fileCopy('vendor/chrome/manifest.json', 'dist/chrome'),
		fileCopy('config.js', 'dist/chrome'),
	]);
});

gulp.task('chrome-min-code', ['bundle'], function() {
	return Promise.all([
		fileCopy('build/merged/popup.min.js', 'dist/chrome/vendor/chrome/popup'),
		fileCopy('build/merged/background.min.js', 'dist/chrome/vendor/chrome/'),
		fileCopy('build/merged/content.min.js', 'dist/chrome/vendor/chrome/'),
		fileCopy('build/merged/options.min.js', 'dist/chrome/vendor/chrome/options'),
	])
});

gulp.task('default', ['chrome-min-code', 'chrome-resources']);
