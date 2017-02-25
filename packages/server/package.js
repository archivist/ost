let config = require('config')
let extend = require('lodash/extend')
let ServerConfig = extend({}, config.get('server'), {env: config.util.getEnv('NODE_ENV')})
let Database = require('./Database')
let EnginePackage = require('../engine/package')
let IndexerPackage = require('../indexer/package')
let ResourceServerPackage = require('./resource/package')
let ConverterServerPackage = require('./converter/package')
let DocumentServerPackage = require('./document/package')
let AuthServerPackage = require('archivist').AuthServerPackage
let CollabServerPackage = require('archivist').CollabServerPackage
let UserServerPackage = require('archivist').ResourceServerPackage

let db = new Database()

let InterviewPackage = require('../../dist/ost.cjs').InterviewPackage

module.exports = {
  name: 'ost-server',
  configure: function(config) {
    config.setAppConfig(ServerConfig)
    config.setDBConnection(db)
    config.import(InterviewPackage)
    config.import(EnginePackage)
    config.import(IndexerPackage)
    config.import(DocumentServerPackage)
    config.import(AuthServerPackage)
    config.import(CollabServerPackage)
    config.import(ResourceServerPackage)
    config.import(UserServerPackage)
    config.import(ConverterServerPackage)
  }
}