var b = require('substance-bundler');
var fs = require('fs')
var config = require('config')

b.task('clean', function() {
  b.rm('./dist')
})

// copy assets
b.task('assets', function() {
  b.copy('node_modules/font-awesome', './dist/font-awesome')
  b.copy('node_modules/leaflet.markercluster/dist', './dist/markercluster')
  b.copy('node_modules/leaflet/dist/images', './dist/publisher/images')
  b.copy('node_modules/leaflet-control-geocoder/dist/images', './dist/publisher/images')
})

// this optional task makes it easier to work on Substance core
b.task('substance', function() {
  b.make('substance', 'build')
  b.copy('node_modules/substance/dist', './dist/substance')
  b.minify('./dist/substance/substance.js', './dist/substance/substance.min.js')
})

b.task('archivist', function() {
  b.make('archivist', 'build')
  b.copy('node_modules/archivist/dist', './dist/archivist')
  b.minify('./dist/archivist/archivist.js', './dist/archivist/archivist.min.js')
})

function buildArchivistDev() {
  return function() {
    b.make('archivist', 'dev')
    b.copy('node_modules/archivist/dist', './dist/archivist')
  }
}

function buildApp(app, production) {
  return function() {
    if(production) {
      b.copy('client/'+app+'/index.production.html', './dist/'+app+'/index.html')
    } else {
      b.copy('client/'+app+'/index.html', './dist/'+app+'/')
    }
    b.copy('client/'+app+'/assets', './dist/'+app+'/assets/')
    b.css('./client/' + app + '/app.css', 'dist/' + app + '/' + app + '.css', {variables: true})
    b.js('client/' + app + '/app.js', {
      // need buble if we want to minify later
      buble: true,
      external: ['substance', 'archivist'],
      commonjs: { 
        include: [
          'node_modules/moment/moment.js', 
          'node_modules/plyr/src/js/plyr.js', 
          'node_modules/leaflet/dist/leaflet-src.js',
          'node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js',
          'node_modules/leaflet-control-geocoder/dist/Control.Geocoder.js'
        ] 
      },
      targets: [{
        dest: './dist/' + app + '/app.js',
        format: 'umd',
        moduleName: app
      }]
    })
    b.custom('injecting config', {
      src: './dist/' + app + '/app.js',
      dest: './dist/' + app + '/' + app + '.js',
      execute: function(file) {
        const code = fs.readFileSync(file[0], 'utf8')
        const result = code.replace(/ARCHIVISTCONFIG/g, JSON.stringify(config.get('app')))
        fs.writeFileSync(this.outputs[0], result, 'utf8')
      }      
    })
    b.minify('./dist/' + app + '/' + app + '.js', './dist/' + app + '/' + app + '.min.js')
    b.copy('./dist/' + app + '/app.js.map', './dist/' + app + '/' + app + '.js.map')
    b.rm('./dist/' + app + '/app.js')
    b.rm('./dist/' + app + '/app.js.map')
  }
}

function _ostJS() {
  b.js('./index.es.js', {
    buble: true,
    external: ['substance', 'archivist'],
    targets: [{
      dest: 'dist/ost.cjs.js',
      format: 'cjs', 
      sourceMapRoot: __dirname, 
      sourceMapPrefix: 'ost'
    }]
  })
}

b.task('deps', ['substance', 'assets', 'archivist'])
b.task('ost', _ostJS())

// dev
b.task('archivist-dev', buildArchivistDev())
b.task('publisher', buildApp('publisher'))
b.task('scholar', buildApp('scholar'))
// production
b.task('publisher-min', buildApp('publisher', true))
b.task('scholar-min', buildApp('scholar', true))

b.task('client', ['publisher', 'scholar'])
b.task('client-min', ['scholar-min', 'publisher-min'])

// build all
b.task('default', ['deps', 'client', 'ost'])
b.task('dev', ['substance', 'assets', 'archivist-dev', 'client', 'ost'])
b.task('production', ['deps', 'client-min', 'ost'])

// starts a server when CLI argument '-s' is set
b.setServerPort(5001)
b.serve({
  static: true, route: '/', folder: 'dist'
});