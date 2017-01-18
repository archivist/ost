let Err = require('substance').SubstanceError
let ArchivistResourceEngine = require('archivist').ResourceEngine

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

  getResourcesTreeFacets(entityType, references) {
    let query = `
      SELECT "entityId", entities.name, cnt, entities.data->'parent' AS parent, entities.data->'position' AS pos FROM (
        SELECT DISTINCT
          jsonb_object_keys(documents.references) AS anno,
          COUNT(*) OVER (PARTITION BY jsonb_object_keys(documents.references)) cnt
        FROM documents WHERE meta->>'state'='published' AND "references" ?& $2
      ) AS docs INNER JOIN entities ON (docs.anno = entities."entityId")
      WHERE "entityType" = $1
      ORDER BY pos ASC
    `

    return new Promise((resolve, reject) => {
      this.db.run(query, [entityType, references], (err, entities) => {
        if (err) {
          return reject(new Err('ResourceEngine.GetResourcesTree', {
            cause: err
          }))
        }
        
        resolve(entities)
      })
    })
  }
}

module.exports = ResourceEngine
