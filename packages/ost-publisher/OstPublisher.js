// import { ContainerEditor, Highlights, Layout, ProseEditor, SplitPane, Toolbar } from 'substance'
import { forEach, map } from 'lodash-es'
import OstPublisherContext from './OstPublisherContext'
import { Publisher } from 'archivist'

class OstPublisher extends Publisher {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'showTopics': this._showTopics
    })
  }

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
    let selectionChanged = editorSession.hasChanged('selection')

    if (!editorSession.hasChanged('document') && !selectionChanged) return

    let change = editorSession.getChange()
    if(change) {
      let changeInfo = editorSession.getChangeInfo()
      // Fetch resource after remote update
      if(changeInfo.remote) {
        Object.keys(change.created).forEach(id => {
          let node = change.created[id]
          let reference = node.reference

          if(reference) {
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
          }
        })
      }

      // Rerender brackets if subjects were affected
      change.ops.forEach(op => {
        if(op.path[0].indexOf('subject') > -1) {
          this.refs.brackets.rerender()
          setTimeout(function() {
            this.refs.brackets.updateBrackets()
          }.bind(this))
        }
      })
    }

    // TODO: figure out why selection flags changed after comment update 
    if(selectionChanged && !this._isCommentChange(change)) {

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
            let isCollapsed = selectionState.selection.isCollapsed()
            if(isCollapsed) contextPanel.openResource(node)
            overlapsAnno = true
          }
        }
      })

      if(!overlapsAnno) {
        let overlapedComments = selectionState.getAnnotationsForType('comment')
        if(overlapedComments.length > 0) {
          contextPanel.openComment(overlapedComments[0])
        } else {
          contextPanel.openDefaultTab()
        }
      }

      this.contentHighlights.set(highlights)

    }
  }

  _isCommentChange(change) {
    if(change) {
      if(change.ops.length === 1) {
        let path = change.ops[0].path[0]
        if(path.indexOf('comment') > -1) {
          return true
        }
      }
    }

    return false
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

  _showTopics(topics) {
    let editorSession = this.editorSession
    let doc = editorSession.getDocument()
    let entityIndex = doc.getIndex('entities')
    let paragraphs = []
    forEach(topics, topic => {
      let refs = entityIndex.get(topic)
      let paras = map(refs, n => {return n.start.path[0]})
      paragraphs = paragraphs.concat(paras)
    })
    let firstPara = doc.getFirst(paragraphs)
    this.refs.contentPanel.scrollTo(firstPara)

    setTimeout(function(){
      this.refs.brackets.highlight(topics)
      this.highlightReferences(topics, true)
    }.bind(this), 10)
  }
}

export default OstPublisher
