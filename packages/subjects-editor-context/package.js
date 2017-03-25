import SubjectsContext from './SubjectsContext'

export default {
  name: 'archivist-publisher-subjects',
  configure: function(config) {
    config.addContext('subjects', SubjectsContext, true)
    config.addIcon('subjects', {'fontawesome': 'fa-tags'})
    config.addLabel('subjects', {
      en: 'Subjects',
      ru: 'Тематики'
    })
  }
}