module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower: {
            install: {
                options: {
                    targetDir: 'client/requires',
                    layout: 'byComponent'
                }
            }
        },

        clean: {
            build: ['build'],
            dev: {
                src: ['build/app.js', 'build/<%= pkg.name %>.css', 'build/<%= pkg.name %>.js']
            },
            prod: ['dist']
        },

        browserify: {
            util: {
                src: ['client/requires/**/util/*.js'],
                dest: 'build/util.js',
                options: {
                    shim: {
                        modernizr: {
                            path: 'client/requires/modernizr/util/modernizr.js',
                            exports: 'Modernizr'
                        }
                    }
                }
            },
            vendor: {
                src: ['client/requires/**/js/*.js'],
                dest: 'build/vendor.js',
                options: {
                    shim: {
                        jquery: {
                            path: 'client/requires/jquery/js/jquery.js',
                            exports: '$'
                        },
                        underscore: {
                            path: 'client/requires/underscore/js/underscore.js',
                            exports: '_'
                        },
                        backbone: {
                            path: 'client/requires/backbone/js/backbone.js',
                            exports: 'Backbone',
                            depends: {
                                underscore: 'underscore'
                            }
                        },
                        'backbone.touch': {
                            path: 'client/requires/backbone.touch/js/backbone.touch.js',
                            exports: 'Backbone',
                            depends: {
                                jquery: '$',
                                backbone: 'Backbone',
                                underscore: '_'
                            }
                        },
                        'backbone.marionette': {
                            path: 'client/requires/backbone.marionette/js/backbone.marionette.js',
                            exports: 'Marionette',
                            depends: {
                                jquery: '$',
                                backbone: 'Backbone',
                                underscore: '_'
                            }
                        },
                        'backbone.babysitter': {
                            path: 'client/requires/backbone.babysitter/js/backbone.babysitter.js',
                            exports: 'Babysitter',
                            depends: {
                                jquery: '$',
                                backbone: 'Backbone',
                                underscore: '_'
                            }
                        },
                        'backbone.wreqr': {
                            path: 'client/requires/backbone.wreqr/js/backbone.wreqr.js',
                            exports: 'Wreqr',
                            depends: {
                                jquery: '$',
                                backbone: 'Backbone',
                                underscore: '_'
                            }
                        }
                    }
                }
            },
            app: {
                files: {
                    'build/app.js': ['client/src/main.js']
                },
                options: {
                    transform: ['hbsfy'],
                    external: ['jquery', 'underscore', 'backbone', 'backbone.touch', 'backbone.marionette']
                }
            }
        },

        compass: {
            dev: {
                options: {
                  sassDir: 'client/styles',
                  cssDir: 'build',
                  outputStyle: 'expanded',
                  raw: "require 'compass-normalize'"
                }
            },
            prod: {
                options: {
                  sassDir: 'client/styles',
                  cssDir: 'build',
                  outputStyle: 'compressed',
                  raw: "require 'compass-normalize'",
                  force: true
                }
            }
        },

        webfont: {
            icons: {
                src: 'build/*.svg',
                dest: 'public/css',
                destCss: 'client/styles',
                options: {
                    font: 'icon',
                    stylesheet: 'scss',
                    relativeFontPath: './',
                    htmlDemo: false,
                    syntax: 'bootstrap'
                }
            }
        },

        concat: {
            'build/<%= pkg.name %>.js': ['build/vendor.js', 'build/app.js']
        },

        copy: {
            webfont: {
                files: [{
                    expand: true,
                    src: 'client/icons/*.svg',
                    dest: 'build',
                    rename: function(dest, src) {
                        src = src.substring(src.indexOf('icon_')+5);
                        return dest + '/' + src;
                    }
                }]
            },
            dev: {
                files: [{
                    src: 'build/<%= pkg.name %>.js',
                    dest: 'public/js/<%= pkg.name %>.js'
                }, {
                    src: 'build/util.js',
                    dest: 'public/js/util.js'
                }, {
                    src: 'build/main.css',
                    dest: 'public/css/<%= pkg.name %>.css'
                }, {
                    src: 'client/img/*',
                    dest: 'public/img/'
                }]
            },
            prod: {
                files: [{
                    src: ['client/img/*'],
                    dest: 'dist/img/'
                }]
            }
        },

        // CSS minification.
        cssmin: {
            minify: {
                src: ['build/<%= pkg.name %>.css'],
                dest: 'dist/css/<%= pkg.name %>.css'
            }
        },

        // Javascript minification.
        uglify: {
            compile: {
                options: {
                    compress: true,
                    verbose: true
                },
                files: [{
                    src: 'build/<%= pkg.name %>.js',
                    dest: 'dist/js/<%= pkg.name %>.js'
                }]
            }
        },

        // for changes to the front-end code
        watch: {
            scripts: {
                files: ['client/templates/*.hbs', 'client/src/**/*.js'],
                tasks: ['clean:dev', 'browserify:app', 'concat', 'copy:dev']
            },
            webfont: {
                files: ['client/icons/*.svg'],
                tasks: ['copy:webfont', 'webfont']
            },
            compass: {
                files: ['client/styles/**/*.scss'],
                tasks: ['compass:dev', 'copy:dev']
            }
        },

        // for changes to the node code
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug'],
                    watch: ['controllers', 'app'],
                    env: {
                        PORT: '3300'
                    }
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon:dev', 'watch:scripts', 'watch:webfont', 'watch:compass'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'client/src/**/*.js', 'client/spec/**/*.js'],
            dev: ['client/src/**/*.js']
        }
    });

    grunt.registerTask('init:dev', ['clean', 'bower', 'browserify:vendor', 'browserify:util']);

    grunt.registerTask('build:dev', ['clean:dev', 'browserify:app', 'jshint:dev', 'copy:webfont', 'webfont', 'compass:dev', 'concat', 'copy:dev']);
    grunt.registerTask('build:prod', ['clean:prod', 'browserify:vendor', 'browserify:util', 'browserify:app', 'jshint:all', 'copy:webfont', 'webfont', 'compass:prod', 'concat', 'cssmin', 'uglify', 'copy:prod']);

    grunt.registerTask('heroku', ['init:dev', 'build:dev']);

    grunt.registerTask('server', ['build:dev', 'concurrent:dev']);

};
