/*jshint node:true*/
'use strict';

var banner = '' +
  '/*!\n' +
  ' * <%= pkg.name %>\n' +
  ' * v<%= pkg.version %> - <%= grunt.template.today("dd/mm/yyyy") %>\n' +
  ' * http://github.com/<%= pkg.repo %>\n' +
  ' * (c) <%= pkg.author %> (@kewah) - <%= pkg.license %> License\n' +
  ' */\n';

var standaloneTpl = '<%= banner %>' +
  ';(function(window, document, undefined) { \n\n' +
  '<%= content %> \n\n' +
  'window.CSSAnimationEmitter = CSSAnimationEmitter;\n\n' +
  '}(window, document));';

var componentTpl = '' +
  '<%= content %> \n' +
  'module.exports = CSSAnimationEmitter;';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('component.json'),

    clean: {
      all: ['dist', 'build']
    },

    jshint: {
      all: ['src/<%= pkg.name %>.js']
    },

    build: {
      dist: {
        filename: '<%= pkg.name %>',
        banner: banner
      }
    },

    component_build: {
      build: {
        scripts: true,
        styles: false,
        verbose: true
      },
    },

    uglify: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      },
      options: {
        banner: banner
      }
    }

  });

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-component-build');

  // Task which generates the component and standalone version in the `dist` directory.
  grunt.registerMultiTask('build', 'Generate standalone & component versions', function() {
    var opts = this.data;
    var src = {
      data: {
        content: grunt.file.read('src/' + opts.filename + '.js')
      }
    };

    var standalone = grunt.template.process(opts.banner + standaloneTpl, src);
    var component = grunt.template.process(componentTpl, src);

    grunt.file.write('dist/' + opts.filename + '.js', standalone);
    grunt.file.write('dist/' + opts.filename + '.common.js', component);
  });

  // register tasks
  grunt.registerTask('default', ['dist']);
  grunt.registerTask('dist', ['clean', 'jshint', 'build:dist', 'uglify:dist']);
  grunt.registerTask('test', ['dist', 'component_build']);
};
