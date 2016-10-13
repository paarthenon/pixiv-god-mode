var gulp = require('gulp');

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

gulp.task('htmlFile', ['build'], function(){
	return new Promise(resolve => gulp.src('src/www/index.html')
		.pipe(gulp.dest('build/src/www'))
		.on('end', resolve))
});
gulp.task('default', ['htmlFile']);
