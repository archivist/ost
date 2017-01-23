let ArchivistResourceServer = require('archivist').ResourceServer

/*
  ResourceServer module. Can be bound to an express instance
*/
class ResourceServer extends ArchivistResourceServer {

  bind(app) {
    // search
    app.get(this.path + '/entities/locations', this._getLocationsList.bind(this))
    super.bind(app)
    app.get(this.path + '/entities/tree/:type', this._getResourcesTree.bind(this))
    app.get(this.path + '/entities/facets/:type', this._getResourcesFacetsTree.bind(this))
  }

  /*
    Get resources tree data for given entity type
  */
  _getResourcesTree(req, res, next) {
    let type = req.params.type

    this.engine.getResourcesTree(type)
      .then(function(entities) {
        res.json(entities)
      })
      .catch(function(err) {
        next(err)
      })
  }

  /*
    Get resources tree facets data for given entity type
  */
  _getResourcesFacetsTree(req, res, next) {
    let type = req.params.type
    let filters = req.query.filters
    filters = filters ? JSON.parse(filters) : {}

    ///refs = refs ? JSON.parse(refs) : []
    
    this.engine.getResourcesTreeFacets(filters, type)
      .then(function(entities) {
        res.json(entities)
      })
      .catch(function(err) {
        next(err)
      })
  }

  /*
    Get list of all locations as geoJSON
  */
  _getLocationsList(req, res, next) {
    this.engine.getLocationsList()
      .then(function(geojson) {
        res.json(geojson)
      })
      .catch(function(err) {
        next(err)
      })
  }
}

module.exports = ResourceServer
