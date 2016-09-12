var gulp = require('gulp');

var nexe = require('nexe');

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

gulp.task('default', ['build']);
