let Err = require('substance').SubstanceError
let ArchivistResourceEngine = require('archivist').ResourceEngine
let each = require('lodash/each')
let isEmpty = require('lodash/isEmpty')
let isNull = require('lodash/isNull')

// Massive internal libs
let ArgTypes = require('../../../node_modules/massive/lib/arg_types')
let Where = require('../../../node_modules/massive/lib/where')

class ResourceEngine extends ArchivistResourceEngine {

  getResourcesTree(entityType) {
    let query = `
      SELECT "entityId", "name", data->'parent' AS parent, data->'position' AS position
      FROM entities
      WHERE "entityType" = $1 
      ORDER BY cast(data->>'position' as integer) ASC
    `

    return new Promise((resolve, reject) => {
      this.db.run(query, [entityType], (err, entities) => {
        if (err) {
          return reject(new Err('ResourceEngine.GetResourcesTree', {
            cause: err
          }))
        }
        
        resolve(entities)
      })
    })
  }

  getResourcesTreeFacets(filters, entityType) {
    if(filters.topics) {
      filters['"references" ?&'] = filters.topics
      delete filters.topics
    }

    let whereSearch
    if(filters.query) {
      let searchQuery = filters.query
      let language = filters.language || 'english'
      whereSearch = `tsv @@ plainto_tsquery('${language}', '${searchQuery}')`
      delete filters.query
      delete filters.language
    }

    let args = ArgTypes.findArgs(arguments, this)
    let where = isEmpty(args.conditions) ? {} : Where.forTable(args.conditions)

    let whereQuery = where.where ? where.where : ''
    if(whereSearch) {
      whereQuery += whereQuery ? ' \nAND ' + whereSearch : ' \nWHERE ' + whereSearch
    }

    let query = `
      SELECT "entityId", entities.name, cnt, entities.data->'parent' AS parent, entities.data->'position' AS pos FROM (
        SELECT DISTINCT
          jsonb_object_keys(documents.references) AS anno,
          COUNT(*) OVER (PARTITION BY jsonb_object_keys(documents.references)) cnt
        FROM documents ${whereQuery}
      ) AS docs INNER JOIN entities ON (docs.anno = entities."entityId")
      WHERE "entityType" = '${entityType}'
      ORDER BY pos ASC
    `
    
    return new Promise((resolve, reject) => {
      this.db.run(query, where.params, (err, entities) => {
        if (err) {
          return reject(new Err('ResourceEngine.GetResourcesTree', {
            cause: err
          }))
        }
        
        resolve(entities)
      })
    })
  }

  getLocationsList() {
    let query = `
      SELECT "entityId", entities.name, entities."entityType", entities.data, cnt FROM (
        SELECT DISTINCT
          jsonb_object_keys(documents.references) AS anno,
          COUNT(*) OVER (PARTITION BY jsonb_object_keys(documents.references)) cnt
        FROM documents
      ) AS docs INNER JOIN entities ON (docs.anno = entities."entityId")
      WHERE "entityType" = 'prison' OR "entityType" = 'toponym'
    `

    return new Promise((resolve, reject) => {
      this.db.run(query, (err, entities) => {
        if (err) {
          return reject(new Err('ResourceEngine.GetLocationsList', {
            cause: err
          }))
        }
        
        let geojson = {
          type: "FeatureCollection",
          features: []
        }
        each(entities, function(entity) {
          let feature = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": entity.data.point
            },
            "properties": entity.data
          }
          feature.properties.entityId = entity.entityId
          feature.properties.entityType = entity.entityType
          feature.properties.documents = entity.cnt
          feature.properties.fragments = 5

          if(!isNull(entity.data.point)) geojson.features.push(feature)
        })

        resolve(geojson)
      })
    })
  }
}

module.exports = ResourceEngine
