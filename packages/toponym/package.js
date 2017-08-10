import ToponymReference from './ToponymReference'
import ToponymComponent from './ToponymComponent'
import ToponymCommand from './ToponymCommand'
import ToponymContextItem from './ToponymContextItem'

export default {
  name: 'toponym',
  configure: function(config) {
    config.addNode(ToponymReference)
    config.addCommand(ToponymReference.type, ToponymCommand, { nodeType: ToponymReference.type })
    config.addIcon(ToponymReference.type, {'fontawesome': 'fa-globe'})
    config.addComponent('toponym', ToponymComponent)
    config.addContextItem('toponym', ToponymContextItem)
    config.addLabel('toponym-resources', {
      en: 'Geography',
      ru: 'География'
    })
    config.addLabel('toponym', {
      en: 'Toponym',
      ru: 'Топоним'
    })
  }
}