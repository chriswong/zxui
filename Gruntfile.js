module.exports = function (grunt) {
    
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: ['asset'],
        
        jshint: {
            options: grunt.file.readJSON('src/ui/.jshintrc'),
            files: ['src/ui/*.js']
        },

        less: {
            compile: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: '*.less',
                    dest: 'asset/css',
                    ext: '.css'
                }]
            }
        },

        stylus: {
            compile: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: '*.styl',
                    dest: 'asset/css',
                    ext: '.css'
                }]
            }
        },

        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            src: 'asset/css/*.css'
        },

        jsdoc : {
            files: ['src/ui/*.js'], 
            options: {
                destination: 'doc'
            }
        },

        watch: {
            styles: {
                options: {
                  debounceDelay: 250
                },
                files: 'src/css/*.styl',
                tasks: ['clean', 'stylus:compile', 'csslint']
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'src/ui',
                    dir: 'asset/ui',
                    skipDirOptimize: false,
                    preserveLicenseComments: false,
                    generateSourceMaps: true,
                    optimize: 'uglify2',
                    modules: [
                        {name: 'calendar'},
                        {name: 'city'}
                    ]
                }
            }
        },

        jasmine: {
            task: {
                src: 'src/**/*.js',
                options: {
                    specs: 'spec/*Spec.js',
                    template: require('grunt-template-jasmine-requirejs')
                }
            }
        }

    });


    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-jasmine');


    grunt.registerTask('default', ['clean'/*, 'jshint', 'less', 'stylus', 'csslint'*/]);

}
