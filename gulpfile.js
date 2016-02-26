var gulp = require('gulp');
var header = require('gulp-header');
var browserify = require('gulp-browserify');
var fs = require('fs');
var rename = require('gulp-rename');

var exec = require('child_process').exec;

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

gulp.task('browserify', ['build'], function(){
	return gulp.src('build/src/main.js')
		.pipe(browserify())
		.pipe(gulp.dest('build/merged'))
});

gulp.task('header', ['browserify'], function(){
	return gulp.src('build/merged/main.js')
		.pipe(header(fs.readFileSync('resources/userscript-header.txt','utf8')))
		.pipe(gulp.dest('build/final'))
});

gulp.task('deploy', ['header'], function(){
	return gulp.src('build/final/main.js')
		.pipe(rename('pixiv-assistant.user.js'))
		.pipe(gulp.dest('dist'))
});

gulp.task('default', ['deploy']);
