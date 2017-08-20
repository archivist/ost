import PersonsPage from './PersonsPage'

export default {
  name: 'person-manager',
  configure: function(config) {
    config.addPage(PersonsPage.pageName, PersonsPage)
    config.addLabel('persons', {
      en: 'Persons',
      ru: 'Персоналии'
    })
  }
}