module.exports = function (grunt) {
    
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: ['asset'],
        
        jshint: {
            options: grunt.file.readJSON('src/ui/.jshintrc'),
            files: ['src/ui/*.js', 'test/spec/*.js']
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
            less: {
                options: {
                  debounceDelay: 250
                },
                files: 'src/css/*.less',
                tasks: ['clean', 'csslint']
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

        connect: {
            test: {
                options: {
                    port: 8888
                }
            }
        },

        jasmine: {
            requirejs: {
                src: 'src/ui/*.js',
                options: {
                    styles: '<%= csslint.src %>',
                    specs: 'test/spec/*Spec.js',
                    helpers: 'test/spec/*Helper.js',
                    vendor: ['./dep/vars.js', './dep/common-2.3.js'],
                    host: 'http://localhost:<%= connect.test.options.port %>',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: './src/ui/'
                        }
                    }
                }
            }
        }

    });


    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');


    grunt.registerTask('base', ['clean', 'jshint', 'less', 'csslint']);
    grunt.registerTask('test', ['base', 'connect', 'jasmine']);
    grunt.registerTask('default', ['base']);

}
