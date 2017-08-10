import PersonReference from './PersonReference'
import PersonComponent from './PersonComponent'
import PersonCommand from './PersonCommand'
import PersonContextItem from './PersonContextItem'

export default {
  name: 'person',
  configure: function(config) {
    config.addNode(PersonReference)
    config.addCommand(PersonReference.type, PersonCommand, { nodeType: PersonReference.type })
    config.addIcon(PersonReference.type, {'fontawesome': 'fa-address-book-o'})
    config.addComponent('person', PersonComponent)
    config.addContextItem('person', PersonContextItem)
    config.addLabel('person-resources', {
      en: 'Persons',
      ru: 'Персоналии'
    })
    config.addLabel('person', {
      en: 'Person',
      ru: 'Персоналия'
    })
  }
}