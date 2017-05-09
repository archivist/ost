import { Component } from 'substance'
import { clone, concat, flattenDeep, isEmpty, map, sortBy } from 'lodash-es'

class SubjectSelector extends Component {

  didMount() {
    this.buildTree()
  }

  render($$) {
    let el = $$('div').addClass('sc-subject-selector')
    let ScrollPane = this.getComponent('scroll-pane')

    let header = $$('div').addClass('sc-panel-header').append(
      $$('div').addClass('sc-goback-action').append(
        this.context.iconProvider.renderIcon($$, 'goBackToList'),
        this.getLabel('goBackToSubjects')
      ).on('click', this._goBack),
      $$('div').addClass('sc-actions').append(
        $$('div').addClass('sc-remove-action').append(
          this.context.iconProvider.renderIcon($$, 'removeReference'),
          this.getLabel('removeReference')
        ).on('click', this._removeAnno)
      )
    )

    el.append(
      header,
      $$(ScrollPane).addClass('se-subject-tree').append(
        this.renderTree($$)
      ).ref('subjectTree')
    )

    return el
  }

  renderTree($$) {
    let subjects = this.state.subjects
    let subjectsPanel = $$('div').addClass('se-subject-entries')

    if(subjects) {
      let childNodes = subjects.getRoots()
      childNodes = sortBy(childNodes, ['position'])

      let childEls = childNodes.map(function(node) {
        return this.renderChildren($$, node, 1)
      }.bind(this))

      subjectsPanel.append(flattenDeep(childEls))
    }

    return subjectsPanel
  }

  buildTree() {
    let nodeId = this.props.node
    let doc = this.context.doc
    let editorSession = this.context.editorSession
    let subjectsTree = clone(editorSession.subjects)
    subjectsTree.resetTree()
    let subjects = []
    if(nodeId) {
      let node = doc.get(nodeId)
      subjects = node.reference
    }
    subjects.forEach(s => {
      subjectsTree.set([s, 'active'], true)
      subjectsTree.set([s, 'expanded'], true)
      let parents = subjectsTree.getParents(s)
      parents.forEach(pid => {
        subjectsTree.set([pid, 'active'], true)
        subjectsTree.set([pid, 'expanded'], true)
      })
    })
    this.extendState({
      subjects: subjectsTree
    })
  }

  renderChildren($$, node, level) {
    let subjects = this.state.subjects
    let isSelected = node.active
    let hasSelectedChildren = subjects.hasActiveChildren(node.id)
    let isExpanded = node.expanded || isSelected || hasSelectedChildren
    let childNodes = subjects.getChildren(node.id)
    let hideExpand = isEmpty(childNodes)
    let childrenEls = []

    if(isExpanded) {
      childrenEls = map(childNodes, function(сhildNode) {
        return this.renderChildren($$, сhildNode, level + 1)
      }.bind(this))
    }

    let el = $$('div').addClass('se-tree-node').ref(node.id)
      .on('click', this._expandNode.bind(this, node.id))
      
    if(isSelected) el.addClass('active')

    // level graphical nesting
    if(hideExpand && level !== 1) {
      level = level * 2
      if(level === 4) level = 5
    }
    let levelSign = new Array(level).join('·') + ' '
    el.append(levelSign)

    if(!hideExpand) {
      let expandedIcon = isExpanded ? 'expanded' : 'collapsed'
      el.append(
        this.renderIcon($$, expandedIcon).addClass('expansion')
      )
    }

    let selectedIcon = isSelected ? 'checked' : 'unchecked'
    if(isSelected) el.addClass('sm-selected')
    el.append(
      this.renderIcon($$, selectedIcon).addClass('selection')
        .on('click', this._toggleItem.bind(this, node.id)),
      $$('span').addClass('se-tree-node-name').append(node.name)
    )

    return concat(el, childrenEls)
  }

  renderIcon($$, icon) {
    let iconEl = this.context.iconProvider.renderIcon($$, icon)
    return iconEl
  }

  _expandNode(id, e) {
    e.preventDefault()
    e.stopPropagation()
    let subjects = this.state.subjects
    let isExpanded = subjects.get([id, 'expanded'])
    subjects.set([id, 'expanded'], !isExpanded);
    this.extendState({
      subjects: subjects
    })
  }

  _toggleItem(id, e) {
    e.preventDefault()
    e.stopPropagation()
    let subjects = this.state.subjects
    let currentValue = subjects.get([id, 'active'])
    subjects.set([id, 'active'], !currentValue)
    this._setReference()
    this.extendState({
      subjects: subjects
    })
  }

  _setReference() {
    let subjects = this.state.subjects
    let editorSession = this.context.editorSession
    let active = subjects.getActive()
    editorSession.transaction((tx) => {
      tx.set([this.props.node, 'reference'], active)
    })
  }

  _goBack() {
    this.send('showList')
  }

  _removeAnno() {
    let nodeId = this.props.node
    let editorSession = this.context.editorSession
    editorSession.transaction(function(tx, args) {
      tx.delete(nodeId)
      return args
    })
    this.send('showList')
  }
}

export default SubjectSelector