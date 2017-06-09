import { request } from 'substance'

/*
  HTTP client for talking with ResourceServer
*/

class ResourceClient {
  constructor(config) {
    this.config = config
  }

  /*
    Create an entity
  */
  createEntity(entityData, cb) {
    request('POST', '/api/entities', entityData, cb)
  }

  /*
    Read an entity
  */
  getEntity(entityId, cb) {
    request('GET', '/api/entities/' + entityId, null, cb)
  }

  /*
    Update an entity
  */
  updateEntity(entityId, entityData, cb) {
    request('PUT', '/api/entities/' + entityId, entityData, cb)
  }

  /*
    Update entities
  */
  updateEntities(entityData, cb) {
    request('POST', '/api/entities/tree/update', entityData, cb)
  }

  /*
    Remove an entity
  */
  deleteEntity(entityId, cb) {
    request('DELETE', '/api/entities/' + entityId, null, cb)
  }

  /*
    Merge two entities
  */
  mergeEntity(entityId, mergeEntityId, type, cb) {
    let entityData = {
      mergeEntity: entityId,
      targetEntity: mergeEntityId
    }
    if(type) entityData.type = type
    request('POST', '/api/entities/merge', entityData, cb)
  }

  listEntities(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    request('GET', '/api/entities?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  searchEntities(query, language, filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    request('GET', '/api/entities/search?query=' + query + '&language=' + language + '&filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  /*
    Read all document resources
  */
  getDocumentResources(documentId, cb) {
    request('GET', '/api/entities/document/' + documentId, null, cb)
  }

  /*
    Get subjects data
  */
  getSubjects(cb) {
    request('GET', '/api/entities/tree/subject', null, cb)
  }

}

export default ResourceClient
