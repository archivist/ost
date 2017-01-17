let Err = require('substance').SubstanceError
let ArchivistIndexer = require('archivist').Indexer
let findIndex = require('lodash/findIndex')
let isEmpty = require('lodash/isEmpty')

// Massive internal libs
let ArgTypes = require('../../node_modules/massive/lib/arg_types')
let Where = require('../../node_modules/massive/lib/where')

class Indexer extends ArchivistIndexer {
  searchDocuments(filters, options) {
    let isTextSearch = filters.query ? true : false
    let limit = options.limit || 100
    let offset = options.offset || 0
    let query, countQuery, args, where, searchQuery, language

    if(isTextSearch) {
      searchQuery = filters.query
      language = filters.language || 'english'
      delete filters.query
      delete filters.language

      args = ArgTypes.findArgs(arguments, this)
      where = isEmpty(args.conditions) ? {} : Where.forTable(args.conditions)

      let whereQuery = where.where ? where.where + ' \nAND (tsv @@ q)' : '\nWHERE (tsv @@ q)'

      countQuery = `SELECT COUNT(*) FROM documents, plainto_tsquery(${language}, ${searchQuery}) AS q ${whereQuery}`

      query = `SELECT 
"documentId", title, meta,
(SELECT COUNT(*) 
  FROM fragments ${whereQuery} 
  AND "documentId" = documents."documentId"
) AS count,
ts_rank_cd(documents.tsv, q) AS rank FROM documents, plainto_tsquery(${language}, ${searchQuery}) AS q ${whereQuery} 
ORDER BY rank DESC limit ${limit} offset ${offset}`

    } else {
      args = ArgTypes.findArgs(arguments, this)
      where = isEmpty(args.conditions) ? {} : Where.forTable(args.conditions)

      let whereQuery = where.where

      countQuery = `SELECT COUNT(*) FROM documents ${whereQuery}`

      query = `SELECT 
"documentId", title, meta,
(SELECT COUNT(*) 
  FROM fragments ${whereQuery} 
  AND "documentId" = documents."documentId"
) AS count
FROM documents ${whereQuery}
ORDER BY count DESC limit ${limit} offset ${offset}`
    }

    return new Promise(function(resolve, reject) {
      this.db.run(countQuery, where.params, function(err, count) {
        if(err) {
          return reject(new Err('Indexer.SearchDocumentsError', {
            cause: err
          }))
        }

        let output = {
          total: count[0].count
        }

        this.db.run(query, where.params, function(err, res) {
          if(err) {
            return reject(new Err('Indexer.SearchDocumentsError', {
              cause: err
            }))
          }
          let first = findIndex(res, function(doc) {
            return doc.count > 0
          })

          if(first > -1) {
            if(isTextSearch) {
              filters.query = searchQuery
              filters.language = language
            }
            filters["documentId"] = res[first]["documentId"]
            this.searchFragments(filters, options)
              .then(function(fragments) {
                res[first].fragments = fragments
                output.records = res
                resolve(output)
              })
              .catch(function() {
                output.records = res
                resolve(output)
              })
          } else {
            output.records = res
            resolve(output)
          }
        }.bind(this))
      }.bind(this))
    }.bind(this))
  }

  searchFragments(filters, options) {
    let isTextSearch = filters.query ? true : false
    let limit = options.limit || 100
    let offset = options.offset || 0
    let query, args, where

    if(isTextSearch) {
      let searchQuery = filters.query
      let language = filters.language || 'english'
      delete filters.query
      delete filters.language

      args = ArgTypes.findArgs(arguments, this)
      where = isEmpty(args.conditions) ? {} : Where.forTable(args.conditions)

      let whereQuery = where.where ? where.where + ' \nAND (tsv @@ q)' : '\nWHERE (tsv @@ q)'

      query = `SELECT 
"fragmentId",
ts_headline(${language}, content, q, 'StartSel=<strong>, StopSel=</strong>, HighlightAll=TRUE') as content
FROM fragments,
plainto_tsquery(${language}, ${searchQuery}) AS q ${whereQuery} 
ORDER BY SUBSTRING("fragmentId", '([0-9]+)')::int ASC limit ${limit} offset ${offset}`

    } else {
      args = ArgTypes.findArgs(arguments, this)
      where = isEmpty(args.conditions) ? {} : Where.forTable(args.conditions)

      let whereQuery = where.where

      query = `SELECT 
"fragmentId",
content
FROM fragments ${whereQuery} 
ORDER BY SUBSTRING("fragmentId", '([0-9]+)')::int ASC limit ${limit} offset ${offset}`
    }

    return new Promise(function(resolve, reject) {
      this.db.run(query, where.params, function(err, res) {
        if(err) {
          return reject(new Err('Indexer.SearchFragmentsError', {
            cause: err
          }))
        }

        resolve(res)
      })
    }.bind(this))
  }
}

module.exports = Indexer