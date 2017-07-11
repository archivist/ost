let DocumentServer = require('./DocumentServer')

module.exports = {
  name: 'document-server',
  configure: function(config) {
    let server = config.getServerApp()
    let authEngine = config.getEngine('auth')
    let documentEngine = config.getEngine('document')
    let indexer = config.getEngine('indexer')

    let documentServer = new DocumentServer({
      configurator: config,
      authEngine: authEngine,
      documentEngine: documentEngine,
      indexer: indexer,
      path: '/api/documents'
    })
    documentServer.bind(server)
  }
}
