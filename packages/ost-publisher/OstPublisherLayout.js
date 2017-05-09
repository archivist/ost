import { CollabSession, JSONConverter, series, substanceGlobals } from 'substance'
import { PublisherLayout } from 'archivist'

let converter = new JSONConverter()

class OstPublisherLayout extends PublisherLayout {

  /*
    Loads a document and initializes a Document Session
  */
  _loadDocument(documentId) {
    let configurator = this.props.configurator
    let collabClient = this.collabClient
    let documentClient = this.context.documentClient

    documentClient.getDocument(documentId, (err, docRecord) => {
      if (err) {
        this._onError(err)
        return
      }

      let document = configurator.createArticle()
      let doc = converter.importDocument(document, docRecord.data)

      let session = new CollabSession(doc, {
        configurator: configurator,
        documentId: documentId,
        version: docRecord.version,
        collabClient: collabClient
      })

      if (substanceGlobals.DEBUG_RENDERING) {
        window.doc = doc
        window.session = session
      }

      // Listen for errors and sync start events for error reporting
      session.on('error', this._onCollabSessionError, this)
      session.on('sync', this._onCollabSessionSync, this)

      series([
        this._loadResources(documentId, session),
        this._loadSubjects(session)
      ], () => {
        this.setState({
          session: session
        })
      })
    })
  }

  /*
    Loads subjects tree data
  */
  _loadSubjects(session) {
    return function(cb) {
      let resourceClient = this.context.resourceClient
      let mainConfigurator = this.context.configurator
      let configurator = mainConfigurator.getConfigurator('archivist-subjects')

      resourceClient.getSubjects((err, res) => {
        if (err) {
          this._onError(err)
          return
        }

        let importer = configurator.createImporter('subjects')
        let subjects = importer.importDocument(res, true)

        session.subjects = subjects
        cb()
      })
    }.bind(this)
  }

}

export default OstPublisherLayout
