import { EditorSession, JSONConverter, series, substanceGlobals } from 'substance'
import { PublisherLayout } from 'archivist'

let converter = new JSONConverter()

class OstPublisherLayout extends PublisherLayout {

  /*
    Loads a document and initializes a Document Session
  */
  _loadDocument(documentId) {
    let configurator = this.props.configurator
    let documentClient = this.context.documentClient

    documentClient.getDocument(documentId, (err, docRecord) => {
      if (err) {
        this._onError(err)
        return
      }

      let document = configurator.createArticle()
      let doc = converter.importDocument(document, docRecord.data)

      let session = new EditorSession(doc, {
        configurator: configurator
      })

      if (substanceGlobals.DEBUG_RENDERING) {
        window.doc = doc
        window.session = session
      }

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
