import SubjectsContext from './SubjectsContext'

export default {
  name: 'archivist-publisher-subjects',
  configure: function(config) {
    config.addContext('subjects', SubjectsContext, true)
    config.addIcon('subjects', {'fontawesome': 'fa-tags'})
    config.addIcon('collapsed', { 'fontawesome': 'fa-caret-right' })
    config.addIcon('expanded', { 'fontawesome': 'fa-caret-down' })
    config.addIcon('checked', { 'fontawesome': 'fa-check-square-o' })
    config.addIcon('unchecked', { 'fontawesome': 'fa-square-o' })
    config.addLabel('subjects', {
      en: 'Subjects',
      ru: 'Тематики'
    })
    config.addLabel('goBackToSubjects', {
      en: 'Subjects',
      ru: 'К списку'
    })
  }
}