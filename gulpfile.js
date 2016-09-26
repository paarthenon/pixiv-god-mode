var gulp = require('gulp');
var header = require('gulp-header');
var browserify = require('gulp-browserify');
var fs = require('fs');
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

gulp.task('chrome', ['es5'], function(){
	return Promise.all([
		new Promise(resolve => gulp.src('build/es5/**/*')
			.pipe(gulp.dest('dist/chrome'))
			.on('end', resolve)),
		new Promise(resolve => gulp.src('vendor/chrome/**/*.html')
			.pipe(gulp.dest('dist/chrome/vendor/chrome'))
			.on('end', resolve)),
		new Promise(resolve => gulp.src('vendor/chrome/manifest.json')
			.pipe(gulp.dest('dist/chrome'))
			.on('end', resolve)),
		new Promise(resolve => gulp.src('vendor/chrome/resources/*')
			.pipe(gulp.dest('dist/chrome/resources'))
			.on('end', resolve)),
		new Promise(resolve => gulp.src('config.js')
			.pipe(gulp.dest('dist/chrome'))
			.on('end', resolve)),
		new Promise(resolve => gulp.src('bower_components/jquery/dist/jquery.js')
			.pipe(gulp.dest('dist/chrome/resources'))
			.on('end', resolve))
	]);
});

gulp.task('jspm_deps', ['chrome'], function() {
	return new Promise(resolve => gulp.src('jspm_packages/**/*')
			.pipe(gulp.dest('dist/chrome/jspm_packages'))
			.on('end', resolve));
})

gulp.task('full', ['jspm_deps']);


gulp.task('default', ['chrome']);
