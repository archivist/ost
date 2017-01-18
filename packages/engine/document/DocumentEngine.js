let ArchivistDocumentEngine = require('archivist').DocumentEngine
let Err = require('substance').SubstanceError
let isEmpty = require('lodash/isEmpty')

class DocumentEngine extends ArchivistDocumentEngine {

  listDocuments(args, cb) {
    let filters = !isEmpty(args.filters) ? JSON.parse(args.filters) : {}
    let options = !isEmpty(args.options) ? JSON.parse(args.options) : {}  
    let results = {}
    
    if(!options.columns) options.columns = ['"documentId"', '"schemaName"', '"schemaVersion"', "meta", "title", "language", '"updatedAt"', '"updatedBy"', '"userId"']

    if(filters.topics) {
      filters['"references" ?&'] = filters.topics
      delete filters.topics
    }

    this.documentStore.countDocuments(filters, function(err, count) {
      if(err) {
        return cb(new Err('ArchivistDocumentEngine.ListDocumentsError', {
          cause: err
        }))
      }
      results.total = count
      this.documentStore.listDocuments(filters, options, function(err, docs) {
        if(err) {
          return cb(new Err('ArchivistDocumentEngine.ListDocumentsError', {
            cause: err
          }))
        }
        results.records = docs
        
        cb(null, results)
      })
    }.bind(this))
  }
}

module.exports = DocumentEngine
