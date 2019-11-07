import DefinitionReference from './DefinitionReference'
import DefinitionComponent from './DefinitionComponent'
import DefinitionCommand from './DefinitionCommand'
import DefinitionContextItem from './DefinitionContextItem'

export default {
  name: 'definition',
  configure: function(config) {
    config.addNode(DefinitionReference)
    config.addCommand(DefinitionReference.type, DefinitionCommand, { nodeType: DefinitionReference.type })
    config.addIcon(DefinitionReference.type, {'fontawesome': 'fa-book'})
    config.addComponent('definition', DefinitionComponent)
    config.addContextItem('definition', DefinitionContextItem)
    config.addLabel('definition-resources', {
      en: 'Definitions',
      ru: 'Реалии'
    })
    config.addLabel('definition', {
      en: 'Definition',
      ru: 'Дефиниция'
    })
  }
}