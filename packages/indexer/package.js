let Indexer = require('./Indexer')

module.exports = {
  name: 'ost-indexer',
  configure: function(config) {
    let db = config.getDBConnection()
    let indexer = new Indexer({
      db: db,
      configurator: config,
      documentEngine: config.getEngine('document'),
      snapshotEngine: config.getEngine('snapshot'),
      fragmentStore: config.getStore('fragment')
    })

    config.addEngine('indexer', indexer)
  }
}