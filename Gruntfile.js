module.exports = function (grunt) {
    
    grunt.initConfig({

        meta: {
            pkg: grunt.file.readJSON('package.json'),
            src: {
                main: 'src',
                test: 'test/spec'
            }
        },


        clean: ['asset', 'bin'],
        
        jshint: {
            options: grunt.file.readJSON('.jshintrc'),
            files: ['<%=meta.src.main%>/ui/*.js', '<%=meta.src.test%>/*.js']
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
                    baseUrl: '<%=meta.src.main%>',
                    dir: 'asset/src',
                    skipDirOptimize: false,
                    preserveLicenseComments: false,
                    generateSourceMaps: true,
                    optimize: 'uglify2',
                    modules: [
                        {name: 'ui/Calendar'},
                        {name: 'ui/City'}
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
                src: './<%=meta.src.main%>/*/*.js',
                options: {
                    outfile: 'SpecRunner.html',
                    keepRunner: true,
                    styles: '<%= csslint.src %>',
                    specs: 'test/spec/*Spec.js',
                    // helpers: 'test/spec/*Helper.js',
                    vendor: [],
                    host: 'http://localhost:<%= connect.test.options.port %>',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: './<%=meta.src.main%>/',
                            urlArgs: '?' + (+new Date).toString(36)
                        }
                    }
                }
            },
            istanbul: {
                src: './<%=meta.src.main%>/*/*.js',
                options: {
                    specs: ['test/spec/*Spec.js'],
                    vendor: [],
                    outfile: 'SpecRunner.html',
                    keepRunner: true,
                    styles: '<%= csslint.src %>',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'test/coverage/coverage.json',
                        report: 'test/coverage',
                        // helpers: 'test/spec/*Helper.js',
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

    grunt.registerTask('foo', 'just for test', function (arg1, arg2) {
        grunt.log.writeln('arg1:%s, arg2:%s', arg1, arg3);
    });

    grunt.registerTask('base', ['clean', 'jshint', 'less', 'csslint']);
    grunt.registerTask('build', ['base', 'requirejs']);
    grunt.registerTask('test', ['base', 'connect', 'jasmine:requirejs']);
    grunt.registerTask('cover', ['base', 'connect', 'jasmine:istanbul']);
    grunt.registerTask('default', ['base']);

}
