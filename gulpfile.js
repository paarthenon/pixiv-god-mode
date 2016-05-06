var gulp = require('gulp');
var header = require('gulp-header');
var browserify = require('gulp-browserify');
var fs = require('fs');
var rename = require('gulp-rename');
var exec = require('child_process').exec;
var babel = require('gulp-babel');

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

gulp.task('greasemonkey-browserify', ['build'], function(){
	return gulp.src('build/src/main.js')
		.pipe(browserify())
		.pipe(gulp.dest('build/merged'))
});

gulp.task('greasemonkey-header', ['greasemonkey-browserify'], function(){
	return gulp.src('build/merged/main.js')
		.pipe(header(fs.readFileSync('resources/userscript-header.txt','utf8')))
		.pipe(gulp.dest('build/merged'))
});

gulp.task('greasemonkey-deploy', ['greasemonkey-header'], function(){
	return gulp.src('build/merged/main.js')
		.pipe(rename('pixiv-assistant.user.js'))
		.pipe(gulp.dest('dist'))
});

gulp.task('chrome-pack', ['es5'], function(){
	return gulp.src('build/es5/vendor/chrome/chrome.js')
		.pipe(browserify())
		.pipe(gulp.dest('build/merged'))
});

gulp.task('chrome', ['chrome-pack'], function(){
	gulp.src('build/merged/chrome.js')
		.pipe(rename('pixiv-assistant.js'))
		.pipe(gulp.dest('dist/chrome'));

	gulp.src('build/es5/vendor/chrome/background.js')
		.pipe(gulp.dest('dist/chrome'));
	gulp.src('vendor/chrome/**/*')
		.pipe(gulp.dest('dist/chrome'));
});

gulp.task('firefox', ['browserify'], function(){
	gulp.src('build/merged/main.js')
		.pipe(rename('pixiv-assistant.js'))
		.pipe(gulp.dest('dist/firefox'))
	gulp.src('vendor/firefox/*')
		.pipe(gulp.dest('dist/firefox'))
});

gulp.task('default', ['chrome']);
