import PersonIndex from './PersonIndex'
import PersonItem from './PersonItem'

export default {
  name: 'person-index',
  configure: function(config) {
    config.addPage('persons', PersonIndex)
    config.addComponent('person-item', PersonItem)
    config.addLabel('mentioned-person', {
      en: 'Number of mentioned persons',
      ru: 'Всего персон'
    })
  }
}