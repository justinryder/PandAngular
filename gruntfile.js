module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //config
        watch: {
            compass: {
                files: ['src/sass/**/*.{scss,sass}'],
                tasks: ['compass:dev'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['src/**/*.html'],
                tasks: ['copy:html'],
                options: {
                    livereload: true
                }
            },
            images: {
                files: ['src/images/**/*'],
                tasks: ['copy:images'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['uglify'],
                options: {
                    livereload: true
                }
            }
        },
        compass: {
            dev: {
                options: {
                    sassDir: ['src/sass'],
                    cssDir: ['app/css'],
                    environment: 'development'
                }
            },
            prod: {
                options: {
                    sassDir: ['src/sass'],
                    cssDir: ['app/css'],
                    environment: 'production'
                }
            }
        },
        uglify: {
            all: {
                options: {
                    beautify: true
                },
                files: {
                    'app/js/app.js': [
                        'src/js/app.js',
                        'src/js/graphController.js',
                        'src/js/graphDirective.js',
                        'src/js/controlsController.js'
                    ]
                }
            }
        },
        copy: {
            html: {
                files: [
                    {
                        src: 'src/index.html',
                        dest: 'app/index.html'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: 'src/html/**/*.html',
                        dest: 'app/html/'
                    }
                ]
            },
            images: {
                expand: true,
                flatten: true,
                src: 'src/images/**/*',
                dest: 'app/images/'
            }
        }
    });

    // dependencies
    loadNpmDependencies([
            'grunt-contrib-watch',
            'grunt-contrib-compass',
            'grunt-contrib-uglify',
            'grunt-contrib-copy'
        ]);

    // tasks
    grunt.registerTask('default', [
            'compass:dev',
            'uglify',
            'copy'
        ]);

    function loadNpmDependencies(tasks){
        for (var i = 0; i < tasks.length; i++){
            grunt.loadNpmTasks(tasks[i]);
        }
    }
};