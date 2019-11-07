// import { Component } from 'substance'
// import { forEach } from 'lodash-es'

import { PublisherContext } from 'archivist-js'

class OstPublisherContext extends PublisherContext {
  
  editSubject(node) {
    let mode = 'edit'
    let context = node ? this.contextMap[node.type] : 'subjects'
    let state = {
      contextId: context,
      mode: mode,
      item: node ? node.id : undefined
    }
    this.extendState(state)
    console.log('Edit container resource', node.id, ',', mode, 'mode')
  }

  resetSubjectsList() {
    let context = 'subjects'
    if(this.refs[context]) {
      this.refs[context].setSelected()
    }
  }

}

export default OstPublisherContext