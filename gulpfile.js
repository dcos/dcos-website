'use strict'

const fs = require('fs')
const Metalsmith = require('metalsmith')
const jade = require('metalsmith-jade')
const markdown = require('metalsmith-markdown')
const layouts = require('metalsmith-layouts')
const permalinks = require('metalsmith-permalinks')
const path = require('path')
const autoprefixer = require('autoprefixer')
const each = require('metalsmith-each')
const navigation = require('metalsmith-navigation')
const modRewrite = require('connect-modrewrite')
const define = require('metalsmith-define')
const collections = require('metalsmith-collections')
const writemetadata = require('metalsmith-writemetadata')
const moment = require('moment')
const tags = require('metalsmith-tags')
const mlunr = require('metalsmith-lunr')
const feed = require('metalsmith-feed')
const gulpsmith = require('gulpsmith')
const gulp = require('gulp')
const watch = require('gulp-watch')
const plumber = require('gulp-plumber')
const batch = require('gulp-batch')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const readline = require('readline')
const promisify = require("promisify-node")
const gulpLoadPlugins = require('gulp-load-plugins')
const $ = gulpLoadPlugins()
const CONFIG = require('./env.json')[process.env.NODE_ENV] || require('./env.json')['production']
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const ancestry = require('metalsmith-ancestry')
const excerpts = require('metalsmith-excerpts')

//
// general build settings
//

const docsVersions = ['1.7', '1.8', '1.9']
const currentDevVersion = '1.10'

const cssTimestamp = new Date().getTime()
const paths = {
  build: './build',
  blog: {
    src: 'src/blog/*.md'
  },
  styles: {
    src: './src/styles/**/*.scss',
    dest: './build/styles'
  },
  js: {
    src: './src/scripts/**/*.js',
    dest: './build/scripts'
  },
  assets: {
    src: './src/assets/**/*.*',
    dest: './build/assets'
  },
  nginx: {
    config: './nginx.conf'
  },
  s3: {
    config: './s3-config.json'
  },
  yaml: {
    src: './dcos-docs/**/*.yaml',
    dest: './build/docs'
  },
  html: {
    src: './dcos-docs/**/*.html',
    dest: './build/docs'
  },
  redirects: {
    files: './redirect-files',
    prefixes: './redirect-prefixes'
  }
}

const navConfig = {
  header: {
    includeDirs: true,
    pathProperty: 'nav_path',
    childrenProperty: 'nav_children',
    sortBy: function (file, node) {
      if (file !== undefined) {
        if (file.menu_order !== undefined) {
          return file.menu_order
        }
      } else if (node.type === 'dir') {
        // for directories find the index.html and grab its menu_order
        let indexFile = node.children.find((c) => c.name == 'index.html')
        if (indexFile !== undefined) {
          if (indexFile.file.menu_order !== undefined) {
            return indexFile.file.menu_order
          }
        }
      }
      return 999
    },
    sortByNameFirst: true
  }
}

let createDocsJSON = function (obj) {
  var newObj = {
    name: obj.type,
    path: obj.path
  }

  if (obj.file) {
    newObj.file = {
      post_title: obj.file.nav_title || obj.file.post_title,
      search_blurb: obj.file.search_blurb
    }
  }
  newObj.children = obj.children.map(createDocsJSON)

  return newObj
}

const navSettings = {
  navListProperty: 'navs',
  permalinks: false,
  formatJSONfn: createDocsJSON
}

let nav = navigation(navConfig, navSettings)

