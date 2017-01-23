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
})

// this optional task makes it easier to work on Substance core
b.task('substance', function() {
  b.make('substance', 'clean', 'browser', 'server')
  b.copy('node_modules/substance/dist', './dist/substance')
})

b.task('archivist', function() {
  b.make('archivist')
  b.copy('node_modules/archivist/dist', './dist/archivist')
})

function buildApp(app, core) {
  return function() {
    if(core) {
      _ostJS()
    }
    b.copy('client/'+app+'/index.html', './dist/'+app+'/')
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
          'node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'
        ] 
      },
      dest: './dist/' + app + '/app.js',
      format: 'umd',
      moduleName: app
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
      format: 'cjs', sourceMapRoot: __dirname, sourceMapPrefix: 'ost'
    }]
  })
}

b.task('deps', ['clean', 'substance', 'assets', 'archivist'])
b.task('ost', _ostJS())
b.task('publisher', buildApp('publisher'))
b.task('scholar', buildApp('scholar'))

b.task('client', ['publisher', 'scholar'])

// build all
b.task('default', ['client'])

// starts a server when CLI argument '-s' is set
b.setServerPort(5001)
b.serve({
  static: true, route: '/', folder: 'dist'
});