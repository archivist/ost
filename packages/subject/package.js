import SubjectReference from './SubjectReference'
import SubjectCommand from './SubjectCommand'
import SubjectComponent from './SubjectComponent'

export default {
  name: 'subject',
  configure: function(config) {
    config.addNode(SubjectReference)
    config.addCommand(SubjectReference.type, SubjectCommand, { nodeType: SubjectReference.type, commandGroup: 'references' })
    config.addComponent('container-annotation-fragment', SubjectComponent)
    config.addIcon(SubjectReference.type, {'fontawesome': 'fa-tags'})
  }
}