const serveTask = () => {
  return readFileLines(paths.redirects.prefixes)
    .then(parseRedirects)
    .then((redirects) => {
      var rewriteRules = []
      for (let index = 0; index < redirects.length; ++index) {
        var redirect = redirects[index]
        // strip leading slash
        var from = redirect.from.replace(/^\//, '')
        var to = redirect.to.replace(/^\//, '')
        // normalize WITH leading slash
        rewriteRules.push('^/'+ from +'(.*) /' + to + '$1 [R]')
      }
      return rewriteRules
    })
    .then((rewriteRules) => {
      browserSync.init({
        open: false,
        server: {
          baseDir: paths.build,
          middleware: [
            modRewrite(rewriteRules),
            function (req, res, next) {
              var file = `./build${req.originalUrl}.html`
              fs.exists(file, function (exists) {
                if (exists) req.url += '.html'
                next()
              })
            }
          ]
        }
      })

      watch(['./src/*.jade', './src/**/*.jade', './src/*.md', './src/events.json', './src/scripts/*.js'],
        batch(function (events, done) { gulp.start('build-site-templates', done) }))
      watch(paths.blog.src,
        batch(function (events, done) { gulp.start('build-blog-templates', done) }))
      watch(paths.styles.src,
        batch(function (events, done) { gulp.start('styles', done) }))
      watch(paths.js.src,
        batch(function (events, done) { gulp.start('browserify', done) }))
      watch(paths.assets.src,
        batch(function (events, done) { gulp.start('copy', done) }))
      watch(['./layouts/**/*.*', './mixins/**/*.*', './includes/**/*.*'],
        batch(function (events, done) {
          gulp.start(['build-site-templates', 'build-blog-templates'], done)
        }))

      docsVersions.forEach(function (version) {
        watch([`./dcos-docs/${version}/**/*.md`], batch(function (events, done) {
          gulp.start(`build-docs-${version}`, done)
        }))
      })
    })
}

//
// Gulp tasks
//

const sharedDocsSiteTasks = ['copy', 'browserify', 'styles', 'nginx-config', 's3-config']

gulp.task('build', ['build-site', 'build-docs'])
gulp.task('build-site', ['build-site-templates', 'build-blog-templates', ...sharedDocsSiteTasks])
gulp.task('build-docs', [...docsVersions.map(getDocsBuildTask), ...docsVersions.map(getDocsCopyTask), ...sharedDocsSiteTasks, 'swagger-yaml', 'docs-raw-html'])

gulp.task('serve', ['build'], serveTask)
gulp.task('serve-site', ['build-site'], serveTask)
gulp.task('serve-docs', ['build-docs'], serveTask)

gulp.task('test', ['serve'], () => {
  process.exit(0)
})

function getDocsBuildTask (version) {
  const name = `build-docs-${version}`
  const src = `./dcos-docs/${version}/**/*.md`
  const collectionName = `docs-${version}`

  gulp.task(name, () => {
    return gulp.src(src)
      .pipe($.frontMatter().on('data', file => {
        file.title = file.frontMatter.post_title
        Object.assign(file, file.frontMatter)
        delete file.frontMatter
      }))
      .pipe($.ignore(file => (file.published == false)))
      .pipe(
        gulpsmith()
          .metadata({
            docsVersion: version, docsVersions, currentDevVersion,
            site: {
              url: `${CONFIG.root_url}/docs/${version}/`,
              title: `docs-${version}`,
              image_url: '/assets/images/rss-logo.png'
            }
          })
          .use(addTimestampToMarkdownFiles)
          .use(collections({
            [collectionName]: '**/*.md'
          }))
          .use(markdown({
            smartypants: true,
            gfm: true,
            tables: true
          }))
          .use((files, ms, done) => {
            const metadata = ms.metadata()
            const collection = metadata.collections[collectionName]
            collection.forEach((file) => {
              const p = file.path.includes('index.md')
                ? file.path.split('index.md')[0]
                : file.path.split('.md')[0]

              Object.assign(file, {
                url: `${CONFIG.root_url}/docs/${version}/${p}`,
                githubURL: `https://github.com/dcos/dcos-docs/tree/master/${version}/${file.path}`
              })
            })
            done()
          })
          .use(feed({
            collection: collectionName,
          }))
          .use(nav)
          .use(excerpts())
          .use(ancestry())
          .use(layouts({
            pattern: '**/*.html',
            engine: 'jade',
            directory: path.join('layouts'),
            default: 'docs.jade'
          }))
          .use(each(updatePaths))
          .use(jade({
            locals: { cssTimestamp, docsVersions, currentDevVersion },
            useMetadata: true,
            pretty: true
          }))
          .use(reloadInMetalsmithPipeline)
      )
      .pipe(gulp.dest(path.join(paths.build, 'docs', version)))
  })

  return name
}

function getDocsCopyTask (version) {
  const name = `copy-docs-images-${version}`

  gulp.task(name, () => {
    return gulp.src(`./dcos-docs/${version}/**/*.{png,gif,jpg,jpeg,json,sh}`)
      .pipe(gulp.dest(path.join(paths.build, 'docs', version)))
  })

  return name
}

gulp.task('swagger-yaml', () => {
  gulp.src(paths.yaml.src)
    .pipe(gulp.dest(paths.yaml.dest))
})

gulp.task('docs-raw-html', () => {
  gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
})

gulp.task('build-blog-templates', () => {
  return gulp.src(paths.blog.src)
    .pipe($.frontMatter().on('data', file => {
      Object.assign(file, file.frontMatter)
      delete file.frontMatter
    }))
    .pipe(
      gulpsmith()
        .metadata({
          site: {
            url: CONFIG.root_url,
            title: 'DC/OS Blog',
            image_url: './assets/images/rss-logo.png'
          }
        })
        .use(addTimestampToMarkdownFiles)
        .use(markdown({
          smartypants: true,
          gfm: true,
          tables: true
        }))
        .use(jade({
          locals: { cssTimestamp },
          pretty: true
        }))
        .use(permalinks({
          pattern: ':title',
          date: 'YYYY',
          linksets: [{
            match: { collection: 'posts' },
            pattern: 'blog/:date/:title'
          }]
        }))
        .use(collections({
          posts: {
            pattern: '*.md',
            sortBy: 'date',
            reverse: true
          }
        }))
        .use(addPropertiesToCollectionItems('posts', post => {
          return Object.assign(post, {
            formattedDate: moment(post.date).format('MMMM DD')
          })
        }))
        .use(writemetadata({
          collections: {
            posts: {
              output: {
                path: 'blog/posts.json',
                asObject: true
              },
              ignorekeys: ['contents', 'next', 'previous', 'stats', 'mode', 'lunr']
            }
          }
        }))
        .use(tags({
          handle: 'category',
          path: 'blog/category/:tag.html',
          layout: '../layouts/blog-category.jade',
          sortBy: 'date',
          reverse: true
        }))
        .use(mlunr({
          indexPath: 'blog/search-index.json',
          fields: {
            contents: 2,
            title: 10,
            category: 5
          }
        }))
        .use(define({
          moment,
          rootUrl: CONFIG.root_url
        }))
        .use(feed({ collection: 'posts' }))
        .use(layouts({
          pattern: '**/*.html',
          engine: 'jade',
          directory: path.join('layouts')
        }))
        .use(reloadInMetalsmithPipeline)
  )
    .pipe(gulp.dest(paths.build))
})

gulp.task('build-site-templates', () => {
  return gulp.src(['src/*.jade', 'src/**/*.jade', 'src/*.md'])
    .pipe($.changed(paths.build, { extension: '.html' }))
    .pipe($.frontMatter().on('data', file => {
      Object.assign(file, file.frontMatter)
      delete file.frontMatter
    }))
    .pipe(
      gulpsmith()
        .use(addTimestampToMarkdownFiles)
        .use(markdown({
          smartypants: true,
          gfm: true,
          tables: true
        }))
        .use(jade({
          locals: { cssTimestamp, events: addDateProps(sortEventsAscending(JSON.parse(fs.readFileSync('./src/events.json', 'utf8')))) },
          pretty: true
        }))
        .use(define({
          moment,
          rootUrl: CONFIG.root_url
        }))
        .use(each(updatePaths))
        .use(layouts({
          pattern: '**/*.html',
          engine: 'jade',
          directory: path.join('layouts')
        })))
    .use(reloadInMetalsmithPipeline)
    .pipe(gulp.dest(paths.build))
})

gulp.task('s3-config', (done) => {
  return readFileLines(paths.redirects.prefixes)
    .then(parseRedirects)
    .then((redirects) => {
      var routingRules = []
      for (let index = 0; index < redirects.length; ++index) {
        var redirect = redirects[index]
        // strip leading slash
        var from = redirect.from.replace(/^\//, '')
        var to = redirect.to.replace(/^\//, '')
        // normalize WITHOUT leading slash
        routingRules.push({
          "Condition": { "KeyPrefixEquals": from },
          "Redirect": { "HostName": "dcos.io", "ReplaceKeyPrefixWith": to }
        })
      }
      return {
        "IndexDocument": {
           "Suffix": "index.html"
         },
         "ErrorDocument": {
           "Key": "404/index.html"
         },
         "RoutingRules": routingRules
      }
    })
    .then(writeJson(paths.s3.config, {spaces: 4}))
})

gulp.task('nginx-config', () => {
  const nginxConf = require('nginx-conf').NginxConfFile
  // create empty file or erase existing file
  fs.closeSync(fs.openSync(paths.nginx.config, 'w'))
  // convert nodeback function to return a Promise
  var createNginxConf = promisify(nginxConf.create)
  // write to existing file
  return createNginxConf(paths.nginx.config)
    .then((conf) => {
      conf.nginx._add('server')

      conf.nginx.server._add('listen', '80')
      conf.nginx.server._add('server_name', 'localhost')

      conf.nginx.server._add('location', '/')
      conf.nginx.server.location._add('root', '/usr/share/nginx/html')

      // rewrite is slower than the default index method, but allows for making the directory canonical
      //conf.nginx.server.location._add('index', 'index.html')
      conf.nginx.server._add('rewrite', '^(.*)/index\.html$ $1/ redirect')
      conf.nginx.server._add('rewrite', '^(.*)/$ $1/index.html')

      conf.nginx.server._add('error_page', '404 /404/index.html')
      conf.nginx.server._add('error_page', '500 502 503 504 /50x.html')

      conf.nginx.server._add('location', '= /50x.html')
      conf.nginx.server.location.slice(-1)[0]._add('root', '/usr/share/nginx/html')

      return conf
    })
    .then((conf) => {
      // Add 301 prefix rewrite rules
      return readFileLines(paths.redirects.prefixes)
        .then(parseRedirects)
        .then((redirects) => {
          var routingRules = []
          for (let index = 0; index < redirects.length; ++index) {
            var redirect = redirects[index]
            // strip leading slash
            var from = redirect.from.replace(/^\//, '')
            var to = redirect.to.replace(/^\//, '')
            // normalize WITH leading slash
            conf.nginx.server._add('rewrite', '^/'+ from +'(.*) /' + to + '$1 redirect')
          }
          return conf
        })
    })
    .then((conf) => {
      // Add 301 page redirects
      return readFileLines(paths.redirects.files)
        .then(parseRedirects)
        .then((redirects) => {
          for (let index = 0; index < redirects.length; ++index) {
            var redirect = redirects[index]
            conf.nginx.server._add('location', '= ' + redirect.from)
            conf.nginx.server.location.slice(-1)[0]._add('return', '301 ' + redirect.to)
          }
        })
        return conf
    })
})

gulp.task('browserify', () => {
  const browserifyThis = (() => {
    let bundler = browserify({
      cache: {}, packageCache: {}, fullPaths: true,
      entries: './src/scripts/main.js',
      extensions: ['.js'],
      debug: !isProd()
    });

    const bundle = () => {
      return bundler.bundle()
        .on('error', (e) => {
          console.log('error', e)
          const args = Array.prototype.slice.call(arguments);
          return $.notify.onError((error) => {
            console.log('error', error)
            return error.message
          }).apply(this, args);
        })
        .pipe(source('main.min.js'))
        .pipe(buffer())
        .pipe($.uglify())
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream({ once: true }));
    }

    return bundle();
  })();
});

// TODO: minify in production
gulp.task('styles', () => {
  const processors = [
    autoprefixer({ browsers: ['last 3 versions'] })
  ]

  return gulp.src(paths.styles.src)
    .pipe($.sass({
      outputStyle: 'expanded',
      includePaths: [
        '/node_modules/',
        path.join(__dirname, 'node_modules/support-for/sass')
      ]
    }).on('error', $.sass.logError))
    .pipe($.postcss(processors))
    .pipe($.if(isProd(), $.cleanCss()))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream())
})

gulp.task('copy', () => {
  return gulp.src(paths.assets.src)
    .pipe(gulp.dest(paths.assets.dest))
})

// Utility functions

const isDev = () => process.env.NODE_ENV === 'development'
const isProd = () => process.env.NODE_ENV === 'production'

const reloadInMetalsmithPipeline = (a, b, done) => {
  reload()
  done()
}

function updatePaths (file, filename) {
  if (path.basename(filename) === 'index.html') { return filename }

  if (path.extname(filename) === '.html' && path.extname(filename) !== '') {
    return filename.split('.html')[0] + '/index.html'
  }
  return filename
}

function docsRSSPaths (file, filename) {
  if (path.basename(filename) === 'index.html') { return filename }

  if (path.extname(filename) === '.html' && path.extname(filename) !== '') {
    return filename.split('.html')[0]
  }
  return filename
}

function addPropertiesToCollectionItems (collectionName, callback) {
  return function (files, metalsmith, done) {
    let metadata = metalsmith.metadata()
    let collection = metadata[collectionName] || []

    metadata[collectionName] = collection.map(callback)

    return done()
  }
}

function addTimestampToMarkdownFiles (files, metalsmith, callback) {
  Object.keys(files).forEach(key => {
    if (key.split('.').pop() !== 'md') return
    Object.assign(files[key], { cssTimestamp })
  })
  callback()
}

const sortEventsAscending = eventsArr => {
  return eventsArr.sort((eventA, eventB) => {
    const a = moment(eventA.date).unix()
    const b = moment(eventB.date).unix()

    if(a > b) return -1
    if(a < b) return 1
    return 0
  })
}

const addDateProps = eventsArr => {
  return eventsArr.map(event => {
    const date = moment(event.date)
    return Object.assign({}, event, {
      day: date.format('D'),
      month: date.format('MMM')
    })
  })
}

var Redirect = function (from, to) {
    this.from = from
    this.to = to
}

// Parse an array of strings into an array of Redirect objects
function parseRedirects(lines) {
  var redirects = []
  for (let index = 0; index < lines.length; ++index) {
    var splitLine = lines[index].split(' ')
    redirects.push(new Redirect(splitLine[0], splitLine[1]))
  }
  return redirects
}

// Read a file into an array of file lines.
// Returns a promise.
function readFileLines(filePath) {
  return new Promise(function(resolve, reject) {
    var lines = []
    readline.createInterface({
      input: fs.createReadStream(filePath)
    }).on('line', (line) => {
      lines.push(line)
    }).on('close', () => {
      resolve(lines)
    })
  })
}

// Promisify fs.writeJson for chained input.
// Options may include replacer or spaces for JSON.stringify.
function writeJson(filePath, options) {
  return (data) => {
    return new Promise(function(resolve, reject) {
      var spaces = options ? options.spaces : null
      var replacer = options ? options.replacer : null
      var dataStr = JSON.stringify(data, replacer, spaces)
      fs.writeFile(filePath, dataStr, options, (err) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  }
}
