// import { ContainerEditor, Highlights, Layout, ProseEditor, SplitPane, Toolbar } from 'substance'
import { forEach } from 'lodash-es'
import OstPublisherContext from './OstPublisherContext'
import { Publisher } from 'archivist'

class OstPublisher extends Publisher {
  didMount() {
    super.didMount()
    let editorSession = this.getEditorSession()
    editorSession.on('createSubjectReference', this._createSubjectReference, this)
  }

  dispose() {
    super.dispose()
    this.getEditorSession().off(this)
  }

  _onSessionUpdate(editorSession) {
    if (!editorSession.hasChanged('document') && !editorSession.hasChanged('selection')) return

    let change = editorSession.getChange()
    if(change) {
      let changeInfo = editorSession.getChangeInfo()
      // Fetch resource after remote update
      if(changeInfo.remote) {
        Object.keys(change.created).forEach(id => {
          let node = change.created[id]
          let reference = node.reference

          let resources = editorSession.resources
          let entity = find(resources, item => { return item.entityId === reference })
          if(!entity) {
            let resourceClient = this.context.resourceClient
            resourceClient.getEntity(reference, (err, entity) => {
              if (err) {
                console.error(err)
              } else {
                resources.push(entity)
              }
            })
          }
        })
      }

      // Rerender brackets if subjects were affected
      change.ops.forEach(op => {
        if(op.path[0].indexOf('subject') >= -1) {
          this.refs.brackets.rerender()
          setTimeout(function() {
            this.refs.brackets.updateBrackets()
          }.bind(this))
        }
      })

    }    

    let doc = editorSession.getDocument()
    let contextPanel = this.refs.contextPanel

    //let entityIndex = doc.getIndex('entities')
    let schema = doc.getSchema()
    let nodes = schema.nodeRegistry.entries
    let highlights = {}
    forEach(nodes, node => {
      if(node.prototype.isResourceReference) {
        highlights[node.type] = []
      }
    })

    let overlapsAnno = false

    let selectionState = editorSession.getSelectionState()
    forEach(highlights, (h, annoType) => {
      let annos = selectionState.getAnnotationsForType(annoType)
      // This will work if inline annotations can't overlap each other
      // we should check for one node
      if(annos.length === 1) {
        let node = annos[0]
        highlights[annoType] = [node.id]
        if(node.reference) {
          contextPanel.openResource(node)
          overlapsAnno = true
        }
      }

      if(!overlapsAnno) {
        contextPanel.openDefaultTab()
      }
    })

    this.contentHighlights.set(highlights)
  }

  _renderContextSection($$) {
    return $$('div').addClass('se-context-section').append(
      $$(OstPublisherContext, {
        configurator: this.props.configurator
      }).ref('contextPanel')
    )
  }

  _createSubjectReference(anno) {
    let contextPanel = this.refs.contextPanel
    contextPanel.editSubject(anno)
  }
}

export default OstPublisher
