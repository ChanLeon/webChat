module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    fis: {
      compile: {
        options: {
          src: './src/',
          dist: '../site',
          pack: true, //是否按照将js,css的uri打包
          env: {
            'NODE_ENV': 'development'
          },
          command: 'm,D,l,p' //m: md5, D: domains, l: lint, o: optimize, p: pack
        }
      },
      deploy: {
        options: {
          src: './src/',
          dist: '../site',
          pack: true, //是否按照将js,css的uri打包
          env: {
            'NODE_ENV': 'production'
          },
          command: 'm,D,l,o,p' //m: md5, D: domains, l: lint, o: optimize, p: pack
        }
      }
    },

    layout: {
      view: {
        options: {
          dist: './src/'
        },
        tree: ['{0}/page/index.ejs', '{0}/static/index.css', '{0}/static/index.js', '{0}/static/image/', '{0}/tpl/']
      },
      controller: {
        options: {
          dist: './controllers/'
        },
        tree: ['{0}/index.js']
      }
    },

    nodeunit: {
      files: ['test/**/*_test.js'],
    },

    clean: {
      site: ['site']
    },

    qiniu: {
      sync: {
        options: {
          ACCESS_KEY: '',
          SECRET_KEY: '',
          bucket: '',
          prefix: 'static/',
          path: __dirname
        },
        files: {
          'logs/qiniu.json': ['site/static/']
        }
      }
    },

    watch: {
      scripts: {
        options: {
          livereload: 1339
        },
        files: ['src/**/*'],
        tasks: ['fis:compile']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-umi-fis');
  grunt.loadNpmTasks('grunt-umi-layout');
  grunt.loadNpmTasks('grunt-umi-qiniu');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task.
  grunt.registerTask('deploy', ['fis:deploy', 'qiniu']);

  grunt.registerTask('default', ['cp']);

  grunt.registerTask('cp', ['fis:compile']);
  grunt.registerTask('av', ['layout:view']);
  grunt.registerTask('ac', ['layout:controller']);
};