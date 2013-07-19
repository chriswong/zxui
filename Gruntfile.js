module.exports = function (grunt) {
    
    grunt.initConfig({

        meta: {
            pkg: grunt.file.readJSON('package.json'),
            src: {
                main: 'src/ui',
                test: 'test/spec'
            }
        },


        clean: ['asset', 'bin'],
        
        jshint: {
            options: grunt.file.readJSON('.jshintrc'),
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
            files: ['src/ui/lib.js'], 
            options: {
                configure: '.jsdocrc',
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
                        {name: 'Calendar'},
                        {name: 'City'}
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
                            baseUrl: './src/ui/',
                            urlArgs: '?' + (+new Date).toString(36)
                        }
                    }
                }
            },
            istanbul: {
                src: './<%=meta.src.main%>/*.js',
                options: {
                    specs: ['test/spec/*Spec.js'],
                    vendor: ['./dep/vars.js', './dep/common-2.3.js'],
                    styles: '<%= csslint.src %>',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'test/coverage/coverage.json',
                        report: 'test/coverage',
                        helpers: 'test/spec/*Helper.js',
                        host: 'http://localhost:<%= connect.test.options.port %>',
                        template: require('grunt-template-jasmine-requirejs'),
                        templateOptions: {
                            requireConfig: {
                                baseUrl: '.grunt/grunt-contrib-jasmine/<%= meta.src.main %>/',
                                urlArgs: '?' + (+new Date).toString(36)
                            }
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
    grunt.registerTask('test', ['base', 'connect', 'jasmine:requirejs']);
    grunt.registerTask('cover', ['base', 'connect', 'jasmine:istanbul']);
    grunt.registerTask('default', ['base']);

}
