var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var open = require('open');
var gulpSequence = require('gulp-sequence');

var SRC = 'src';   //本地代码
var	DIS = 'public';  //生产环境的代码
var	BUILD = 'build'; //整合或打包的代码
// var	MIN = 'minify'; //整合或打包的代码


function clear(){
	var del = require('del');
	console.log('task clear done...')
	return del([ DIS ,BUILD])
};
gulp.task('clear',clear);

function less(){
	console.log('task less done...')
	gulp.src( SRC + '/less/*.less')
		.pipe(plugins.less())
		.pipe(gulp.dest( SRC + '/css' ))
};
gulp.task('less',less);

function dist(){
	console.log('task dist done...')
	gulp.src( SRC + '/**/*')
		.pipe(gulp.dest( DIS ))
};
gulp.task('dist',dist)

gulp.task('disl', ['clear','less','dist'])

function watch(){
	var plugins = require ('gulp-load-plugins')();
	gulp.watch( SRC + '/less/*.less',function (event){
		var globs = [
		        event.path,  /// 发生改变的文件的路径  // event.type：change的类型，有added、deleted、changed。
		        process.cwd() + '/' + SRC + '/less/*.less'
		    ];
		return gulp.src( globs )
			.pipe( plugins.less() )
			.pipe( gulp.dest( SRC + '/css' ) )
	});

	gulp.watch( SRC + '/**/*',function(event){
		return gulp.src([event.path],{base: process.cwd() + '/' + SRC })
			.pipe( gulp.dest(DIS) )
	});
}

gulp.task('default', ['dist'], watch);


// var  SRC = 'src';   //本地代码
// var	DIS = 'public';  //生产环境的代码
// var	BUILD = 'build'; //整合或打包的代码

gulp.task('js',function(){
	var minifyJs = require('gulp-uglify')
	console.log('task js done...')
	return gulp.src(DIS + '/js/*.js')
		.pipe(minifyJs().on('error',function(){
			console.log('=======')
			console.log(e)
		}))
		.pipe(gulp.dest(BUILD+ '/js'));
});

gulp.task('css',function(){
	var minifyCSS = require('gulp-minify-css');
	console.log('task css done...')
	return gulp.src(DIS + '/css/*.css')
		.pipe(minifyCSS())
		.pipe(gulp.dest(BUILD+'/css'))
});

gulp.task('html',function(){
	var minifyHTML = require('gulp-htmlmin');
	console.log('task html done...')
	return gulp.src(DIS+'/html/*.html')
		.pipe(minifyHTML())
		.pipe(gulp.dest(BUILD+'/html'))
});

gulp.task('image',function(){
	console.log('task image done...')
	gulp.src(SRC+'/image/*')
		.pipe(plugins.imagemin())
		.pipe(gulp.dest(BUILD+'/image'))
})

gulp.task('copy',function(){
	console.log('task copy done...')
	return gulp.src([
			DIS + '/**/*',
			'!' + DIS + '/**/*.{js,less,css,html}'
		])
		.pipe(gulp.dest( BUILD ))
})


gulp.task( 'build',['disl','js','css','html','copy'] )
